'use client';

import { useState } from 'react';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { SUPPORTED_CURRENCIES } from '@/lib/calculations';

const DEFAULT_INVOICE: InvoiceData = {
  emitterName: '',
  emitterEmail: '',
  emitterPhone: '',
  emitterAddress: '',
  emitterTaxId: '',
  emitterLogo: undefined,

  receiverName: '',
  receiverEmail: '',
  receiverAddress: '',
  receiverTaxId: '',

  invoiceNumber: '001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  notes: '',

  items: [
    { id: '1', description: '', quantity: 1, price: 0 },
  ],

  currency: 'USD',
  taxRate: 0.19,
};

interface InvoiceFormProps {
  onSubmit?: (data: InvoiceData) => void;
}

export function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE);

  const updateEmitter = (field: keyof InvoiceData, value: any) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const updateReceiver = (field: string, value: string) => {
    setInvoice((prev) => ({
      ...prev,
      [`receiver${field.charAt(0).toUpperCase()}${field.slice(1)}`]: value,
    } as any));
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
    };
    setInvoice((prev) => ({ ...prev, items: [...prev.items, newItem] }));
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setInvoice((prev) => ({
        ...prev,
        emitterLogo: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* EMISOR */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Tus Datos</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nombre o Empresa"
            value={invoice.emitterName}
            onChange={(e) => updateEmitter('emitterName', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
          <input
            type="email"
            placeholder="Email"
            value={invoice.emitterEmail}
            onChange={(e) => updateEmitter('emitterEmail', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={invoice.emitterPhone}
            onChange={(e) => updateEmitter('emitterPhone', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={invoice.emitterAddress}
            onChange={(e) => updateEmitter('emitterAddress', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
          <input
            type="text"
            placeholder="RFC / RUT / NIF"
            value={invoice.emitterTaxId}
            onChange={(e) => updateEmitter('emitterTaxId', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />

          {/* Logo Upload */}
          <div className="flex items-center gap-3">
            <label className="px-4 py-2 rounded bg-secondary text-black cursor-pointer hover:bg-secondary/90 transition-colors">
              Subir Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {invoice.emitterLogo && (
              <span className="text-sm text-secondary">Logo subido ✓</span>
            )}
          </div>
        </div>
      </section>

      {/* RECEPTOR */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Datos del Cliente</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nombre o Empresa"
            value={invoice.receiverName}
            onChange={(e) => updateReceiver('name', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
          <input
            type="email"
            placeholder="Email"
            value={invoice.receiverEmail}
            onChange={(e) => updateReceiver('email', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={invoice.receiverAddress}
            onChange={(e) => updateReceiver('address', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
          <input
            type="text"
            placeholder="RFC / RUT / NIF"
            value={invoice.receiverTaxId}
            onChange={(e) => updateReceiver('taxid', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
        </div>
      </section>

      {/* DATOS DE FACTURA */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Números y Fechas</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Número"
            value={invoice.invoiceNumber}
            onChange={(e) => updateEmitter('invoiceNumber', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50"
          />
          <select
            value={invoice.currency}
            onChange={(e) =>
              updateEmitter(
                'currency',
                e.target.value as 'USD' | 'EUR' | 'COP' | 'MXN'
              )
            }
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface"
          >
            {SUPPORTED_CURRENCIES.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={invoice.issueDate}
            onChange={(e) => updateEmitter('issueDate', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface"
          />
          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => updateEmitter('dueDate', e.target.value)}
            className="w-full px-4 py-2 rounded bg-surface-container text-on-surface"
          />
        </div>
      </section>

      {/* ÍTEMS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Servicios/Productos</h2>
        <div className="space-y-2">
          {invoice.items.map((item, idx) => (
            <div key={item.id} className="flex gap-2">
              <input
                type="text"
                placeholder="Descripción"
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, 'description', e.target.value)
                }
                className="flex-1 px-4 py-2 rounded bg-surface-container text-on-surface text-sm placeholder:text-on-surface/50"
              />
              <input
                type="number"
                placeholder="Cant"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, 'quantity', parseFloat(e.target.value))
                }
                className="w-16 px-4 py-2 rounded bg-surface-container text-on-surface text-sm"
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
                className="w-24 px-4 py-2 rounded bg-surface-container text-on-surface text-sm"
              />
              {invoice.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="px-2 py-2 text-error hover:bg-surface-container-high rounded transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 rounded bg-surface-container text-secondary hover:bg-surface-container-high transition-colors text-sm"
        >
          + Agregar Servicio
        </button>
      </section>

      {/* NOTAS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Notas</h2>
        <textarea
          placeholder="Notas adicionales (opcional)"
          value={invoice.notes}
          onChange={(e) => updateEmitter('notes', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded bg-surface-container text-on-surface placeholder:text-on-surface/50 resize-none"
        />
      </section>

      <button
        type="submit"
        className="w-full px-6 py-3 rounded bg-primary text-on-primary font-semibold hover:bg-primary-container transition-colors"
      >
        Generar Factura
      </button>
    </form>
  );
}
