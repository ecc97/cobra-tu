'use client';

import { useState } from 'react';
import { Toast } from '@/components/ui/Toast';

interface ExpandDescriptionButtonProps {
  currentDescription: string;
  onDescriptionUpdated: (newDescription: string) => void;
  disabled?: boolean;
}

export function ExpandDescriptionButton({
  currentDescription,
  onDescriptionUpdated,
  disabled = false,
}: ExpandDescriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleExpand = async () => {
    if (!currentDescription.trim()) {
      setError('Escribe una descripción primero');
      return;
    }

    // Prevenir múltiples requests simultáneos
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Timeout de 10s para requests lentas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/expand-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: currentDescription }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          setError('Límite de solicitudes. Intenta en unos minutos');
        } else if (response.status === 400) {
          setError('Descripción vacía o inválida');
        } else if (response.status === 401 || response.status === 403) {
          setError('API key inválida. Configura una nueva');
        } else if (response.status === 503) {
          setError('Servicio no disponible. Intenta luego');
        } else if (response.status === 500) {
          setError('Error del servidor. Intenta de nuevo');
        } else {
          setError(`Error ${response.status}. Intenta de nuevo`);
        }
        return;
      }

      const data = await response.json();
      if (!data.expandedDescription) {
        setError('Respuesta vacía de IA');
        return;
      }

      onDescriptionUpdated(data.expandedDescription);
      setError(null);
      setShowSuccessToast(true);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Solicitud tardó mucho (timeout)');
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Error de red. Verifica tu conexión');
      } else if (err instanceof TypeError) {
        setError('Error de conexión. Intenta de nuevo');
      } else {
        setError('Error inesperado. Intenta de nuevo');
      }
      console.error('Expand description error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleExpand}
        disabled={disabled || isLoading}
        title="Mejorar con IA"
        className="px-3 py-2 rounded bg-secondary text-black text-sm font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin mr-1">✨</span>
            ...
          </>
        ) : (
          <>
            ✨ Mejorar
          </>
        )}
      </button>
      {error && <span className="text-error text-xs self-center">{error}</span>}
      {showSuccessToast && (
        <Toast 
          message="Descripción mejorada" 
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
}
