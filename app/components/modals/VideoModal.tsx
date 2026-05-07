'use client';

import { useEffect, useRef } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

/**
 * Modal para reproducir video con diseño responsive.
 * Sigue el sistema de diseño del proyecto (colores, animaciones, tipografía).
 * Usa <video> nativo, no iframes.
 */
export function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Detener video al cerrar
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro con blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 md:px-8 md:py-12 animate-fade-in" onClick={onClose}>
        <div
          className="relative w-full max-w-4xl bg-surface-container rounded-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-surface-container-highest hover:bg-surface-bright transition-colors p-2 rounded-lg md:top-6 md:right-6"
            aria-label="Cerrar modal"
          >
            <svg
              className="w-6 h-6 text-on-surface"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Video Container */}
          <div className="relative w-full bg-black/80 aspect-video">
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              autoPlay
              className="w-full h-full"
              controlsList="nodownload"
            >
              Tu navegador no soporta reproducción de video.
            </video>
          </div>

          {/* Footer con información */}
          <div className="hidden lg:block bg-surface-container-low px-4 py-3 md:px-6 md:py-4">
            <p className="text-sm md:text-base text-on-surface-high">
              Presiona <kbd className="bg-surface-container-highest px-2 py-1 rounded text-primary text-xs font-mono">ESC</kbd> para cerrar
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
