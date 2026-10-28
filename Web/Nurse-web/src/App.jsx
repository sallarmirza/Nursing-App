import Navbar from './components/layout/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import WhyChooseUs from './sections/WhyChooseUs';
import HowItWorks from './sections/HowItWorks';
import FAQ from './sections/FAQ';
import Waitlist from './sections/Waitlist';
import Footer from './components/layout/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <main className="grow">
        <Hero />
        <Features />
        <WhyChooseUs />
        <HowItWorks />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}