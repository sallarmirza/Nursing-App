import SectionHeader from '../components/ui/SectionHeader';

export default function Features() {
  const features = [
    {
      title: "Patient Management",
      description: "Register patients, assign them to your care, and maintain comprehensive digital clinical records securely.",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "SOAP Notes",
      description: "Structure your clinical documentation with Subjective, Objective, Assessment, and Plan (SOAP) notes.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "SBAR Handovers",
      description: "Ensure safe and clear shift handovers using the Situation, Background, Assessment, and Recommendation format.",
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Calculations & Meds",
      description: "Access medication management tools, plus accurate dosage and IV drip-rate calculators to minimize errors.",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  return (
    <section id="features" className="py-24 bg-bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader 
          badge="CORE FEATURES" 
          title="Everything You Need in One App" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-[2.5rem] p-3 sm:p-4 group hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Large Image Container */}
              <div className="w-full h-64 sm:h-72 rounded-3xl overflow-hidden mb-6">
                <img
                  src={feature.image}
                  srcSet={`${feature.image.replace('w=1200', 'w=640')} 640w, ${feature.image} 1200w`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={feature.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text Content */}
              <div className="px-4 pb-4">
                <h3 className="text-2xl font-bold text-blue-950 mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                {/* Link */}
                <a href="#waitlist" className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:gap-3 transition-all">
                  Know more 
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}