import LegalLayout from "../components/layout/LegalLayout";

// Terms of Service: renamed to DNA, with the medical disclaimer first.
// DRAFT: have it reviewed before launch.
export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="November 2026">
      <p>
        By downloading or using the Digital Nursing Assistant (DNA), you agree to
        these terms. If you do not agree, please do not use DNA.
      </p>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">1. Medical disclaimer</h2>
        <p>
          DNA provides tools for clinical documentation and calculations. It does
          not replace professional judgement. Always verify doses, drip rates and
          clinical decisions against your hospital protocol before acting.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">2. Getting the app</h2>
        <p>
          DNA is distributed as an APK from this website. Download it only from
          this page. We cannot vouch for copies from other sources.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">3. Your responsibilities</h2>
        <p className="mb-4">You are responsible for your account and everything done under it. You agree to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Give accurate information when you create an account.</li>
          <li>Keep your password secure.</li>
          <li>Tell us straight away if you think someone else used your account.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">4. Limitation of liability</h2>
        <p>
          To the extent the law allows, the DNA team is not liable for indirect,
          incidental or consequential damages that result from using the app.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">5. Changes</h2>
        <p>
          We may update these terms as DNA changes. The date at the top shows when
          they were last updated.
        </p>
      </div>
    </LegalLayout>
  );
}