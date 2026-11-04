import Button from "../components/ui/Button";
import PhoneFrame from "../components/ui/PhoneFrame";
import { SITE } from "../config/site";

// Hero: the page's first job is getting the APK into the visitor's hands.
// Left: headline + download action + file facts. Right: phone with a real screen.
const HERO_SCREENSHOT = ""; // e.g. import dashboardShot from "../assets/shots/dashboard.png"

export default function Hero() {
  const { apk } = SITE;

  return (
    <section id="top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <div className="bg-bg-soft rounded-[2.5rem] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 p-8 sm:p-12 lg:p-16">
          {/* Left: message + action */}
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-[1.1] mb-6">
              Your ward notes, handovers and dose checks in one Android app
            </h1>

            <p className="text-lg text-text-muted mb-8 max-w-lg leading-relaxed">
              DNA keeps patient records, SOAP and SBAR notes, and dosage and IV
              drip calculators on your phone. Download it directly and install
              it in a few minutes.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              {apk.available ? (
                <Button href={apk.url} download className="px-8 py-3.5 text-base">
                  Download APK
                </Button>
              ) : (
                <Button href="#feedback" variant="primary" className="px-8 py-3.5 text-base">
                  Get notified at launch
                </Button>
              )}
              <Button href="#features" variant="secondary" className="px-8 py-3.5 text-base">
                See features
              </Button>
            </div>

            {apk.available ? (
              <>
                <p className="text-sm text-text-muted">
                  Version {apk.version} · {apk.size} · {apk.minAndroid}
                </p>
                <p className="text-sm text-text-muted mt-1">
                  Not on the Play Store yet, so you install the APK file directly.
                </p>
              </>
            ) : (
              <p className="text-sm text-text-muted">
                Android {apk.minAndroid} · Free · APK download coming soon
              </p>
            )}
          </div>

          {/* Right: phone with a real screen */}
          <div className="flex justify-center">
            <PhoneFrame src={HERO_SCREENSHOT} alt="DNA dashboard screen" priority />
          </div>
        </div>
      </div>
    </section>
  );
}