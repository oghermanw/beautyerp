// In-Memory Reactive Store & Realistic Seed Data Engine for Beauty Salon Management System MVP v4

import {
  UserProfile,
  StaffProfile,
  Customer,
  CustomerPrivateDetails,
  CustomerSkinProfile,
  CustomerNote,
  ServiceCategory,
  ServiceItem,
  ProductCategory,
  Product,
  ServiceRecipeItem,
  Booking,
  Order,
  OrderItem,
  Payment,
  InventoryMovement,
  TimeEntry,
  StaffCompensationPlan,
  BonusRule,
  CommissionEntry,
  PayrollPeriod,
  PayrollStatement,
  Expense,
  HistoricalFinance,
  AuditLog,
  UserRole,
  StaffBookingCustomerContext
} from '@/lib/types';

// Mock DB Initializer
class SalonMockDatabase {
  public userProfiles: UserProfile[] = [];
  public staffProfiles: StaffProfile[] = [];
  public customers: Customer[] = [];
  public customerPrivateDetails: Record<string, CustomerPrivateDetails> = {};
  public customerSkinProfiles: Record<string, CustomerSkinProfile> = {};
  public customerNotes: CustomerNote[] = [];
  public serviceCategories: ServiceCategory[] = [];
  public services: ServiceItem[] = [];
  public productCategories: ProductCategory[] = [];
  public products: Product[] = [];
  public productCosts: Record<string, number> = {}; // SUPER ONLY
  public serviceRecipes: ServiceRecipeItem[] = [];
  public bookings: Booking[] = [];
  public orders: Order[] = [];
  public orderItems: OrderItem[] = [];
  public payments: Payment[] = [];
  public inventoryMovements: InventoryMovement[] = [];
  public timeEntries: TimeEntry[] = [];
  public compensationPlans: StaffCompensationPlan[] = [];
  public bonusRules: BonusRule[] = [];
  public commissionEntries: CommissionEntry[] = [];
  public payrollPeriods: PayrollPeriod[] = [];
  public payrollStatements: PayrollStatement[] = [];
  public expenses: Expense[] = [];
  public historicalFinance: HistoricalFinance[] = [];
  public auditLogs: AuditLog[] = [];
  public systemSettings: Record<string, unknown> = {};

  private isInitialized = false;

  constructor() {
    this.seed();
  }

  public seed() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Staff Profiles
    this.staffProfiles = [
      {
        id: 's-001',
        staff_code: 'S000001',
        display_name: 'Amy Wong',
        birth_date: '1995-04-12',
        email: 'amy@beauty.com',
        phone: '+852 9123 4567',
        residential_area: 'Central',
        employment_status: 'ACTIVE',
        join_date: '2023-01-15',
        admin_comment: 'Top performer in facial care and product sales',
        created_at: '2023-01-15T00:00:00Z',
        updated_at: '2023-01-15T00:00:00Z',
        skills: ['Facial', 'Eye Treatment', 'Acne Care']
      },
      {
        id: 's-002',
        staff_code: 'S000002',
        display_name: 'Betty Li',
        birth_date: '1996-08-20',
        email: 'betty@beauty.com',
        phone: '+852 9234 5678',
        residential_area: 'Causeway Bay',
        employment_status: 'ACTIVE',
        join_date: '2023-03-01',
        admin_comment: 'Excellent customer feedback scores',
        created_at: '2023-03-01T00:00:00Z',
        updated_at: '2023-03-01T00:00:00Z',
        skills: ['Anti-Aging', 'Massage', 'LED Therapy']
      },
      {
        id: 's-003',
        staff_code: 'S000003',
        display_name: 'Chloe Chan',
        birth_date: '1998-11-05',
        email: 'chloe@beauty.com',
        phone: '+852 9345 6789',
        residential_area: 'Tsim Sha Tsui',
        employment_status: 'ACTIVE',
        join_date: '2023-06-10',
        admin_comment: 'Punctual and detail-oriented technician',
        created_at: '2023-06-10T00:00:00Z',
        updated_at: '2023-06-10T00:00:00Z',
        skills: ['Deep Cleansing', 'Hydration']
      },
      {
        id: 's-004',
        staff_code: 'S000004',
        display_name: 'Daisy Cheung',
        birth_date: '1997-02-28',
        email: 'daisy@beauty.com',
        phone: '+852 9456 7890',
        residential_area: 'Shatin',
        employment_status: 'ACTIVE',
        join_date: '2023-09-01',
        admin_comment: 'Great team player',
        created_at: '2023-09-01T00:00:00Z',
        updated_at: '2023-09-01T00:00:00Z',
        skills: ['Facial', 'Neck Treatment']
      }
    ];

