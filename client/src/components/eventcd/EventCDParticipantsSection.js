import React from 'react';

const EventCDParticipantsSection = () => {
  const sampleEvents = [
    {
      id: 1,
      title: "Tech Summit 2024",
      date: "15-16 Mars 2024",
      location: "Kinshasa, RDC",
      type: "Conférence",
      attendees: "500+ participants",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Forum de l'Emploi",
      date: "22 Mars 2024",
      location: "Lubumbashi, RDC",
      type: "Salon",
      attendees: "200+ participants",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Conférence Startup",
      date: "5 Avril 2024",
      location: "Goma, RDC",
      type: "Atelier",
      attendees: "150+ participants",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815c?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Sommet B2B",
      date: "12 Avril 2024",
      location: "Kinshasa, RDC",
      type: "Sommet",
      attendees: "300+ participants",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop"
    }
  ];

  return (
    <section id="participants" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Trouvez les événements qui comptent
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez un catalogue diversifié d'événements professionnels et créez votre réseau
          </p>
        </div>

        {/* Features for Participants */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recherche Facile</h3>
            <p className="text-gray-600">
              Trouvez rapidement les événements qui correspondent à vos intérêts et votre localisation.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expérience 100% Numérique</h3>
            <p className="text-gray-600">
              Inscription fluide, badge QR Code automatique, et gestion complète depuis votre mobile.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Diversité des Événements</h3>
            <p className="text-gray-600">
              Conférences, ateliers, salons, sommets B2B - un écosystème complet d'événements.
            </p>
          </div>
        </div>

        {/* Sample Events */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Événements Populaires
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden mb-4">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl">
                    🎯
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded">
                    {event.type}
                  </span>
                  <span className="text-xs text-gray-500">{event.attendees}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{event.title}</h4>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    {event.location}
                  </div>
                </div>
                <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 text-sm">
                  Voir Détails
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA for Participants */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Rejoignez la communauté EventCD
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre profil participant et accédez à des événements exclusifs, du networking de qualité et des opportunités professionnelles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Créer un Compte
              </button>
              <button className="bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:scale-105">
                Explorer les Événements
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCDParticipantsSection;
