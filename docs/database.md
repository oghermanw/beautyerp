# Database Schema & Migrations Documentation

## Data Model & Relationships

The Beauty Salon Management System uses a normalized PostgreSQL schema with 33 core tables, explicit foreign keys, indexing, and sequence generators.

### Human-Readable Code Generators
- **Customer Code**: `C000001` (Sequence `seq_customer_code`)
- **Staff Code**: `S000001` (Sequence `seq_staff_code`)
- **Booking Code**: `B202608150001` (Sequence `seq_booking_code` + date string)
- **Order Code**: `O202608150001` (Sequence `seq_order_number` + date string)

### Core Business Entities
1. `user_profiles` & `staff_profiles`: Linked via `staff_id`, linked to `auth.users` via `auth_user_id`.
2. `customers`, `customer_private_details`, `customer_skin_profiles`: 1-to-1 extension tables isolating PII and medical skin notes.
3. `services`, `products`, `service_recipe_items`: Recipe mapping connecting facial services to inventory consumable products.
4. `bookings`, `booking_staff_assignments`, `booking_status_history`: Appointment lifecycle tracking.
5. `orders`, `order_items`, `payments`: Financial ledger recording line items and multi-payment settlements.
6. `inventory_movements`: Immutable stock transaction ledger for facial recipe auto-deductions, retail sales, stock-in, and manual adjustments.
7. `payroll_periods`, `payroll_statements`, `payroll_line_items`, `payroll_adjustments`: Salary engine supporting monthly base pay, hourly wages, customer milestone bonuses, product commissions, and manual adjustments.
8. `audit_logs`: Operational & security change audit log.
