import LegalLayout from '../components/layout/LegalLayout';

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="November 2025">
      
      <p>
        By accessing or using NurseAssist, you agree to be bound by these Terms. If you do not agree 
        to these Terms, please do not use our services.
      </p>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">1. Medical Disclaimer</h2>
        <p>
          NurseAssist provides tools for clinical documentation and calculations. It is not a substitute 
          for professional medical judgment. Always verify calculations and clinical decisions independently.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">2. User Responsibilities</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account credentials and for all 
          activities that occur under your account. You agree to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide accurate and complete information when creating an account.</li>
          <li>Keep your password secure and confidential.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">3. Limitation of Liability</h2>
        <p>
          In no event shall NurseAssist, nor its directors, employees, partners, agents, suppliers, or 
          affiliates, be liable for any indirect, incidental, special, consequential or punitive damages 
          resulting from your use of the service.
        </p>
      </div>

    </LegalLayout>
  );
}