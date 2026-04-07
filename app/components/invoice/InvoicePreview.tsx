'use client';

import { InvoiceData } from '@/types/invoice';
import { getCalculations, CURRENCY_SYMBOLS } from '@/lib/calculations';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const { subtotal, taxAmount, total } = getCalculations(
    data.items,
    data.taxRate
  );
  const currencySymbol = CURRENCY_SYMBOLS[data.currency] || '$';

  return (
    <div
      id="invoice-paper"
      className="invoice-paper p-8 max-w-2xl mx-auto min-h-screen flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {data.emitterLogo && (
            <img
              src={data.emitterLogo}
              alt="Logo"
              className="h-16 object-contain mb-4"
            />
          )}
          <h1 className="text-3xl font-bold text-black">
            {data.emitterName || 'Tu Empresa'}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-black">FACTURA</p>
          <p className="text-gray-600">
            #{data.invoiceNumber.padStart(3, '0')}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div>
          <p className="font-semibold text-black mb-2">DE:</p>
          <p className="text-gray-700">{data.emitterName}</p>
          {data.emitterEmail && (
            <p className="text-gray-600">{data.emitterEmail}</p>
          )}
          {data.emitterPhone && (
            <p className="text-gray-600">{data.emitterPhone}</p>
          )}
          {data.emitterAddress && (
            <p className="text-gray-600">{data.emitterAddress}</p>
          )}
          {data.emitterTaxId && (
            <p className="text-gray-600">RFC: {data.emitterTaxId}</p>
          )}
        </div>
        <div>
          <p className="font-semibold text-black mb-2">PARA:</p>
          <p className="text-gray-700">{data.receiverName}</p>
          {data.receiverEmail && (
            <p className="text-gray-600">{data.receiverEmail}</p>
          )}
          {data.receiverAddress && (
            <p className="text-gray-600">{data.receiverAddress}</p>
          )}
          {data.receiverTaxId && (
            <p className="text-gray-600">RFC: {data.receiverTaxId}</p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-sm border-t border-b border-gray-300 py-4">
        <div>
          <p className="text-gray-600">Fecha de Emisión</p>
          <p className="font-semibold text-black">
            {new Date(data.issueDate).toLocaleDateString('es-ES')}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Fecha de Vencimiento</p>
          <p className="font-semibold text-black">
            {new Date(data.dueDate).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-3 text-black font-semibold">
              Descripción
            </th>
            <th className="text-right py-3 text-black font-semibold w-20">
              Cantidad
            </th>
            <th className="text-right py-3 text-black font-semibold w-24">
              Precio
            </th>
            <th className="text-right py-3 text-black font-semibold w-24">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 text-gray-700">{item.description}</td>
              <td className="text-right py-3 text-gray-700">
                {item.quantity}
              </td>
              <td className="text-right py-3 text-gray-700">
                {currencySymbol}
                {item.price.toFixed(2)}
              </td>
              <td className="text-right py-3 text-black font-semibold">
                {currencySymbol}
                {(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="ml-auto w-80 mb-8">
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-700">Subtotal:</span>
          <span className="text-black font-semibold">
            {currencySymbol}
            {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between py-2 text-sm border-b border-gray-300">
          <span className="text-gray-700">
            IVA ({(data.taxRate * 100).toFixed(0)}%):
          </span>
          <span className="text-black font-semibold">
            {currencySymbol}
            {taxAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between py-3 text-lg border-t-2 border-black">
          <span className="text-black font-bold">TOTAL:</span>
          <span className="text-black font-bold">
            {currencySymbol}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="text-sm text-gray-700 border-t border-gray-300 pt-4 mt-auto">
          <p className="font-semibold text-black mb-2">Notas:</p>
          <p>{data.notes}</p>
        </div>
      )}
    </div>
  );
}
