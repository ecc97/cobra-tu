import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePdfDownload } from '@/hooks/usePdfDownload';
import { DEFAULT_INVOICE } from '@/lib/constants';

vi.mock('@/lib/pdf', () => ({
    generatePDFFromData: vi.fn().mockResolvedValue(undefined),
}));

describe('usePdfDownload', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('marca factura invalida cuando faltan campos minimos', () => {
        const invalidInvoice = {
            ...DEFAULT_INVOICE,
            emitterName: '',
            receiverName: '',
        };

        const { result } = renderHook(() =>
            usePdfDownload({ invoiceData: invalidInvoice, invoiceNumber: '001' })
        );

        expect(result.current.isValidInvoice).toBeFalsy();
    });

    it('descarga PDF cuando la factura es valida', async () => {
        const validInvoice = {
            ...DEFAULT_INVOICE,
            emitterName: 'Empresa',
            receiverName: 'Cliente',
            items: [{ id: '1', description: 'Servicio', quantity: 1, price: 10 }],
        };

        const { result } = renderHook(() =>
            usePdfDownload({ invoiceData: validInvoice, invoiceNumber: '001' })
        );

        await act(async () => {
            await result.current.handleDownload();
        });

        expect(result.current.error).toBeNull();
        expect(result.current.showSuccessToast).toBe(true);
    });
});
