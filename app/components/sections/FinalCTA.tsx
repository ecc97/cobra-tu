import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h2 className="text-5xl md:text-6xl font-display mb-8 leading-tight">¿Tienes un servicio que facturar?</h2>
        <p className="text-xl text-on-surface-variant mb-12 max-w-xl mx-auto leading-relaxed">
          Únete a miles de freelancers que han profesionalizado su flujo de trabajo hoy mismo.
        </p>
        <Link
          href="/nueva-factura"
          className="bg-primary text-on-primary px-10 py-5 rounded-lg font-bold text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-opacity inline-flex items-center gap-3"
        >
          Crear mi primera factura <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
