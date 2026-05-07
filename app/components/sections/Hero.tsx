import Link from 'next/link';
import { VideoModal } from '@/components/modals/VideoModal';
import { useVideoModal } from '@/hooks/useVideoModal';

export default function Hero() {
  const { isOpen, openModal, closeModal } = useVideoModal();

  return (
    <main className="pt-32 pb-24 overflow-hidden">
      <VideoModal
        isOpen={isOpen}
        onClose={closeModal}
        videoSrc="/videos/demo-invoice.mp4"
      />
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/20 border border-outline-variant/15 text-secondary text-sm font-medium">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            ✨ Con IA integrada · Sin cuenta requerida
          </div>

          <h1 className="text-5xl lg:text-7xl font-display leading-tight text-on-surface">
            Tu factura profesional en <span className="italic text-primary">menos de 2 minutos.</span>
          </h1>

          <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
            Sin registrarte. Sin configurar nada. Llena el formulario, mejora con IA y descarga el PDF al instante.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/nueva-factura"
              className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Crear factura ahora
            </Link>
            <button 
              onClick={openModal} 
              className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-surface-bright transition-colors"
            >
              Ver ejemplo
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6 text-sm text-on-surface-variant/60 font-medium">
            <div className="flex items-center gap-2 text-on-surface-high">
              <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
              ✓ Gratis para siempre
            </div>
            <div className="flex items-center gap-2 text-on-surface-high">
              <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
              ✓ Sin tarjeta de crédito
            </div>
            <div className="flex items-center gap-2 text-on-surface-high">
              <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
              ✓ PDF en segundos
            </div>
          </div>
        </div>

        {/* Right: Invoice Mockup */}
        <MockupInvoice />
      </div>
    </main>
  );
}

function MockupInvoice() {
  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />

      <div className="relative bg-white p-8 md:p-12 paper-shadow rounded-sm aspect-[1/1.41] max-w-md mx-auto rotate-2 hover:rotate-0 transition-transform duration-500 text-slate-800 font-invoice shadow-2xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="text-3xl font-display font-bold text-slate-900 mb-1">FACTURA</div>
            <div className="text-xs text-slate-400">#INV-2025-001</div>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12 text-xs">
          <div>
            <div className="font-bold mb-1 text-slate-400 uppercase tracking-tighter text-[10px]">De:</div>
            <div className="font-bold">Alex Rivera Design</div>
            <div>Calle Innovación 45, Madrid</div>
          </div>
          <div>
            <div className="font-bold mb-1 text-slate-400 uppercase tracking-tighter text-[10px]">Para:</div>
            <div className="font-bold">Studio Creativo S.L.</div>
            <div>Paseo de la Castellana 120</div>
          </div>
        </div>

        <div className="border-t border-slate-100 py-4 mb-4">
          <div className="grid grid-cols-4 font-bold text-[10px] text-slate-400 uppercase mb-4">
            <div className="col-span-2">Descripción</div>
            <div className="text-right">Cant.</div>
            <div className="text-right">Total</div>
          </div>
          <div className="grid grid-cols-4 text-xs mb-3">
            <div className="col-span-2 font-medium">Diseño de Interfaz UX/UI</div>
            <div className="text-right">1</div>
            <div className="text-right font-bold">$1,200.00</div>
          </div>
          <div className="grid grid-cols-4 text-xs">
            <div className="col-span-2 font-medium">Consultoría Branding</div>
            <div className="text-right">4h</div>
            <div className="text-right font-bold">$400.00</div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-end">
          <div className="w-1/2 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Subtotal:</span>
              <span>$1,600.00</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-indigo-600">
              <span>Total:</span>
              <span>$1,600.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
