import React from 'react';
import { Link } from 'react-router-dom';
import virankLogo from '../assets/virank-logo.png';

const VirankLanding = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
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
              <img 
                src={virankLogo} 
                alt="VIRANK Corp" 
                className="h-10 w-auto mr-3"
              />
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
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-primary-300 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-500 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-primary-200 rounded-full opacity-40 animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight transform hover:scale-105 transition-transform duration-300 animate-slideInUp">
              VIRANK CORP : L'IA Africaine qui Bâtit l'Avenir
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-light animate-float">
              Audace. Innovation. Impact.
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Fondée par Vira NEEMA, Ingénieure IA congolaise (MSc Goldsmiths, UoL), nous transformons les défis de la RDC en solutions d'Intelligence Artificielle à l'échelle mondiale.
            </p>
            <a 
              href="#projets"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25 animate-glow"
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
              Pourquoi Virank Corp ? L'Expertise au Service de la Transformation
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                Chez Virank Corp, nous ne faisons pas que coder l'avenir ; nous le co-créons. Née de la passion de Vira NEEMA pour le potentiel inexploité du continent, notre mission est claire :
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Démocratiser la Connaissance</h3>
                  <p className="text-gray-600">par l'e-learning intelligent</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Optimiser les Secteurs Clés</h3>
                  <p className="text-gray-600">Santé, Finance, Agri grâce à l'IA</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Établir Kinshasa</h3>
                  <p className="text-gray-600">comme pôle d'excellence technologique global</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed mt-8 text-gray-700">
                Nous combinons la rigueur académique internationale de l'Université de Londres avec une compréhension intime des besoins locaux pour garantir un impact réel et mesurable.
              </p>
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
                    to="/login" 
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

            {/* KIVU VISION */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-secondary-100 hover:border-secondary-300">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl p-8 text-center order-2 md:order-1">
                  <div className="text-6xl mb-4">🏥</div>
                  <p className="text-secondary-700 font-semibold">En Développement</p>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-secondary-600 text-white rounded-lg px-4 py-2 text-sm font-semibold mr-4">
                      PROJET 2
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">KIVU VISION</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-secondary-600 mb-4">Diagnostic de Santé Précis et Mobile</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Un projet d'IA et santé qui vise à démocratiser le diagnostic médical. En exploitant l'apprentissage profond pour l'analyse d'images (rayons X, microscopie), Kivu Vision apporte des capacités diagnostiques de pointe directement dans les cliniques rurales et les zones à faible ressource.
                  </p>
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-secondary-800 mb-1">Notre Force IA :</p>
                    <p className="text-secondary-700">Modèles légers, optimisés pour un déploiement sur mobile et hors ligne.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ZOLA FINTECH */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-accent-100 hover:border-accent-300">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-accent-600 text-white rounded-lg px-4 py-2 text-sm font-semibold mr-4">
                      PROJET 3
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">ZOLA FINTECH</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-accent-600 mb-4">La Finance 100% Inclusive</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Une solution de microcrédit et d'évaluation de risque ciblant la majorité non bancarisée. Zola Fintech utilise l'analyse de données alternatives et des algorithmes de Machine Learning transparents pour accorder des financements équitables, ouvrant la voie à l'entrepreneuriat à la base.
                  </p>
                  <div className="bg-accent-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-accent-800 mb-1">Notre Force IA :</p>
                    <p className="text-accent-700">Algorithmes d'Explicabilité (XAI) pour une confiance totale dans l'évaluation de crédit.</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">💰</div>
                  <p className="text-accent-700 font-semibold">En Développement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Le Blog */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Le Tech Blog Virank : Le Hub d'Information Tech de la RDC
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plus qu'un simple blog, c'est la plateforme de référence pour décrypter l'innovation technologique en République Démocratique du Congo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Vos Articles</h3>
              <p className="text-gray-600">
                Plongez dans la recherche de Vira NEEMA (IA, éthique, entrepreneuriat). Des analyses de doctorante pour comprendre les enjeux techniques et stratégiques de demain.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Nouvelles RDC</h3>
              <p className="text-gray-600">
                Nous sommes la source incontournable pour les actualités tech congolaises. Annonces de startups, tendances du marché, politiques numériques...
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Communauté Virank</h3>
              <p className="text-gray-600">
                Rejoignez nos discussions pour connecter les développeurs, les investisseurs et les leaders d'opinion.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="space-x-4">
              <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300">
                Lire le Blog
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition duration-300">
                Proposer un Article (Tech RDC)
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
              Vira NEEMA : De l'Excellence Académique à l'Action
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
                  Vira NEEMA est la preuve vivante du potentiel technologique africain. Diplômée en MSc de Data Science et IA à Goldsmiths, University of London et chercheuse doctorale en IA, elle insuffle dans chaque projet une double expertise : la connaissance des systèmes mondiaux et l'engagement envers le développement local.
                </p>
                <p className="text-lg leading-relaxed">
                  Virank Corp est l'incarnation de sa conviction : la RDC est prête à diriger la prochaine vague d'innovation mondiale.
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
                  <h4 className="text-lg font-semibold mb-3 text-primary-300">Vision</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Transformer la RDC en hub technologique</li>
                    <li>• Démocratiser l'accès à l'IA en Afrique</li>
                    <li>• Créer un écosystème tech inclusif</li>
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
                <img 
                  src={virankLogo} 
                  alt="VIRANK Corp" 
                  className="h-8 w-auto mr-3"
                />
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
