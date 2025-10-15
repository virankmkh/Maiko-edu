import React from 'react';

const EventCDProofSection = () => {
  const stats = [
    {
      number: "50+",
      label: "Événements Organisés",
      description: "Depuis le lancement de la plateforme"
    },
    {
      number: "2K+",
      label: "Participants Inscrits",
      description: "Communauté active et engagée"
    },
    {
      number: "90%",
      label: "Satisfaction Organisateurs",
      description: "Taux de satisfaction élevé"
    },
    {
      number: "10+",
      label: "Villes Couvertes",
      description: "Présence nationale croissante"
    }
  ];

  const testimonials = [
    {
      name: "Yanick Futatali",
      role: "Directrice Événements, TechCorp RDC",
      content: "EventCD a révolutionné notre façon d'organiser des événements. La gestion des inscriptions, l'impression des badges, tout est automatisé. Nous avons gagné 70% de temps sur l'organisation !",
      rating: 5
    },
    {
      name: "Jean-Pierre Mbuyi",
      role: "Fondateur, StartupHub",
      content: "Grâce au système de matchmaking B2B d'EventCD, j'ai pu rencontrer 15 partenaires potentiels lors de notre dernier sommet. L'outil est incroyablement efficace !",
      rating: 5
    },
    {
      name: "Sarah Ntumba",
      role: "Responsable RH, Groupe Minier",
      content: "L'expérience participant est exceptionnelle. Inscription en 2 minutes, badge QR Code automatique, et l'application mobile est parfaite pour le networking.",
      rating: 5
    }
  ];

  return (
    <section id="temoignages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Rejoignez la Communauté
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des milliers d'organisateurs et participants nous font confiance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Ce que disent nos utilisateurs
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Restez informé des derniers événements
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Recevez chaque semaine une sélection des meilleurs événements professionnels dans votre région.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCDProofSection;
