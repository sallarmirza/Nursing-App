
import SectionHeader from "../components/ui/SectionHeader";

// Team: edit the TEAM array only.
// photo: path in /public (e.g. "/name.png") or an imported image; initials show without one.
// icon: "clinical" | "code" picks the small tile above the name.
// bio: one or two short sentences. TODO: replace the placeholder bios with real ones.
// Links with href "#" are hidden until a real URL is added.
const TEAM = [
  {
    name: "Haseeb Abbasi",
    role: "Clinical Co-Founder",
    photo: "/haseeb-img.png",
    icon: "clinical",
    bio: "The clinical visionary behind DNA. Haseeb leads the clinical side, validating every workflow against real-world ward practices.",
    email: "ha5599248@gmail.com",
    links: [{ label: "LinkedIn", href: "#" }],
  },
  {
    name: "Salar Ahmed Mirza",
    role: "Developer",
    photo: "/salar-img.png",
    icon: "code",
    bio: "Developer behind DNA. Designed, built, and maintaining complete application flow, backend systems, and platform website.",
    email: "sallarmirza77@gmail.com",
    links: [{ label: "GitHub", href: "#" }],
  },
];

// Small line icons (inline SVG, no extra package)
const svgProps = {
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
};
const TILE_ICONS = {
  clinical: (
    <svg width="24" height="24" {...svgProps}>
      <path d="M11 2v2" />
      <path d="M5 2v2" />
      <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
      <path d="M8 15a6 6 0 0 0 12 0v-3" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
  code: (
    <svg width="24" height="24" {...svgProps}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
};
const LINK_ICONS = {
  linkedin: (
    <svg width="16" height="16" {...svgProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  github: (
    <svg width="16" height="16" {...svgProps}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
};
const MailIcon = (
  <svg width="16" height="16" {...svgProps}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// Round icon badge used for email and social links
const badge =
  "shrink-0 w-9 h-9 rounded-full bg-brand-light text-brand-blue inline-flex items-center justify-center";

// Two-letter initials for the photo fallback
const initials = (name) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function Team() {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="center"
          title="The people who built DNA"
          subtitle="DNA was designed and built to make a nurse's shift easier. Say hello, or send feedback below."
        />

        {/* Two cards per row on large screens, stacked below; centered for any team size */}
        <ul className="flex flex-wrap justify-center gap-6">
          {TEAM.map((p, i) => {
            const links = p.links.filter((l) => l.href && l.href !== "#");

            return (
              <li
                key={`${p.name}-${i}`}
                className="w-full lg:w-[calc(50%-0.75rem)] flex flex-col sm:flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                {/* Photo side: fills the card edge to edge, or initials on a brand tint */}
                <div className="sm:w-2/5 shrink-0 h-72 sm:h-auto sm:min-h-[22rem] bg-brand-light">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-full h-full flex items-center justify-center text-5xl font-bold text-brand-blue"
                    >
                      {initials(p.name)}
                    </div>
                  )}
                </div>

                {/* Details side */}
                <div className="flex flex-col p-6 sm:p-8 grow">
                  {p.icon && TILE_ICONS[p.icon] && (
                    <div className="w-12 h-12 rounded-xl bg-brand-light text-brand-blue flex items-center justify-center mb-5">
                      {TILE_ICONS[p.icon]}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-text-dark leading-snug">{p.name}</h3>
                  <p className="text-brand-blue font-semibold mt-1">{p.role}</p>

                  {p.bio && (
                    <p className="text-text-muted text-sm leading-relaxed mt-4">{p.bio}</p>
                  )}

                  {/* Contact pinned to the bottom of the card */}
                  <div className="mt-auto pt-6 flex flex-col gap-3">
                    {p.email && (
                      <a
                        href={`mailto:${p.email}`}
                        className="inline-flex items-center gap-3 text-sm text-text-muted hover:text-brand-blue transition-colors break-all"
                      >
                        <span className={badge}>{MailIcon}</span>
                        {p.email}
                      </a>
                    )}

                    {links.length > 0 && (
                      <div className="flex gap-2">
                        {links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${p.name} on ${l.label}`}
                            title={l.label}
                            className={`${badge} hover:bg-brand-blue hover:text-white transition-colors`}
                          >
                            {LINK_ICONS[l.label.toLowerCase()] || l.label[0]}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}