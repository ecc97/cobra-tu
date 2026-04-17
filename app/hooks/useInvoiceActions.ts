import { useCallback } from 'react';
import { validators } from '@/lib/validators';
import { InvoiceData } from '@/types/invoice';
import { useInvoiceStore } from '@/store/invoice-store';

export function useInvoiceActions() {
  const invoice = useInvoiceStore((state) => state.invoiceData);
  const updateEmitterField = useInvoiceStore((state) => state.updateEmitterField);
  const updateReceiverField = useInvoiceStore((state) => state.updateReceiverField);
  const updateItemField = useInvoiceStore((state) => state.updateItemField);
  const addItem = useInvoiceStore((state) => state.addItem);
  const removeItem = useInvoiceStore((state) => state.removeItem);
  const setIssueDate = useInvoiceStore((state) => state.setIssueDate);

  const validateForm = useCallback((): string | null => {
    if (!validators.isValidName(invoice.emitterName)) {
      return 'Tu nombre debe tener al menos 2 caracteres';
    }

    if (invoice.emitterEmail && !validators.isValidEmail(invoice.emitterEmail)) {
      return 'Email inválido';
    }

    if (!validators.isValidName(invoice.receiverName)) {
      return 'Nombre del cliente debe tener al menos 2 caracteres';
    }

    if (invoice.receiverEmail && !validators.isValidEmail(invoice.receiverEmail)) {
      return 'Email del cliente inválido';
    }

    if (!invoice.invoiceNumber.trim()) {
      return 'Agrega un número de factura';
    }

    if (!validators.isValidDateRange(invoice.issueDate, invoice.dueDate)) {
      return 'Fecha de vencimiento debe ser igual o posterior a la de emisión';
    }

    if (!validators.hasValidItems(invoice.items)) {
      return 'Al menos un servicio debe tener descripción, precio y cantidad válidos';
    }

    return null;
  }, [invoice]);

  const updateTaxRatePercent = useCallback(
    (value: string) => {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) {
        updateEmitterField('taxRate', 0);
        return;
      }

      const normalized = Math.min(100, Math.max(0, parsed));
      updateEmitterField('taxRate', normalized / 100);
    },
    [updateEmitterField]
  );

  const updateEmitter = useCallback(
    <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
      updateEmitterField(field, value);
    },
    [updateEmitterField]
  );

  return {
    invoice,
    updateEmitter,
    updateReceiver: updateReceiverField,
    updateItem: updateItemField,
    addItem,
    removeItem,
    setIssueDate,
    updateTaxRatePercent,
    validateForm,
  };
}
