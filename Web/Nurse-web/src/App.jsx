import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./sections/Hero";
import WhyChooseUs from "./sections/WhyChooseUs";
import Features from "./sections/Features";
import HowItWorks from "./sections/HowItWorks";
import Install from "./sections/Install";
import Download from "./sections/Download";
import Team from "./sections/Team";
import FAQ from "./sections/FAQ";
import Feedback from "./sections/Feedback";

// Home page order:
// hook (Hero) → why (WhyChooseUs) → what (Features) → how (HowItWorks)
// → get it (Install) → download CTA → team → questions → feedback
export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <main className="grow">
        <Hero />
        <WhyChooseUs />
        <Features />
        <HowItWorks />
        <Install />
        <Download />
        <Team />
        <FAQ />
        <Feedback />
      </main>
      <Footer />
    </div>
  );
}