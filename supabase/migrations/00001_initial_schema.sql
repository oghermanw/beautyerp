-- Beauty Salon Management System MVP v4 Migration
-- Created: 2026-08-17

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('SUPER', 'ADMIN', 'STAFF');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'DISABLED');
CREATE TYPE employment_status AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED');
CREATE TYPE note_visibility AS ENUM ('SERVICE_TEAM', 'SUPER_ONLY');
CREATE TYPE product_type AS ENUM ('RETAIL', 'CONSUMABLE', 'BOTH');
CREATE TYPE booking_status AS ENUM ('DRAFT', 'SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_SERVICE', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE order_status AS ENUM ('DRAFT', 'FINALIZED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'VOID');
CREATE TYPE order_item_type AS ENUM ('SERVICE', 'ADD_ON', 'PRODUCT', 'OTHER');
CREATE TYPE payment_method AS ENUM ('CASH', 'FPS', 'CARD', 'BANK_TRANSFER', 'OCTOPUS', 'OTHER');
CREATE TYPE inventory_movement_type AS ENUM ('STOCK_IN', 'PRODUCT_SALE', 'SERVICE_USAGE', 'RETURN', 'DAMAGED', 'EXPIRED', 'MANUAL_ADJUSTMENT', 'REVERSAL');
CREATE TYPE time_entry_status AS ENUM ('PRESENT', 'SICK_LEAVE', 'ANNUAL_LEAVE', 'DAY_OFF', 'ABSENT');
CREATE TYPE salary_type AS ENUM ('MONTHLY', 'HOURLY', 'MIXED');
CREATE TYPE payroll_status AS ENUM ('OPEN', 'APPROVED', 'PAID', 'LOCKED');
CREATE TYPE payroll_adjustment_type AS ENUM ('MANUAL_BONUS', 'DEDUCTION');

-- 2. SEQUENCES
CREATE SEQUENCE seq_customer_code START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_staff_code START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_booking_code START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_order_number START WITH 1 INCREMENT BY 1;

-- 3. CORE TABLES

-- Staff Profiles
CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_code TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    birth_date DATE,
    email TEXT,
    phone TEXT,
    residential_area TEXT,
    employment_status employment_status DEFAULT 'ACTIVE',
    join_date DATE DEFAULT CURRENT_DATE,
    admin_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    role user_role NOT NULL,
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    status user_status NOT NULL DEFAULT 'ACTIVE',
    must_change_password BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE staff_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(staff_id, skill_id)
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    birth_date DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE customer_private_details (
    customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    residential_area TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE customer_skin_profiles (
    customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    skin_type TEXT,
    skin_conditions TEXT[],
    allergies TEXT[],
    sensitivity TEXT,
    preferences TEXT,
    main_concern TEXT,
    desired_improvement TEXT,
    updated_by UUID,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    booking_id UUID,
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    note_type TEXT DEFAULT 'GENERAL',
    content TEXT NOT NULL,
    visibility note_visibility DEFAULT 'SERVICE_TEAM',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Catalog: Services
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    base_price NUMERIC(12,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Catalog: Products
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    product_type product_type NOT NULL DEFAULT 'RETAIL',
    selling_price NUMERIC(12,2) NOT NULL,
    low_stock_threshold NUMERIC(12,3) DEFAULT 5,
    base_unit TEXT NOT NULL DEFAULT 'pcs',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product Costs (SUPER ONLY)
CREATE TABLE product_costs (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    current_unit_cost NUMERIC(12,2) NOT NULL,
    updated_by UUID,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recipe Mapping
CREATE TABLE service_recipe_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity_required NUMERIC(12,3) NOT NULL,
    unit TEXT NOT NULL,
    UNIQUE(service_id, product_id)
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status booking_status DEFAULT 'SCHEDULED',
    internal_note TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

CREATE TABLE booking_staff_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT true,
    assigned_by UUID,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(booking_id, staff_id)
);

CREATE TABLE booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    old_status booking_status,
    new_status booking_status NOT NULL,
    changed_by UUID,
    changed_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    status order_status DEFAULT 'DRAFT',
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    finalized_at TIMESTAMPTZ,
    finalized_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    item_type order_item_type NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    description_snapshot TEXT NOT NULL,
    quantity NUMERIC(12,3) NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    line_total NUMERIC(12,2) NOT NULL,
    commission_eligible BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    amount NUMERIC(12,2) NOT NULL,
    method payment_method NOT NULL,
    status TEXT DEFAULT 'SUCCESS',
    paid_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    external_reference TEXT,
    idempotency_key TEXT UNIQUE
);

-- Inventory Movements
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    movement_type inventory_movement_type NOT NULL,
    quantity NUMERIC(12,3) NOT NULL,
    unit_cost_snapshot NUMERIC(12,2),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    reason TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    idempotency_key TEXT UNIQUE
);

-- Staff Attendance / Time Entries
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    worked_hours NUMERIC(6,2),
    status time_entry_status DEFAULT 'PRESENT',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(staff_id, work_date)
);

-- Staff Compensation & Rules (SUPER ONLY)
CREATE TABLE staff_compensation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    salary_type salary_type NOT NULL DEFAULT 'MONTHLY',
    base_salary NUMERIC(12,2) DEFAULT 0,
    hourly_rate NUMERIC(12,2) DEFAULT 0,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bonus_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    rule_type TEXT NOT NULL DEFAULT 'EVERY_N_CUSTOMERS',
    threshold INT NOT NULL DEFAULT 5,
    reward_amount NUMERIC(12,2) NOT NULL DEFAULT 20.00,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    active BOOLEAN DEFAULT true
);

CREATE TABLE commission_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    commission_rule_id UUID,
    sale_amount_snapshot NUMERIC(12,2) NOT NULL,
    commission_amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    idempotency_key TEXT UNIQUE
);

