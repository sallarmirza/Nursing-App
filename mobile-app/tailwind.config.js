/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        primaryAlt: "rgb(var(--color-primary-alt) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        backgroundAlt: "rgb(var(--color-background-alt) / <alpha-value>)",
        textPrimary: "rgb(var(--color-text-primary) / <alpha-value>)",
        textSecondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        dangerAlt: "rgb(var(--color-danger-alt) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};