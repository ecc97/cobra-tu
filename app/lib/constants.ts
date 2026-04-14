import { InvoiceData } from '@/types/invoice';

export const DEFAULT_INVOICE: InvoiceData = {
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
  taxRate: 0,
};
