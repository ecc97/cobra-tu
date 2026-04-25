import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/invoice/InvoicePDF';
import { InvoiceData } from '@/types/invoice';

export async function generatePDFFromData(
  data: InvoiceData,
  fileName: string
): Promise<void> {
  const blob = await pdf(<InvoicePDF data={data} />).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}