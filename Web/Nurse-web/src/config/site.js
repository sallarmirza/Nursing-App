// Single source of truth for site-wide facts.
// Navbar, Hero, Download band and Footer all read from here.
// TODO: replace the placeholder APK values before launch.
export const SITE = {
  name: "Digital Nursing Assistant",
  short: "DNA",
  email: "ha5599248@gmail.com",
  apk: {
    // Set available: true and fill url/sha256 when the APK is ready to ship.
    available: false,
    url: "",
    version: "1.0.0",
    size: "42 MB",
    minAndroid: "Android 8.0+",
    sha256: "",
    updated: "Coming soon",
  },
};