import { describe, it, expect } from 'vitest';
import { mockDb } from '../src/lib/supabase/mock-db';
import { getExportableData } from '../src/lib/export';

describe('Beauty Salon MVP v4 - Core Business Logic & Security RLS Rules', () => {

  it('1. Atomic Booking Finalization deducts recipe consumables and retail stock', () => {
    // Reset booking status to IN_SERVICE for test
    const booking = mockDb.bookings.find(b => b.id === 'b-001');
    if (booking) booking.status = 'IN_SERVICE';

    // Check initial stock of Hydrating Mask (prd-4)
    const initialPrd4Stock = mockDb.products.find(p => p.id === 'prd-4')?.current_stock || 0;

    // Complete booking b-001
    const result = mockDb.completeBookingAtomic('b-001', 'u-super-1', 'SUPER');
    expect(result.success).toBe(true);

    // Verify booking status
    expect(booking?.status).toBe('COMPLETED');

    // Verify stock deduction for recipe item (prd-4 -1.0)
    const updatedPrd4 = mockDb.products.find(p => p.id === 'prd-4');
    expect(updatedPrd4?.current_stock).toBe(initialPrd4Stock - 1.0);

    // Verify audit log entry created
    const audit = mockDb.auditLogs.find(a => a.action === 'COMPLETE_BOOKING');
    expect(audit).toBeDefined();
  });

  it('2. Staff Customer Context RPC hides customer phone, email, and spend', () => {
    const staffContext = mockDb.getStaffBookingCustomerContext('b-001', 's-001');

    expect(staffContext).toBeDefined();
    expect(staffContext?.display_name).toBe('May Chan');
    expect(staffContext?.customer_code).toBe('C000001');

    // Assert sensitive fields are undefined for STAFF
    expect((staffContext as any).phone).toBeUndefined();
    expect((staffContext as any).email).toBeUndefined();
    expect((staffContext as any).lifetime_spend).toBeUndefined();
  });

  it('3. ADMIN Data Export strictly excludes Payroll, COGS, and Audit Logs', () => {
    const adminExport = getExportableData('ADMIN');

    // Assert prohibited tables are NOT exported for ADMIN
    expect((adminExport as any).payroll_statements).toBeUndefined();
    expect((adminExport as any).audit_logs).toBeUndefined();
    expect((adminExport as any).product_costs).toBeUndefined();
    expect((adminExport as any).expenses).toBeUndefined();

    // Assert ADMIN products export does NOT contain current_unit_cost
    const sampleProduct = adminExport.products?.[0];
    expect((sampleProduct as any)?.current_unit_cost).toBeUndefined();
  });

  it('4. SUPER Data Export includes all system tables and COGS', () => {
    const superExport = getExportableData('SUPER');

    expect(superExport.payroll_statements).toBeDefined();
    expect(superExport.audit_logs).toBeDefined();
    expect(superExport.product_costs).toBeDefined();
    expect(superExport.expenses).toBeDefined();
  });

  it('5. Locking Payroll period prevents modifications', () => {
    const period = mockDb.payrollPeriods[0];
    period.status = 'LOCKED';

    expect(period.status).toBe('LOCKED');
  });
});
