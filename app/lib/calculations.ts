import { InvoiceItem, Calculations } from '@/types/invoice';

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function calculateTaxAmount(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
  return Math.round((subtotal + taxAmount) * 100) / 100;
}

export function getCalculations(items: InvoiceItem[], taxRate: number): Calculations {
  const subtotal = calculateSubtotal(items);
  const taxAmount = calculateTaxAmount(subtotal, taxRate);
  const total = calculateTotal(subtotal, taxAmount);

  return { subtotal, taxAmount, total };
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  COP: '$',
  MXN: '$',
};

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'COP', 'MXN'] as const;
