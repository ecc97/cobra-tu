interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
  highlighted?: boolean;
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: 'edit_document',
    title: 'Llena el formulario',
    description: 'Ingresa los datos de tu cliente y los servicios prestados en una interfaz diseñada para la velocidad.',
  },
  {
    number: '02',
    icon: 'auto_awesome',
    title: 'Mejora con IA',
    description: 'Nuestra IA sugiere impuestos, traduce términos y profesionaliza tus descripciones automáticamente.',
    highlighted: true,
  },
  {
    number: '03',
    icon: 'download',
    title: 'Descarga tu PDF',
    description: 'Obtén un archivo profesional, listo para enviar, cumpliendo con todos los estándares legales.',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-center font-display text-4xl mb-20 text-on-surface">El proceso del artesano financiero</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  const bgClass = step.highlighted ? 'bg-surface-container ring-2 ring-secondary/20' : 'bg-surface-container hover:bg-surface-bright';

  return (
    <div className={`relative p-8 rounded-xl ${bgClass} transition-colors group`}>
      <div className={`font-display text-8xl ${step.highlighted ? 'text-secondary/10' : 'text-primary/10'} absolute top-4 right-8 group-hover:opacity-20 transition-opacity`}>
        {step.number}
      </div>

      <div className="relative space-y-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${step.highlighted ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: step.highlighted ? "'FILL' 1" : "'FILL' 0" }}>
            {step.icon}
          </span>
        </div>

        <h3 className={`text-xl font-display font-medium ${step.highlighted ? 'flex items-center gap-2' : ''}`}>
          {step.title}
          {step.highlighted && <span className="text-secondary text-sm font-body font-bold bg-secondary/10 px-2 py-0.5 rounded">✨ Spark</span>}
        </h3>

        <p className="text-on-surface-variant leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}
