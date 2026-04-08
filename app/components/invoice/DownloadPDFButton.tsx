'use client';

import { useState } from 'react';
import { generatePDFFromElement } from '@/lib/pdf';
import { InvoiceData } from '@/types/invoice';

interface DownloadPDFButtonProps {
  invoiceNumber?: string;
  invoiceData?: InvoiceData;
  disabled?: boolean;
}

export function DownloadPDFButton({
  invoiceNumber = '001',
  invoiceData,
  disabled = false,
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validar que la factura tenga datos mínimos
  const isValidInvoice = invoiceData && 
    invoiceData.emitterName.trim() && 
    invoiceData.receiverName.trim() &&
    invoiceData.items.some(item => item.description.trim() && item.price > 0);

  const handleDownload = async () => {
    if (!isValidInvoice) {
      setError('Completa los datos principales para descargar');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const fileName = `factura-${invoiceNumber}-${new Date().getTime()}.pdf`;
      await generatePDFFromElement('invoice-paper', fileName);
      setError(null);
    } catch (err) {
      setError('Error al descargar el PDF. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleDownload}
        disabled={disabled || isLoading || !isValidInvoice}
        title={!isValidInvoice ? 'Completa los datos principales' : ''}
        className="w-full px-6 py-3 rounded bg-secondary text-black font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? '⏳ Descargando...' : '📥 Descargar PDF'}
      </button>
      {error && <p className="text-error text-xs sm:text-sm">{error}</p>}
    </div>
  );
}
