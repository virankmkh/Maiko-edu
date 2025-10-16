import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import OrganizersSection from '../components/OrganizersSection';
import ParticipantsSection from '../components/ParticipantsSection';
import ProofSection from '../components/ProofSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <OrganizersSection />
      <ParticipantsSection />
      <ProofSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
