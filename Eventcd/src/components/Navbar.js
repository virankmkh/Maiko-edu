import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/src/assets/eventcd-logo.png" 
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
            <button className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Connexion
            </button>
            <button className="btn-primary text-sm">
              Publier un Événement
            </button>
            <button className="btn-secondary text-sm">
              Parcourir les Événements
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
