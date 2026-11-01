# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + Vite + Tailwind CSS v4. The web project lives at `Web/Nurse-web/`. The real product is the React Native mobile app (`mobile-app/`); this site is the marketing and download surface for it.

## Users

Registered nurses doing shift work in hospital wards and clinical settings. They work in environments with unstable internet and need tools that reduce medication errors and documentation overhead at the bedside. Secondary audience: nursing students and healthcare administrators evaluating the app.

## Product Purpose

DNA (Digital Nursing Assistant) is a mobile app that puts patient records, SBAR handovers, SOAP notes, medication management, and backend-verified dosage and IV drip-rate calculations in one secure place. The web site serves three jobs: (1) introduce the product, (2) let nurses download the APK directly, (3) collect waitlist sign-ups and early feedback from nurses who want to shape the roadmap.

## Positioning

All-in-one clinical companion that works without reliable internet, with backend-verified calculations that produce immutable audit logs — reducing medication errors while keeping nurses off paper.

## Operating Context

Nurses use the app on shift in wards, ICUs, and clinics. Internet is often unstable in hospitals. The app must never log a nurse out due to a network error. Calculations (dosage, IV drip rate) are safety-critical and stay server-side. The landing page is visited on desktops and mobile devices by nurses researching or being referred by colleagues.

## Capabilities and Constraints

- Patient records, vitals, SOAP notes, SBAR handovers, medications, dosage and drip calculations
- JWT-protected endpoints; nurse_id scoping on all data
- UUID primary keys; hex-prefix IDs on audit tables
- SQLite now, PostgreSQL migration planned
- Offline sync (local SQLite + queued writes) on the roadmap
- APK release first; App Store / Play Store later
- The Streamlit dashboard is internal-only and not exposed to users
- No pricing model confirmed yet

## Brand Commitments

- Name: DNA / Digital Nursing Assistant (both forms in use; "DNA" is the short identity)
- Color: brand-blue is the confirmed primary; exact hex lives in Tailwind config
- Logo: two variants confirmed — blue logo (`nursing-app-logo-blue.png`) and white logo (`nursing-app-logo-white.png`)
- Support contact: support@dna-app.com

## Evidence on Hand

- No real testimonials or case studies yet; "4.9 — Trusted by Nurses" badge in Hero is aspirational copy, not verified data
- Unsplash placeholder images throughout; real product screenshots not yet available
- Waitlist sign-up form exists but currently uses a simulated submit (no backend integration)

## Product Principles

1. **Safety first.** Calculation accuracy and audit trails are non-negotiable; no feature ships that risks medication errors.
2. **Resilience over connectivity.** The app degrades gracefully; nurses are never locked out because the hospital Wi-Fi dropped.
3. **Built around real workflows.** Every screen maps to something nurses already do — SBAR, SOAP, vitals, handover — not an abstraction invented by software.
4. **Simplicity under pressure.** Nurses are mid-shift, time-pressed, sometimes stressed; the UI must be scannable and fast.
5. **Trust through transparency.** Audit logs, JWT identity, and nurse_id scoping exist because clinical accountability matters.
