import { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';

export default function FAQ() {
  // State to track which item is open (defaults to the first one being open)
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "When will the app be available?",
      answer: "We are currently in active development and testing. You can join the waitlist below to get early access and be notified as soon as we launch."
    },
    {
      question: "Is patient data secure and HIPAA compliant?",
      answer: "Absolutely. Security is our top priority. We use industry-standard encryption for all clinical records, SBAR handovers, and patient data."
    },
    {
      question: "Does it include medication and IV drip calculators?",
      answer: "Yes, the app features built-in dosage and IV drip-rate calculators to help minimize medication errors and save you time during your shift."
    },
    {
      question: "Can I use it on my phone or tablet?",
      answer: "Yes, the app is designed mobile-first, ensuring a seamless experience whether you are using a smartphone, tablet, or desktop computer."
    },
    {
      question: "Will I be able to export my notes?",
      answer: "Yes, we are building export features for SOAP notes and patient records so you can easily integrate them into existing hospital systems."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-24 bg-bg-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader 
          badge="FAQ" 
          title="Quick & Clear Answers" 
        />

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-2xl"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-text-dark">
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    )}
                  </div>
                </button>
                
                {/* Answer Panel */}
                <div
                  id={`faq-answer-${index}`}
                  className={`px-6 md:px-8 pb-6 md:pb-8 text-text-muted leading-relaxed transition-all duration-300 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}