CREATE TABLE payroll_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status payroll_status DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payroll_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_period_id UUID REFERENCES payroll_periods(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    worked_hours NUMERIC(6,2) DEFAULT 0,
    base_salary NUMERIC(12,2) DEFAULT 0,
    hourly_salary NUMERIC(12,2) DEFAULT 0,
    customer_bonus NUMERIC(12,2) DEFAULT 0,
    product_commission NUMERIC(12,2) DEFAULT 0,
    manual_bonus NUMERIC(12,2) DEFAULT 0,
    deductions NUMERIC(12,2) DEFAULT 0,
    net_pay NUMERIC(12,2) NOT NULL DEFAULT 0,
    status payroll_status DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(payroll_period_id, staff_id)
);

CREATE TABLE payroll_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_statement_id UUID REFERENCES payroll_statements(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL
);

CREATE TABLE payroll_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    payroll_period_id UUID REFERENCES payroll_periods(id) ON DELETE SET NULL,
    type payroll_adjustment_type NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Expenses (SUPER ONLY)
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_date DATE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    vendor TEXT,
    affects_profit BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Historical Finance Input & Import
CREATE TABLE historical_finance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_type TEXT NOT NULL DEFAULT 'MONTHLY',
    entry_date DATE NOT NULL,
    revenue NUMERIC(12,2) NOT NULL,
    expenses NUMERIC(12,2) NOT NULL,
    note TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs (SUPER ONLY)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- System Settings
CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. INDEXES
CREATE INDEX idx_bookings_starts_at ON bookings(starts_at);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id, starts_at);
CREATE INDEX idx_booking_staff_assignments ON booking_staff_assignments(staff_id, booking_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id, created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);
CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id, created_at);
CREATE INDEX idx_time_entries_staff_date ON time_entries(staff_id, work_date);
CREATE INDEX idx_payroll_statements_staff ON payroll_statements(staff_id);
CREATE INDEX idx_customer_notes_customer ON customer_notes(customer_id, created_at);

-- 5. RLS SECURITY HELPERS & POLICIES

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_private_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_skin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_compensation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Security helper functions
CREATE OR REPLACE FUNCTION current_role() RETURNS user_role AS $$
    SELECT role FROM user_profiles WHERE auth_user_id = auth.uid() AND status = 'ACTIVE' LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super() RETURNS BOOLEAN AS $$
    SELECT current_role() = 'SUPER';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
    SELECT current_role() = 'ADMIN';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_staff_id() RETURNS UUID AS $$
    SELECT staff_id FROM user_profiles WHERE auth_user_id = auth.uid() AND status = 'ACTIVE' LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_staff_assigned_to_booking(b_id UUID) RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM booking_staff_assignments
        WHERE booking_id = b_id AND staff_id = current_staff_id()
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS Policies

