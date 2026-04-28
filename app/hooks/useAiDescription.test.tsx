import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiDescription } from '@/hooks/useAiDescription';
import * as aiService from '@/services/invoice-ai.service';

describe('useAiDescription', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('actualiza descripcion y muestra toast de exito', async () => {
        const onLoadingStateChange = vi.fn();
        const onDescriptionUpdated = vi.fn();

        vi.spyOn(aiService, 'expandDescription').mockResolvedValue({
            expandedDescription: 'Descripcion expandida',
        });

        const { result } = renderHook(() => useAiDescription({ onLoadingStateChange }));

        await act(async () => {
            await result.current.runExpandDescription('diseno logo', onDescriptionUpdated);
        });

        expect(onDescriptionUpdated).toHaveBeenCalledWith('Descripcion expandida');
        expect(result.current.showSuccessToast).toBe(true);
        expect(onLoadingStateChange).toHaveBeenCalledWith(true);
        expect(onLoadingStateChange).toHaveBeenCalledWith(false);
    });

    it('mapea error HTTP 429 al mensaje esperado', async () => {
        const onDescriptionUpdated = vi.fn();
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        vi.spyOn(aiService, 'expandDescription').mockRejectedValue(
            new aiService.ApiServiceError('failed', 429)
        );

        const { result } = renderHook(() => useAiDescription({}));

        await act(async () => {
            await result.current.runExpandDescription('diseno logo', onDescriptionUpdated);
        });

        expect(result.current.error).toBe('Límite de solicitudes. Intenta en unos minutos');
        expect(onDescriptionUpdated).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});
