import { Link } from 'react-router-dom';
import logoBlue from '../../assets/nursing-app-logo-blue.png'; // Import the logo

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100 flex flex-col justify-between min-h-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Logo & Contact Info */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <img src={logoBlue} alt="DNA Logo" className="h-9 w-auto object-contain" />
              <span className="text-2xl font-bold text-text-dark tracking-tight">DNA</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-md">
              Digital Nursing Assistant. Empowering nurses with digital tools to enhance patient care,
              streamline documentation, and ensure safety.
            </p>
            <div className="text-text-muted text-sm space-y-2">
              <p>support@dna-app.com</p>
            </div>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold text-text-dark mb-4 tracking-wide text-sm uppercase">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><a href="#features" className="hover:text-brand-blue transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-brand-blue transition-colors">How it Works</a></li>
              <li><a href="#about" className="hover:text-brand-blue transition-colors">About</a></li>
              <li><a href="#faq" className="hover:text-brand-blue transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold text-text-dark mb-4 tracking-wide text-sm uppercase">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><a href="#waitlist" className="hover:text-brand-blue transition-colors">Join Waitlist</a></li>
              <li><Link to="/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>© {new Date().getFullYear()} Digital Nursing Assistant (DNA). All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-text-dark transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-text-dark transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}