-- User Profiles: SUPER full, users read self
CREATE POLICY user_profiles_super ON user_profiles FOR ALL USING (is_super());
CREATE POLICY user_profiles_read_self ON user_profiles FOR SELECT USING (auth_user_id = auth.uid());

-- Staff Profiles: SUPER full, ADMIN select active/minimal, STAFF read self
CREATE POLICY staff_profiles_super ON staff_profiles FOR ALL USING (is_super());
CREATE POLICY staff_profiles_admin ON staff_profiles FOR SELECT USING (is_admin());
CREATE POLICY staff_profiles_staff_self ON staff_profiles FOR SELECT USING (id = current_staff_id());

-- Customers & Customer Private Details: SUPER & ADMIN full, STAFF NO direct access
CREATE POLICY customers_super_admin ON customers FOR ALL USING (is_super() OR is_admin());
CREATE POLICY customer_private_super_admin ON customer_private_details FOR ALL USING (is_super() OR is_admin());

-- Customer Skin Profiles: SUPER & ADMIN full, STAFF assigned booking access
CREATE POLICY customer_skin_super_admin ON customer_skin_profiles FOR ALL USING (is_super() OR is_admin());
CREATE POLICY customer_skin_staff ON customer_skin_profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM bookings b
        JOIN booking_staff_assignments bsa ON b.id = bsa.booking_id
        WHERE b.customer_id = customer_skin_profiles.customer_id
        AND bsa.staff_id = current_staff_id()
    )
);

-- Customer Notes: SUPER full, ADMIN/STAFF SERVICE_TEAM notes
CREATE POLICY customer_notes_super ON customer_notes FOR ALL USING (is_super());
CREATE POLICY customer_notes_admin ON customer_notes FOR ALL USING (is_admin() AND visibility = 'SERVICE_TEAM');
CREATE POLICY customer_notes_staff ON customer_notes FOR SELECT USING (
    visibility = 'SERVICE_TEAM' AND is_staff_assigned_to_booking(booking_id)
);
CREATE POLICY customer_notes_staff_insert ON customer_notes FOR INSERT WITH CHECK (
    visibility = 'SERVICE_TEAM' AND is_staff_assigned_to_booking(booking_id)
);

-- Services & Products (Catalog)
CREATE POLICY services_all ON services FOR SELECT USING (true);
CREATE POLICY services_write ON services FOR ALL USING (is_super() OR is_admin());
CREATE POLICY products_all ON products FOR SELECT USING (true);
CREATE POLICY products_write ON products FOR ALL USING (is_super() OR is_admin());

-- Product Costs: SUPER ONLY
CREATE POLICY product_costs_super ON product_costs FOR ALL USING (is_super());

-- Bookings & Assignments
CREATE POLICY bookings_super_admin ON bookings FOR ALL USING (is_super() OR is_admin());
CREATE POLICY bookings_staff_select ON bookings FOR SELECT USING (is_staff_assigned_to_booking(id));
CREATE POLICY bookings_staff_update ON bookings FOR UPDATE USING (is_staff_assigned_to_booking(id));

CREATE POLICY booking_assignments_super_admin ON booking_staff_assignments FOR ALL USING (is_super() OR is_admin());
CREATE POLICY booking_assignments_staff ON booking_staff_assignments FOR SELECT USING (staff_id = current_staff_id());

-- Orders & Items & Payments
CREATE POLICY orders_super_admin ON orders FOR ALL USING (is_super() OR is_admin());
CREATE POLICY orders_staff ON orders FOR SELECT USING (is_staff_assigned_to_booking(booking_id));
CREATE POLICY order_items_super_admin ON order_items FOR ALL USING (is_super() OR is_admin());
CREATE POLICY order_items_staff ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND is_staff_assigned_to_booking(o.booking_id))
);

CREATE POLICY payments_super_admin ON payments FOR ALL USING (is_super() OR is_admin());

