import SectionHeader from "../components/ui/SectionHeader";
import Button from "../components/ui/Button";
import { SITE } from "../config/site";

// Install guide: the one numbered sequence on the page, because each step
// depends on the one before it. Plain list, thin dividers, no decoration.
const STEPS = [
  {
    title: "Download the APK",
    body: "Tap Download APK. If Chrome warns that this type of file can harm your device, choose Keep or Download anyway.",
  },
  {
    title: "Allow installs from your browser",
    body: "When you open the file, Android asks for permission. Tap Settings, turn on Allow from this source, then go back. You can turn it off again after DNA is installed.",
  },
  {
    title: "Open the file and tap Install",
    body: "Open the file from the download notification or your Downloads folder, then tap Install.",
  },
  {
    title: "If Play Protect shows a warning",
    body: "Play Protect may flag DNA because it is not on the Play Store yet. Tap More details, then Install anyway.",
  },
  {
    title: "Open DNA and sign in",
    body: "Tap Open, then create your nurse account or sign in.",
  },
];

export default function Install() {
  return (
    <section id="install" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left: heading + action */}
        <div className="lg:col-span-4">
          <SectionHeader
            title="Install DNA in five steps"
            subtitle="It takes about two minutes. Menu names can differ slightly between phone brands."
          />
          {SITE.apk.available ? (
            <Button href={SITE.apk.url} download>
              Download APK
            </Button>
          ) : (
            <Button href="#feedback">
              Get notified at launch
            </Button>
          )}
        </div>

        {/* Right: steps, separated by thin lines */}
        <div className="lg:col-span-8">
          <ol className="divide-y divide-gray-100 border-y border-gray-100">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-6 py-6 sm:py-8">
                <span className="w-9 h-9 shrink-0 rounded-xl bg-brand-blue text-white flex items-center justify-center font-bold text-base leading-none">
                  {i + 1}
                </span>
                <div className="max-w-xl">
                  <h3 className="text-xl font-bold text-text-dark mb-2">{step.title}</h3>
                  <p className="text-text-muted leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* One quiet line instead of a coloured warning box */}
          <p className="mt-6 text-sm text-text-muted">
            Only install DNA from this page. To update, download the newest APK
            and install it over the current app.
          </p>
        </div>
      </div>
    </section>
  );
}