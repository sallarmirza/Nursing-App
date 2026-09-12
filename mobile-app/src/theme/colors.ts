// theme/colors.ts

export const colors = {
  // Backgrounds
  background: "#F4F3F3",       // main screen bg (dashboard, login, signup)
  backgroundAlt: "#F3EFEF",    // secondary screen bg (patients, notes, calculators)
  white: "#FFFFFF",            // cards, inputs, header bars

  // Text
  textPrimary: "#000000",
  textHeading: "#1F2937",      // card titles, section headers
  textSecondary: "#6B7280",    // subtitles, meta text
  textMuted: "#8E8D8A",        // placeholders on light bg, dividers text
  textFaint: "#9CA3AF",        // least prominent meta (sub-meta, placeholders)
  placeholder: "#C4B5FD",      // input placeholder / unfilled value text (lavender)
  inputValue: "#8B5CF6",       // filled input text on some calculator screens

  // Brand / actions
  primary: "#1D9BF0",          // primary buttons, active states, links
  primaryAlt: "#2089DC",       // login/signup buttons, links (slightly different blue)
  accent: "#A78BFA",           // avatar icon tint
  accentBg: "#EDE9FE",         // avatar circle background

  // Status
  success: "#16A34A",
  successBg: "#DCFCE7",
  successAlt: "#10B981",       // modal checkmark circle
  danger: "#DC2626",
  dangerAlt: "#EF4444",        // alerts, overdue status, draft badge text
  warning: "#84CC16",          // "IV Bag Low" status

  // Borders / dividers
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  divider: "#D0D0D0",

  // Misc UI
  badgeNeutralBg: "#E5E7EB",   // discharged/neutral badge
  overlay: "rgba(0,0,0,0.4)",  // modal backdrop
} as const;

export type ColorKey = keyof typeof colors;