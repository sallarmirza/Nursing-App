import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import PhoneFrame from "../components/ui/PhoneFrame";
import nursingnote from "../assets/shots/nursing_note.webp";

// Add more screenshots by dropping them in public/ and setting the shot value to "/filename.ext"
const FEATURES = [
  {
    title: "Patient records",
    description:
      "Register patients, assign them to your care, and keep vitals and clinical history in one place that only you can access.",
    shot: "/dna-dashboard.png",
  },
  {
    title: "SOAP notes",
    description:
      "Write structured Subjective, Objective, Assessment and Plan notes, and review a patient's note history at any time.",
    shot: "",
  },
  {
    title: "SBAR handovers",
    description:
      "Hand over the shift with Situation, Background, Assessment and Recommendation, including current IV medications.",
    shot: nursingnote,
  },
  {
    title: "Dosage and IV drip calculators",
    description:
      "Work out doses and drip rates with the built-in calculators. Every result is saved to a log so you can check it later.",
    shot: "/dna-dosage.png",
  },
];

export default function Features() {
  // Start on the first feature that has a real screenshot
  const [active, setActive] = useState(() => Math.max(0, FEATURES.findIndex((f) => f.shot)));

  return (
    <section id="features" className="py-24 bg-bg-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Built around a nurse's shift"
          subtitle="Four tools for the work you repeat every day. Pick one to see its screen."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: feature rows */}
          <ul className="border-t border-gray-200">
            {FEATURES.map((f, i) => {
              const isActive = i === active;
              return (
                <li key={f.title} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="group relative w-full text-left py-6 pl-6 pr-2"
                  >
                    {/* Marker bar: grows in on hover (grey) and when selected (blue) */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-6 bottom-6 w-0.5 rounded-full origin-center transition-[transform,background-color] duration-300 ease-out ${
                        isActive
                          ? "bg-brand-blue scale-y-100"
                          : "bg-gray-300 scale-y-0 group-hover:scale-y-100"
                      }`}
                    />
                    <h3
                      className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
                        isActive ? "text-text-dark" : "text-text-muted group-hover:text-text-dark"
                      }`}
                    >
                      {f.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed max-w-md">{f.description}</p>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right: all screens stacked; the selected one fades in.
              On phones this sits above the list so the change is visible. */}
          <div className="order-first lg:order-0 grid place-items-center">
            {FEATURES.map((f, i) => (
              <figure
                key={f.title}
                aria-hidden={i !== active}
                style={{ gridArea: "1 / 1" }}
                className={`flex flex-col items-center gap-4 transition-opacity duration-300 ease-out ${
                  i === active ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <PhoneFrame src={f.shot} alt={`${f.title} screen in the DNA app`} />
                <figcaption className="text-sm text-text-muted">{f.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
