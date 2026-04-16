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
  const issueDate = new Date(data.issueDate).toLocaleDateString('es-ES');
  const dueDate = new Date(data.dueDate).toLocaleDateString('es-ES');

  const emitterName = data.emitterName || 'Nombre Empresa';
  const receiverName = data.receiverName || 'Cliente';

  return (
    <div
      id="invoice-paper"
      className="w-full max-w-130 bg-white text-[#111827] paper-shadow rounded-sm min-h-184 p-12 flex flex-col transform transition-transform hover:scale-[1.01] duration-500"
    >
      <div className="flex justify-between items-start mb-14">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded flex items-center justify-center overflow-hidden">
            {data.emitterLogo ? (
              <img src={data.emitterLogo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-gray-300">LOGO</span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-headline text-[22px] font-bold leading-tight text-[#111827]">
              {emitterName}
            </h3>
            <p className="text-[10px] text-gray-400">{data.emitterEmail || 'empresa@email.com'}</p>
            <p className="text-[10px] text-gray-400">{data.emitterAddress || 'Calle Principal #123, Ciudad'}</p>
          </div>
        </div>

        <div className="text-right space-y-1">
          <h1 className="font-headline text-[32px] font-bold leading-none text-primary mb-3">FACTURA</h1>
          <p className="text-[11px] font-bold">#{data.invoiceNumber.padStart(3, '0')}</p>
          <p className="text-[10px] text-gray-500">Fecha: {issueDate}</p>
          <p className="text-[10px] text-gray-500">Vencimiento: {dueDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-14">
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">DE</span>
          <div className="text-[11px] leading-relaxed">
            <p className="font-bold">{emitterName}</p>
            <p className="text-gray-500">{data.emitterAddress || 'Workspace Premium, 45B'}</p>
            <p className="text-gray-500">{data.emitterTaxId ? `NIT: ${data.emitterTaxId}` : 'NIT: 900.123.456-1'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">COBRAR A</span>
          <div className="text-[11px] leading-relaxed">
            <p className="font-bold">{receiverName}</p>
            <p className="text-gray-500">{data.receiverEmail || 'cliente@ejemplo.com'}</p>
            <p className="text-gray-500">{data.receiverAddress || 'Avenida Libertador #99'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-1/2">Descripción</th>
              <th className="text-center py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Cant.</th>
              <th className="text-right py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Precio</th>
              <th className="text-right py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {data.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 1 ? 'bg-gray-50/30' : ''}>
                <td className="py-4.5 pr-4 border-b border-gray-50">
                  <p className="font-medium text-[#111827]">{item.description || 'Servicio profesional'}</p>
                </td>
                <td className="py-4.5 text-center border-b border-gray-50">{item.quantity}</td>
                <td className="py-4.5 text-right border-b border-gray-50">
                  {currencySymbol}{item.price.toFixed(2)}
                </td>
                <td className="py-4.5 text-right font-bold border-b border-gray-50">
                  {currencySymbol}{(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 pt-6 border-t-2 border-gray-100 flex justify-end">
        <div className="w-[46%] min-w-48 space-y-2.5">
          <div className="flex justify-between text-[11px] text-gray-500 px-1">
            <span>Subtotal</span>
            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 px-1">
            <span>Impuestos ({(data.taxRate * 100).toFixed(0)}%)</span>
            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center bg-[#111827] text-white px-4 py-3 rounded mt-4 gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Total</span>
            <span className="text-[18px] font-bold leading-none">{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-8 pt-4 border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">Notas</p>
          <p
            title={data.notes}
            className="text-[11px] text-gray-500 leading-relaxed overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              maxHeight: '4.8em',
            }}
          >
            {data.notes}
          </p>
        </div>
      )}

      <footer className="mt-14 pt-6 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-300 italic">Gracias por confiar en nosotros</p>
      </footer>
    </div>
  );
}
