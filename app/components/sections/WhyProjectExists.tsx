import Link from 'next/link';

export default function WhyProjectExists() {
  return (
    <section id="por-que-existe" className="py-28 bg-surface">
      <div className="max-w-5xl mx-auto px-8">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-10 text-on-surface">¿Por qué existe CobraTú?</h2>

        <blockquote className="max-w-4xl mx-auto text-center text-xl md:text-2xl leading-relaxed text-on-surface border-l-0 md:border-l-4 border-secondary/30 md:pl-6 italic">
          "Las grandes plataformas secuestraron algo que debería ser simple: tu derecho a cobrar por tu trabajo sin tener que ceder tus datos o aprender a usar un software entero."
        </blockquote>

        <div className="mt-12 space-y-7 text-on-surface-variant text-lg leading-relaxed max-w-4xl mx-auto">
          <p>
            Los freelancers y profesionales independientes comparten una frustración constante: generar una simple factura se convirtió en un proceso lleno de obstáculos. Muchas herramientas exigen crear cuentas, verificar correos y navegar paneles complejos antes de poder descargar un documento.
          </p>
          <p>
            La alternativa también desgasta: improvisar en procesadores de texto, perder tiempo en formatos y maquetación, y terminar con un archivo poco profesional que no refleja la calidad real de tus servicios.
          </p>
          <p>
            CobraTú responde a ese dolor de forma directa. Es open source, 100% gratuito y sin registros obligatorios. Entras y empiezas. Sin fricción, sin ceder tus datos y con una experiencia enfocada en privacidad y rapidez.
          </p>
          <p>
            Todo ocurre en un flujo simple: completas los campos, mejoras la descripción con IA en un clic y descargas tu PDF al instante. En menos de dos minutos tienes un documento limpio, estructurado y listo para cobrar con confianza.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/nueva-factura"
            className="group inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
          >
            Empezar ahora
            <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-0.5">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}