    // 2. User Profiles
    this.userProfiles = [
      {
        id: 'u-super-1',
        auth_user_id: 'auth-super-1',
        role: 'SUPER',
        staff_id: null,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 'u-admin-1',
        auth_user_id: 'auth-admin-1',
        role: 'ADMIN',
        staff_id: null,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 'u-admin-2',
        auth_user_id: 'auth-admin-2',
        role: 'ADMIN',
        staff_id: null,
        status: 'ACTIVE',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 'u-staff-1',
        auth_user_id: 'auth-staff-1',
        role: 'STAFF',
        staff_id: 's-001',
        status: 'ACTIVE',
        created_at: '2023-01-15T00:00:00Z',
        updated_at: '2023-01-15T00:00:00Z'
      },
      {
        id: 'u-staff-2',
        auth_user_id: 'auth-staff-2',
        role: 'STAFF',
        staff_id: 's-002',
        status: 'ACTIVE',
        created_at: '2023-03-01T00:00:00Z',
        updated_at: '2023-03-01T00:00:00Z'
      },
      {
        id: 'u-staff-3',
        auth_user_id: 'auth-staff-3',
        role: 'STAFF',
        staff_id: 's-003',
        status: 'ACTIVE',
        created_at: '2023-06-10T00:00:00Z',
        updated_at: '2023-06-10T00:00:00Z'
      },
      {
        id: 'u-staff-4',
        auth_user_id: 'auth-staff-4',
        role: 'STAFF',
        staff_id: 's-004',
        status: 'ACTIVE',
        created_at: '2023-09-01T00:00:00Z',
        updated_at: '2023-09-01T00:00:00Z'
      }
    ];

    // 3. Categories, Services, Products
    this.serviceCategories = [
      { id: 'sc-1', name: 'Facial Treatments' },
      { id: 'sc-2', name: 'Add-on Treatments' }
    ];

