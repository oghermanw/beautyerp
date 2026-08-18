// Complete Data Export & Migration Engine using ExcelJS & JSZip

import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { mockDb } from '@/lib/supabase/mock-db';
import { UserRole } from '@/lib/types';

export interface ExportManifest {
  formatVersion: string;
  system: string;
  exportedAt: string;
  timezone: string;
  currency: string;
  schemaVersion: string;
  exportedByRole: UserRole;
  entityCounts: Record<string, number>;
}

export function generateDataDictionaryCSV(): string {
  const headers = ['entity', 'column', 'data_type', 'nullable', 'description', 'relationship', 'example'];
  const rows = [
    ['customers', 'id', 'UUID', 'NO', 'Primary Key', 'None', 'c-100'],
    ['customers', 'customer_code', 'TEXT', 'NO', 'Human-readable customer code', 'None', 'C000001'],
    ['customers', 'display_name', 'TEXT', 'NO', 'Customer display name', 'None', 'May Chan'],
    ['staff_profiles', 'staff_code', 'TEXT', 'NO', 'Human-readable staff code', 'None', 'S000001'],
    ['bookings', 'booking_code', 'TEXT', 'NO', 'Human-readable booking code', 'None', 'B202608150001'],
    ['orders', 'order_number', 'TEXT', 'NO', 'Human-readable order code', 'None', 'O202608150001'],
    ['payments', 'amount', 'NUMERIC(12,2)', 'NO', 'Payment amount in HKD', 'orders(id)', '1280.00'],
    ['product_costs', 'current_unit_cost', 'NUMERIC(12,2)', 'NO', 'COGS unit cost (SUPER ONLY)', 'products(id)', '45.00'],
    ['payroll_statements', 'net_pay', 'NUMERIC(12,2)', 'NO', 'Final net salary amount', 'staff_profiles(id)', '18222.00']
  ];

  return [headers.join(','), ...rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');
}

export function convertToCSV<T extends Record<string, unknown>>(data: T[], columns?: string[]): string {
  if (!data || data.length === 0) return '';
  const keys = columns || Object.keys(data[0]);
  const headerRow = keys.join(',');

  const bodyRows = data.map(row => {
    return keys.map(k => {
      const val = row[k];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [headerRow, ...bodyRows].join('\n');
}

// Security filtering wrapper
export function getExportableData(role: UserRole) {
  if (role === 'STAFF') {
    // STAFF can only export own data
    return {
      staff_profiles: mockDb.staffProfiles.filter(s => s.id === 's-001'),
      bookings: mockDb.bookings.filter(b => b.assigned_staff_id === 's-001'),
      payroll_statements: mockDb.payrollStatements.filter(p => p.staff_id === 's-001'),
      commission_entries: mockDb.commissionEntries.filter(c => c.staff_id === 's-001')
    };
  }

  if (role === 'ADMIN') {
    // ADMIN can export operational data (NO COGS, NO Payroll, NO Finance, NO Audit)
    return {
      customers: mockDb.customers,
      customer_private_details: Object.values(mockDb.customerPrivateDetails),
      customer_skin_profiles: Object.values(mockDb.customerSkinProfiles),
      staff_profiles: mockDb.staffProfiles.map(s => {
        // Exclude confidential admin_comment for ADMIN export
        const { admin_comment, ...rest } = s;
        return rest;
      }),
      bookings: mockDb.bookings,
      services: mockDb.services,
      products: mockDb.products.map(p => {
        // Exclude current_unit_cost
        const { current_unit_cost, ...rest } = p;
        return rest;
      }),
      orders: mockDb.orders,
      order_items: mockDb.orderItems,
      payments: mockDb.payments,
      inventory_movements: mockDb.inventoryMovements.map(i => {
        // Exclude unit_cost_snapshot
        const { unit_cost_snapshot, ...rest } = i;
        return rest;
      })
    };
  }

  // SUPER gets full system export (All 33 tables)
  return {
    customers: mockDb.customers,
    customer_private_details: Object.values(mockDb.customerPrivateDetails),
    customer_skin_profiles: Object.values(mockDb.customerSkinProfiles),
    customer_notes: mockDb.customerNotes,
    staff_profiles: mockDb.staffProfiles,
    time_entries: mockDb.timeEntries,
    services: mockDb.services,
    service_categories: mockDb.serviceCategories,
    service_recipe_items: mockDb.serviceRecipes,
    products: mockDb.products,
    product_categories: mockDb.productCategories,
    product_costs: Object.entries(mockDb.productCosts).map(([product_id, current_unit_cost]) => ({ product_id, current_unit_cost })),
    bookings: mockDb.bookings,
    orders: mockDb.orders,
    order_items: mockDb.orderItems,
    payments: mockDb.payments,
    inventory_movements: mockDb.inventoryMovements,
    staff_compensation_plans: mockDb.compensationPlans,
    bonus_rules: mockDb.bonusRules,
    commission_entries: mockDb.commissionEntries,
    payroll_periods: mockDb.payrollPeriods,
    payroll_statements: mockDb.payrollStatements,
    expenses: mockDb.expenses,
    historical_finance: mockDb.historicalFinance,
    user_profiles: mockDb.userProfiles.map(u => ({ id: u.id, role: u.role, status: u.status, created_at: u.created_at })), // NEVER export auth secrets
    audit_logs: mockDb.auditLogs
  };
}

export async function generateFullCSVZip(role: UserRole): Promise<Blob> {
  const zip = new JSZip();
  const exportData = getExportableData(role);

  const manifest: ExportManifest = {
    formatVersion: '4.0.0',
    system: 'Beauty Salon Management System MVP v4',
    exportedAt: new Date().toISOString(),
    timezone: 'Asia/Hong_Kong',
    currency: 'HKD',
    schemaVersion: '2026-08-17',
    exportedByRole: role,
    entityCounts: Object.fromEntries(
      Object.entries(exportData).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])
    )
  };

  zip.file('export_manifest.json', JSON.stringify(manifest, null, 2));
  zip.file('data_dictionary.csv', generateDataDictionaryCSV());

  Object.entries(exportData).forEach(([entity, records]) => {
    if (Array.isArray(records) && records.length > 0) {
      zip.file(`${entity}.csv`, convertToCSV(records as Record<string, unknown>[]));
    }
  });

  // Log export action in audit logs if SUPER
  if (role === 'SUPER') {
    mockDb.auditLogs.unshift({
      id: `aud-exp-${Date.now()}`,
      actor_user_id: 'u-super-1',
      actor_name: 'SUPER Owner',
      action: 'FULL_SYSTEM_CSV_EXPORT',
      entity_type: 'export',
      new_data: { entities: Object.keys(exportData) },
      created_at: new Date().toISOString()
    });
  }

  return await zip.generateAsync({ type: 'blob' });
}

export async function generateExcelWorkbook(role: UserRole): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Beauty Salon System MVP v4';
  workbook.created = new Date();

  const exportData = getExportableData(role);

  Object.entries(exportData).forEach(([sheetName, records]) => {
    if (Array.isArray(records) && records.length > 0) {
      const sheet = workbook.addWorksheet(sheetName.slice(0, 30));
      const keys = Object.keys(records[0]);
      sheet.columns = keys.map(k => ({ header: k, key: k, width: 20 }));
      sheet.addRows(records);

      // Header styling
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4F46E5' }
      };
    }
  });

  // Log export action in audit logs if SUPER
  if (role === 'SUPER') {
    mockDb.auditLogs.unshift({
      id: `aud-exp-xl-${Date.now()}`,
      actor_user_id: 'u-super-1',
      actor_name: 'SUPER Owner',
      action: 'FULL_SYSTEM_EXCEL_EXPORT',
      entity_type: 'export',
      new_data: { entities: Object.keys(exportData) },
      created_at: new Date().toISOString()
    });
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
