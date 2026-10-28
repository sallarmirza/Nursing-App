import { useState } from "react";
import { Link } from "react-router-dom"; // Make sure to import Link
import Button from "../ui/Button";
import logoBlue from "../../assets/nursing-app-logo-blue.png"; // Import the logo

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = ["Features", "How it Works", "FAQ"];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoBlue}
              alt="DNA Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col justify-center">
              <span className="text-[1.4rem] font-black text-text-dark tracking-tighter leading-none">
                DNA
              </span>
              <span className="text-[9px] font-bold text-gray-500 tracking-[0.2em] uppercase mt-0.5">
                Digital Nursing Assistant
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-text-muted hover:text-brand-blue transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <a href="#waitlist">
              <Button variant="primary" className="px-6 py-2.5">
                Join Waitlist
              </Button>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-dark text-2xl p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="flex flex-col px-4 py-6 gap-6">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-text-dark hover:text-brand-blue transition-colors"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <a href="#waitlist" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full py-3">
                  Join Waitlist
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
