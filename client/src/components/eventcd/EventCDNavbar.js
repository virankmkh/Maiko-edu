import React from 'react';
import { Link } from 'react-router-dom';
import eventcdLogo from '../../assets/eventcd-logo.png';

const EventCDNavbar = () => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={eventcdLogo} 
              alt="EventCD" 
              className="h-10 w-auto object-contain mr-3"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="text-xl font-bold text-gray-900" style={{display: 'none'}}>EventCD</span>
            <span className="text-xl font-bold text-primary-600 ml-2">EventCD</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#organisateurs" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-50">
                Pour les Organisateurs
              </a>
              <a href="#participants" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-50">
                Pour les Participants
              </a>
              <a href="#temoignages" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-50">
                Témoignages
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Connexion
            </Link>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Publier un Événement
            </button>
            <button className="border-2 border-primary-600 text-primary-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-50 transition-all duration-300 transform hover:scale-105">
              Parcourir les Événements
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EventCDNavbar;
