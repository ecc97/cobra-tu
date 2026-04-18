import { useState } from 'react';
import { ApiServiceError, expandDescription } from '@/services/invoice-ai.service';

const IA_TIMEOUT_MS = 30000;

interface UseAiDescriptionParams {
  onLoadingStateChange?: (isLoading: boolean) => void;
}

interface UseAiDescriptionReturn {
  isLoading: boolean;
  error: string | null;
  showSuccessToast: boolean;
  showErrorToast: boolean;
  errorToastMessage: string;
  runExpandDescription: (currentDescription: string, onDescriptionUpdated: (newDescription: string) => void) => Promise<void>;
  closeSuccessToast: () => void;
  closeErrorToast: () => void;
}

export function useAiDescription({ onLoadingStateChange }: UseAiDescriptionParams): UseAiDescriptionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState('');

  const runExpandDescription = async (
    currentDescription: string,
    onDescriptionUpdated: (newDescription: string) => void
  ) => {
    if (!currentDescription.trim()) {
      setError('Escribe una descripción primero');
      return;
    }

    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      onLoadingStateChange?.(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), IA_TIMEOUT_MS);

      const response = await expandDescription(
        { description: currentDescription },
        controller.signal
      ).finally(() => clearTimeout(timeoutId));

      onDescriptionUpdated(response.expandedDescription);
      setShowSuccessToast(true);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('La solicitud tardó demasiado. Vuelve a intentarlo.');
        setErrorToastMessage('La IA tardó más de 30s. Inténtalo de nuevo.');
        setShowErrorToast(true);
      } else if (err instanceof ApiServiceError) {
        setError(resolveHttpError(err.status));
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
      onLoadingStateChange?.(false);
    }
  };

  return {
    isLoading,
    error,
    showSuccessToast,
    showErrorToast,
    errorToastMessage,
    runExpandDescription,
    closeSuccessToast: () => setShowSuccessToast(false),
    closeErrorToast: () => setShowErrorToast(false),
  };
}

function resolveHttpError(status: number): string {
  if (status === 429) {
    return 'Límite de solicitudes. Intenta en unos minutos';
  }

  if (status === 400) {
    return 'Descripción vacía o inválida';
  }

  if (status === 401 || status === 403) {
    return 'API key inválida. Configura una nueva';
  }

  if (status === 503) {
    return 'Servicio no disponible. Intenta luego';
  }

  if (status === 500) {
    return 'Error del servidor. Intenta de nuevo';
  }

  return `Error ${status}. Intenta de nuevo`;
}
