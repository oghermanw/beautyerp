# Permissions and Security Model

## Explicit Role Hierarchy & Capabilities

### SUPER Role (Salon Owner)
- Access to ALL routes under `/super/*`
- Complete visibility: Revenue, Expenses, Net Profit, Financial Trends, COGS, Staff Salaries, Payroll Statements, Audit Logs.
- Account Management: Create, disable, enable ADMIN & STAFF accounts, reset passwords.
- Data Export: Full System Export (CSV zip package, multi-worksheet Excel workbook).

### ADMIN Role (Operational Manager / Receptionist)
- Access ONLY to `/admin/*` routes.
- Operational capabilities: Bookings creation/editing, Staff assignment, Customer search & operational profile management, Contact info access (Phone, Email), Inventory quantity stock-in and adjustments (NO product cost visible).
- Direct URL restriction: Access to `/super/*`, `/api/payroll`, `/api/finance`, `/api/audit` returns `403 Forbidden`.
- Data Export: Operational exports only (Bookings, Customers operational, Inventory quantities). No financial or salary data exported.

### STAFF Role (Beauty Salon Technician / Employee)
- Access ONLY to `/staff/*` routes.
- Operational capabilities: View own calendar, view assigned bookings only, access restricted customer treatment context via RPC `get_staff_booking_customer_context`, add treatment notes, add permitted products/add-on services to assigned booking, view own salary, payroll history, and commissions.
- Privacy Restrictions: Cannot see customer phone, email, address, spending, payment history, or other staff members' bookings/salaries.

## Table-by-Table RLS Matrix
| Table | SUPER | ADMIN | STAFF |
|---|---|---|---|
| `user_profiles` | ALL | READ self | READ self |
| `staff_profiles` | ALL | READ operational fields | READ self |
| `customers` | ALL | ALL | NO ACCESS |
| `customer_private_details` | ALL | ALL | NO ACCESS |
| `customer_skin_profiles` | ALL | ALL | Assigned context via RPC |
| `customer_notes` | ALL | SERVICE_TEAM notes | Assigned booking SERVICE_TEAM |
| `services` | ALL | READ/WRITE | READ catalog |
| `products` | ALL | READ/WRITE | READ catalog |
| `product_costs` | ALL | NO ACCESS | NO ACCESS |
| `bookings` | ALL | ALL | Assigned only |
| `orders` | ALL | ALL | Assigned booking line items |
| `inventory_movements` | ALL | Stock-in / manual adj | NO ACCESS |
| `staff_compensation_plans` | ALL | NO ACCESS | NO ACCESS |
| `payroll_periods` / `statements` | ALL | NO ACCESS | READ own statements |
| `expenses` / `historical_finance` | ALL | NO ACCESS | NO ACCESS |
| `audit_logs` | ALL | NO ACCESS | NO ACCESS |
