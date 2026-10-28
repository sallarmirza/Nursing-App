import LegalLayout from '../components/layout/LegalLayout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="November 2025">
      
      <p>
        Your privacy is important to us. It is NurseAssist's policy to respect your privacy regarding 
        any information we may collect from you across our website, <a href="https://nurseassist.app" className="text-brand-blue underline">https://nurseassist.app</a>, 
        and other sites we own and operate.
      </p>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">Information We Collect</h2>
        <p className="mb-4">
          We only collect information about you if we have a reason to do so – for example, to 
          provide our Services, to communicate with you, or to make our Services better.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="font-semibold text-text-dark">Personal Information:</strong> We collect personal information that you provide to us when 
            you use our Services, such as your name, email address, and any other contact information you provide.
          </li>
          <li>
            <strong className="font-semibold text-text-dark">Usage Data:</strong> We collect information about your interactions with our Services, such 
            as the pages you visit, the links you click, and the search terms you use.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">How We Use Information</h2>
        <p className="mb-4">
          We use the information we collect in various ways, including to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide, operate, and maintain our website.</li>
          <li>Improve, personalize, and expand our website.</li>
          <li>Understand and analyze how you use our website.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-dark mb-3">Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security of your personal information and clinical data. However, please note that no method of transmission over the internet or method of electronic storage is 100% secure.
        </p>
      </div>

    </LegalLayout>
  );
}