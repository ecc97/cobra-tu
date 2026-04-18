'use client';

import { InvoiceData } from '@/types/invoice';
import { usePdfDownload } from '@/hooks/usePdfDownload';
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
  icon = 'download',
  fullWidth = true,
  buttonClassName = '',
  containerClassName = '',
}: DownloadPDFButtonProps) {
  const {
    isLoading,
    error,
    showSuccessToast,
    isValidInvoice,
    handleDownload,
    closeSuccessToast,
  } = usePdfDownload({
    invoiceData,
    invoiceNumber,
  });

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <button
        onClick={handleDownload}
        disabled={disabled || isLoading || !isValidInvoice}
        title={!isValidInvoice ? 'Completa los datos principales' : ''}
        className={`${fullWidth ? 'w-full' : ''} inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 sm:py-2.5 bg-primary-container text-on-surface font-semibold text-sm tracking-wide hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${buttonClassName}`}
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin">◌</span>
            Descargando...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            <span>{label}</span>
          </>
        )}
      </button>
      {error && <p className="text-error text-xs sm:text-sm">{error}</p>}
      {showSuccessToast && (
        <Toast 
          message="Factura descargada exitosamente" 
          type="success"
          onClose={closeSuccessToast}
        />
      )}
    </div>
  );
}
