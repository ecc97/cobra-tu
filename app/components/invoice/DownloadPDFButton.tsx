'use client';

import { useState } from 'react';
import { generatePDFFromElement } from '@/lib/pdf';
import { InvoiceData } from '@/types/invoice';
import { Toast } from '@/components/ui/Toast';

interface DownloadPDFButtonProps {
  invoiceNumber?: string;
  invoiceData?: InvoiceData;
  disabled?: boolean;
  label?: string;
  icon?: string;
  fullWidth?: boolean;
  buttonClassName?: string;
  containerClassName?: string;
}

export function DownloadPDFButton({
  invoiceNumber = '001',
  invoiceData,
  disabled = false,
  label = 'Descargar PDF',
  icon = '📥',
  fullWidth = true,
  buttonClassName = '',
  containerClassName = '',
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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

    // Prevenir múltiples descargas simultáneas
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Verificar conectividad
      if (!navigator.onLine) {
        setError('Sin conexión a internet');
        return;
      }

      const fileName = `factura-${invoiceNumber}-${new Date().getTime()}.pdf`;
      
      // Timeout de 15s para generar PDF
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        await generatePDFFromElement('invoice-paper', fileName);
        clearTimeout(timeoutId);
        setError(null);
        setShowSuccessToast(true);
      } catch (pdfErr: any) {
        clearTimeout(timeoutId);
        if (pdfErr.name === 'AbortError') {
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

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <button
        onClick={handleDownload}
        disabled={disabled || isLoading || !isValidInvoice}
        title={!isValidInvoice ? 'Completa los datos principales' : ''}
        className={`${fullWidth ? 'w-full' : ''} px-6 py-3 rounded bg-secondary text-black font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 ${buttonClassName}`}
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            Descargando...
          </>
        ) : (
          <>
            <span>{icon}</span> {label}
          </>
        )}
      </button>
      {error && <p className="text-error text-xs sm:text-sm">{error}</p>}
      {showSuccessToast && (
        <Toast 
          message="Factura descargada exitosamente" 
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
}
