// Single source of truth for site-wide facts.
// Navbar, Hero, Download band and Footer all read from here.
// TODO: replace the placeholder APK values before launch.
export const SITE = {
  name: "Digital Nursing Assistant",
  short: "DNA",
  email: "ha5599248@gmail.com",
  apk: {
    url: "/downloads/dna.apk", // direct file link or release URL
    version: "1.0.0",
    size: "42 MB",
    minAndroid: "Android 8.0+",
    sha256: "", // optional, leave empty to hide the checksum row
    updated: "November 2026",
  },
};