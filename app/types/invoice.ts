export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  // Emisor (quien emite la factura)
  emitterName: string;
  emitterEmail: string;
  emitterPhone: string;
  emitterAddress: string;
  emitterTaxId: string; // RUT, RFC, NIF, etc.
  emitterLogo?: string; // Base64 o URL

  // Receptor (quien recibe la factura)
  receiverName: string;
  receiverEmail: string;
  receiverAddress: string;
  receiverTaxId: string;

  // Datos de la factura
  invoiceNumber: string;
  issueDate: string; // ISO date
  dueDate: string; // ISO date
  notes?: string;

  // Items
  items: InvoiceItem[];

  // Configuración
  currency: 'USD' | 'EUR' | 'COP' | 'MXN';
  taxRate: number; // e.g., 0.19 para 19%
}

export interface Calculations {
  subtotal: number;
  taxAmount: number;
  total: number;
}
