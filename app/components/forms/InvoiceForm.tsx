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

  const updateTaxRatePercent = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      updateEmitter('taxRate', 0);
      return;
    }

    const normalized = Math.min(100, Math.max(0, parsed));
    updateEmitter('taxRate', normalized / 100);
  };

  const handleIssueDateChange = (value: string) => {
    setInvoice((prev) => {
      const adjustedDueDate = prev.dueDate < value ? value : prev.dueDate;
      return {
        ...prev,
        issueDate: value,
        dueDate: adjustedDueDate,
      };
    });
    setValidationError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.9rem] leading-none tracking-tight font-display">TUS DATOS</h2>
          <span className="material-symbols-outlined text-on-surface/45">expand_more</span>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
          <label className="w-25 h-25 rounded-xl border-2 border-dashed border-surface-container-highest bg-surface-container-lowest hover:border-primary/60 cursor-pointer flex flex-col items-center justify-center text-on-surface/50 transition-colors overflow-hidden">
            {invoice.emitterLogo ? (
              <img src={invoice.emitterLogo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <>
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                <span className="text-[10px] font-semibold tracking-wider">LOGO</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre de la empresa"
              value={invoice.emitterName}
              onChange={(e) => updateEmitter('emitterName', e.target.value)}
              className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
            />
            <input
              type="email"
              placeholder="Email profesional"
              value={invoice.emitterEmail}
              onChange={(e) => updateEmitter('emitterEmail', e.target.value)}
              className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Dirección fiscal"
          value={invoice.emitterAddress}
          onChange={(e) => updateEmitter('emitterAddress', e.target.value)}
          className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
        />
        <input
          type="text"
          placeholder="Tax ID / NIF"
          value={invoice.emitterTaxId}
          onChange={(e) => updateEmitter('emitterTaxId', e.target.value)}
          className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
        />
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.9rem] leading-none tracking-tight font-display">COBRAR A</h2>
          <span className="material-symbols-outlined text-on-surface/45">expand_more</span>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={invoice.receiverName}
            onChange={(e) => updateReceiver('name', e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
          />
          <input
            type="email"
            placeholder="Email del cliente"
            value={invoice.receiverEmail}
            onChange={(e) => updateReceiver('email', e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
          />
          <textarea
            placeholder="Dirección de envío/facturación"
            value={invoice.receiverAddress}
            onChange={(e) => updateReceiver('address', e.target.value)}
            rows={2}
            className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 resize-none text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
          />
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.9rem] leading-none tracking-tight font-display">DETALLES DE FACTURA</h2>
          <span className="material-symbols-outlined text-on-surface/45">expand_more</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-[0.15em] text-on-surface/60 uppercase">Número</label>
            <input
              type="text"
              value={`#${invoice.invoiceNumber.replace(/^#/, '')}`}
              onChange={(e) => updateEmitter('invoiceNumber', e.target.value.replace('#', ''))}
              className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-[0.15em] text-on-surface/60 uppercase">Fecha</label>
            <input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => handleIssueDateChange(e.target.value)}
              className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-surface-container-lowest">
          {SUPPORTED_CURRENCIES.map((curr) => {
            const isActive = invoice.currency === curr;
            return (
              <button
                key={curr}
                type="button"
                onClick={() => updateEmitter('currency', curr)}
                className={`py-2 text-[11px] font-bold rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface/65 hover:bg-white/5'
                }`}
              >
                {curr}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.9rem] leading-none tracking-tight font-display">LÍNEAS DE PRODUCTO</h2>
          <button
            type="button"
            onClick={addItem}
            className="text-secondary text-base font-semibold inline-flex items-center gap-1.5 hover:brightness-110"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Añadir ítem
          </button>
        </div>

        <div className="space-y-4">
          {invoice.items.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-surface-container-low space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Descripción del servicio"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
                  />
                  {item.description && (
                    <ExpandDescriptionButton
                      currentDescription={item.description}
                      onDescriptionUpdated={(newDesc) => updateItem(item.id, 'description', newDesc)}
                    />
                  )}
                </div>

                {invoice.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mt-1 text-on-surface/45 hover:text-error"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-on-surface/60 font-semibold tracking-wider">Cant.</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                    className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-3 py-2 text-on-surface focus:ring-1 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-on-surface/60 font-semibold tracking-wider">Precio</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                    className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-3 py-2 text-on-surface focus:ring-1 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-on-surface/60 font-semibold tracking-wider">Total</label>
                  <div className="w-full bg-surface-container-lowest rounded-lg text-sm px-3 py-2 text-on-surface-high">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddItemFeedback && (
          <Toast
            message="Nuevo servicio agregado"
            type="success"
            duration={1500}
          />
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.9rem] leading-none tracking-tight font-display">NOTAS E IMPUESTOS</h2>
          <span className="material-symbols-outlined text-on-surface/45">expand_more</span>
        </div>

        <div className="flex items-center gap-3 bg-surface-container-highest p-3 rounded-lg">
          <span className="text-sm text-on-surface-high flex-1">Impuesto sobre las ventas (%)</span>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={Math.round(invoice.taxRate * 100)}
            onChange={(e) => updateTaxRatePercent(e.target.value)}
            className="w-24 bg-surface-container-lowest border-none rounded-md text-base px-3 py-1 text-right text-on-surface focus:ring-1 focus:ring-primary/40"
          />
        </div>

        <textarea
          placeholder="Notas adicionales o términos de pago..."
          value={invoice.notes}
          onChange={(e) => updateEmitter('notes', e.target.value)}
          rows={3}
          className="w-full bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 resize-none text-on-surface placeholder:text-on-surface/35 focus:ring-1 focus:ring-primary/40"
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
