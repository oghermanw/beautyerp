# Data Export & Migration Documentation

## Complete Data Portability Standard

The Beauty Salon Management System provides full data export capabilities designed for zero-vendor-lock-in system migration.

### 1. Export Formats
- **Multi-Worksheet Excel Workbook (`.xlsx`)**: Generated using `ExcelJS`. Contains sheets for all entities.
- **ZIP Package (`.zip`)**: Generated using `JSZip`. Contains individual CSV files for every table, along with `export_manifest.json` and `data_dictionary.csv`.

### 2. Security Boundaries & Field Exclusions
- **Secrets Excluded**: Passwords, password hashes, access tokens, refresh tokens, JWTs, Supabase keys, database passwords, SMTP credentials.
- **Role Isolation**:
  - **SUPER**: Can export ALL system data, including Financial Ledgers, COGS, Salaries, Payroll, Audit Logs, and Settings.
  - **ADMIN**: Can export ONLY operational data (Bookings, Operational Customers, Inventory Quantities). Denied access to Salaries, Payroll, COGS, Profit, and Audit Logs.
  - **STAFF**: Can export ONLY own personal bookings, profile, and salary statements.

### 3. Data Dictionary Standard (`data_dictionary.csv`)
Includes field entity, column, data_type, nullable, description, relationship, and example values to allow future database engineers to import data cleanly into another DB schema.
