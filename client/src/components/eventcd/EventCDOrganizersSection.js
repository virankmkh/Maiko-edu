import React from 'react';

const EventCDOrganizersSection = () => {
  const features = [
    {
      icon: "📝",
      title: "Inscription Simplifiée",
      description: "Formulaires personnalisables, gestion des tarifs et billetterie intégrée avec paiement sécurisé.",
      details: [
        "Formulaires conditionnels",
        "Gestion des tarifs multiples",
        "Paiement Stripe/PayPal",
        "Emails automatiques"
      ]
    },
    {
      icon: "🎫",
      title: "Gestion du Jour J",
      description: "Génération de QR Code unique, outil d'impression de badges, application de check-in rapide.",
      details: [
        "QR Code sécurisé",
        "Impression de badges",
        "Scan de check-in",
        "Suivi en temps réel"
      ]
    },
    {
      icon: "🤝",
      title: "Rencontres Qualifiées (B2B)",
      description: "Outil de Matchmaking optionnel pour les événements professionnels avec gestion d'agenda.",
      details: [
        "Profils détaillés",
        "Algorithme de matching",
        "Gestion d'agenda",
        "Lieux de rencontre"
      ]
    }
  ];

  return (
    <section id="organisateurs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Organisez sans Limite. Gérez en Toute Simplicité.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme complète pour créer, gérer et animer vos événements professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center">
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              
              <div className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center justify-center text-sm text-gray-500">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA for Organizers */}
        <div className="text-center mt-16">
          <div className="bg-primary-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à lancer votre premier événement ?
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre compte organisateur et commencez à planifier votre événement en moins de 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Commencer Gratuitement
              </button>
              <button className="bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:scale-105">
                Voir la Démo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCDOrganizersSection;
