'use client';

import { useState } from 'react';

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

  const handleExpand = async () => {
    if (!currentDescription.trim()) {
      setError('Escribe una descripción primero');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/expand-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: currentDescription }),
      });

      if (!response.ok) throw new Error('Error en la IA');

      const data = await response.json();
      onDescriptionUpdated(data.expandedDescription);
    } catch (err) {
      setError('Error al mejorar la descripción');
      console.error(err);
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
        {isLoading ? '✨ ...' : '✨ Mejorar'}
      </button>
      {error && <span className="text-error text-xs self-center">{error}</span>}
    </div>
  );
}
