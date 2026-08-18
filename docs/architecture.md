# Beauty Salon Management System MVP v4 - System Documentation

## Architecture Overview
- **Framework**: Next.js (App Router) with TypeScript & React
- **Styling**: Tailwind CSS, CSS variables, glassmorphism, responsive navigation
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & @supabase/ssr cookie auth
- **State & Logic**: Server Actions, Server Components, API routes with Zod validation
- **Calendar**: FullCalendar integration + dynamic fallback calendar
- **Analytics & Exports**: Recharts for dynamic charts, ExcelJS for workbook exports, JSZip for full CSV packages
- **Security Boundary**: Role-Based Capabilities (SUPER, ADMIN, STAFF) with server-side authorization enforcement and database RLS.

## Roles & Permissions Matrix Summary
| Capability | SUPER | ADMIN | STAFF |
|---|---|---|---|
| Company Dashboard / Profit / Finance | YES | NO | NO |
| Staff Salary / Payroll / Compensation | YES | NO | Own Only |
| Product Cost / COGS | YES | NO | NO |
| Audit Logs / System Settings | YES | NO | NO |
| Operational Bookings & Customer CRM | YES | YES | Assigned Only (Limited Context) |
| Customer Contact Details | YES | YES | NO |
| Stock Quantity & Stock-In | YES | YES | NO |
| Complete System Data Export | YES | NO | NO |
