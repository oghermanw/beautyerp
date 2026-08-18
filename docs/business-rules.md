# Business Rules Documentation

## Core Workflows & Logic

### 1. Booking Completion & Atomic Finalization (`complete_booking`)
When a booking is completed (by SUPER, ADMIN, or assigned STAFF):
1. Verifies user authentication and active user status.
2. Verifies booking status is ready (`SCHEDULED`, `CONFIRMED`, `CHECKED_IN`, or `IN_SERVICE`).
3. Prevents duplicate completion.
4. Server recalculates Order line items (Services, Add-ons, Products).
5. Finalizes Order status to `FINALIZED`.
6. Sets Booking status to `COMPLETED` with `completed_at` timestamp.
7. Deducts facial consumable recipe items (`SERVICE_USAGE` inventory movements).
8. Deducts retail products sold (`PRODUCT_SALE` inventory movements).
9. Calculates Staff product commissions and creates `commission_entries`.
10. Writes an audit entry into `audit_logs`.
11. Returns operation status atomically (rolls back on failure).

### 2. Facial Recipe Automatic Stock Deduction
- Booking Creation: NO inventory deduction.
- Booking Cancellation: NO inventory deduction.
- Booking Completion: System looks up `service_recipe_items` for the booking's service, creates `SERVICE_USAGE` inventory movements for each recipe item.
- Product Sales: Creates `PRODUCT_SALE` inventory movements for each product line item.

### 3. Price Security
- Browser-submitted unit prices for products/services are NEVER trusted for STAFF.
- SUPER and ADMIN may override prices with an operational reason, which is logged to `audit_logs`.

### 4. Payroll Engine & Locking
- Supports Base Salary (Monthly/Hourly), Customer Milestone Bonus (e.g. $20 for every 5 completed customers), Product Sales Commission, and Manual Bonuses/Deductions.
- Once a Payroll Period is marked `LOCKED`, historical values cannot be altered by future rule changes.
