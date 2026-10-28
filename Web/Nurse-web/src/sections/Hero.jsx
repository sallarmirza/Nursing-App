import Button from '../components/ui/Button';

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      {/* Outer container with light background and rounded corners */}
      <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center p-10 lg:p-16 xl:p-20 z-10">
            
            {/* Review Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm w-fit mb-8 border border-gray-100">
              <span className="text-brand-blue text-lg">★</span>
              <span className="text-sm font-semibold text-text-dark">4.9 (Trusted by Nurses)</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-text-dark leading-[1.1] mb-6">
              Empowering Nurses, <br className="hidden lg:block"/> Enhancing Care
            </h1>

            {/* Subtext */}
            <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">
              Streamline your workflow with digital clinical records, SBAR handovers, and accurate dosage calculations—all in one secure, intuitive app.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" className="px-8 py-3.5 text-base">Get Started</Button>
              <Button variant="secondary" className="px-8 py-3.5 text-base">Learn More</Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-64 lg:h-auto">
            {/* Placeholder image from Unsplash. You can replace this with your own asset later */}
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" 
              alt="Nurse smiling" 
              className="absolute inset-0 w-full h-full object-cover object-center lg:rounded-l-[2.5rem]"
            />
            {/* Subtle gradient overlay to blend image with background on desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-transparent hidden lg:block w-32"></div>
          </div>

        </div>
      </div>
    </section>
  );
}