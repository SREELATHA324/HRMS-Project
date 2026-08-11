import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Solutions from "../components/landing/Solutions";
import HowItWorks from "../components/landing/HowItWorks";
import Security from "../components/landing/Security";
import Contact from "../components/landing/Contact";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

function LandingPage({ onLogin }) {
  return (
    <div className="landing-page">
      <Navbar onLogin={onLogin} />

      <main>
        <Hero onLogin={onLogin} />
        <Features />
        <Solutions />
        <HowItWorks />
        <Security />
        <Contact />
        <CTA onLogin={onLogin} />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;