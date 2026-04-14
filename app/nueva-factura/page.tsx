'use client';

import { useCallback, useState } from 'react';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { DownloadPDFButton } from '@/components/invoice/DownloadPDFButton';
import { InvoiceData } from '@/types/invoice';
import { DEFAULT_INVOICE } from '@/lib/constants';

export default function NuevaFacturaPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_INVOICE;
    }

    const raw = localStorage.getItem('lastInvoice');
    if (!raw) {
      return DEFAULT_INVOICE;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<InvoiceData>;
      const safeItems = Array.isArray(parsed.items) && parsed.items.length > 0
        ? parsed.items
        : DEFAULT_INVOICE.items;

      return {
        ...DEFAULT_INVOICE,
        ...parsed,
        items: safeItems,
      };
    } catch {
      return DEFAULT_INVOICE;
    }
  });
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  const handleInvoiceChange = useCallback((data: InvoiceData) => {
    setInvoiceData(data);
    localStorage.setItem('lastInvoice', JSON.stringify(data));
  }, []);

  return (
    <div className="h-screen bg-surface overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 h-13 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-6">
        <div className="h-full max-w-400 mx-auto flex items-center justify-between gap-4">
          <span className="text-2xl font-display font-semibold text-white">InvoiceFlow</span>
          <span className="hidden md:block text-primary font-bold text-sm tracking-widest">
            Factura #{invoiceData.invoiceNumber.padStart(3, '0')}
          </span>
          <DownloadPDFButton
            invoiceNumber={invoiceData.invoiceNumber}
            invoiceData={invoiceData}
            fullWidth={false}
            icon="↓"
            label="Descargar PDF"
            containerClassName="min-w-45"
            buttonClassName="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary"
          />
        </div>
      </nav>

      <main className="pt-13 h-screen flex flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-[42%] bg-surface-container overflow-y-auto h-full pb-24 md:pb-6">
          <div className="p-4 sm:p-6 md:p-8 max-w-3xl">
            <InvoiceForm
              initialData={invoiceData}
              onChange={handleInvoiceChange}
              showSubmitButton={false}
            />
          </div>
        </aside>

        <section className="hidden md:flex md:w-[58%] bg-surface-container-low h-full overflow-y-auto p-8 lg:p-10 items-start justify-center">
          <div className="w-full max-w-190">
            <InvoicePreview data={invoiceData} />
          </div>
        </section>

        {isMobilePreviewOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/65">
            <div className="h-full overflow-y-auto bg-surface-container-low p-3">
              <div className="sticky top-0 z-10 mb-3 bg-surface-container-low/95 backdrop-blur-sm py-2">
                <button
                  onClick={() => setIsMobilePreviewOpen(false)}
                  className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-sm"
                >
                  Volver al formulario
                </button>
              </div>
              <div className="scale-[0.74] origin-top-left w-[135%] -ml-[8%] pb-8">
                <InvoicePreview data={invoiceData} />
              </div>
            </div>
          </div>
        )}

        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsMobilePreviewOpen(true)}
            className="bg-surface-container-lowest text-primary border border-primary/25 px-7 py-3 rounded-2xl shadow-2xl font-semibold tracking-wider"
          >
            Ver Factura
          </button>
        </div>
      </main>
    </div>
  );
}
