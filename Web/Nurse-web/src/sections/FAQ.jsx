import { useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";

// FAQ: same accordion as before, with questions rewritten for installing
// and trusting an APK. First item starts open.
const FAQS = [
  {
    question: "Why isn't DNA on the Play Store?",
    answer:
      "DNA is releasing as an APK first so nurses can start using it now. Play Store and App Store versions are planned for later.",
  },
  {
    question: "Is it safe to install an APK?",
    answer:
      "Install it only from this page. If a SHA-256 checksum is shown in the download section, you can compare it with your downloaded file to confirm it has not been changed.",
  },
  {
    question: "Play Protect blocked the install. What now?",
    answer:
      "Play Protect can flag apps that are not on the Play Store. Tap More details, then Install anyway. The steps are in the install guide above.",
  },
  {
    question: "Does DNA work on iPhone?",
    answer:
      "Not yet. This release is for Android 8.0 and newer. An iPhone version is planned after the Android release.",
  },
  {
    question: "Do I need an internet connection?",
    answer:
      "Yes, for now. DNA needs a connection to sign you in and save your records. Working offline is planned for a later update.",
  },
  {
    question: "How is patient data protected?",
    answer:
      "You sign in with your own nurse account, and records are tied to that account. Always follow your hospital's policy on handling patient information.",
  },
  {
    question: "Can I rely on the calculators?",
    answer:
      "They are there to speed up your work, not to replace your judgement. Always double-check doses and drip rates against your protocol before giving medication.",
  },
];

export default function FAQ() {
  // Index of the open item (-1 = all closed)
  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

  return (
    <section id="faq" className="py-24 bg-brand-blue">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Questions before you install" inverted />

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <h3 className="text-lg font-semibold text-text-dark">{faq.question}</h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-text-muted"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div id={`faq-answer-${i}`} className="px-6 pb-6 text-text-muted leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}