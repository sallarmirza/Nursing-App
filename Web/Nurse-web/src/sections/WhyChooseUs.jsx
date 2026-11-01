import SectionHeader from '../components/ui/SectionHeader';

export default function WhyChooseUs() {
  const benefits = [
    {
      title: "Built for Nurses",
      description: "Streamline your shift with tools designed specifically for nursing workflows, assessments, and patient care.",
      bgColor: "bg-[#f0f4ff]", // Soft Blue
      iconBg: "bg-brand-blue",
      iconColor: "text-white",
      textColor: "text-blue-950",
      descColor: "text-blue-900/70",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      )
    },
    {
      title: "Accurate & Secure",
      description: "Minimize medication errors with built-in dosage calculators and keep clinical records securely stored.",
      bgColor: "bg-[#f0fdf4]", // Soft Green
      iconBg: "bg-[#166534]", // Dark Green
      iconColor: "text-white",
      textColor: "text-green-950",
      descColor: "text-green-900/70",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      title: "Smart Workflows",
      description: "From SBAR handovers to SOAP notes, standardize your documentation to save time and improve outcomes.",
      bgColor: "bg-[#f0f9ff]", // Soft Cyan
      iconBg: "bg-[#0284c7]", // Cyan
      iconColor: "text-white",
      textColor: "text-cyan-950",
      descColor: "text-cyan-900/70",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="py-24 bg-bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader 
          badge="ABOUT US" 
          title="Why Choose DNA?" 
        />

        {/* Large Feature Image */}
        <div className="w-full h-100 lg:h-137.5 rounded-4xl overflow-hidden mb-8 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1400&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=768&auto=format&fit=crop 768w, https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1400&auto=format&fit=crop 1400w"
            sizes="(max-width: 768px) 100vw, 90vw"
            alt="Medical team collaborating"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 3 Column Pastel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              // REMOVED: transition-transform hover:-translate-y-1
              className={`flex flex-col items-start p-8 sm:p-10 rounded-4xl ${benefit.bgColor}`}
            >
              
              {/* Icon Circle */}
              <div className={`w-16 h-16 rounded-full ${benefit.iconBg} ${benefit.iconColor} flex items-center justify-center mb-8 shadow-sm`}>
                {benefit.icon}
              </div>

              <h3 className={`text-2xl font-bold ${benefit.textColor} mb-4`}>
                {benefit.title}
              </h3>
              
              <p className={`${benefit.descColor} leading-relaxed mb-6 grow`}>
                {benefit.description}
              </p>

              <a href="#waitlist" className={`inline-flex items-center gap-2 font-semibold ${benefit.textColor} hover:opacity-70 transition-opacity mt-auto`}>
                Know more
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}