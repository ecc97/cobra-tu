import { useEffect, useRef, useState } from 'react';
import { validators } from '@/lib/validators';
import { InvoiceData } from '@/types/invoice';
import { useInvoiceActions } from '@/hooks/useInvoiceActions';
import { useInvoiceStore } from '@/store/invoice-store';

interface UseInvoiceFormControllerParams {
  onSubmit?: (data: InvoiceData) => void;
  onAiLoadingChange?: (isLoading: boolean) => void;
}

export function useInvoiceFormController({
  onSubmit,
  onAiLoadingChange,
}: UseInvoiceFormControllerParams) {
  const invoice = useInvoiceStore((state) => state.invoiceData);
  const setIsAiOptimizing = useInvoiceStore((state) => state.setIsAiOptimizing);

  const {
    updateEmitter,
    updateReceiver,
    updateItem,
    addItem,
    removeItem,
    setIssueDate,
    updateTaxRatePercent,
    validateForm,
  } = useInvoiceActions();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAddItemFeedback, setShowAddItemFeedback] = useState(false);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPriceDrafts((prev) => {
      const next: Record<string, string> = { ...prev };

      invoice.items.forEach((item) => {
        if (next[item.id] === undefined) {
          next[item.id] = item.price > 0 ? item.price.toFixed(2) : '';
        }
      });

      Object.keys(next).forEach((itemId) => {
        const itemExists = invoice.items.some((item) => item.id === itemId);
        if (!itemExists) {
          delete next[itemId];
        }
      });

      return next;
    });
  }, [invoice.items]);

  useEffect(() => {
    setValidationError(null);
  }, [invoice]);

  const handlePriceInputChange = (itemId: string, rawValue: string) => {
    const normalizedValue = rawValue.replace(',', '.');

    if (!/^\d*(\.\d{0,2})?$/.test(normalizedValue)) {
      return;
    }

    setPriceDrafts((prev) => ({ ...prev, [itemId]: normalizedValue }));

    if (!normalizedValue) {
      updateItem(itemId, 'price', 0);
      return;
    }

    const parsedValue = Number(normalizedValue);
    if (!Number.isNaN(parsedValue)) {
      updateItem(itemId, 'price', parsedValue);
    }
  };

  const handlePriceBlur = (itemId: string) => {
    const draftValue = priceDrafts[itemId] ?? '';

    if (!draftValue) {
      setPriceDrafts((prev) => ({ ...prev, [itemId]: '' }));
      updateItem(itemId, 'price', 0);
      return;
    }

    const parsedValue = Number(draftValue);
    if (Number.isNaN(parsedValue)) {
      setPriceDrafts((prev) => ({ ...prev, [itemId]: '' }));
      updateItem(itemId, 'price', 0);
      return;
    }

    const normalizedPrice = validators.normalizePrice(parsedValue);
    setPriceDrafts((prev) => ({
      ...prev,
      [itemId]: normalizedPrice.toFixed(2),
    }));
    updateItem(itemId, 'price', normalizedPrice);
  };

  const handleAddItem = () => {
    addItem();
    setShowAddItemFeedback(true);
    setTimeout(() => setShowAddItemFeedback(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    e.currentTarget.value = '';

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Solo PNG, JPG o WebP');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError('Logo debe ser menor a 2MB');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        setValidationError('Logo debe tener al menos 100x100 px');
        setTimeout(() => setValidationError(null), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        updateEmitter('emitterLogo', reader.result as string);
      };
      reader.onerror = () => {
        setValidationError('Error al cargar el archivo');
        setTimeout(() => setValidationError(null), 3000);
      };
      reader.readAsDataURL(file);
    };
    img.onerror = () => {
      setValidationError('Archivo de imagen corrupto');
      setTimeout(() => setValidationError(null), 3000);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleLogoRemove = () => {
    updateEmitter('emitterLogo', '');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    onSubmit?.(invoice);
  };

  const handleIssueDateChange = (value: string) => {
    setIssueDate(value);
    setValidationError(null);
  };

  const handleAiLoadingChange = (isLoading: boolean) => {
    setIsAiOptimizing(isLoading);
    onAiLoadingChange?.(isLoading);
  };

  return {
    invoice,
    logoInputRef,
    validationError,
    showAddItemFeedback,
    priceDrafts,
    updateEmitter,
    updateReceiver,
    updateItem,
    removeItem,
    updateTaxRatePercent,
    handlePriceInputChange,
    handlePriceBlur,
    handleAddItem,
    handleLogoUpload,
    handleLogoRemove,
    handleSubmit,
    handleIssueDateChange,
    handleAiLoadingChange,
  };
}
