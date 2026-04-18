import { useState } from 'react';
import { generatePDFFromElement } from '@/lib/pdf';
import { InvoiceData } from '@/types/invoice';

const PDF_TIMEOUT_MS = 15000;

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
    if (!isValidInvoice) {
      setError('Completa los datos principales para descargar');
      return;
    }

    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (!navigator.onLine) {
        setError('Sin conexión a internet');
        return;
      }

      const fileName = `factura-${invoiceNumber}-${new Date().getTime()}.pdf`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), PDF_TIMEOUT_MS);

      try {
        await generatePDFFromElement('invoice-paper', fileName);
        clearTimeout(timeoutId);
        setError(null);
        setShowSuccessToast(true);
      } catch (pdfErr: unknown) {
        clearTimeout(timeoutId);
        if (pdfErr instanceof DOMException && pdfErr.name === 'AbortError') {
          setError('Generación de PDF tardó mucho');
        } else {
          setError('Error al generar PDF. Intenta de nuevo');
        }
        console.error('PDF error:', pdfErr);
      }
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo');
      console.error(err);
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
