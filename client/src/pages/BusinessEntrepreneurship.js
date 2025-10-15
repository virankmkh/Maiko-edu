import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  Users, 
  Award, 
  Globe, 
  Star, 
  ArrowRight,
  Play,
  Clock,
  User,
  CheckCircle,
  TrendingUp,
  BarChart3,
  CreditCard,
  UserPlus,
  Link as LinkIcon,
  Share2,
  Briefcase,
  Lightbulb,
  Target,
  Zap,
  Shield,
  Download,
  Monitor,
  Database,
  FileText,
  Presentation,
  MessageSquare,
  ThumbsUp,
  Rocket
} from 'lucide-react';

const BusinessEntrepreneurship = () => {
  const { language, setLanguage } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    setLanguage(lang);
  };

  const englishContent = {
    title: "Welcome to Your Business & Entrepreneurship Learning Hub",
    subtitle: "Hands-on, practical, and powered by open tools you can use anywhere.",
    differentTitle: "🌟 What Makes This Platform Different",
    differentDescription: "This isn't just another online course site. Here, you'll learn by doing — running virtual businesses, testing ideas, and building real-world skills — all inside a safe, interactive environment. We've built the platform using Maiko Edu's integrated tools, so you can keep learning without expensive licences.",
    sections: [
      {
        title: "1. Your Learning Space",
        icon: BookOpen,
        items: [
          {
            title: "Course Materials",
            description: "Lessons, videos, and case studies are delivered through Maiko Edu, so you can access them anytime, anywhere.",
            icon: BookOpen
          },
          {
            title: "Interactive Lessons",
            description: "We use interactive content for quizzes, scenario-based exercises, and drag‑and‑drop activities.",
            icon: Play
          },
          {
            title: "Live Sessions",
            description: "Join real-time classes and Q&A sessions via our secured forums.",
            icon: Monitor
          }
        ]
      },
      {
        title: "2. Collaboration & Community",
        icon: Users,
        items: [
          {
            title: "Discussion Forums",
            description: "Share ideas, ask questions, and get feedback from peers and instructors.",
            icon: MessageSquare
          },
          {
            title: "Group Projects",
            description: "Work together in Mattermost to plan, brainstorm, and present your business ideas.",
            icon: Users
          },
          {
            title: "Peer Reviews",
            description: "Give and receive constructive feedback on assignments to sharpen your entrepreneurial thinking.",
            icon: ThumbsUp
          }
        ]
      },
      {
        title: "3. The Virtual Business Lab",
        icon: Briefcase,
        items: [
          {
            title: "Business Simulations",
            description: "OpenSimBiz lets you run a virtual company, manage budgets, and respond to market changes. You'll practice marketing strategy, pricing decisions, and operations management in a safe, game-like environment.",
            icon: Target
          },
          {
            title: "Financial Modeling & Analysis",
            description: "LibreOffice Calc for creating budgets, forecasts, and business plans. Metabase to turn raw data into clear dashboards and insights.",
            icon: BarChart3
          },
          {
            title: "Idea to Launch Toolkit",
            description: "Penpot for creating pitch decks, logos, and product mockups. LimeSurvey for market research and customer feedback.",
            icon: Rocket
          }
        ]
      },
      {
        title: "4. How You'll Learn",
        icon: TrendingUp,
        items: [
          {
            title: "Start with the Basics",
            description: "Learn core concepts in entrepreneurship, finance, and marketing.",
            icon: BookOpen
          },
          {
            title: "Apply in the Lab",
            description: "Use simulations and tools to test your knowledge.",
            icon: Zap
          },
          {
            title: "Get Feedback",
            description: "Instructors and peers review your work.",
            icon: CheckCircle
          },
          {
            title: "Refine & Launch",
            description: "Improve your business idea and present it in a final pitch.",
            icon: Rocket
          }
        ]
      },
      {
        title: "5. Your Progress & Credentials",
        icon: Award,
        items: [
          {
            title: "Track Your Journey",
            description: "Track your learning journey with built-in Moodle analytics — see your completed modules, grades, and skill badges.",
            icon: TrendingUp
          },
          {
            title: "Earn Certificates",
            description: "Earn digital certificates (issued via Open Badges standard) that you can share on LinkedIn or your CV.",
            icon: Award
          }
        ]
      },
      {
        title: "6. Why Open-Source?",
        icon: Shield,
        items: [
          {
            title: "No Extra Cost",
            description: "All tools are free to use.",
            icon: CreditCard
          },
          {
            title: "Real-world Skills",
            description: "You'll learn on platforms used by startups and professionals worldwide.",
            icon: Globe
          },
          {
            title: "Accessible Anywhere",
            description: "No special licences or installations required.",
            icon: Download
          }
        ]
      }
    ],
    cta: {
      title: "Get Ready to Build, Test, and Launch",
      description: "By the end of your journey here, you won't just know how to start a business — you'll have practiced running one, made data-driven decisions, and built a portfolio of work you can show to investors, employers, or partners.",
      button: "Start Learning Now"
    }
  };

  const frenchContent = {
    title: "Bienvenue dans Votre Centre d'Apprentissage Business & Entrepreneuriat",
    subtitle: "Pratique, concret, et alimenté par des outils open source que vous pouvez utiliser partout.",
    differentTitle: "🌟 Ce qui Rend Cette Plateforme Différente",
    differentDescription: "Ce n'est pas juste un autre site de cours en ligne. Ici, vous apprendrez en faisant — en gérant des entreprises virtuelles, en testant des idées, et en développant des compétences du monde réel — le tout dans un environnement sûr et interactif. Nous avons construit la plateforme en utilisant les outils intégrés de Maiko Edu, donc vous pouvez continuer à apprendre sans licences coûteuses.",
    sections: [
      {
        title: "1. Votre Espace d'Apprentissage",
        icon: BookOpen,
        items: [
          {
            title: "Matériel de Cours",
            description: "Les leçons, vidéos et études de cas sont livrées via Maiko Edu, donc vous pouvez y accéder n'importe quand, n'importe où.",
            icon: BookOpen
          },
          {
            title: "Leçons Interactives",
            description: "Nous utilisons du contenu interactif pour les quiz, exercices basés sur des scénarios, et activités de glisser-déposer.",
            icon: Play
          },
          {
            title: "Sessions en Direct",
            description: "Rejoignez des classes en temps réel et sessions Q&R via nos forums sécurisés.",
            icon: Monitor
          }
        ]
      },
      {
        title: "2. Collaboration & Communauté",
        icon: Users,
        items: [
          {
            title: "Forums de Discussion",
            description: "Partagez des idées, posez des questions, et obtenez des retours de pairs et instructeurs.",
            icon: MessageSquare
          },
          {
            title: "Projets de Groupe",
            description: "Travaillez ensemble dans Mattermost pour planifier, brainstormer, et présenter vos idées d'entreprise.",
            icon: Users
          },
          {
            title: "Évaluations par les Pairs",
            description: "Donnez et recevez des retours constructifs sur les devoirs pour aiguiser votre pensée entrepreneuriale.",
            icon: ThumbsUp
          }
        ]
      },
      {
        title: "3. Le Laboratoire d'Entreprise Virtuelle",
        icon: Briefcase,
        items: [
          {
            title: "Simulations d'Entreprise",
            description: "OpenSimBiz vous permet de gérer une entreprise virtuelle, gérer les budgets, et répondre aux changements du marché. Vous pratiquerez la stratégie marketing, les décisions de prix, et la gestion des opérations dans un environnement sûr et ludique.",
            icon: Target
          },
          {
            title: "Modélisation & Analyse Financière",
            description: "LibreOffice Calc pour créer des budgets, prévisions, et plans d'affaires. Metabase pour transformer les données brutes en tableaux de bord clairs et insights.",
            icon: BarChart3
          },
          {
            title: "Boîte à Outils Idée à Lancement",
            description: "Penpot pour créer des pitch decks, logos, et maquettes de produits. LimeSurvey pour la recherche de marché et retours clients.",
            icon: Rocket
          }
        ]
      },
      {
        title: "4. Comment Vous Apprendrez",
        icon: TrendingUp,
        items: [
          {
            title: "Commencez par les Bases",
            description: "Apprenez les concepts clés en entrepreneuriat, finance, et marketing.",
            icon: BookOpen
          },
          {
            title: "Appliquez dans le Lab",
            description: "Utilisez les simulations et outils pour tester vos connaissances.",
            icon: Zap
          },
          {
            title: "Obtenez des Retours",
            description: "Les instructeurs et pairs examinent votre travail.",
            icon: CheckCircle
          },
          {
            title: "Affinez & Lancez",
            description: "Améliorez votre idée d'entreprise et présentez-la dans un pitch final.",
            icon: Rocket
          }
        ]
      },
      {
        title: "5. Votre Progrès & Certifications",
        icon: Award,
        items: [
          {
            title: "Suivez Votre Parcours",
            description: "Suivez votre parcours d'apprentissage avec les analytics intégrées de Moodle — voyez vos modules complétés, notes, et badges de compétences.",
            icon: TrendingUp
          },
          {
            title: "Gagnez des Certificats",
            description: "Gagnez des certificats numériques (émis via le standard Open Badges) que vous pouvez partager sur LinkedIn ou votre CV.",
            icon: Award
          }
        ]
      },
      {
        title: "6. Pourquoi Open-Source ?",
        icon: Shield,
        items: [
          {
            title: "Aucun Coût Supplémentaire",
            description: "Tous les outils sont gratuits à utiliser.",
            icon: CreditCard
          },
          {
            title: "Compétences du Monde Réel",
            description: "Vous apprendrez sur des plateformes utilisées par les startups et professionnels du monde entier.",
            icon: Globe
          },
          {
            title: "Accessible Partout",
            description: "Aucune licence spéciale ou installation requise.",
            icon: Download
          }
        ]
      }
    ],
    cta: {
      title: "Prêt à Construire, Tester, et Lancer",
      description: "À la fin de votre parcours ici, vous ne saurez pas seulement comment démarrer une entreprise — vous aurez pratiqué la gestion d'une, pris des décisions basées sur les données, et construit un portfolio de travail que vous pouvez montrer aux investisseurs, employeurs, ou partenaires.",
      button: "Commencer l'Apprentissage Maintenant"
    }
  };

  const content = currentLanguage === 'fr' ? frenchContent : englishContent;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Toggle */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end">
            <div className="flex space-x-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentLanguage === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentLanguage === 'fr'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Français
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              {content.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
              >
                {content.cta.button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Different Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {content.differentTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {content.differentDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <section.icon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
              </div>
              
              <div className={`grid grid-cols-1 ${sectionIndex === 3 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${sectionIndex === 3 ? 'p-4' : 'p-6'}`}>
                    <div className={`flex items-start ${sectionIndex === 3 ? 'space-x-3' : 'space-x-4'}`}>
                      <div className="flex-shrink-0">
                        <div className={`bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center ${sectionIndex === 3 ? 'w-8 h-8' : 'w-10 h-10'}`}>
                          <item.icon className={`${sectionIndex === 3 ? 'h-4 w-4' : 'h-5 w-5'}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-gray-900 mb-2 ${sectionIndex === 3 ? 'text-base' : 'text-lg'}`}>
                          {item.title}
                        </h3>
                        <p className={`text-gray-600 leading-relaxed ${sectionIndex === 3 ? 'text-sm' : ''}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {content.cta.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
            {content.cta.description}
          </p>
          <Link
            to="/courses"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
          >
            {content.cta.button}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BusinessEntrepreneurship;
