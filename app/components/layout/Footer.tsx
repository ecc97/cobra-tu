export default function Footer() {
  const donationUrl = process.env.NEXT_PUBLIC_DONATION_URL?.trim();

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/15 py-16 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-2xl font-display italic text-primary">CobraTú</div>
          <p className="font-body text-xs text-gray-500 uppercase tracking-widest">© {new Date().getFullYear()} · Hecho para freelancers</p>
        </div>

        {/* <div className="flex gap-12 text-xs font-body uppercase tracking-[0.2em] text-gray-500">
          <a href="#" className="hover:text-secondary transition-colors">
            Privacidad
          </a>
          <a href="#" className="hover:text-secondary transition-colors">
            Términos
          </a>
          <a href="#" className="hover:text-secondary transition-colors">
            Contacto
          </a>
        </div> */}

        {donationUrl && (
          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-outline-variant/40 rounded-full px-4 py-2 text-[10px] font-body uppercase tracking-[0.15em] text-gray-500 hover:text-secondary hover:border-secondary/60 transition-colors"
            aria-label="Invitame un cafe"
          >
            <span className="material-symbols-outlined text-sm">coffee</span>
            Apóyanos con un café, opcional
          </a>
        )}

        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary cursor-pointer transition-colors">
          <span className="material-symbols-outlined text-xl">language</span>
        </div>
      </div>
    </footer>
  );
}
