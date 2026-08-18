// Core Types for Beauty Salon Management System MVP v4

export type UserRole = 'SUPER' | 'ADMIN' | 'STAFF';
export type UserStatus = 'ACTIVE' | 'DISABLED';
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
export type NoteVisibility = 'SERVICE_TEAM' | 'SUPER_ONLY';
export type ProductType = 'RETAIL' | 'CONSUMABLE' | 'BOTH';
export type BookingStatus = 'DRAFT' | 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type OrderStatus = 'DRAFT' | 'FINALIZED' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'VOID';
export type OrderItemType = 'SERVICE' | 'ADD_ON' | 'PRODUCT' | 'OTHER';
export type PaymentMethod = 'CASH' | 'FPS' | 'CARD' | 'BANK_TRANSFER' | 'OCTOPUS' | 'OTHER';
export type InventoryMovementType = 'STOCK_IN' | 'PRODUCT_SALE' | 'SERVICE_USAGE' | 'RETURN' | 'DAMAGED' | 'EXPIRED' | 'MANUAL_ADJUSTMENT' | 'REVERSAL';
export type TimeEntryStatus = 'PRESENT' | 'SICK_LEAVE' | 'ANNUAL_LEAVE' | 'DAY_OFF' | 'ABSENT';
export type SalaryType = 'MONTHLY' | 'HOURLY' | 'MIXED';
export type PayrollStatus = 'OPEN' | 'APPROVED' | 'PAID' | 'LOCKED';
export type PayrollAdjustmentType = 'MANUAL_BONUS' | 'DEDUCTION';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  role: UserRole;
  staff_id?: string | null;
  status: UserStatus;
  must_change_password?: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffProfile {
  id: string;
  staff_code: string;
  display_name: string;
  birth_date?: string;
  email?: string;
  phone?: string;
  residential_area?: string;
  employment_status: EmploymentStatus;
  join_date: string;
  admin_comment?: string | null; // SUPER ONLY
  created_at: string;
  updated_at: string;
  skills?: string[];
}

export interface Customer {
  id: string;
  customer_code: string;
  display_name: string;
  birth_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerPrivateDetails {
  customer_id: string;
  full_name: string;
  phone: string;
  email?: string;
  residential_area?: string;
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerSkinProfile {
  customer_id: string;
  skin_type?: string;
  skin_conditions?: string[];
  allergies?: string[];
  sensitivity?: string;
  preferences?: string;
  main_concern?: string;
  desired_improvement?: string;
  updated_by?: string;
  updated_at: string;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  booking_id?: string;
  staff_id?: string;
  note_type: string;
  content: string;
  visibility: NoteVisibility;
  created_by?: string;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface ServiceItem {
  id: string;
  service_code: string;
  name: string;
  category_id?: string;
  category_name?: string;
  duration_minutes: number;
  base_price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category_id?: string;
  category_name?: string;
  product_type: ProductType;
  selling_price: number;
  current_unit_cost?: number; // SUPER ONLY
  low_stock_threshold: number;
  base_unit: string;
  current_stock?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceRecipeItem {
  id: string;
  service_id: string;
  product_id: string;
  product_name?: string;
  quantity_required: number;
  unit: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  customer_id: string;
  customer_name?: string;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  internal_note?: string;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  service_name?: string;
  price?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  cancelled_at?: string;
}

export interface BookingStaffAssignment {
  id: string;
  booking_id: string;
  staff_id: string;
  is_primary: boolean;
  assigned_by?: string;
  assigned_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  booking_id?: string;
  customer_id: string;
  status: OrderStatus;
  subtotal: number;
  discount_total: number;
  grand_total: number;
  finalized_at?: string;
  finalized_by?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: OrderItemType;
  service_id?: string;
  product_id?: string;
  staff_id?: string;
  description_snapshot: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;
  commission_eligible: boolean;
  created_by?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  method: PaymentMethod;
  status: string;
  paid_at: string;
  created_by?: string;
  created_at: string;
  external_reference?: string;
  idempotency_key?: string;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  product_name?: string;
  movement_type: InventoryMovementType;
  quantity: number;
  unit_cost_snapshot?: number; // SUPER ONLY
  booking_id?: string;
  order_item_id?: string;
  reason?: string;
  created_by?: string;
  created_at: string;
  idempotency_key?: string;
}

export interface TimeEntry {
  id: string;
  staff_id: string;
  staff_name?: string;
  work_date: string;
  clock_in?: string;
  clock_out?: string;
  worked_hours?: number;
  status: TimeEntryStatus;
  created_by?: string;
  created_at: string;
}

export interface StaffCompensationPlan {
  id: string;
  staff_id: string;
  salary_type: SalaryType;
  base_salary: number;
  hourly_rate: number;
  effective_from: string;
  effective_to?: string;
  active: boolean;
  created_by?: string;
  created_at: string;
}

export interface BonusRule {
  id: string;
  name: string;
  rule_type: string;
  threshold: number;
  reward_amount: number;
  effective_from: string;
  effective_to?: string;
  active: boolean;
}

export interface CommissionEntry {
  id: string;
  staff_id: string;
  order_item_id: string;
  sale_amount_snapshot: number;
  commission_amount: number;
  created_at: string;
}

export interface PayrollPeriod {
  id: string;
  period_name: string;
  start_date: string;
  end_date: string;
  status: PayrollStatus;
  created_at: string;
  updated_at: string;
}

export interface PayrollStatement {
  id: string;
  payroll_period_id: string;
  staff_id: string;
  staff_name?: string;
  staff_code?: string;
  worked_hours: number;
  base_salary: number;
  hourly_salary: number;
  customer_bonus: number;
  product_commission: number;
  manual_bonus: number;
  deductions: number;
  net_pay: number;
  status: PayrollStatus;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  affects_profit: boolean;
  created_by?: string;
  created_at: string;
}

export interface HistoricalFinance {
  id: string;
  period_type: string;
  entry_date: string;
  revenue: number;
  expenses: number;
  note?: string;
  created_by?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id?: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  created_at: string;
}

export interface StaffBookingCustomerContext {
  customer_code: string;
  display_name: string;
  skin_type?: string;
  skin_conditions?: string[];
  allergies?: string[];
  sensitivity?: string;
  main_concern?: string;
  desired_improvement?: string;
  today_service_name?: string;
  previous_services?: Array<{ service: string; date: string }>;
}
