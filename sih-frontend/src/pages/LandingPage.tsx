import NavBar from './landing/NavBar';
import Hero from './landing/Hero';
import Stats from './landing/Stats';
import Features from './landing/Features';
import HowItWorks from './landing/HowItWorks';
import CTA from './landing/CTA';
import Footer from './landing/Footer';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen">
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 bg-black/30 -z-10" />
      <div className="relative">
        <NavBar />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
