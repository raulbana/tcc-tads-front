import React from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import ValueProposition from './components/ValueProposition/ValueProposition';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Credibility from './components/Credibility/Credibility';
import Footer from './components/Footer/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <ValueProposition />
      <FeaturesSection />
      <HowItWorks />
      <Credibility />
      <Footer />
    </div>
  );
};

export default AboutPage;