// Footer on the original brand blue. Hash links scroll the home page;
// legal links use router <Link> (Footer renders inside RouterProvider via App).
import { Link } from "react-router-dom";
import logoWhite from "../../assets/nursing-app-logo-white.png";
import { SITE } from "../../config/site";

// Higher opacity than before so small text stays readable on bright blue
const linkClass = "text-white/85 hover:text-white transition-colors";

export default function Footer() {
  return (
    <footer className="bg-brand-blue text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand + contact */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <img src={logoWhite} alt="" className="h-9 w-auto object-contain" />
              <span className="text-2xl font-bold tracking-tight">{SITE.short}</span>
            </div>
            <p className="text-white/85 text-sm leading-relaxed mb-6 max-w-md">
              {SITE.name}. Digital tools that help nurses document care, hand over
              shifts, and calculate doses safely.
            </p>
            <a href={`mailto:${SITE.email}`} className={`text-sm ${linkClass}`}>
              {SITE.email}
            </a>
          </div>

          {/* Get the app */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold mb-4 text-sm">Get the app</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#download" className={linkClass}>Download APK</a></li>
              <li><a href="#install" className={linkClass}>Install guide</a></li>
              <li><a href="#features" className={linkClass}>Features</a></li>
              <li><a href="#how-it-works" className={linkClass}>How it works</a></li>
            </ul>
          </div>

          {/* About + legal */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold mb-4 text-sm">About</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className={linkClass}>Why DNA</a></li>
              <li><a href="#team" className={linkClass}>Team</a></li>
              <li><a href="#faq" className={linkClass}>FAQ</a></li>
              <li><a href="#feedback" className={linkClass}>Send feedback</a></li>
              <li><Link to="/privacy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={linkClass}>Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="py-8 border-t border-white/25 text-sm text-white/85">
          <p>© {new Date().getFullYear()} {SITE.name} ({SITE.short}). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}