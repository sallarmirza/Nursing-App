import { useState } from "react";
import Button from "../components/ui/Button";
import { SITE } from "../config/site";

// Download band on the original brand blue. Shows exactly what the visitor
// is getting, plus an optional SHA-256 so careful users can verify the file.
export default function Download() {
  const { apk } = SITE;
  const [copied, setCopied] = useState(false);

  // Copy the checksum; fail quietly if the browser blocks clipboard access
  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(apk.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the hash stays selectable on screen */
    }
  };

  const rows = [
    ["Version", apk.version],
    ["File size", apk.size],
    ["Requires", apk.minAndroid],
    ["Last updated", apk.updated],
  ];

  return (
    <section id="download" className="py-24 bg-brand-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: action */}
        <div>
          <h2 className="text-3xl md:text-4xl mb-4">Download DNA for Android</h2>
          <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-md">
            One file, free to install. Follow the install guide above if this is
            your first time installing an APK.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href={apk.url} download variant="light" className="px-8 py-3.5 text-base">
              Download APK
            </Button>
            <Button href="#install" variant="ghostLight" className="px-8 py-3.5 text-base">
              Install guide
            </Button>
          </div>
        </div>

        {/* Right: file details */}
        <dl className="bg-white/10 border border-white/25 rounded-3xl p-6 sm:p-8 divide-y divide-white/20">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3 first:pt-0">
              <dt className="text-white/80">{label}</dt>
              <dd className="font-semibold">{value}</dd>
            </div>
          ))}

          {/* Checksum row only appears when a hash is set in site.js */}
          {apk.sha256 && (
            <div className="py-3 last:pb-0">
              <dt className="text-white/80 mb-2">SHA-256 checksum</dt>
              <dd className="flex items-start gap-3">
                <code className="text-xs break-all text-white grow">{apk.sha256}</code>
                <button
                  onClick={copyHash}
                  className="shrink-0 text-sm font-semibold text-white border border-white/40 rounded-full px-4 py-1.5 hover:bg-white/10"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}