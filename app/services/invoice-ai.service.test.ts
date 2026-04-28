import { describe, expect, it, vi, afterEach } from 'vitest';
import { ApiServiceError, expandDescription } from '@/services/invoice-ai.service';

describe('invoice-ai.service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna descripción expandida cuando la API responde OK', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ expandedDescription: 'Descripcion profesional' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await expandDescription({ description: 'logo' });

    expect(result.expandedDescription).toBe('Descripcion profesional');
  });

  it('lanza ApiServiceError cuando la API devuelve error HTTP', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'rate limit' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(expandDescription({ description: 'logo' })).rejects.toBeInstanceOf(ApiServiceError);
  });

  it('lanza error cuando la respuesta es invalida', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ wrong: 'shape' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(expandDescription({ description: 'logo' })).rejects.toThrow('INVALID_AI_RESPONSE');
  });
});
