import { useState } from 'react';
import { generatePDFFromData } from '@/lib/pdf';
import { InvoiceData } from '@/types/invoice';

const PDF_TIMEOUT_MS = 15_000;

interface UsePdfDownloadParams {
  invoiceData?: InvoiceData;
  invoiceNumber: string;
}

export function usePdfDownload({ invoiceData, invoiceNumber }: UsePdfDownloadParams) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const isValidInvoice =
    invoiceData &&
    invoiceData.emitterName.trim() &&
    invoiceData.receiverName.trim() &&
    invoiceData.items.some((item) => item.description.trim() && item.price > 0);

  const handleDownload = async () => {
    if (!isValidInvoice || !invoiceData) {
      setError('Completa los datos principales para descargar');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError('Generación de PDF tardó mucho');
    }, PDF_TIMEOUT_MS);

    try {
      const fileName = `factura-${invoiceNumber}-${Date.now()}.pdf`;
      await generatePDFFromData(invoiceData, fileName);
      clearTimeout(timeoutId);
      setShowSuccessToast(true);
    } catch (err) {
      clearTimeout(timeoutId);
      setError('Error al generar PDF. Intenta de nuevo');
      console.error('PDF error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    showSuccessToast,
    isValidInvoice,
    handleDownload,
    closeSuccessToast: () => setShowSuccessToast(false),
  };
}