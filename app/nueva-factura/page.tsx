'use client';

import { useState } from 'react';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { InvoiceData } from '@/types/invoice';
import { DEFAULT_INVOICE } from '@/lib/constants';

export default function NuevaFacturaPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE);

  const handleFormSubmit = (data: InvoiceData) => {
    setInvoiceData(data);
    // Save to localStorage
    localStorage.setItem('lastInvoice', JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Form Panel - Left */}
      <div className="w-full md:w-1/2 p-8 overflow-y-auto">
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold text-primary mb-8">
            Nueva Factura
          </h1>
          <InvoiceForm onSubmit={handleFormSubmit} />
        </div>
      </div>

      {/* Preview Panel - Right */}
      <div className="hidden md:flex md:w-1/2 bg-surface-container-low p-8 overflow-y-auto">
        <div className="flex-1">
          <InvoicePreview data={invoiceData} />
        </div>
      </div>

      {/* Mobile - Preview Modal */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-high p-4 border-t border-surface-container-highest">
        <button
          onClick={() => {
            // Toggle full preview
            const preview = document.getElementById('invoice-paper');
            if (preview) preview.classList.toggle('hidden');
          }}
          className="w-full px-4 py-3 bg-primary text-on-primary rounded font-semibold hover:bg-primary-container transition-colors"
        >
          Ver Previsualización
        </button>
      </div>
    </div>
  );
}
