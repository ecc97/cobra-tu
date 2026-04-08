'use client';

import { useState } from 'react';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { DownloadPDFButton } from '@/components/invoice/DownloadPDFButton';
import { InvoiceData } from '@/types/invoice';
import { DEFAULT_INVOICE } from '@/lib/constants';

export default function NuevaFacturaPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [showPreview, setShowPreview] = useState(false);

  const handleFormSubmit = (data: InvoiceData) => {
    setInvoiceData(data);
    setShowPreview(true);
    // Save to localStorage
    localStorage.setItem('lastInvoice', JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Form Panel - Left */}
      <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-lg mx-auto md:mx-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">
            Nueva Factura
          </h1>
          <p className="text-sm sm:text-base text-on-surface/70 mb-6 sm:mb-8">
            Llena los datos y tu factura se actualizará en tiempo real.
          </p>
          <InvoiceForm onSubmit={handleFormSubmit} />
        </div>
      </div>

      {/* Preview Panel - Right */}
      <div
        className={`hidden md:flex md:w-1/2 bg-surface-container-low p-8 overflow-y-auto flex-col`}
      >
        <div className="flex-1 mb-6">
          <InvoicePreview data={invoiceData} />
        </div>
        {showPreview && (
          <div className="sticky bottom-0 bg-surface-container-low pt-4 border-t border-surface-container-highest">
            <DownloadPDFButton 
              invoiceNumber={invoiceData.invoiceNumber} 
              invoiceData={invoiceData}
            />
          </div>
        )}
      </div>

      {/* Mobile - Preview Modal */}
      {showPreview && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="bg-surface-container-low p-4 min-h-screen pb-20">
            <div className="mb-6">
              <button
                onClick={() => setShowPreview(false)}
                className="mb-4 px-4 py-2 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-sm sm:text-base"
              >
                ← Volver
              </button>
              <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133.33%', marginLeft: '-8.33%' }}>
                <InvoicePreview data={invoiceData} />
              </div>
            </div>
            <div className="sticky bottom-0 bg-surface-container-low pt-4 pb-4">
              <DownloadPDFButton 
                invoiceNumber={invoiceData.invoiceNumber}
                invoiceData={invoiceData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
