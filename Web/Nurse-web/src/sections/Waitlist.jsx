import { useState } from 'react';
import logoWhite from '../assets/nursing-app-logo-white.png'; // Import white logo

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section id="waitlist" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-brand-blue rounded-[2.5rem] py-16 px-6 md:px-16 text-center flex flex-col items-center shadow-xl relative overflow-hidden">
          
          {/* White Logo for Blue Background */}
          <img src={logoWhite} alt="DNA Logo" className="h-16 w-auto object-contain mb-6" />

          <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 text-white text-xs font-bold tracking-wider uppercase mb-6">
            Early Access
          </span>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Be the First to Experience <br className="hidden md:block"/> DNA
          </h2>
          
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Get early access to the Digital Nursing Assistant app, exclusive updates, and launch news delivered straight to your inbox.
          </p>

          <div className="w-full max-w-xl h-16 flex items-center justify-center">
            {status === 'success' ? (
              <div className="bg-white/10 border border-white/20 text-white px-6 py-4 rounded-full flex items-center gap-3 animate-fade-in">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span className="font-semibold">You're on the list! We'll be in touch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-full shadow-lg">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="grow px-6 py-3 rounded-full text-text-dark focus:outline-none bg-transparent placeholder:text-gray-400 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-brand-blue text-white font-semibold px-8 py-3 rounded-full hover:bg-brand-hover transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center min-w-35"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : "Join Waitlist"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}