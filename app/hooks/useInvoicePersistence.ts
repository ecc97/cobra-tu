import { useEffect, useState } from 'react';
import { DEFAULT_INVOICE } from '@/lib/constants';
import { InvoiceData } from '@/types/invoice';
import { useInvoiceStore } from '@/store/invoice-store';

const LAST_INVOICE_KEY = 'lastInvoice';

export function useInvoicePersistence() {
  const invoiceData = useInvoiceStore((state) => state.invoiceData);
  const setInvoice = useInvoiceStore((state) => state.setInvoice);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LAST_INVOICE_KEY);

    if (!raw) {
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<InvoiceData>;
      const safeItems = Array.isArray(parsed.items) && parsed.items.length > 0
        ? parsed.items
        : DEFAULT_INVOICE.items;

      setInvoice({
        ...DEFAULT_INVOICE,
        ...parsed,
        items: safeItems,
      });
    } catch {
      localStorage.removeItem(LAST_INVOICE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, [setInvoice]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(LAST_INVOICE_KEY, JSON.stringify(invoiceData));
  }, [invoiceData, isHydrated]);

  return { isHydrated };
}
