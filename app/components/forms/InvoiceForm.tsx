'use client';

import { useEffect, useState } from 'react';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { SUPPORTED_CURRENCIES } from '@/lib/calculations';
import { validators } from '@/lib/validators';
import { DEFAULT_INVOICE } from '@/lib/constants';
import { ExpandDescriptionButton } from './ExpandDescriptionButton';
import { Toast } from '@/components/ui/Toast';

interface InvoiceFormProps {
  initialData?: InvoiceData;
  onChange?: (data: InvoiceData) => void;
  onSubmit?: (data: InvoiceData) => void;
  showSubmitButton?: boolean;
}

export function InvoiceForm({
  initialData = DEFAULT_INVOICE,
  onChange,
  onSubmit,
  showSubmitButton = true,
}: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<InvoiceData>(initialData);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAddItemFeedback, setShowAddItemFeedback] = useState(false);

  useEffect(() => {
    onChange?.(invoice);
  }, [invoice, onChange]);

  const validateForm = (): string | null => {
    // Validar nombre del emisor
    if (!validators.isValidName(invoice.emitterName)) {
      return 'Tu nombre debe tener al menos 2 caracteres';
    }

    // Validar email del emisor si está presente
    if (invoice.emitterEmail && !validators.isValidEmail(invoice.emitterEmail)) {
      return 'Email inválido';
    }

    // Validar nombre del receptor
    if (!validators.isValidName(invoice.receiverName)) {
      return 'Nombre del cliente debe tener al menos 2 caracteres';
    }

    // Validar email del receptor si está presente
    if (invoice.receiverEmail && !validators.isValidEmail(invoice.receiverEmail)) {
      return 'Email del cliente inválido';
    }

    // Validar número de factura
    if (!invoice.invoiceNumber.trim()) {
      return 'Agrega un número de factura';
    }

    // Validar rango de fechas
    if (!validators.isValidDateRange(invoice.issueDate, invoice.dueDate)) {
      return 'Fecha de vencimiento debe ser igual o posterior a la de emisión';
    }

    // Validar items
    if (!validators.hasValidItems(invoice.items)) {
      return 'Al menos un servicio debe tener descripción, precio y cantidad válidos';
    }

    return null;
  };

  const updateEmitter = (field: keyof InvoiceData, value: any) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const updateReceiver = (field: string, value: string) => {
    setInvoice((prev) => ({
      ...prev,
      [`receiver${field.charAt(0).toUpperCase()}${field.slice(1)}`]: value,
    } as any));
    setValidationError(null);
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    let finalValue = value;

    // Validar casos edge según el campo
    if (field === 'quantity') {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        finalValue = 1; // Default a 1 si es inválido
      } else {
        finalValue = Math.max(1, Math.floor(num)); // Mínimo 1, solo enteros
      }
    }

    if (field === 'price') {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        finalValue = 0; // Default a 0 si es inválido
      } else {
        finalValue = validators.normalizePrice(num); // Máximo 2 decimales
      }
    }

    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, [field]: finalValue } : item
      ),
    }));
    setValidationError(null);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
    };
    setInvoice((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setShowAddItemFeedback(true);
    setTimeout(() => setShowAddItemFeedback(false), 2000);
  };

  const removeItem = (itemId: string) => {
    if (invoice.items.length === 1) return; // Keep at least one item
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación: Tipo de archivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Solo PNG, JPG o WebP');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    // Validación: Tamaño máximo 2MB
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setValidationError('Logo debe ser menor a 2MB');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    // Validación: Dimensiones mínimas (al menos 100x100)
    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        setValidationError('Logo debe tener al menos 100x100 px');
        setTimeout(() => setValidationError(null), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setInvoice((prev) => ({
          ...prev,
          emitterLogo: reader.result as string,
        }));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* EMISOR */}
      <section className="space-y-2 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-primary">Tus Datos</h2>
        <div className="space-y-2 sm:space-y-3">
          <input
            type="text"
            placeholder="Nombre o Empresa"
            value={invoice.emitterName}
            onChange={(e) => updateEmitter('emitterName', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Email"
            value={invoice.emitterEmail}
            onChange={(e) => updateEmitter('emitterEmail', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={invoice.emitterPhone}
            onChange={(e) => updateEmitter('emitterPhone', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={invoice.emitterAddress}
            onChange={(e) => updateEmitter('emitterAddress', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="RFC / RUT / NIF"
            value={invoice.emitterTaxId}
            onChange={(e) => updateEmitter('emitterTaxId', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />

          {/* Logo Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="px-3 sm:px-4 py-2 rounded bg-secondary text-black cursor-pointer hover:bg-secondary/90 transition-colors text-xs sm:text-sm font-semibold whitespace-nowrap">
              Subir Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {invoice.emitterLogo && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs sm:text-sm text-secondary font-semibold">Logo subido ✓</span>
                <button
                  type="button"
                  onClick={() =>
                    setInvoice((prev) => ({ ...prev, emitterLogo: undefined }))
                  }
                  className="text-xs sm:text-sm text-error hover:underline text-left sm:text-auto"
                >
                  Eliminar
                </button>
              </div>
            )}
            <span className="text-xs text-on-surface/50 hidden sm:inline">
              (PNG, JPG o WebP, máx. 2MB)
            </span>
          </div>
        </div>
      </section>

      {/* RECEPTOR */}
      <section className="space-y-2 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-primary">Datos del Cliente</h2>
        <div className="space-y-2 sm:space-y-3">
          <input
            type="text"
            placeholder="Nombre o Empresa"
            value={invoice.receiverName}
            onChange={(e) => updateReceiver('name', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Email"
            value={invoice.receiverEmail}
            onChange={(e) => updateReceiver('email', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={invoice.receiverAddress}
            onChange={(e) => updateReceiver('address', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="RFC / RUT / NIF"
            value={invoice.receiverTaxId}
            onChange={(e) => updateReceiver('taxid', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
        </div>
      </section>

      {/* DATOS DE FACTURA */}
      <section className="space-y-2 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-primary">Números y Fechas</h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Número"
            value={invoice.invoiceNumber}
            onChange={(e) => updateEmitter('invoiceNumber', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 text-sm sm:text-base"
          />
          <select
            value={invoice.currency}
            onChange={(e) =>
              updateEmitter(
                'currency',
                e.target.value as 'USD' | 'EUR' | 'COP' | 'MXN'
              )
            }
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface text-sm sm:text-base"
          >
            {SUPPORTED_CURRENCIES.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <input
            type="date"
            value={invoice.issueDate}
            onChange={(e) => updateEmitter('issueDate', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface text-sm sm:text-base"
          />
          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => updateEmitter('dueDate', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface text-sm sm:text-base"
          />
        </div>
      </section>

      {/* ÍTEMS */}
      <section className="space-y-2 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-primary">Servicios/Productos</h2>
        <div className="space-y-2 sm:space-y-3">
          {invoice.items.map((item, idx) => (
            <div key={item.id} className="space-y-1 sm:space-y-2">
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, 'description', e.target.value)
                  }
                  className="flex-1 min-w-30 px-3 py-2 rounded bg-surface-container text-on-surface text-xs sm:text-sm placeholder:text-on-surface/50"
                />
                <input
                  type="number"
                  placeholder="Cant"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, 'quantity', parseFloat(e.target.value))
                  }
                  className="w-12 sm:w-16 px-2 sm:px-3 py-2 rounded bg-surface-container text-on-surface text-xs sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(item.id, 'price', parseFloat(e.target.value))
                  }
                  className="w-16 sm:w-24 px-2 sm:px-3 py-2 rounded bg-surface-container text-on-surface text-xs sm:text-sm"
                />
                {invoice.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="px-2 py-2 text-error hover:bg-surface-container-high rounded transition-colors text-sm sm:text-base"
                  >
                    ✕
                  </button>
                )}
              </div>
              {/* Botón Mejorar con IA */}
              {item.description && (
                <ExpandDescriptionButton
                  currentDescription={item.description}
                  onDescriptionUpdated={(newDesc) =>
                    updateItem(item.id, 'description', newDesc)
                  }
                />
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="px-3 sm:px-4 py-2 rounded bg-surface-container text-secondary hover:bg-surface-container-high transition-colors text-xs sm:text-sm"
        >
          + Agregar Servicio
        </button>
        {showAddItemFeedback && (
          <Toast 
            message="Nuevo servicio agregado" 
            type="success"
            duration={1500}
          />
        )}
      </section>

      {/* NOTAS */}
      <section className="space-y-2 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-primary">Notas</h2>
        <textarea
          placeholder="Notas adicionales (opcional)"
          value={invoice.notes}
          onChange={(e) => updateEmitter('notes', e.target.value)}
          rows={3}
          className="w-full px-3 sm:px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 resize-none text-sm sm:text-base"
        />
      </section>

      {validationError && (
        <div className="p-3 sm:p-4 rounded bg-error/10 border border-error/30 text-error text-xs sm:text-sm">
          ⚠️ {validationError}
        </div>
      )}

      {showSubmitButton && (
        <button
          type="submit"
          className="w-full px-4 sm:px-6 py-3 rounded bg-primary text-on-primary font-semibold hover:bg-primary-container transition-colors text-sm sm:text-base"
        >
          Ver Previsualización
        </button>
      )}
    </form>
  );
}