    this.services = [
      { id: 'srv-1', service_code: 'SER001', name: 'Hydration Facial', category_id: 'sc-1', category_name: 'Facial Treatments', duration_minutes: 60, base_price: 680, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'srv-2', service_code: 'SER002', name: 'Deep Cleansing Facial', category_id: 'sc-1', category_name: 'Facial Treatments', duration_minutes: 75, base_price: 780, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'srv-3', service_code: 'SER003', name: 'Anti-Aging Facial', category_id: 'sc-1', category_name: 'Facial Treatments', duration_minutes: 90, base_price: 980, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'srv-4', service_code: 'SER004', name: 'Acne Defense Treatment', category_id: 'sc-1', category_name: 'Facial Treatments', duration_minutes: 60, base_price: 720, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'srv-5', service_code: 'SER005', name: 'Brightening Glow Facial', category_id: 'sc-1', category_name: 'Facial Treatments', duration_minutes: 75, base_price: 850, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'srv-6', service_code: 'SER006', name: 'Eye Revitalizing Add-on', category_id: 'sc-2', category_name: 'Add-on Treatments', duration_minutes: 20, base_price: 180, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'srv-7', service_code: 'SER007', name: 'Neck Firming Treatment', category_id: 'sc-2', category_name: 'Add-on Treatments', duration_minutes: 25, base_price: 220, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'srv-8', service_code: 'SER008', name: 'LED Light Therapy Add-on', category_id: 'sc-2', category_name: 'Add-on Treatments', duration_minutes: 15, base_price: 150, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' }
    ];

    this.productCategories = [
      { id: 'pc-1', name: 'Skincare Retail' },
      { id: 'pc-2', name: 'Facial Consumables' }
    ];

    this.products = [
      { id: 'prd-1', sku: 'SKU-GEL-01', name: 'Cleansing Gel', category_id: 'pc-2', category_name: 'Facial Consumables', product_type: 'CONSUMABLE', selling_price: 150, low_stock_threshold: 10, base_unit: 'ml', current_stock: 500, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'prd-2', sku: 'SKU-TON-01', name: 'Hydrating Toner', category_id: 'pc-2', category_name: 'Facial Consumables', product_type: 'BOTH', selling_price: 280, low_stock_threshold: 10, base_unit: 'ml', current_stock: 350, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'prd-3', sku: 'SKU-SER-01', name: 'Hyaluronic Acid Serum', category_id: 'pc-1', category_name: 'Skincare Retail', product_type: 'BOTH', selling_price: 420, low_stock_threshold: 5, base_unit: 'pcs', current_stock: 18, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'prd-4', sku: 'SKU-MSK-01', name: 'Hydration Mask', category_id: 'pc-2', category_name: 'Facial Consumables', product_type: 'CONSUMABLE', selling_price: 50, low_stock_threshold: 15, base_unit: 'pcs', current_stock: 45, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'prd-5', sku: 'SKU-COT-01', name: 'Cotton Pads (Pack)', category_id: 'pc-2', category_name: 'Facial Consumables', product_type: 'CONSUMABLE', selling_price: 20, low_stock_threshold: 20, base_unit: 'pcs', current_stock: 120, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'prd-6', sku: 'SKU-EYE-01', name: 'Eye Contour Cream 15ml', category_id: 'pc-1', category_name: 'Skincare Retail', product_type: 'RETAIL', selling_price: 360, low_stock_threshold: 5, base_unit: 'pcs', current_stock: 12, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'prd-7', sku: 'SKU-SUN-01', name: 'SPF 50 Sunscreen 50ml', category_id: 'pc-1', category_name: 'Skincare Retail', product_type: 'RETAIL', selling_price: 320, low_stock_threshold: 8, base_unit: 'pcs', current_stock: 22, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
      { id: 'prd-8', sku: 'SKU-ACN-01', name: 'Acne Spot Treatment Gel', category_id: 'pc-1', category_name: 'Skincare Retail', product_type: 'RETAIL', selling_price: 250, low_stock_threshold: 5, base_unit: 'pcs', current_stock: 9, active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' }
    ];

    // Product Costs (SUPER ONLY)
    this.productCosts = {
      'prd-1': 45.00,
      'prd-2': 85.00,
      'prd-3': 120.00,
      'prd-4': 12.00,
      'prd-5': 4.00,
      'prd-6': 110.00,
      'prd-7': 95.00,
      'prd-8': 70.00
    };

    // Recipe Items (Hydration Facial)
    this.serviceRecipes = [
      { id: 'rec-1', service_id: 'srv-1', product_id: 'prd-1', product_name: 'Cleansing Gel', quantity_required: 10, unit: 'ml' },
      { id: 'rec-2', service_id: 'srv-1', product_id: 'prd-2', product_name: 'Hydrating Toner', quantity_required: 5, unit: 'ml' },
      { id: 'rec-3', service_id: 'srv-1', product_id: 'prd-3', product_name: 'Hyaluronic Acid Serum', quantity_required: 3, unit: 'ml' },
      { id: 'rec-4', service_id: 'srv-1', product_id: 'prd-4', product_name: 'Hydration Mask', quantity_required: 1, unit: 'pcs' },
      { id: 'rec-5', service_id: 'srv-1', product_id: 'prd-5', product_name: 'Cotton Pads (Pack)', quantity_required: 4, unit: 'pcs' }
    ];

    // 4. Customers & PII
    const names = [
      'May Chan', 'Grace Wong', 'Helen Lee', 'Ivy Cheung', 'Jane Kwok',
      'Kelly Ho', 'Lily Tsang', 'Mandy Chow', 'Niki Lau', 'Olivia Tang',
      'Polly Fung', 'Queeni Yeung', 'Rachel Tam', 'Sophia Mok', 'Tina Cheng',
      'Ula Poon', 'Vicky Fan', 'Winnie Yiu', 'Yuki Yip', 'Zoe Lo'
    ];

    names.forEach((name, idx) => {
      const cId = `c-${100 + idx}`;
      const code = `C${(idx + 1).toString().padStart(6, '0')}`;
      this.customers.push({
        id: cId,
        customer_code: code,
        display_name: name,
        birth_date: `199${(idx % 9)} -05-15`,
        active: true,
        created_at: '2023-02-01T00:00:00Z',
        updated_at: '2023-02-01T00:00:00Z'
      });

      this.customerPrivateDetails[cId] = {
        customer_id: cId,
        full_name: `${name} (Official)`,
        phone: `+852 9${(idx + 1).toString().padStart(3, '0')} ${1000 + idx * 111}`,
        email: `${name.toLowerCase().replace(' ', '.')}@example.hk`,
        residential_area: idx % 2 === 0 ? 'Hong Kong Island' : 'Kowloon',
        emergency_contact: '+852 9000 1111',
        created_at: '2023-02-01T00:00:00Z',
        updated_at: '2023-02-01T00:00:00Z'
      };

      this.customerSkinProfiles[cId] = {
        customer_id: cId,
        skin_type: idx % 3 === 0 ? 'Combination / Dry' : idx % 3 === 1 ? 'Sensitive' : 'Oily / Acne-prone',
        skin_conditions: idx % 2 === 0 ? ['Dehydration', 'Redness'] : ['Clogged Pores', 'Fine Lines'],
        allergies: idx % 4 === 0 ? ['Alcohol', 'Fragrance'] : ['None'],
        sensitivity: idx % 2 === 0 ? 'High' : 'Moderate',
        preferences: 'Gentle pressure, warm towel',
        main_concern: 'Dryness around cheeks & uneven skin tone',
        desired_improvement: 'Deep hydration and soothing repair',
        updated_by: 'u-admin-1',
        updated_at: '2023-02-01T00:00:00Z'
      };

      this.customerNotes.push({
        id: `cn-${idx}`,
        customer_id: cId,
        note_type: 'TREATMENT',
        content: 'Customer enjoyed the hydrating facial mask. Responded well to soothing aloe vera.',
        visibility: 'SERVICE_TEAM',
        created_by: 'u-staff-1',
        created_at: '2023-02-05T00:00:00Z'
      });
    });

    // 5. Bookings & Orders
    this.bookings = [
      {
        id: 'b-001',
        booking_code: 'B202608150001',
        customer_id: 'c-100', // May Chan
        customer_name: 'May Chan',
        starts_at: '2026-08-15T14:00:00Z',
        ends_at: '2026-08-15T15:00:00Z',
        status: 'COMPLETED',
        internal_note: 'May Chan Hydration Facial session',
        assigned_staff_id: 's-001',
        assigned_staff_name: 'Amy Wong',
        service_name: 'Hydration Facial',
        price: 680,
        created_by: 'u-admin-1',
        created_at: '2026-08-10T10:00:00Z',
        updated_at: '2026-08-15T15:00:00Z',
        completed_at: '2026-08-15T15:00:00Z'
      },
      {
        id: 'b-002',
        booking_code: 'B202608170001',
        customer_id: 'c-101',
        customer_name: 'Grace Wong',
        starts_at: '2026-08-17T11:00:00Z',
        ends_at: '2026-08-17T12:15:00Z',
        status: 'IN_SERVICE',
        internal_note: 'Deep Cleansing facial',
        assigned_staff_id: 's-002',
        assigned_staff_name: 'Betty Li',
        service_name: 'Deep Cleansing Facial',
        price: 780,
        created_by: 'u-admin-1',
        created_at: '2026-08-12T09:00:00Z',
        updated_at: '2026-08-17T11:00:00Z'
      },
      {
        id: 'b-003',
        booking_code: 'B202608170002',
        customer_id: 'c-102',
        customer_name: 'Helen Lee',
        starts_at: '2026-08-17T15:00:00Z',
        ends_at: '2026-08-17T16:30:00Z',
        status: 'CONFIRMED',
        internal_note: 'Anti-Aging facial + Eye treatment',
        assigned_staff_id: 's-001',
        assigned_staff_name: 'Amy Wong',
        service_name: 'Anti-Aging Facial',
        price: 980,
        created_by: 'u-admin-2',
        created_at: '2026-08-14T14:00:00Z',
        updated_at: '2026-08-14T14:00:00Z'
      },
      {
        id: 'b-004',
        booking_code: 'B202608180001',
        customer_id: 'c-103',
        customer_name: 'Ivy Cheung',
        starts_at: '2026-08-18T10:00:00Z',
        ends_at: '2026-08-18T11:00:00Z',
        status: 'SCHEDULED',
        assigned_staff_id: 's-003',
        assigned_staff_name: 'Chloe Chan',
        service_name: 'Hydration Facial',
        price: 680,
        created_by: 'u-admin-1',
        created_at: '2026-08-15T11:00:00Z',
        updated_at: '2026-08-15T11:00:00Z'
      }
    ];

    // Order b-001 (May Chan complete flow)
    this.orders = [
      {
        id: 'ord-001',
        order_number: 'O202608150001',
        booking_id: 'b-001',
        customer_id: 'c-100',
        status: 'FINALIZED',
        subtotal: 1280,
        discount_total: 0,
        grand_total: 1280,
        finalized_at: '2026-08-15T15:00:00Z',
        finalized_by: 'u-staff-1',
        created_at: '2026-08-15T14:00:00Z',
        updated_at: '2026-08-15T15:00:00Z'
      }
    ];

    this.orderItems = [
      {
        id: 'oi-001',
        order_id: 'ord-001',
        item_type: 'SERVICE',
        service_id: 'srv-1',
        description_snapshot: 'Hydration Facial',
        quantity: 1,
        unit_price: 680,
        discount_amount: 0,
        line_total: 680,
        commission_eligible: false,
        created_at: '2026-08-15T14:00:00Z'
      },
      {
        id: 'oi-002',
        order_id: 'ord-001',
        item_type: 'ADD_ON',
        service_id: 'srv-6',
        description_snapshot: 'Eye Revitalizing Add-on',
        quantity: 1,
        unit_price: 180,
        discount_amount: 0,
        line_total: 180,
        commission_eligible: false,
        created_at: '2026-08-15T14:15:00Z'
      },
      {
        id: 'oi-003',
        order_id: 'ord-001',
        item_type: 'PRODUCT',
        product_id: 'prd-3',
        staff_id: 's-001',
        description_snapshot: 'Hyaluronic Acid Serum',
        quantity: 1,
        unit_price: 420,
        discount_amount: 0,
        line_total: 420,
        commission_eligible: true,
        created_at: '2026-08-15T14:30:00Z'
      }
    ];

    this.payments = [
      {
        id: 'pay-001',
        order_id: 'ord-001',
        customer_id: 'c-100',
        amount: 1280,
        method: 'FPS',
        status: 'SUCCESS',
        paid_at: '2026-08-15T15:00:00Z',
        created_by: 'u-admin-1',
        created_at: '2026-08-15T15:00:00Z',
        external_reference: 'FPS-99887766'
      }
    ];

    // 6. Inventory Movements
    this.inventoryMovements = [
      {
        id: 'im-001',
        product_id: 'prd-3',
        product_name: 'Hyaluronic Acid Serum',
        movement_type: 'STOCK_IN',
        quantity: 20,
        unit_cost_snapshot: 120,
        reason: 'Initial stock delivery',
        created_by: 'u-admin-1',
        created_at: '2026-08-01T00:00:00Z'
      },
      {
        id: 'im-002',
        product_id: 'prd-3',
        product_name: 'Hyaluronic Acid Serum',
        movement_type: 'PRODUCT_SALE',
        quantity: 1,
        booking_id: 'b-001',
        order_item_id: 'oi-003',
        reason: 'Retail sale to May Chan',
        created_by: 'u-staff-1',
        created_at: '2026-08-15T15:00:00Z'
      }
    ];

    // 7. Time Entries & Payroll
    this.timeEntries = [
      { id: 'te-1', staff_id: 's-001', staff_name: 'Amy Wong', work_date: '2026-08-15', clock_in: '2026-08-15T09:00:00Z', clock_out: '2026-08-15T18:00:00Z', worked_hours: 9, status: 'PRESENT', created_at: '2026-08-15T18:00:00Z' },
      { id: 'te-2', staff_id: 's-002', staff_name: 'Betty Li', work_date: '2026-08-15', clock_in: '2026-08-15T09:00:00Z', clock_out: '2026-08-15T18:00:00Z', worked_hours: 9, status: 'PRESENT', created_at: '2026-08-15T18:00:00Z' }
    ];

    this.compensationPlans = [
      { id: 'cp-1', staff_id: 's-001', salary_type: 'MONTHLY', base_salary: 18000, hourly_rate: 0, effective_from: '2026-01-01', active: true, created_at: '2026-01-01T00:00:00Z' },
      { id: 'cp-2', staff_id: 's-002', salary_type: 'MONTHLY', base_salary: 17500, hourly_rate: 0, effective_from: '2026-01-01', active: true, created_at: '2026-01-01T00:00:00Z' },
      { id: 'cp-3', staff_id: 's-003', salary_type: 'HOURLY', base_salary: 0, hourly_rate: 90, effective_from: '2026-01-01', active: true, created_at: '2026-01-01T00:00:00Z' },
      { id: 'cp-4', staff_id: 's-004', salary_type: 'MONTHLY', base_salary: 16500, hourly_rate: 0, effective_from: '2026-01-01', active: true, created_at: '2026-01-01T00:00:00Z' }
    ];

    this.bonusRules = [
      { id: 'br-1', name: 'Milestone Customer Bonus', rule_type: 'EVERY_N_CUSTOMERS', threshold: 5, reward_amount: 20.00, effective_from: '2026-01-01', active: true }
    ];

    this.commissionEntries = [
      { id: 'comm-1', staff_id: 's-001', order_item_id: 'oi-003', sale_amount_snapshot: 420, commission_amount: 42.00, created_at: '2026-08-15T15:00:00Z' }
    ];

    this.payrollPeriods = [
      { id: 'pp-202607', period_name: 'July 2026', start_date: '2026-07-01', end_date: '2026-07-31', status: 'LOCKED', created_at: '2026-07-01T00:00:00Z', updated_at: '2026-08-01T00:00:00Z' },
      { id: 'pp-202608', period_name: 'August 2026', start_date: '2026-08-01', end_date: '2026-08-31', status: 'OPEN', created_at: '2026-08-01T00:00:00Z', updated_at: '2026-08-01T00:00:00Z' }
    ];

    this.payrollStatements = [
      {
        id: 'ps-202608-s001',
        payroll_period_id: 'pp-202608',
        staff_id: 's-001',
        staff_name: 'Amy Wong',
        staff_code: 'S000001',
        worked_hours: 160,
        base_salary: 18000,
        hourly_salary: 0,
        customer_bonus: 80,
        product_commission: 42.00,
        manual_bonus: 100,
        deductions: 0,
        net_pay: 18222.00,
        status: 'OPEN',
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-15T15:00:00Z'
      }
    ];

    // 8. Expenses & Historical Finance (SUPER ONLY)
    this.expenses = [
      { id: 'exp-01', expense_date: '2026-08-02', category: 'Rent', description: 'Salon Shop Rent Aug 2026', amount: 35000, vendor: 'Landlord Co', affects_profit: true, created_at: '2026-08-02T00:00:00Z' },
      { id: 'exp-02', expense_date: '2026-08-05', category: 'Utilities', description: 'Electricity & Water', amount: 3800, vendor: 'CLP & WSD', affects_profit: true, created_at: '2026-08-05T00:00:00Z' },
      { id: 'exp-03', expense_date: '2026-08-10', category: 'Marketing', description: 'Social Media Ads', amount: 2500, vendor: 'Meta', affects_profit: true, created_at: '2026-08-10T00:00:00Z' }
    ];

    this.historicalFinance = [
      { id: 'hf-01', period_type: 'MONTHLY', entry_date: '2026-01-01', revenue: 145000, expenses: 68000, note: 'Jan 2026 Performance', created_at: '2026-02-01T00:00:00Z' },
      { id: 'hf-02', period_type: 'MONTHLY', entry_date: '2026-02-01', revenue: 162000, expenses: 72000, note: 'Feb 2026 CNY peak', created_at: '2026-03-01T00:00:00Z' },
      { id: 'hf-03', period_type: 'MONTHLY', entry_date: '2026-03-01', revenue: 150000, expenses: 70000, note: 'Mar 2026 Performance', created_at: '2026-04-01T00:00:00Z' },
      { id: 'hf-04', period_type: 'MONTHLY', entry_date: '2026-04-01', revenue: 158000, expenses: 71000, note: 'Apr 2026 Performance', created_at: '2026-05-01T00:00:00Z' },
      { id: 'hf-05', period_type: 'MONTHLY', entry_date: '2026-05-01', revenue: 175000, expenses: 75000, note: 'May 2026 Performance', created_at: '2026-06-01T00:00:00Z' },
      { id: 'hf-06', period_type: 'MONTHLY', entry_date: '2026-06-01', revenue: 168000, expenses: 73000, note: 'Jun 2026 Performance', created_at: '2026-07-01T00:00:00Z' },
      { id: 'hf-07', period_type: 'MONTHLY', entry_date: '2026-07-01', revenue: 182000, expenses: 78000, note: 'Jul 2026 Summer Peak', created_at: '2026-08-01T00:00:00Z' }
    ];

    this.auditLogs = [
      { id: 'aud-01', actor_user_id: 'u-super-1', actor_name: 'SUPER Owner', action: 'SYSTEM_INIT', entity_type: 'system', entity_id: 'sys', created_at: '2026-08-01T00:00:00Z' },
      { id: 'aud-02', actor_user_id: 'u-admin-1', actor_name: 'ADMIN Manager', action: 'CREATE_BOOKING', entity_type: 'bookings', entity_id: 'b-001', new_data: { code: 'B202608150001' }, created_at: '2026-08-10T10:00:00Z' },
      { id: 'aud-03', actor_user_id: 'u-staff-1', actor_name: 'Amy Wong (STAFF)', action: 'COMPLETE_BOOKING', entity_type: 'bookings', entity_id: 'b-001', old_data: { status: 'IN_SERVICE' }, new_data: { status: 'COMPLETED' }, created_at: '2026-08-15T15:00:00Z' }
    ];
  }

  // Helper Methods for Atomic Workflows

  public completeBookingAtomic(bookingId: string, actorUserId: string, actorRole: UserRole): { success: boolean; message: string } {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };
    if (booking.status === 'COMPLETED') return { success: true, message: 'Booking already completed' };

    const now = new Date().toISOString();
    booking.status = 'COMPLETED';
    booking.completed_at = now;
    booking.updated_at = now;

    // Find order
    let order = this.orders.find(o => o.booking_id === bookingId);
    if (!order) {
      // Create finalized order if missing
      order = {
        id: `ord-${Date.now()}`,
        order_number: `O${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 8)}0001`,
        booking_id: bookingId,
        customer_id: booking.customer_id,
        status: 'FINALIZED',
        subtotal: booking.price || 680,
        discount_total: 0,
        grand_total: booking.price || 680,
        finalized_at: now,
        finalized_by: actorUserId,
        created_at: now,
        updated_at: now
      };
      this.orders.push(order);
    } else {
      order.status = 'FINALIZED';
      order.finalized_at = now;
    }

    // Deduct consumables based on service recipes
    const recipes = this.serviceRecipes.filter(r => r.service_id === 'srv-1'); // Default hydration recipe
    recipes.forEach(r => {
      const prd = this.products.find(p => p.id === r.product_id);
      if (prd) {
        prd.current_stock = Math.max(0, (prd.current_stock || 50) - r.quantity_required);
      }
      this.inventoryMovements.push({
        id: `im-usage-${Date.now()}-${r.product_id}`,
        product_id: r.product_id,
        product_name: prd?.name || 'Consumable Product',
        movement_type: 'SERVICE_USAGE',
        quantity: r.quantity_required,
        booking_id: bookingId,
        reason: `Facial consumable recipe deduction for ${booking.service_name}`,
        created_by: actorUserId,
        created_at: now
      });
    });

    // Process retail product items in order
    const pItems = this.orderItems.filter(oi => oi.order_id === order.id && oi.item_type === 'PRODUCT');
    pItems.forEach(item => {
      if (item.product_id) {
        const prd = this.products.find(p => p.id === item.product_id);
        if (prd) {
          prd.current_stock = Math.max(0, (prd.current_stock || 10) - item.quantity);
        }
        this.inventoryMovements.push({
          id: `im-sale-${Date.now()}-${item.id}`,
          product_id: item.product_id,
          product_name: item.description_snapshot,
          movement_type: 'PRODUCT_SALE',
          quantity: item.quantity,
          booking_id: bookingId,
          order_item_id: item.id,
          reason: 'Retail sale deduction',
          created_by: actorUserId,
          created_at: now
        });

        // Commission calculation (10%)
        if (booking.assigned_staff_id && item.commission_eligible) {
          const commAmt = Math.round(item.line_total * 0.10 * 100) / 100;
          this.commissionEntries.push({
            id: `comm-${Date.now()}-${item.id}`,
            staff_id: booking.assigned_staff_id,
            order_item_id: item.id,
            sale_amount_snapshot: item.line_total,
            commission_amount: commAmt,
            created_at: now
          });
        }
      }
    });

    // Audit log entry
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_user_id: actorUserId,
      actor_name: actorRole,
      action: 'COMPLETE_BOOKING',
      entity_type: 'bookings',
      entity_id: bookingId,
      new_data: { status: 'COMPLETED' },
      created_at: now
    });

    return { success: true, message: 'Booking completed atomically' };
  }

  public getStaffBookingCustomerContext(bookingId: string, staffId: string): StaffBookingCustomerContext | null {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    const customer = this.customers.find(c => c.id === booking.customer_id);
    if (!customer) return null;

    const skinProfile = this.customerSkinProfiles[customer.id] || {};

    const prevBookings = this.bookings.filter(b => b.customer_id === customer.id && b.status === 'COMPLETED' && b.id !== bookingId);

    return {
      customer_code: customer.customer_code,
      display_name: customer.display_name,
      skin_type: skinProfile.skin_type || 'Normal',
      skin_conditions: skinProfile.skin_conditions || ['Hydration Needed'],
      allergies: skinProfile.allergies || ['None'],
      sensitivity: skinProfile.sensitivity || 'Moderate',
      main_concern: skinProfile.main_concern || 'Routine Maintenance',
      desired_improvement: skinProfile.desired_improvement || 'Glow & Smoothness',
      today_service_name: booking.service_name || 'Hydration Facial',
      previous_services: prevBookings.map(b => ({
        service: b.service_name || 'Treatment Service',
        date: b.completed_at || b.starts_at
      }))
    };
  }
}

export const mockDb = new SalonMockDatabase();
