import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./sections/Hero";
import Install from "./sections/Install";
import Features from "./sections/Features";
import Download from "./sections/Download";
import Team from "./sections/Team";
import FAQ from "./sections/FAQ";
import Feedback from "./sections/Feedback";

// Home page. Order follows the visitor's job:
// get the app -> install it -> see what it does -> download -> who built it -> questions -> feedback
export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <main className="grow">
        <Hero />
        <Install />
        <Features />
        <Download />
        <Team />
        <FAQ />
        <Feedback />
      </main>
      <Footer />
    </div>
  );
}