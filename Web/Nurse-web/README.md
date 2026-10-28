# DNA - Digital Nursing Assistant (Landing Page)

This repository contains the official marketing and early-access landing page for the **DNA (Digital Nursing Assistant)** mobile app. 

The goal of this site is to showcase the app's features to nurses, collect early-access emails via a waitlist, and eventually serve as a direct distribution platform for the Android APK.

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite` plugin)
- **Routing:** React Router DOM (v6)
- **Language:** JavaScript (JSX)

## ✅ What Has Been Done (Current Progress)

- **Project Setup:** Vite + React initialized, Tailwind v4 configured with custom theme tokens (`brand-blue`, `bg-beige`, etc.).
- **Reusable UI Components:** Created `Button`, `Badge`, `SectionHeader`, and `Card` components.
- **Layout & Sections:**
  - **Navbar:** Sticky, responsive with a functional mobile hamburger menu and smooth scrolling links.
  - **Hero:** High-impact headline, review badge, and CTAs.
  - **Features (Core Services):** 2x2 grid with full-bleed images and custom expanding hover cards that reveal detailed CTAs.
  - **Why Choose DNA:** Pastel-colored cards with custom "cutout" shapes for the "Know more" links.
  - **How It Works:** Alternating 3-step process explaining the app's workflow.
  - **FAQ:** Interactive accordion answering common questions about the app's launch and security.
  - **Waitlist CTA:** Solid blue section with a simulated email capture form (loading and success states included).
  - **Footer:** Clean, multi-column footer with relevant links and contact info.
- **Legal Pages:** Fully routed Privacy Policy (`/privacy`) and Terms of Service (`/terms`) pages using a custom `LegalLayout` component.
- **Branding:** Integrated custom blue and white logos and changed project name to "DNA".

## 📂 Folder Structure

```
src/
├── assets/          # Logos (blue and white)
├── components/      # Reusable components
│   ├── layout/      # Navbar, Footer, LegalLayout
│   └── ui/          # Button, Card, Badge, SectionHeader
├── pages/           # Full pages (PrivacyPolicy, TermsOfService)
├── sections/        # Landing page sections (Hero, Features, FAQ, etc.)
├── App.jsx          # Main landing page assembly
├── index.css        # Tailwind import and @theme configuration
└── main.jsx         # React Router setup and app entry point
```
Future Roadmap (Iterations)
App Screens Showcase: Add a section with 3D phone mockups displaying actual screenshots of the React Native (Expo) app.

SEO & Analytics: Add robots.txt, sitemap.xml, Open Graph meta tags, and Google Analytics.

Deployment: Deploy to Vercel or Cloudflare Pages (handling React Router fallback configurations).

APK Distribution: Once the React Native app is built, add a "Download for Android" button that directly serves the .apk file (bypassing the Play Store for early adopters).