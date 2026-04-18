'use client';

import { useAiDescription } from '@/hooks/useAiDescription';
import { Toast } from '@/components/ui/Toast';

interface ExpandDescriptionButtonProps {
  currentDescription: string;
  onDescriptionUpdated: (newDescription: string) => void;
  disabled?: boolean;
  onLoadingStateChange?: (isLoading: boolean) => void;
}

export function ExpandDescriptionButton({
  currentDescription,
  onDescriptionUpdated,
  disabled = false,
  onLoadingStateChange,
}: ExpandDescriptionButtonProps) {
  const {
    isLoading,
    error,
    showSuccessToast,
    showErrorToast,
    errorToastMessage,
    runExpandDescription,
    closeSuccessToast,
    closeErrorToast,
  } = useAiDescription({ onLoadingStateChange });

  const handleExpand = async () => {
    await runExpandDescription(currentDescription, onDescriptionUpdated);
  };

  return (
    <div className="relative flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={handleExpand}
        disabled={disabled || isLoading}
        title="Mejorar con IA"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/22 text-secondary border border-secondary/30 text-sm font-semibold hover:bg-secondary-container/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin">✦</span>
            Mejorando...
          </>
        ) : (
          <>
            ✦ Mejorar con IA
          </>
        )}
      </button>

      {error && <span className="text-error text-xs self-center">{error}</span>}
      {showSuccessToast && (
        <Toast
          message="Descripción mejorada"
          type="success"
          onClose={closeSuccessToast}
        />
      )}
      {showErrorToast && (
        <Toast
          message={errorToastMessage}
          type="error"
          onClose={closeErrorToast}
        />
      )}
    </div>
  );
}
