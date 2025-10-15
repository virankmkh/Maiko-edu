import React from 'react';

const EventCDHeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full opacity-25 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-float">
            La plateforme pour vos événements B2B, B2G et plus encore
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-primary-100">
            Lancez votre événement en quelques clics, de l'inscription à l'impression des badges QR Code.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-glow w-full sm:w-auto">
              🎯 Publier un Événement
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
              🔍 Trouver un Événement
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-2 shadow-xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  className="flex-1 px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <input
                  type="date"
                  className="px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <input
                  type="text"
                  placeholder="Lieu"
                  className="px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button className="bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCDHeroSection;
