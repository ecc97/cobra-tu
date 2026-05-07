import { useCallback, useState } from 'react';

interface UseVideoModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * Hook para gestionar el estado de la modal de video.
 * Maneja la apertura y cierre de la modal de forma aislada.
 */
export function useVideoModal(): UseVideoModalReturn {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    // Prevenir scroll del body cuando la modal está abierta
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Restaurar scroll del body
    document.body.style.overflow = 'unset';
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
  };
}
