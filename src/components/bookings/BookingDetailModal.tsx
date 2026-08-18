'use client';

import { useState } from 'react';
import { Booking, UserRole } from '@/lib/types';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';
import { X, CheckCircle, Plus, ShieldAlert, Sparkles, FileText, ShoppingBag, Clock, User, Calendar as CalendarIcon } from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking;
  role: UserRole;
  currentUserId: string;
  currentStaffId?: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function BookingDetailModal({
  booking,
  role,
  currentUserId,
  currentStaffId,
  onClose,
  onUpdate
}: BookingDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | 'customer' | 'onsite'>('details');
  const [selectedAddon, setSelectedAddon] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [overridePrice, setOverridePrice] = useState<string>(booking.price?.toString() || '680');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [treatmentNote, setTreatmentNote] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Editable Form State
  const [editStatus, setEditStatus] = useState<string>(booking.status);
  const [editStaffId, setEditStaffId] = useState<string>(booking.assigned_staff_id || 's-001');
  const [editStartsAt, setEditStartsAt] = useState<string>(booking.starts_at ? booking.starts_at.substring(0, 16) : '2026-08-17T14:00');
  const [editServiceName, setEditServiceName] = useState<string>(booking.service_name || 'Hydration Facial');

  const staffCustomerContext = mockDb.getStaffBookingCustomerContext(booking.id, currentStaffId || 's-001');
  const availableServices = mockDb.services;
  const availableProducts = mockDb.products;
  const staffList = mockDb.staffProfiles;

  const bookingOrder = mockDb.orders.find(o => o.booking_id === booking.id);
  const orderItems = bookingOrder ? mockDb.orderItems.filter(oi => oi.order_id === bookingOrder.id) : [];

  const handleSaveBookingChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedStaff = staffList.find(s => s.id === editStaffId);

    booking.status = editStatus as any;
    booking.assigned_staff_id = editStaffId;
    if (assignedStaff) {
      booking.assigned_staff_name = assignedStaff.display_name;
    }
    booking.starts_at = new Date(editStartsAt).toISOString();
    booking.service_name = editServiceName;
    booking.updated_at = new Date().toISOString();

    if (editStatus === 'COMPLETED' && booking.status !== 'COMPLETED') {
      mockDb.completeBookingAtomic(booking.id, currentUserId, role);
    }

    mockDb.auditLogs.unshift({
      id: `aud-edit-${Date.now()}`,
      actor_user_id: currentUserId,
      actor_name: role,
      action: 'UPDATE_BOOKING',
      entity_type: 'bookings',
      entity_id: booking.id,
      new_data: { status: editStatus, staffId: editStaffId, startsAt: editStartsAt },
      created_at: new Date().toISOString()
    });

    setActionMessage('預約狀態及資料已更新 (Booking state updated successfully).');
    onUpdate();
  };

  const handleAddProductOrAddon = () => {
    if (!bookingOrder) return;
    if (selectedAddon) {
      const service = availableServices.find(s => s.id === selectedAddon);
      if (service) {
        mockDb.orderItems.push({
          id: `oi-add-${Date.now()}`,
          order_id: bookingOrder.id,
          item_type: 'ADD_ON',
          service_id: service.id,
          description_snapshot: service.name,
          quantity: 1,
          unit_price: service.base_price,
          discount_amount: 0,
          line_total: service.base_price,
          commission_eligible: false,
          created_at: new Date().toISOString()
        });
        bookingOrder.subtotal += service.base_price;
        bookingOrder.grand_total += service.base_price;
      }
    }

    if (selectedProduct) {
      const prd = availableProducts.find(p => p.id === selectedProduct);
      if (prd) {
        mockDb.orderItems.push({
          id: `oi-prd-${Date.now()}`,
          order_id: bookingOrder.id,
          item_type: 'PRODUCT',
          product_id: prd.id,
          staff_id: currentStaffId || 's-001',
          description_snapshot: prd.name,
          quantity: 1,
          unit_price: prd.selling_price,
          discount_amount: 0,
          line_total: prd.selling_price,
          commission_eligible: true,
          created_at: new Date().toISOString()
        });
        bookingOrder.subtotal += prd.selling_price;
        bookingOrder.grand_total += prd.selling_price;
      }
    }

    setSelectedAddon('');
    setSelectedProduct('');
    setActionMessage('已新增現場加購項目 (On-site item added).');
    onUpdate();
  };

  const handlePriceOverride = () => {
    if (role === 'STAFF') return;
    const newPrice = parseFloat(overridePrice);
    if (isNaN(newPrice) || !overrideReason) {
      setActionMessage('請輸入有效價格及修訂原因 (Enter valid price & reason).');
      return;
    }

    booking.price = newPrice;
    if (bookingOrder) {
      bookingOrder.grand_total = newPrice;
    }

    mockDb.auditLogs.unshift({
      id: `aud-price-${Date.now()}`,
      actor_user_id: currentUserId,
      actor_name: role,
      action: 'PRICE_OVERRIDE',
      entity_type: 'bookings',
      entity_id: booking.id,
      new_data: { newPrice, reason: overrideReason },
      created_at: new Date().toISOString()
    });

    setActionMessage(`價格已更正為 ${formatHKD(newPrice)} (Price updated).`);
    onUpdate();
  };

  const handleAddTreatmentNote = () => {
    if (!treatmentNote.trim()) return;
    mockDb.customerNotes.push({
      id: `cn-${Date.now()}`,
      customer_id: booking.customer_id,
      booking_id: booking.id,
      staff_id: currentStaffId,
      note_type: 'TREATMENT',
      content: treatmentNote,
      visibility: 'SERVICE_TEAM',
      created_by: currentUserId,
      created_at: new Date().toISOString()
    });
    setTreatmentNote('');
    setActionMessage('療程紀錄已儲存 (Note saved).');
    onUpdate();
  };

  const handleCompleteBooking = () => {
    const result = mockDb.completeBookingAtomic(booking.id, currentUserId, role);
    booking.status = 'COMPLETED';
    setEditStatus('COMPLETED');
    setActionMessage(result.message);
    onUpdate();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <span className="badge-emerald px-2.5 py-0.5 rounded-full text-xs font-bold">🟢 已完成 (COMPLETED)</span>;
      case 'IN_SERVICE': return <span className="badge-purple px-2.5 py-0.5 rounded-full text-xs font-bold">🟣 進行中 (IN SERVICE)</span>;
      case 'CONFIRMED': return <span className="badge-amber px-2.5 py-0.5 rounded-full text-xs font-bold">🟡 已確認 (CONFIRMED)</span>;
      case 'SCHEDULED': return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold">🔵 已預約 (SCHEDULED)</span>;
      case 'CANCELLED': return <span className="badge-rose px-2.5 py-0.5 rounded-full text-xs font-bold">🔴 已取消 (CANCELLED)</span>;
      default: return <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-700/80 shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-indigo-400 font-semibold">{booking.booking_code}</span>
                {getStatusBadge(booking.status)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">{booking.customer_name} - {booking.service_name}</h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/50 px-4 sm:px-6 bg-slate-900/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'details' ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-400'
            }`}
          >
            預約概覽 (Overview)
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'edit' ? 'border-indigo-500 text-indigo-300 font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            ✏️ 修改狀態/資料 (Edit State)
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'customer' ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-400'
            }`}
          >
            {role === 'STAFF' ? '療程背景 (Context)' : '顧客資料 (Customer)'}
          </button>
          <button
            onClick={() => setActiveTab('onsite')}
            className={`px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'onsite' ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-400'
            }`}
          >
            現場加購 (Add-ons)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {actionMessage && (
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-4 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">預約時間 (Appointment Time)</span>
                  <p className="text-sm font-semibold text-slate-100">
                    {new Date(booking.starts_at).toLocaleString()}
                  </p>
                </div>
                <div className="glass-card p-4 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">負責美容師 (Assigned Technician)</span>
                  <p className="text-sm font-semibold text-indigo-300">
                    {booking.assigned_staff_name || '未指派 Unassigned'}
                  </p>
                </div>
              </div>

              {/* Price Overview */}
              <div className="glass-card p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">療程價格 (Booking Financial Price)</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                  <span className="text-sm text-slate-300">{booking.service_name}</span>
                  <span className="text-base font-bold text-emerald-400">
                    {role !== 'STAFF' && booking.price ? formatHKD(booking.price) : '標準價 Standard Rate'}
                  </span>
                </div>

                {role !== 'STAFF' && (
                  <div className="pt-3 border-t border-slate-700/50 space-y-3">
                    <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      價格重設 (SUPER / ADMIN 價格修正權限)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={overridePrice}
                        onChange={(e) => setOverridePrice(e.target.value)}
                        placeholder="新價格 (HKD)"
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                      />
                      <input
                        type="text"
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="修改原因..."
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                    <button
                      onClick={handlePriceOverride}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
                    >
                      修改並記入審計日誌
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <form onSubmit={handleSaveBookingChanges} className="glass-card p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                修改預約狀態及美容師 (Edit Booking Status & Staff Assignment)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">預約狀態 (Booking Status)</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:border-indigo-500"
                  >
                    <option value="SCHEDULED">🔵 已預約 (SCHEDULED)</option>
                    <option value="CONFIRMED">🟡 已確認 (CONFIRMED)</option>
                    <option value="IN_SERVICE">🟣 進行中 (IN SERVICE)</option>
                    <option value="COMPLETED">🟢 已完成 (COMPLETED - 自動扣減消耗品/庫存)</option>
                    <option value="CANCELLED">🔴 已取消 (CANCELLED)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">指派美容師 (Assigned Staff)</label>
                  <select
                    value={editStaffId}
                    onChange={(e) => setEditStaffId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:border-indigo-500"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>{s.display_name} ({s.staff_code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">療程服務項目 (Service Item)</label>
                  <select
                    value={editServiceName}
                    onChange={(e) => setEditServiceName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:border-indigo-500"
                  >
                    {availableServices.map(s => (
                      <option key={s.id} value={s.name}>{s.name} (HK${s.base_price})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">預約時間 (Appointment Date & Time)</label>
                  <input
                    type="datetime-local"
                    value={editStartsAt}
                    onChange={(e) => setEditStartsAt(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="gradient-bg text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:opacity-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>儲存預約修改 (Save Changes)</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'customer' && (
            <div className="space-y-6">
              {role === 'STAFF' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>美容師受限檢視：客戶聯絡電話、電郵及消費額已被嚴格遮蔽。</span>
                  </div>

                  {staffCustomerContext && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass-card p-4 space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">顧客名字 (Customer)</span>
                        <p className="text-base font-bold text-slate-100">{staffCustomerContext.display_name}</p>
                        <p className="text-xs text-indigo-400 font-mono">{staffCustomerContext.customer_code}</p>
                      </div>

                      <div className="glass-card p-4 space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">皮膚狀況與敏感度</span>
                        <p className="text-sm font-semibold text-slate-200">{staffCustomerContext.skin_type}</p>
                        <span className="text-[10px] badge-emerald inline-block">敏感度: {staffCustomerContext.sensitivity}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="font-bold text-slate-100 text-base">{booking.customer_name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">聯絡電話 (Phone)</span>
                      <span className="font-mono text-slate-200">+852 9123 4567</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">電郵 (Email)</span>
                      <span className="text-slate-200">may.chan@example.hk</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">居住地區 (Area)</span>
                      <span className="text-slate-200">港島區 Hong Kong Island</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">膚質 (Skin Type)</span>
                      <span className="text-slate-200">混合性 / 敏感肌</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Treatment Notes */}
              <div className="glass-card p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  美容師療程紀錄 (Treatment Note)
                </h4>
                <textarea
                  value={treatmentNote}
                  onChange={(e) => setTreatmentNote(e.target.value)}
                  placeholder="輸入療程記錄、客戶肌膚反應或注意細節..."
                  className="w-full h-20 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddTreatmentNote}
                  className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-semibold shadow-md hover:opacity-95"
                >
                  儲存療程筆記
                </button>
              </div>
            </div>
          )}

          {activeTab === 'onsite' && (
            <div className="space-y-6">
              <div className="glass-card p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">目前訂單項目 (Order Items)</h4>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{item.description_snapshot}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({item.item_type})</span>
                      </div>
                      <span className="font-bold text-emerald-400">
                        {role !== 'STAFF' ? formatHKD(item.line_total) : '已加入'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-indigo-400" />
                  現場加購療程或護膚產品
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">加購療程項目 (Add-on Service)</label>
                    <select
                      value={selectedAddon}
                      onChange={(e) => setSelectedAddon(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    >
                      <option value="">選擇加購項目...</option>
                      {availableServices.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({formatHKD(s.base_price)})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">護膚零售產品 (Skincare Retail Product)</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    >
                      <option value="">選擇護膚產品...</option>
                      {availableProducts.filter(p => p.product_type !== 'CONSUMABLE').map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({formatHKD(p.selling_price)})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddProductOrAddon}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-md hover:bg-indigo-500 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>加入訂單細項</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-700/60 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>預約狀態:</span>
            {getStatusBadge(booking.status)}
          </div>

          <div className="flex items-center gap-3">
            {booking.status !== 'COMPLETED' && (
              <button
                onClick={handleCompleteBooking}
                className="gradient-bg text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:opacity-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>完成療程 (Atomic Finalize)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              關閉 (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
