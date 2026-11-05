import SectionHeader from "../components/ui/SectionHeader";

// Why choose DNA: left column heading, right 2x2 benefit cards.
const iconProps = {
  width: 26, height: 26, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round",
  "aria-hidden": true,
};

const benefits = [
  {
    title: "Built for Nurses",
    description:
      "Streamline your shift with tools designed specifically for nursing workflows, assessments, and patient care.",
    icon: (
      <svg {...iconProps}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "Accurate & Secure",
    description:
      "Minimize medication errors with built-in dosage calculators and keep clinical records securely stored.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Smart Workflows",
    description:
      "From SBAR handovers to SOAP notes, standardize your documentation to save time and improve outcomes.",
    icon: (
      <svg {...iconProps}>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
  },
  // New fourth card so the grid is a full 2x2 (edit or replace freely)
  {
    title: "Your Patients, Your Account",
    description:
      "Sign in with your own nurse account and see only the patients assigned to your care.",
    icon: (
      <svg {...iconProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: heading */}
        <div className="lg:col-span-4">
          <SectionHeader
            title="Why Choose DNA?"
            subtitle="Everything you need for your shift, in one app."
          />
        </div>

        {/* Right: 2x2 cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="bg-bg-soft rounded-2xl p-6 sm:p-8 hover:shadow-sm transition-shadow duration-200">
              <div className="text-brand-blue mb-4">{b.icon}</div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">{b.title}</h3>
              <p className="text-text-muted leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}