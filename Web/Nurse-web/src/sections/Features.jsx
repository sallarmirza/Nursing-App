import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import PhoneFrame from "../components/ui/PhoneFrame";

// Features: pick a feature on the left, see its real app screen on the right.
// Replace each `shot` with an imported screenshot, e.g.
// import soapShot from "../assets/shots/soap.png"
const FEATURES = [
  {
    title: "Patient records",
    description:
      "Register patients, assign them to your care, and keep vitals and clinical history in one place that only you can access.",
    shot: "",
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
    shot: "",
  },
  {
    title: "Dosage and IV drip calculators",
    description:
      "Work out doses and drip rates with the built-in calculators. Every result is saved to a log so you can check it later.",
    shot: "",
  },
];

export default function Features() {
  const [active, setActive] = useState(0);
  const current = FEATURES[active];

  return (
    <section id="features" className="py-24 bg-bg-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Built around a nurse's shift"
          subtitle="Four tools for the work you repeat every day. Pick one to see its screen."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: feature list (the user's click is what changes the phone) */}
          <ul className="flex flex-col gap-3">
            {FEATURES.map((f, i) => {
              const isActive = i === active;
              return (
                <li key={f.title}>
                  <button
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`w-full text-left rounded-3xl p-6 transition-colors ${
                      isActive
                        ? "bg-white shadow-sm border border-brand-blue/30"
                        : "border border-transparent hover:bg-white/60"
                    }`}
                  >
                    <h3 className={`text-xl font-bold mb-1 ${isActive ? "text-brand-blue" : "text-text-dark"}`}>
                      {f.title}
                    </h3>
                    {/* Description is shown for the selected feature only */}
                    {isActive && (
                      <p className="text-text-muted leading-relaxed mt-2">{f.description}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right: the selected screen */}
          <div aria-live="polite">
            <PhoneFrame src={current.shot} alt={`${current.title} screen in the DNA app`} />
          </div>
        </div>
      </div>
    </section>
  );
}