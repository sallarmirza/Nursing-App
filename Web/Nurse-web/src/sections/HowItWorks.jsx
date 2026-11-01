import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Register & Manage Patients",
      description: "Create secure profiles, assign patients to your care, and keep all clinical records and vitals in one place.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
      reverse: false // Text on left, image on right
    },
    {
      number: "2",
      title: "Document Notes & Vitals",
      description: "Log vitals, write SOAP notes, and track patient history seamlessly right from your mobile device.",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop",
      reverse: true // Image on left, text on right
    },
    {
      number: "3",
      title: "Calculate & Handover",
      description: "Use dosage and IV drip calculators for precise medication management, then generate SBAR handovers instantly.",
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1200&auto=format&fit=crop",
      reverse: false // Text on left, image on right
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader 
          badge="HOW IT WORKS" 
          title="Hassle-Free Shift Management" 
        />

        <div className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-center bg-white border border-gray-100 shadow-sm rounded-4xl overflow-hidden ${step.reverse ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-100">
                <img
                  src={step.image}
                  srcSet={`${step.image.replace('w=1200', 'w=640')} 640w, ${step.image} 1200w`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={step.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-lg mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-text-dark mb-4">
                  {step.title}
                </h3>
                <p className="text-text-muted text-lg leading-relaxed mb-8">
                  {step.description}
                </p>
                <div>
                  <a href="#waitlist"><Button variant="primary">Get Started</Button></a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}