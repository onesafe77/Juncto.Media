import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Pillars from '../components/landing/Pillars';
import LatestNews from '../components/landing/LatestNews';
import PremiumTeaser from '../components/landing/PremiumTeaser';
import AIFeature from '../components/landing/AIFeature';
import Pricing from '../components/landing/Pricing';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-off-white font-sans text-text-dark">
      <Navbar />
      <Hero />
      <Pillars />
      <LatestNews />
      <PremiumTeaser />
      <AIFeature />
      <Pricing />
      <Footer />
    </div>
  );
}
