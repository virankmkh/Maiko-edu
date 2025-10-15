import React from 'react';
import EventCDNavbar from '../../components/eventcd/EventCDNavbar';
import EventCDHeroSection from '../../components/eventcd/EventCDHeroSection';
import EventCDOrganizersSection from '../../components/eventcd/EventCDOrganizersSection';
import EventCDParticipantsSection from '../../components/eventcd/EventCDParticipantsSection';
import EventCDProofSection from '../../components/eventcd/EventCDProofSection';
import EventCDFooter from '../../components/eventcd/EventCDFooter';

const EventCDLanding = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <EventCDNavbar />
      <EventCDHeroSection />
      <EventCDOrganizersSection />
      <EventCDParticipantsSection />
      <EventCDProofSection />
      <EventCDFooter />
    </div>
  );
};

export default EventCDLanding;
