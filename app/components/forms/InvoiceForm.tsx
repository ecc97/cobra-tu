'use client';

import { InvoiceData } from '@/types/invoice';
import { SUPPORTED_CURRENCIES } from '@/lib/calculations';
import { useInvoiceFormController } from '@/hooks/useInvoiceFormController';
import { ExpandDescriptionButton } from './ExpandDescriptionButton';
import { Toast } from '@/components/ui/Toast';

interface InvoiceFormProps {
  onSubmit?: (data: InvoiceData) => void;
  showSubmitButton?: boolean;
  onAiLoadingChange?: (isLoading: boolean) => void;
}

export function InvoiceForm({
  onSubmit,
  showSubmitButton = true,
  onAiLoadingChange,
}: InvoiceFormProps) {
  const {
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
  } = useInvoiceFormController({ onSubmit, onAiLoadingChange });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      <section className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.55rem] sm:text-[1.9rem] leading-none tracking-tight font-display">TUS DATOS</h2>
          <span className="material-symbols-outlined text-on-surface/45">expand_more</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-3 sm:gap-4 items-start">
          <label className="relative w-25 h-25 rounded-xl border-2 border-dashed border-surface-container-highest bg-surface-container-lowest hover:border-primary/60 cursor-pointer flex flex-col items-center justify-center text-on-surface/50 transition-colors overflow-hidden">
            {invoice.emitterLogo ? (
              <>
                <img src={invoice.emitterLogo} alt="Logo" className="w-full h-full object-cover" />
                <button
                  type="button"
                  title="Quitar logo"
                  aria-label="Quitar logo"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleLogoRemove();
                  }}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/45 text-white/90 hover:bg-black/60 transition-colors flex items-center justify-center"
                >
                  <span className="text-sm leading-none">x</span>
                </button>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                <span className="text-[10px] font-semibold tracking-wider">LOGO</span>
              </>
            )}
            <input
              ref={logoInputRef}
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

      <section className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.55rem] sm:text-[1.9rem] leading-none tracking-tight font-display">COBRAR A</h2>
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

      <section className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.55rem] sm:text-[1.9rem] leading-none tracking-tight font-display">DETALLES DE FACTURA</h2>
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
                className={`py-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-colors ${
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

      <section className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.55rem] sm:text-[1.9rem] leading-none tracking-tight font-display">LÍNEAS DE PRODUCTO</h2>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-secondary text-sm sm:text-base font-semibold inline-flex items-center gap-1.5 hover:brightness-110"
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
                      onLoadingStateChange={handleAiLoadingChange}
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
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={priceDrafts[item.id] ?? ''}
                    onChange={(e) => handlePriceInputChange(item.id, e.target.value)}
                    onBlur={() => handlePriceBlur(item.id)}
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

      <section className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-[1.55rem] sm:text-[1.9rem] leading-none tracking-tight font-display">NOTAS E IMPUESTOS</h2>
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

      <p className="text-[11px] leading-relaxed text-on-surface/55 border-t border-outline-variant/20 pt-4">
        Este documento es un comprobante de cobro generado por el usuario y no constituye una factura
        electrónica fiscal válida ante autoridades tributarias (DIAN, SAT, AEAT, etc.).
      </p>
    </form>
  );
}
