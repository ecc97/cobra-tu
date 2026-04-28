import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { DEFAULT_INVOICE } from '@/lib/constants';
import { useInvoiceStore } from '@/store/invoice-store';

describe('InvoiceForm', () => {
    beforeEach(() => {
        useInvoiceStore.setState({
            invoiceData: {
                ...DEFAULT_INVOICE,
                items: [{ id: '1', description: '', quantity: 1, price: 0 }],
            },
            isAiOptimizing: false,
            isMobilePreviewOpen: false,
        });
    });

    it('agrega y elimina items desde la UI', async () => {
        const user = userEvent.setup();

        render(<InvoiceForm showSubmitButton={false} />);

        expect(screen.getAllByPlaceholderText('Descripción del servicio')).toHaveLength(1);

        await user.click(screen.getByRole('button', { name: /añadir ítem/i }));

        expect(screen.getAllByPlaceholderText('Descripción del servicio')).toHaveLength(2);

        const deleteIcon = screen.getAllByText('delete')[0];
        const deleteButton = deleteIcon.closest('button');

        expect(deleteButton).not.toBeNull();

        await user.click(deleteButton as HTMLButtonElement);

        expect(screen.getAllByPlaceholderText('Descripción del servicio')).toHaveLength(1);
    });
});
