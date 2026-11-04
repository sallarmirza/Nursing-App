import LegalLayout from "../components/layout/LegalLayout";

// Privacy Policy: renamed to DNA and matched to what the site and app do today.
// DRAFT: have it reviewed before launch, especially the patient data section.
export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="November 2026">
      <p>
        This policy explains what the Digital Nursing Assistant (DNA) website and
        app collect, and how we use it.
      </p>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">Information we collect</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="font-semibold">Feedback form:</strong> if you send
            feedback, we receive your message and the name and email you choose
            to include.
          </li>
          <li>
            <strong className="font-semibold">Account details:</strong> when you
            create a nurse account in the app, we store the details you enter to
            sign you in.
          </li>
          <li>
            <strong className="font-semibold">Records you enter:</strong> patient
            records, vitals, notes and calculation logs that you add in the app
            are stored against your account.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">How we use it</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide, run and maintain the app and this website.</li>
          <li>To reply to your feedback and fix problems.</li>
          <li>To improve DNA and plan new features.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">Patient information</h2>
        <p>
          Only enter patient information that your hospital policy allows you to
          store in DNA. Records are tied to your nurse account.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">Data security</h2>
        <p>
          We use technical and organisational measures to protect your
          information. No method of transmission or storage is completely
          secure, so we cannot guarantee absolute security.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">Contact</h2>
        <p>
          Questions about this policy? Use the feedback form on the home page.
        </p>
      </div>
    </LegalLayout>
  );
}