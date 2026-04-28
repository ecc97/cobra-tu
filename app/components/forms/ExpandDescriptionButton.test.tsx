import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpandDescriptionButton } from '@/components/forms/ExpandDescriptionButton';
import * as aiService from '@/services/invoice-ai.service';

describe('ExpandDescriptionButton', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('ejecuta flujo exitoso al hacer click en mejorar con IA', async () => {
        const user = userEvent.setup();
        const onDescriptionUpdated = vi.fn();

        vi.spyOn(aiService, 'expandDescription').mockResolvedValue({
            expandedDescription: 'Descripcion mejorada por IA',
        });

        render(
            <ExpandDescriptionButton
                currentDescription="diseno de logo"
                onDescriptionUpdated={onDescriptionUpdated}
            />
        );

        await user.click(screen.getByRole('button', { name: /mejorar con ia/i }));

        expect(onDescriptionUpdated).toHaveBeenCalledWith('Descripcion mejorada por IA');
        expect(await screen.findByText('Descripción mejorada')).toBeInTheDocument();
    });

    it('muestra mensaje de validacion si descripcion esta vacia', async () => {
        const user = userEvent.setup();

        render(
            <ExpandDescriptionButton
                currentDescription="   "
                onDescriptionUpdated={vi.fn()}
            />
        );

        await user.click(screen.getByRole('button', { name: /mejorar con ia/i }));

        expect(await screen.findByText('Escribe una descripción primero')).toBeInTheDocument();
    });
});
