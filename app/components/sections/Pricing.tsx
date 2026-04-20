export default function Pricing() {
  return (
    <section id="precios" className="py-32 bg-surface-container-lowest">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl mb-8">Sin friccion, sin sorpresas</h2>

          <div className="group max-w-xl mx-auto rounded-2xl border border-outline-variant/20 bg-surface-container-low px-8 py-10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <span className="material-symbols-outlined text-5xl text-[#E5B83A] transition-transform duration-300 group-hover:scale-105" style={{fontSize: '48px'}}>redeem</span>
            <h3 className="font-display text-3xl mt-5">Gratis, sin costos ocultos</h3>
            <p className="text-on-surface-variant text-lg mt-3">Sin suscripciones, sin anuncios.</p>
          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-secondary mt-8">Disponible ahora: exportacion PDF con plantilla predisenada</p>
        </div>
      </div>
    </section>
  );
}
