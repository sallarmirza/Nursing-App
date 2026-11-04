import SectionHeader from "../components/ui/SectionHeader";

// Team: edit this array only. Photos are optional; initials are shown without one.
// For a photo: import ph from "../assets/team/name.jpg" and set `photo: ph`.
// TODO: replace the placeholder entries with the real team.
const TEAM = [
  { name: "Team member name", role: "Role, e.g. Mobile developer", photo: "", links: [{ label: "LinkedIn", href: "#" }] },
  { name: "Team member name", role: "Role, e.g. Backend developer", photo: "", links: [{ label: "GitHub", href: "#" }] },
  { name: "Team member name", role: "Role, e.g. UI designer", photo: "", links: [] },
  { name: "Supervisor name", role: "Project supervisor", photo: "", links: [] },
];

// Two-letter initials for the photo fallback
const initials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function Team() {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="The people who built DNA"
          subtitle="DNA was designed and built to make a nurse's shift easier. Say hello, or send feedback below."
        />

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {TEAM.map((p, i) => (
            <li key={`${p.name}-${i}`} className="flex flex-col items-start">
              {/* Photo, or initials on a brand tint */}
              {p.photo ? (
                <img
                  src={p.photo}
                  alt={p.name}
                  loading="lazy"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mb-4"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-light text-brand-blue flex items-center justify-center text-2xl font-bold mb-4"
                >
                  {initials(p.name)}
                </div>
              )}

              <h3 className="text-lg font-bold text-text-dark">{p.name}</h3>
              <p className="text-text-muted text-sm mb-2">{p.role}</p>

              {p.links.length > 0 && (
                <div className="flex gap-3 text-sm">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-blue font-semibold hover:underline underline-offset-2"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}