// import Button from "../components/ui/Button";
// import PhoneFrame from "../components/ui/PhoneFrame";
// import { SITE } from "../config/site";
// import dashboardShot from "../assets/shots/dashboard.png";

// const HERO_SCREENSHOT = dashboardShot;
// export default function Hero() {
//   const { apk } = SITE;

//   return (
//     <section id="top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
//       <div className="bg-bg-soft rounded-[2.5rem] overflow-hidden">
//         <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 p-8 sm:p-12 lg:p-16">
//           {/* Left: message + action */}
//           <div className="flex flex-col">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-[1.1] mb-6">
//               Your ward notes, handovers and dose checks in one Android app
//             </h1>

//             <p className="text-lg text-text-muted mb-8 max-w-lg leading-relaxed">
//               DNA keeps patient records, SOAP and SBAR notes, and dosage and IV
//               drip calculators on your phone. Download it directly and install
//               it in a few minutes.
//             </p>

//             <div className="flex flex-wrap gap-4 mb-6">
//               {apk.available ? (
//                 <Button href={apk.url} download className="px-8 py-3.5 text-base">
//                   Download APK
//                 </Button>
//               ) : (
//                 <Button href="#feedback" variant="primary" className="px-8 py-3.5 text-base">
//                   Get notified at launch
//                 </Button>
//               )}
//               <Button href="#features" variant="secondary" className="px-8 py-3.5 text-base">
//                 See features
//               </Button>
//             </div>

//             {apk.available ? (
//               <>
//                 <p className="text-sm text-text-muted">
//                   Version {apk.version} · {apk.size} · {apk.minAndroid}
//                 </p>
//                 <p className="text-sm text-text-muted mt-1">
//                   Not on the Play Store yet, so you install the APK file directly.
//                 </p>
//               </>
//             ) : (
//               <p className="text-sm text-text-muted">
//                 Android {apk.minAndroid} · Free · APK download coming soon
//               </p>
//             )}
//           </div>

//           {/* Right: phone with a real screen */}
//           <div className="flex justify-center">
//             <PhoneFrame src={HERO_SCREENSHOT} alt="DNA dashboard screen" priority />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import Button from "../components/ui/Button";
import { SITE } from "../config/site";


// Background photo from Pexels, served at two sizes for phones and desktops.
// To self-host later: download it into src/assets/, import it, and use that.
const BG = "https://images.pexels.com/photos/37889383/pexels-photo-37889383.jpeg?auto=compress&cs=tinysrgb";
const BG_SRCSET = `${BG}&w=900 900w, ${BG}&w=1600 1600w`;

export default function Hero() {
  const { apk } = SITE;

  return (
    <section id="top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <div className="relative bg-brand-blue rounded-[2.5rem] overflow-hidden">
        {/* Background photo (decorative) */}
        <img
          src={`${BG}&w=1600`}
          srcSet={BG_SRCSET}
          sizes="(max-width: 1280px) 100vw, 1280px"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay: brand blue tint, heavier behind the text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-brand-blue/95 via-brand-blue/80 to-brand-blue/50"
        />

        {/* Content sits above the photo and overlay */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 p-8 sm:p-12 lg:p-16">
          {/* Left: message + action */}
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            The clinical co-pilot built by nurses, for nurses.
            </h1>

            <p className="text-lg text-white/85 mb-8 max-w-lg leading-relaxed">
              DNA keeps patient records, SOAP and SBAR notes, and dosage and IV
              drip calculators on your phone. Download it directly and install
              it in a few minutes.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              {apk.available ? (
                <Button href={apk.url} download variant="light" className="px-8 py-3.5 text-base">
                  Download APK
                </Button>
              ) : (
                <Button href="#feedback" variant="light" className="px-8 py-3.5 text-base">
                  Get notified at launch
                </Button>
              )}
              <Button href="#features" variant="ghostLight" className="px-8 py-3.5 text-base">
                See features
              </Button>
            </div>

            {apk.available ? (
              <>
                <p className="text-sm text-white/80">
                  Version {apk.version} · {apk.size} · {apk.minAndroid}
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Not on the Play Store yet, so you install the APK file directly.
                </p>
              </>
            ) : (
              <p className="text-sm text-white/80">
                {apk.minAndroid} · Free · APK download coming soon
              </p>
            )}
          </div>

          {/* Right: phone with a real screen
          <div className="flex justify-center">
            <PhoneFrame src={HERO_SCREENSHOT} alt="DNA dashboard screen" priority />
          </div> */}
        </div>
      </div>
    </section>
  );
}