const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return inr.format(value);
}

export function formatRate(value: number): string {
  return value === 0 ? '0%' : `${value.toLocaleString('en-IN')}%`;
}
