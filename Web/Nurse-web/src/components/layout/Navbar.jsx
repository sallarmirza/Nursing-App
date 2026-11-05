import { useEffect, useState } from "react";
import Button from "../ui/Button";
import logoBlue from "../../assets/nursing-app-logo-blue.png";
import { SITE } from "../../config/site";

const CTA_HREF = SITE.apk.available ? "#download" : "#feedback";
const CTA_LABEL = SITE.apk.available ? "Download APK" : "Get notified";

// Anchor targets match the section ids used on the home page.
const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Install", href: "#install" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo: links back to the top of the page */}
          <a href="#top" className="flex items-center gap-3" aria-label={`${SITE.name} home`}>
            <img src={logoBlue} alt="" className="h-10 w-auto object-contain" />
            <span className="flex flex-col justify-center">
              <span className="text-[1.4rem] font-black text-text-dark tracking-tighter leading-none">
                {SITE.short}
              </span>
              <span className="text-xs font-medium text-text-muted mt-0.5">
                {SITE.name}
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex gap-8" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-text-muted hover:text-brand-blue transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button href={CTA_HREF} className="px-6 py-2.5">
              {CTA_LABEL}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-menu"
              className="text-text-dark text-2xl p-3 rounded-md"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          id="mobile-nav-menu"
          className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg"
        >
          <nav className="flex flex-col px-4 py-6 gap-6" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-text-dark hover:text-brand-blue transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <Button href={CTA_HREF} onClick={() => setOpen(false)} className="w-full py-3">
                {CTA_LABEL}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}