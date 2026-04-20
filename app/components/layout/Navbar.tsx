import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-display italic text-primary">CobraTú</div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-on-surface-variant hover:text-on-surface hover:-translate-y-0.5 border-b border-transparent hover:border-primary/60 transition-all duration-300 text-sm pb-1">
            Características
          </a>
          <a href="#precios" className="text-on-surface-variant hover:text-on-surface hover:-translate-y-0.5 border-b border-transparent hover:border-primary/60 transition-all duration-300 text-sm pb-1">
            Precios
          </a>
          <a href="#por-que-existe" className="text-on-surface-variant hover:text-on-surface hover:-translate-y-0.5 border-b border-transparent hover:border-primary/60 transition-all duration-300 text-sm pb-1">
            ¿Por qué existe este proyecto?
          </a>
        </div>

        <Link
          href="/nueva-factura"
          className="group bg-primary-container text-on-surface px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
        >
          Emitir Factura
          <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-0.5">arrow_forward</span>
        </Link>
      </div>
    </nav>
  );
}
