interface PricingPlan {
  name: string;
  price: number;
  period?: string;
  description?: string;
  features: Array<{ text: string; included: boolean; highlight?: boolean }>;
  highlighted?: boolean;
  buttonText: string;
}

const PLANS: PricingPlan[] = [
  {
    name: 'Básico',
    price: 0,
    description: 'Gratis para siempre',
    features: [
      { text: 'Facturas ilimitadas', included: true },
      { text: 'Exportación PDF', included: true },
      { text: 'Sin marca de agua', included: false },
    ],
    buttonText: 'Empezar gratis',
  },
  {
    name: 'Pro Mensual',
    price: 9,
    period: '/mes',
    description: 'Facturación inteligente',
    features: [
      { text: 'IA Spark Ilimitada', included: true, highlight: true },
      { text: 'Sin marca de agua', included: true },
      { text: 'Logo personalizado', included: true },
      { text: 'Almacenamiento en nube', included: true },
    ],
    highlighted: true,
    buttonText: 'Suscribirse Pro',
  },
  {
    name: 'Pro Anual',
    price: 79,
    period: '/año',
    description: 'Ahorras 27%',
    features: [
      { text: 'Todo lo del Plan Pro', included: true },
      { text: 'Soporte prioritario 24/7', included: true },
      { text: 'Acceso anticipado beta', included: true },
    ],
    buttonText: 'Elegir Anual',
  },
];

export default function Pricing() {
  return (
    <section className="py-32 bg-[#1C1F26]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="font-display text-4xl mb-4">Planes para cada etapa</h2>
          <p className="text-on-surface-variant">Escoge la potencia que tu negocio necesita. Sin permanencia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const borderClass = plan.highlighted ? 'ring-2 ring-primary relative overflow-hidden' : 'border border-outline-variant/10';

  return (
    <div className={`bg-surface-container-low p-8 rounded-xl flex flex-col h-full ${borderClass}`}>
      {plan.highlighted && <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold px-4 py-1 rounded-bl-lg uppercase tracking-tighter">Más popular</div>}

      <div className="mb-8">
        <div className={`text-sm font-bold uppercase tracking-widest mb-2 ${plan.highlighted ? 'text-primary' : 'text-on-surface-variant'}`}>
          {plan.name}
        </div>
        <div className="text-4xl font-display font-bold">
          ${plan.price}
          {plan.period && <span className="text-lg font-normal text-on-surface-variant">{plan.period}</span>}
        </div>
        {plan.description && <div className={`text-xs text-on-surface-variant mt-1 ${plan.name.includes('Anual') ? 'text-secondary' : ''}`}>{plan.description}</div>}
      </div>

      <ul className="space-y-3 mb-10 grow">
        {plan.features.map((feature, i) => (
          <li key={i} className={`flex items-center gap-3 text-sm ${feature.included ? (feature.highlight ? 'font-semibold text-primary' : '') : 'text-on-surface-variant/40'}`}>
            <span className={`material-symbols-outlined text-lg ${feature.included ? (feature.highlight ? 'text-primary' : 'text-secondary') : ''}`}>
              {feature.included ? (feature.highlight ? 'auto_awesome' : 'check') : 'close'}
            </span>
            {feature.text}
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${plan.highlighted ? 'bg-primary text-on-primary hover:opacity-90' : 'border border-outline-variant hover:bg-surface-bright'}`}>
        {plan.buttonText}
      </button>
    </div>
  );
}
