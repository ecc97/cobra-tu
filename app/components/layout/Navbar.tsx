import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-display italic text-primary">InvoiceFlow</div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors text-sm">
            Características
          </a>
          <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors text-sm">
            Precios
          </a>
          <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors text-sm">
            Testimonios
          </a>
        </div>

        <Link
          href="/nueva-factura"
          className="bg-primary-container text-on-surface px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Emitir Factura
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </nav>
  );
}
