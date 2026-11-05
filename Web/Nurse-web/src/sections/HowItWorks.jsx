import SectionHeader from "../components/ui/SectionHeader";
import Button from "../components/ui/Button";

// How it works: original content, restyled.
// Left: the three original photos as one tidy mosaic.
// Right: the three steps as a static list with a rule and number tile.
const IMG = (id, w) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const steps = [
  {
    number: "1",
    title: "Register & Manage Patients",
    description:
      "Create secure profiles, assign patients to your care, and keep all clinical records and vitals in one place.",
    image: "photo-1576091160550-2173dba999ef",
  },
  {
    number: "2",
    title: "Document Notes & Vitals",
    description:
      "Log vitals, write SOAP notes, and track patient history seamlessly right from your mobile device.",
    image: "photo-1551076805-e1869033e561",
  },
  {
    number: "3",
    title: "Calculate & Handover",
    description:
      "Use dosage and IV drip calculators for precise medication management, then generate SBAR handovers instantly.",
    image: "photo-1584982751601-97dcc096659c",
  },
];

// Shared photo style: rounded, fills its grid cell
const Photo = ({ step, className = "" }) => (
  <img
    src={IMG(step.image, 1200)}
    srcSet={`${IMG(step.image, 640)} 640w, ${IMG(step.image, 1200)} 1200w`}
    sizes="(max-width: 1024px) 50vw, 25vw"
    alt={step.title}
    loading="lazy"
    decoding="async"
    className={`w-full h-full object-cover rounded-2xl ${className}`}
  />
);

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-brand-blue">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader align="center" title="Hassle-Free Shift Management" inverted />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left: photo mosaic (photo 1 tall, photos 2 and 3 stacked) */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-80 sm:h-96 lg:h-full lg:min-h-[460px]">
            <div className="row-span-2">
              <Photo step={steps[0]} />
            </div>
            <Photo step={steps[1]} />
            <Photo step={steps[2]} />
          </div>

          {/* Right: static steps */}
          <ol className="flex flex-col justify-center">
            {steps.map((step) => (
              <li key={step.number} className="relative flex items-start gap-5 pl-6 py-6">
                {/* White tile on blue background — inverts the number tile */}
                <span className="shrink-0 w-12 h-12 rounded-xl bg-white text-brand-blue flex items-center justify-center font-bold text-lg">
                  {step.number}
                </span>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-white/80 leading-relaxed max-w-md">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="#download" variant="light">Get Started</Button>
        </div>
      </div>
    </section>
  );
}