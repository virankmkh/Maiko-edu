import React from 'react';
import { Link } from 'react-router-dom';

const VirankLanding = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(34, 211, 238, 0.5); }
          50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.6); }
        }
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
      `}</style>
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">VIRANK Corp</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#vision" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-50">Notre Vision</a>
                <a href="#projets" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-50">Nos Projets</a>
                <a href="#blog" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-50">Le Blog</a>
                <a href="#fondatrice" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-50">Notre Fondatrice</a>
                <Link to="/login" className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Maiko EDU
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Bannière Principale */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-cyan-300 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-500 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-purple-200 rounded-full opacity-40 animate-pulse"></div>
          {/* Add some geometric shapes */}
          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-cyan-400 rotate-45 opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-blue-300 rounded-full opacity-50 animate-bounce"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight transform hover:scale-105 transition-transform duration-300 animate-slideInUp text-white">
              VIRANK CORP : L'IA Africaine qui Bâtit l'Avenir
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-light animate-float text-cyan-200">
              Audace. Innovation. Impact.
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed text-white">
              Nous développons des solutions d'IA innovantes et stratégiques pour transformer l'Éducation, la Santé et la Finance en Afrique, de la RDC au monde.
            </p>
            <a 
              href="#projets"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-gray-900 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 animate-glow"
            >
              Voir nos Solutions Révolutionnaires
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Notre Vision */}
      <section id="vision" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Notre Mission : Catalyser le Progrès par l'IA
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                Virank Corp est la force motrice derrière une nouvelle vague d'innovation technologique africaine. Notre mission est simple : utiliser le potentiel de l'Intelligence Artificielle pour relever les défis socio-économiques et créer des systèmes durables.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                Nous combinons une expertise mondiale en IA avec une connaissance approfondie du terrain. Nous ne nous contentons pas d'appliquer la technologie ; nous la concevons pour qu'elle soit pertinente, impactante et accessible.
              </p>
              <div className="bg-gray-50 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">L'impact que nous créons :</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Démocratisation de la Connaissance</h4>
                    <p className="text-gray-600">(via MAIKO EDU)</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Amélioration des Services Essentiels</h4>
                    <p className="text-gray-600">Santé, Finance, Agri</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Établissement d'un Pôle d'Excellence</h4>
                    <p className="text-gray-600">Tech Africain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Les Projets Phares */}
      <section id="projets" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              L'Écosystème Virank : Des Projets, des Piliers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque projet Virank est une application stratégique de l'IA conçue pour catalyser le progrès social et économique.
            </p>
          </div>
          
          <div className="space-y-16">
            {/* MAIKO EDU */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-primary-100 hover:border-primary-300">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-semibold mr-4">
                      PROJET 1
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">MAIKO EDU</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-primary-600 mb-4">Révolutionner l'Éducation</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Notre plateforme d'e-learning de nouvelle génération. Nous utilisons l'IA pour créer des parcours d'apprentissage adaptatifs basés sur les besoins individuels, réduisant l'écart entre le talent congolais et les opportunités mondiales. Maiko Edu n'enseigne pas seulement ; il personnalise l'ascension.
                  </p>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-primary-800 mb-1">Notre Force IA :</p>
                    <p className="text-primary-700">Moteurs de recommandation basés sur l'IA pour un engagement maximal.</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <Link 
                    to="/home" 
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300"
                  >
                    Découvrir Maiko EDU
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* MAIKO CHECK */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-secondary-100 hover:border-secondary-300">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl p-8 text-center order-2 md:order-1">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-secondary-700 font-semibold">En Développement</p>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-secondary-600 text-white rounded-lg px-4 py-2 text-sm font-semibold mr-4">
                      PROJET 2
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">MAIKO CHECK</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-secondary-600 mb-4">L'Authenticité Éducative</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Face à la montée en puissance de l'IA générative, nous lançons Maiko Check. Cet outil utilise des algorithmes sophistiqués pour analyser et authentifier tous les types de productions étudiantes, qu'il s'agisse d'évaluations, de devoirs, de dissertations ou de travaux de fin d'études. Nous déterminons si le contenu a été généré par une IA ou rédigé par l'étudiant lui-même. C'est l'outil indispensable pour garantir l'intégrité académique dans l'ère numérique, du secondaire à l'université.
                  </p>
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-secondary-800 mb-1">Notre Force IA :</p>
                    <p className="text-secondary-700">Modèles de Traitement du Langage Naturel (TAL) spécialisés dans la détection de patterns de génération de texte et d'originalité stylistique.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBEKO AI */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-accent-100 hover:border-accent-300">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-accent-600 text-white rounded-lg px-4 py-2 text-sm font-semibold mr-4">
                      PROJET 3
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">MOBEKO AI</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-accent-600 mb-4">L'IA au Service du Droit Congolais</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Un modèle d'aide à la décision juridique de pointe, spécifiquement formé sur la législation, la jurisprudence et la doctrine de la RDC. Mobeko AI évalue les chances de succès d'un procès, guide l'avocat sur la meilleure stratégie à adopter, l'aide à la rédaction de conclusions (plaidoyers) et à l'anticipation des arguments adverses. C'est l'assistant ultime pour l'optimisation des procédures judiciaires.
                  </p>
                  <div className="bg-accent-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-accent-800 mb-1">Notre Force IA :</p>
                    <p className="text-accent-700">Modèles de TAL avancés pour l'analyse prédictive et la génération de documents juridiques contextualisés au droit congolais.</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">⚖️</div>
                  <p className="text-accent-700 font-semibold">En Développement</p>
                </div>
              </div>
            </div>

            {/* DIGIT KIN */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-8 text-center order-2 md:order-1">
                  <div className="text-6xl mb-4">🌐</div>
                  <p className="text-purple-700 font-semibold">En Développement</p>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-semibold mr-4">
                      PROJET 4
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">DIGIT KIN</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-purple-600 mb-4">La Présence Web en Moins d'Une Minute</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    La numérisation est simplifiée. Digit Kin est une plateforme de création de sites web instantanée et assistée par IA. L'utilisateur n'a qu'à décrire son entreprise, fournir son logo et quelques informations clés, et notre IA génère automatiquement un site web complet, hébergé et prêt à l'emploi. Nous offrons également la possibilité d'obtenir un nom de domaine personnalisé. C'est la solution idéale pour donner une vitrine professionnelle immédiate aux entreprises locales.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-purple-800 mb-1">Notre Force IA :</p>
                    <p className="text-purple-700">Moteurs de génération de contenu (texte, structure) et de design assisté pour une mise en ligne en quelques clics.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KASH AI */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-semibold mr-4">
                      PROJET 5
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">KASH AI</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-green-600 mb-4">La Comptabilité Intelligente</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Kash AI est l'assistant de comptabilité pour les PME. Fini la saisie manuelle : notre solution utilise l'IA pour catégoriser automatiquement les dépenses et les revenus, analyser les flux de trésorerie et effectuer des prévisions financières. Cet outil aide les entrepreneurs à obtenir une visibilité instantanée sur la santé financière de leur entreprise, garantissant une meilleure gestion et une croissance éclairée, en conformité avec les standards locaux.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-800 mb-1">Notre Force IA :</p>
                    <p className="text-green-700">Modèles de Machine Learning pour la classification des transactions et l'analyse prédictive de la trésorerie.</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">💰</div>
                  <p className="text-green-700 font-semibold">En Développement</p>
                </div>
              </div>
            </div>

            {/* MAMA VIBE */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-orange-100 hover:border-orange-300">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-8 text-center order-2 md:order-1">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-orange-700 font-semibold">En Développement</p>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-600 text-white rounded-lg px-4 py-2 text-sm font-semibold mr-4">
                      PROJET 6
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">MAMA VIBE</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-orange-600 mb-4">Le "Watch Guard" Citoyen et Hyperlocal</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Application mobile gratuite basée sur le crowdsourcing et l'IA. Elle permet aux citoyens de signaler en temps réel les situations critiques (électricité, eau, sécurité, trafic) dans leur quartier. L'IA filtre le bruit pour offrir un tableau de bord fiable et des alertes prédictives pour planifier sa journée.
                  </p>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-orange-800 mb-1">Notre Force IA :</p>
                    <p className="text-orange-700">Modèles d'Analyse de Confiance et de Vérification de la Vérité pour garantir la fiabilité des données communautaires.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Le VIRANK HUB */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Le VIRANK HUB : Communauté & Média Tech RDC
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Le Virank Hub est la plateforme centrale de l'écosystème technologique en RDC et au-delà.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Communauté des Développeurs</h3>
              <p className="text-gray-600">
                Un espace d'échange pour les experts et les passionnés. Rencontrez d'autres développeurs, discutez des défis techniques, collaborez sur des projets open-source et faites progresser vos compétences.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Le Tech Blog Virank</h3>
              <p className="text-gray-600">
                Le média de référence pour les actualités tech congolaises et l'analyse de pointe sur l'IA. Publiez vos propres articles ou plongez dans les recherches des leaders du secteur.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Partage de Connaissances</h3>
              <p className="text-gray-600">
                Le Virank Hub est votre lieu de rencontre, de partage de connaissances et de publication pour façonner l'avenir technologique congolais.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="space-x-4">
              <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300">
                Rejoindre la Communauté
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition duration-300">
                Publier un Article
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Notre Fondatrice */}
      <section id="fondatrice" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Vira NEEMA : La Garante de notre Excellence et de notre Vision
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">VN</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Vira NEEMA</h3>
                <p className="text-primary-200 text-lg">Fondatrice & CEO, Virank Corp</p>
              </div>
              
              <div className="prose prose-lg mx-auto text-gray-200">
                <p className="text-xl leading-relaxed mb-6">
                  Virank Corp est propulsée par la vision de Vira NEEMA, Ingénieure IA congolaise. Son parcours exceptionnel, couronné par un MSc de Data Science et IA à Goldsmiths, University of London et ses recherches doctorales en cours, est notre gage d'excellence.
                </p>
                <p className="text-lg leading-relaxed">
                  Vira insuffle dans chaque projet une double expertise : la rigueur académique et l'innovation de pointe (AI & ML) pour les marchés mondiaux, couplée à une compréhension intime des besoins et des opportunités spécifiques en RDC et en Afrique. Son leadership assure que nos solutions sont à la fois sophistiquées et ancrées dans la réalité.
                </p>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-3 text-primary-300">Formation</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• MSc Data Science & IA - Goldsmiths, University of London</li>
                    <li>• Chercheuse Doctorale en Intelligence Artificielle</li>
                    <li>• Expertise en Machine Learning & Deep Learning</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-3 text-primary-300">Leadership</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Rigueur académique internationale</li>
                    <li>• Innovation de pointe pour les marchés mondiaux</li>
                    <li>• Compréhension intime des besoins africains</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Call to Action Final */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt(e) à Bâtir l'Avenir Numérique ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Que vous soyez un développeur, un investisseur, un partenaire potentiel ou un passionné de tech, rejoignez le mouvement Virank.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                S'inscrire à la Newsletter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold">VIRANK Corp</span>
              </div>
              <p className="text-gray-400">
                L'IA Africaine qui Bâtit l'Avenir
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Projets</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Maiko EDU</Link></li>
                <li><a href="#" className="hover:text-white">Kivu Vision</a></li>
                <li><a href="#" className="hover:text-white">Zola Fintech</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#blog" className="hover:text-white">Le Blog</a></li>
                <li><a href="#fondatrice" className="hover:text-white">Notre Fondatrice</a></li>
                <li><a href="#vision" className="hover:text-white">Notre Vision</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">Kinshasa, RDC</p>
              <p className="text-gray-400">contact@virank.org</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VIRANK Corp. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VirankLanding;
