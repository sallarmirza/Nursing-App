import SectionHeader from "../components/ui/SectionHeader";

// Team: edit the TEAM array only. Photos are optional; initials show without one.
// For a photo: import ph from "../assets/team/name.jpg" and set `photo: ph`.
// Links with href "#" are hidden until a real URL is added.
const TEAM = [
  {
    name: "Haseeb Abbasi",
    role: "Clinical Co-Founder",
    photo: "/haseeb-img.png",
    email: "ha5599248@gmail.com",
    links: [{ label: "LinkedIn", href: "#" }],
  },
  {
    name: "Salar Ahmed Mirza",
    role: "Developer",
    photo: "/salar-img.png",
    email: "sallarmirza77@gmail.com",
    links: [{ label: "GitHub", href: "#" }],
  },
];

// Small line icons for known link types (inline SVG, no extra package)
const iconProps = {
  width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
  "aria-hidden": true,
};
const ICONS = {
  linkedin: (
    <svg {...iconProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  github: (
    <svg {...iconProps}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
};
const MailIcon = (
  <svg {...iconProps}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// Two-letter initials for the photo fallback
const initials = (name) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function Team() {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="center"
          title="The people who built DNA"
          subtitle="DNA was designed and built to make a nurse's shift easier. Say hello, or send feedback below."
        />

        {/* Centered row; stays centered for any team size */}
        <ul className="flex flex-wrap justify-center gap-6">
          {TEAM.map((p, i) => {
            const links = p.links.filter((l) => l.href && l.href !== "#");

            return (
              <li
                key={`${p.name}-${i}`}
                className="w-full sm:w-80 flex flex-col items-center text-center bg-white border border-gray-200 rounded-2xl px-8 pt-10 pb-8"
              >
                {/* Photo, or initials on a brand tint */}
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.name}
                    loading="lazy"
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-brand-light mb-5"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-28 h-28 rounded-full bg-brand-light text-brand-blue ring-4 ring-brand-light/60 flex items-center justify-center text-3xl font-bold mb-5"
                  >
                    {initials(p.name)}
                  </div>
                )}

                <h3 className="text-xl font-bold text-text-dark leading-snug">{p.name}</h3>
                <p className="text-brand-blue text-sm font-semibold mt-1">{p.role}</p>

                {/* Contact: email text + icon buttons, under a thin divider */}
                <div className="w-full mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                  {p.email && (
                    <a
                      href={`mailto:${p.email}`}
                      className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-blue transition-colors break-all"
                    >
                      {MailIcon}
                      {p.email}
                    </a>
                  )}

                  {links.length > 0 && (
                    <div className="flex gap-2">
                      {links.map((l) => {
                        const icon = ICONS[l.label.toLowerCase()];
                        return (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${p.name} on ${l.label}`}
                            title={l.label}
                            className="h-10 min-w-10 px-3 inline-flex items-center justify-center rounded-lg border border-gray-200 text-text-muted text-sm font-semibold hover:text-brand-blue hover:border-brand-blue transition-colors"
                          >
                            {icon || l.label}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}