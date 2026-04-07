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
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '2rem',
        maxWidth: '42rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0.25rem',
        boxShadow:
          '0 4px 6px rgba(0, 0, 0, 0.3), 0 10px 40px rgba(0, 0, 0, 0.4), 0 2px 80px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
        }}
      >
        <div>
          {data.emitterLogo && (
            <img
              src={data.emitterLogo}
              alt="Logo"
              style={{
                height: '4rem',
                objectFit: 'contain',
                marginBottom: '1rem',
              }}
            />
          )}
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>
            {data.emitterName || 'Tu Empresa'}
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            FACTURA
          </p>
          <p style={{ color: '#4b5563', margin: 0 }}>
            #{data.invoiceNumber.padStart(3, '0')}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
        }}
      >
        <div>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#000' }}>DE:</p>
          <p style={{ color: '#4b5563', margin: '0.25rem 0' }}>{data.emitterName}</p>
          {data.emitterEmail && (
            <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>{data.emitterEmail}</p>
          )}
          {data.emitterPhone && (
            <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>{data.emitterPhone}</p>
          )}
          {data.emitterAddress && (
            <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>{data.emitterAddress}</p>
          )}
          {data.emitterTaxId && (
            <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>RFC: {data.emitterTaxId}</p>
          )}
        </div>
        <div>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#000' }}>PARA:</p>
          <p style={{ color: '#4b5563', margin: '0.25rem 0' }}>{data.receiverName}</p>
          {data.receiverEmail && (
            <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>{data.receiverEmail}</p>
          )}
          {data.receiverAddress && (
            <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>{data.receiverAddress}</p>
          )}
          {data.receiverTaxId && (
            <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>RFC: {data.receiverTaxId}</p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          borderTop: '1px solid #d1d5db',
          borderBottom: '1px solid #d1d5db',
          padding: '1rem 0',
        }}
      >
        <div>
          <p style={{ color: '#6b7280', margin: 0 }}>Fecha de Emisión</p>
          <p style={{ fontWeight: 'bold', color: '#000', margin: 0 }}>
            {new Date(data.issueDate).toLocaleDateString('es-ES')}
          </p>
        </div>
        <div>
          <p style={{ color: '#6b7280', margin: 0 }}>Fecha de Vencimiento</p>
          <p style={{ fontWeight: 'bold', color: '#000', margin: 0 }}>
            {new Date(data.dueDate).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: '100%',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid #1f2937' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#000', fontWeight: 'bold' }}>
              Descripción
            </th>
            <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#000', fontWeight: 'bold', width: '5rem' }}>
              Cantidad
            </th>
            <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#000', fontWeight: 'bold', width: '6rem' }}>
              Precio
            </th>
            <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#000', fontWeight: 'bold', width: '6rem' }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr
              key={item.id}
              style={{ borderBottom: '1px solid #e5e7eb' }}
            >
              <td style={{ padding: '0.75rem 0', color: '#4b5563' }}>
                {item.description}
              </td>
              <td style={{ textAlign: 'right', padding: '0.75rem 0', color: '#4b5563' }}>
                {item.quantity}
              </td>
              <td style={{ textAlign: 'right', padding: '0.75rem 0', color: '#4b5563' }}>
                {currencySymbol}
                {item.price.toFixed(2)}
              </td>
              <td style={{ textAlign: 'right', padding: '0.75rem 0', color: '#000', fontWeight: 'bold' }}>
                {currencySymbol}
                {(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginLeft: 'auto', width: '20rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.875rem' }}>
          <span style={{ color: '#4b5563' }}>Subtotal:</span>
          <span style={{ color: '#000', fontWeight: 'bold' }}>
            {currencySymbol}
            {subtotal.toFixed(2)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            fontSize: '0.875rem',
            borderBottom: '1px solid #d1d5db',
          }}
        >
          <span style={{ color: '#4b5563' }}>
            IVA ({(data.taxRate * 100).toFixed(0)}%):
          </span>
          <span style={{ color: '#000', fontWeight: 'bold' }}>
            {currencySymbol}
            {taxAmount.toFixed(2)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            fontSize: '1.125rem',
            borderTop: '2px solid #000',
          }}
        >
          <span style={{ color: '#000', fontWeight: 'bold' }}>TOTAL:</span>
          <span style={{ color: '#000', fontWeight: 'bold' }}>
            {currencySymbol}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div
          style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            borderTop: '1px solid #d1d5db',
            paddingTop: '1rem',
            marginTop: 'auto',
          }}
        >
          <p style={{ fontWeight: 'bold', color: '#000', marginBottom: '0.5rem' }}>Notas:</p>
          <p style={{ margin: 0 }}>{data.notes}</p>
        </div>
      )}
    </div>
  );
}
