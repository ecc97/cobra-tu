'use client';

import { useInvoicePersistence } from '@/hooks/useInvoicePersistence';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { DownloadPDFButton } from '@/components/invoice/DownloadPDFButton';
import { useInvoiceStore } from '@/store/invoice-store';

export default function NuevaFacturaPage() {
  const invoiceData = useInvoiceStore((state) => state.invoiceData);
  const isMobilePreviewOpen = useInvoiceStore((state) => state.isMobilePreviewOpen);
  const isAiOptimizing = useInvoiceStore((state) => state.isAiOptimizing);
  const setIsMobilePreviewOpen = useInvoiceStore((state) => state.setIsMobilePreviewOpen);

  useInvoicePersistence();

  return (
    <div className="h-screen bg-surface overflow-hidden invoice-enter">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface-container-lowest border-b border-outline-variant/20 px-3 py-1 sm:px-6">
        <div className="h-full max-w-400 mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-display font-semibold text-white">CobraTú</span>
          </a>
          <span className="hidden md:block text-primary font-bold text-sm tracking-widest">
            Factura #{invoiceData.invoiceNumber.padStart(3, '0')}
          </span>
          <DownloadPDFButton
            invoiceNumber={invoiceData.invoiceNumber}
            invoiceData={invoiceData}
            fullWidth={false}
            icon="download"
            label="Descargar PDF"
            containerClassName="min-w-37 sm:min-w-45"
            buttonClassName="px-3 sm:px-4 py-2 text-xs sm:text-sm"
          />
        </div>
      </nav>

      <main className="pt-13 h-screen flex flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-[42%] bg-surface-container overflow-y-auto h-full pb-34 md:pb-6 stagger-in-left">
          <div className="p-4 sm:p-6 md:p-8 max-w-3xl">
            <InvoiceForm showSubmitButton={false} />
          </div>
        </aside>

        <section className="hidden md:flex md:w-[58%] bg-surface-container-low h-full overflow-y-auto p-8 lg:p-10 items-start justify-center stagger-in-right">
          <div className="w-full max-w-190">
            <InvoicePreview data={invoiceData} />
          </div>

          {isAiOptimizing && (
            <div className="hidden lg:flex fixed bottom-8 right-8 bg-white/8 backdrop-blur-xl p-4 rounded-2xl border border-white/10 items-center gap-4 shadow-2xl pulse-soft animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">IA está optimizando tus descripciones</p>
                <p className="text-[10px] text-on-surface/60">Precisión profesional detectada.</p>
              </div>
            </div>
          )}
        </section>

        {isAiOptimizing && !isMobilePreviewOpen && (
          <div className="md:hidden fixed top-15 left-2 right-2 z-40 bg-white/8 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/10 shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">IA está optimizando tus descripciones</p>
                <p className="text-[10px] text-on-surface/60">Esto puede tardar unos segundos.</p>
              </div>
            </div>
          </div>
        )}

        {isMobilePreviewOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/65 animate-fade-in">
            <div className="h-full overflow-y-auto bg-surface-container-low px-2 pt-2 pb-4 animate-slide-up">
              <div className="sticky top-0 z-10 mb-3 bg-surface-container-low/95 backdrop-blur-sm py-2">
                <button
                  onClick={() => setIsMobilePreviewOpen(false)}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline-variant/20"
                >
                  Volver al formulario
                </button>
              </div>

              <div className="flex justify-center pb-10">
                <div className="w-130 shrink-0 origin-top scale-[0.80] sm:scale-[0.70]">
                  <InvoicePreview data={invoiceData} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="md:hidden fixed left-1/2 -translate-x-1/2 z-40"
          style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => setIsMobilePreviewOpen(true)}
            className="bg-surface-container-lowest/95 backdrop-blur-md text-primary border border-primary/25 px-6 py-3 rounded-2xl shadow-2xl font-semibold tracking-wide inline-flex items-center gap-2 pulse-soft"
          >
            <span className="material-symbols-outlined">visibility</span>
            Ver Factura
          </button>
        </div>
      </main>
    </div>
  );
}