-- Inventory Movements: SUPER full, ADMIN stock-in/adj (NO unit cost), STAFF NO access
CREATE POLICY inventory_super ON inventory_movements FOR ALL USING (is_super());
CREATE POLICY inventory_admin ON inventory_movements FOR INSERT WITH CHECK (is_admin());
CREATE POLICY inventory_admin_select ON inventory_movements FOR SELECT USING (is_admin());

-- Time Entries: SUPER full, STAFF read self
CREATE POLICY time_entries_super ON time_entries FOR ALL USING (is_super());
CREATE POLICY time_entries_staff ON time_entries FOR SELECT USING (staff_id = current_staff_id());

-- Compensation / Payroll / Expenses / Finance / Audit: SUPER ONLY (Staff view own statement)
CREATE POLICY comp_plans_super ON staff_compensation_plans FOR ALL USING (is_super());
CREATE POLICY bonus_rules_super ON bonus_rules FOR ALL USING (is_super());
CREATE POLICY commission_super ON commission_entries FOR ALL USING (is_super());
CREATE POLICY commission_staff ON commission_entries FOR SELECT USING (staff_id = current_staff_id());
CREATE POLICY payroll_periods_super ON payroll_periods FOR ALL USING (is_super());
CREATE POLICY payroll_statements_super ON payroll_statements FOR ALL USING (is_super());
CREATE POLICY payroll_statements_staff ON payroll_statements FOR SELECT USING (staff_id = current_staff_id());
CREATE POLICY payroll_lines_super ON payroll_line_items FOR ALL USING (is_super());
CREATE POLICY payroll_lines_staff ON payroll_line_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM payroll_statements ps WHERE ps.id = payroll_line_items.payroll_statement_id AND ps.staff_id = current_staff_id())
);
CREATE POLICY payroll_adj_super ON payroll_adjustments FOR ALL USING (is_super());
CREATE POLICY payroll_adj_staff ON payroll_adjustments FOR SELECT USING (staff_id = current_staff_id());

CREATE POLICY expenses_super ON expenses FOR ALL USING (is_super());
CREATE POLICY historical_finance_super ON historical_finance FOR ALL USING (is_super());
CREATE POLICY audit_logs_super ON audit_logs FOR ALL USING (is_super());
CREATE POLICY system_settings_super ON system_settings FOR ALL USING (is_super());


-- 6. RPC: GET STAFF BOOKING CUSTOMER CONTEXT (RESTRICTED FOR STAFF)
CREATE OR REPLACE FUNCTION get_staff_booking_customer_context(p_booking_id UUID)
RETURNS TABLE (
    customer_code TEXT,
    display_name TEXT,
    skin_type TEXT,
    skin_conditions TEXT[],
    allergies TEXT[],
    sensitivity TEXT,
    main_concern TEXT,
    desired_improvement TEXT,
    today_service_name TEXT,
    previous_services JSONB
) AS $$
DECLARE
    v_staff_id UUID;
    v_customer_id UUID;
    v_service_name TEXT;
BEGIN
    v_staff_id := current_staff_id();
    
    -- Verify assignment or SUPER/ADMIN
    IF NOT (is_super() OR is_admin() OR is_staff_assigned_to_booking(p_booking_id)) THEN
        RAISE EXCEPTION 'Unauthorized customer context access';
    END IF;
    
    SELECT b.customer_id INTO v_customer_id FROM bookings b WHERE b.id = p_booking_id;
    
    RETURN QUERY
    SELECT 
        c.customer_code,
        c.display_name,
        csp.skin_type,
        csp.skin_conditions,
        csp.allergies,
        csp.sensitivity,
        csp.main_concern,
        csp.desired_improvement,
        (SELECT s.name FROM order_items oi JOIN services s ON oi.service_id = s.id JOIN orders o ON oi.order_id = o.id WHERE o.booking_id = p_booking_id AND oi.item_type = 'SERVICE' LIMIT 1) AS today_service_name,
        (
            SELECT COALESCE(jsonb_agg(jsonb_build_object('service', s.name, 'date', b.completed_at)), '[]'::jsonb)
            FROM bookings b
            JOIN orders o ON o.booking_id = b.id
            JOIN order_items oi ON oi.order_id = o.id
            JOIN services s ON oi.service_id = s.id
            WHERE b.customer_id = v_customer_id AND b.status = 'COMPLETED' AND b.id <> p_booking_id
        ) AS previous_services
    FROM customers c
    LEFT JOIN customer_skin_profiles csp ON c.id = csp.customer_id
    WHERE c.id = v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. RPC: ATOMIC COMPLETE BOOKING
