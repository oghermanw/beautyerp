// Money & Currency Calculation Utility for Beauty Salon Management System MVP v4

export function formatHKD(amount: number): string {
  return new Intl.NumberFormat('en-HK', {
    style: 'currency',
    currency: 'HKD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(amount: number, decimals = 2): string {
  return amount.toFixed(decimals);
}

export function calculateOrderTotals(items: Array<{ unit_price: number; quantity: number; discount_amount?: number }>) {
  const subtotal = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
  const discountTotal = items.reduce((acc, item) => acc + (item.discount_amount || 0), 0);
  const grandTotal = Math.max(0, subtotal - discountTotal);
  return { subtotal, discountTotal, grandTotal };
}

export function calculateProductCommission(saleAmount: number, commissionRate = 0.10): number {
  return Math.round(saleAmount * commissionRate * 100) / 100;
}
