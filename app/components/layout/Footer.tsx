export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/15 py-16 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-2xl font-display italic text-primary">InvoiceFlow</div>
          <p className="font-body text-xs text-gray-500 uppercase tracking-widest">© {new Date().getFullYear()} · Hecho para freelancers</p>
        </div>

        <div className="flex gap-12 text-xs font-body uppercase tracking-[0.2em] text-gray-500">
          <a href="#" className="hover:text-secondary transition-colors">
            Privacidad
          </a>
          <a href="#" className="hover:text-secondary transition-colors">
            Términos
          </a>
          <a href="#" className="hover:text-secondary transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-secondary transition-colors">
            Contacto
          </a>
        </div>

        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary cursor-pointer transition-colors">
          <span className="material-symbols-outlined text-xl">language</span>
        </div>
      </div>
    </footer>
  );
}