CREATE OR REPLACE FUNCTION complete_booking(p_booking_id UUID, p_completed_by UUID)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_order RECORD;
    v_recipe RECORD;
    v_product_item RECORD;
    v_primary_staff_id UUID;
    v_order_item RECORD;
    v_comm_amount NUMERIC(12,2);
BEGIN
    -- 1. Fetch booking
    SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    IF v_booking.status = 'COMPLETED' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Booking already completed');
    END IF;

    -- 2. Fetch primary staff
    SELECT staff_id INTO v_primary_staff_id 
    FROM booking_staff_assignments 
    WHERE booking_id = p_booking_id AND is_primary = true 
    LIMIT 1;

    -- 3. Update booking status
    UPDATE bookings 
    SET status = 'COMPLETED', completed_at = now(), updated_at = now() 
    WHERE id = p_booking_id;

    INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by)
    VALUES (p_booking_id, v_booking.status, 'COMPLETED', p_completed_by);

    -- 4. Finalize associated Order if exists
    SELECT * INTO v_order FROM orders WHERE booking_id = p_booking_id FOR UPDATE;
    IF FOUND THEN
        UPDATE orders 
        SET status = 'FINALIZED', finalized_at = now(), finalized_by = p_completed_by, updated_at = now() 
        WHERE id = v_order.id;

        -- 5. Deduct Recipe Consumables for Services in Order
        FOR v_recipe IN 
            SELECT r.product_id, r.quantity_required, r.unit, s.name as service_name
            FROM order_items oi
            JOIN service_recipe_items r ON oi.service_id = r.service_id
            JOIN services s ON s.id = r.service_id
            WHERE oi.order_id = v_order.id AND oi.item_type = 'SERVICE'
        LOOP
            INSERT INTO inventory_movements (
                product_id, movement_type, quantity, booking_id, reason, created_by, idempotency_key
            ) VALUES (
                v_recipe.product_id, 
                'SERVICE_USAGE', 
                v_recipe.quantity_required, 
                p_booking_id, 
                'Facial Consumable for ' || v_recipe.service_name, 
                p_completed_by,
                'recipe_' || p_booking_id || '_' || v_recipe.product_id
            ) ON CONFLICT (idempotency_key) DO NOTHING;
        END LOOP;

        -- 6. Deduct Retail Product Inventory & Calculate Commission
        FOR v_order_item IN 
            SELECT * FROM order_items WHERE order_id = v_order.id AND item_type = 'PRODUCT'
        LOOP
            INSERT INTO inventory_movements (
                product_id, movement_type, quantity, booking_id, order_item_id, reason, created_by, idempotency_key
            ) VALUES (
                v_order_item.product_id, 
                'PRODUCT_SALE', 
                v_order_item.quantity, 
                p_booking_id, 
                v_order_item.id, 
                'Product Retail Sale', 
                p_completed_by,
                'sale_' || v_order_item.id
            ) ON CONFLICT (idempotency_key) DO NOTHING;

            -- Calculate 10% commission on product sale for assigned staff
            IF v_primary_staff_id IS NOT NULL AND v_order_item.commission_eligible THEN
                v_comm_amount := ROUND(v_order_item.line_total * 0.10, 2);
                INSERT INTO commission_entries (
                    staff_id, order_item_id, sale_amount_snapshot, commission_amount, idempotency_key
                ) VALUES (
                    v_primary_staff_id, v_order_item.id, v_order_item.line_total, v_comm_amount, 'comm_' || v_order_item.id
                ) ON CONFLICT (idempotency_key) DO NOTHING;
            END IF;
        END LOOP;
    END IF;

    -- 7. Record Audit Log
    INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, old_data, new_data)
    VALUES (
        p_completed_by, 
        'COMPLETE_BOOKING', 
        'bookings', 
        p_booking_id, 
        jsonb_build_object('status', v_booking.status), 
        jsonb_build_object('status', 'COMPLETED')
    );

    RETURN jsonb_build_object('success', true, 'booking_id', p_booking_id, 'status', 'COMPLETED');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
