'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-primary mb-6">
            Facturas Profesionales
          </h1>
          <p className="text-2xl text-on-surface/80 mb-4">
            Sin cuenta. Sin fricción. En 2 minutos.
          </p>
          <p className="text-lg text-on-surface/60 mb-12">
            Genera facturas hermosas y profesionales. Con la ayuda de IA para
            describir tus servicios. Sin suscripciones obligatorias.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nueva-factura"
              className="px-8 py-4 rounded bg-primary text-on-primary text-lg font-semibold hover:bg-primary-container transition-colors"
            >
              Crear Factura
            </Link>
            <button className="px-8 py-4 rounded border-2 border-primary text-primary text-lg font-semibold hover:bg-surface-container transition-colors">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-container py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">
            ¿Por qué InvoiceFlow?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Rápido',
                desc: 'Tu factura en menos de 2 minutos. Llena el formulario y descarga el PDF.',
              },
              {
                icon: '✨',
                title: 'Con IA',
                desc: 'Descripción de servicios profesionales con un clic. La IA lo hace por ti.',
              },
              {
                icon: '🎨',
                title: 'Hermoso',
                desc: 'Diseño moderno y profesional. Tu cliente verá calidad desde el primer PDF.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-surface-container-low p-6 rounded">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-on-surface/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-surface py-16 px-6 text-center">
        <h3 className="text-3xl font-bold text-primary mb-6">
          ¿Listo para emitir tu primera factura?
        </h3>
        <Link
          href="/nueva-factura"
          className="inline-block px-8 py-4 rounded bg-secondary text-black text-lg font-semibold hover:bg-secondary/90 transition-colors"
        >
          Comenzar Ahora
        </Link>
      </section>
    </div>
  );
}
