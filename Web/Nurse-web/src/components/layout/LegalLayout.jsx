import { Link } from 'react-router-dom';

export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Top Header Area */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <Link 
            to="/" 
            className="inline-flex items-center text-brand-blue font-semibold text-sm hover:underline mb-6"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Text Content */}
          <div className="text-text-dark text-sm md:text-base leading-relaxed space-y-6">
            {children}
          </div>

          {/* Right Column: Illustration */}
          {/* Note: Replace the src with your own illustration later */}
          <div className="hidden lg:flex justify-center items-start sticky top-12">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
              alt="Data Privacy Illustration" 
              className="w-full max-w-md rounded-2xl object-cover shadow-sm border border-gray-100"
              // The image above is a placeholder. If you have an illustration, replace the URL.
            />
          </div>

        </div>
      </div>

    </div>
  );
}