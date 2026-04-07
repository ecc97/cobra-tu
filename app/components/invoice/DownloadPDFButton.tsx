'use client';

import { useState } from 'react';
import { generatePDFFromElement } from '@/lib/pdf';

interface DownloadPDFButtonProps {
  invoiceNumber?: string;
  disabled?: boolean;
}

export function DownloadPDFButton({
  invoiceNumber = '001',
  disabled = false,
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fileName = `factura-${invoiceNumber}-${new Date().getTime()}.pdf`;
      await generatePDFFromElement('invoice-paper', fileName);
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
        disabled={disabled || isLoading}
        className="w-full px-6 py-3 rounded bg-secondary text-black font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? '⏳ Descargando...' : '📥 Descargar PDF'}
      </button>
      {error && <p className="text-error text-sm">{error}</p>}
    </div>
  );
}
