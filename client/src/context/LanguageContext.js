import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { privacyTranslations } from './privacyTranslations';
import { termsTranslations } from './termsTranslations';
import { teamTranslations } from './teamTranslations';

const LanguageContext = createContext();

// Language configurations
const languages = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    direction: 'ltr'
  }
};

// English translations
const enTranslations = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success!',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    home: 'Home',
    courses: 'Courses',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    creating: 'Creating',
    register: 'Register',
  },
  courses: {
    title: 'All Courses',
    searchPlaceholder: 'Search by title, description, or category...',
    category: 'Category',
    difficulty: 'Difficulty',
    sortBy: 'Sort by',
    showing: 'Showing',
    of: 'of',
    courses: 'courses',
    for: 'for',
    in: 'in',
    noCoursesFound: 'No courses found',
    tryAdjusting: 'Try adjusting your search terms or filters',
    clearFilters: 'Clear Filters',
    enrollNow: 'Enroll Now',
    enrolling: 'Enrolling...',
    instructor: 'Instructor',
    duration: 'min',
    free: 'Free',
    categories: {
      all: 'All Categories',
      business: 'Business',
      technology: 'Technology',
      arts: 'Arts',
      language: 'Language',
      health: 'Health',
      lifeskills: 'Life Skills'
    },
    difficulties: {
      all: 'All Levels',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    },
      sortOptions: {
        newest: 'Newest First',
        oldest: 'Oldest First',
        priceLow: 'Price: Low to High',
        priceHigh: 'Price: High to Low',
        title: 'Title A-Z',
        rating: 'Highest Rated'
      },
      payment: {
        title: 'Complete Your Purchase',
        fullAccess: 'Full Course Access',
        selectMethod: 'Select Payment Method',
        pay: 'Pay',
        processing: 'Processing...',
        secure: 'Your payment information is secure and encrypted',
        upgrade: 'Upgrade to Full Access',
        enrolled: 'Enrolled',
        tryFree: 'Try Free + Pay Later'
      }
  },
  instructor: {
    dashboard: {
      title: 'Instructor Dashboard',
      welcome: 'Welcome back',
      totalCourses: 'Total Courses',
      totalStudents: 'Total Students',
      totalRevenue: 'Total Revenue',
      averageRating: 'Average Rating',
      myCourses: 'My Courses',
      createCourse: 'Create Course',
      createFirstCourse: 'Create Your First Course',
      noCourses: 'No courses yet',
      noCoursesDesc: 'Start by creating your first course to begin teaching',
      students: 'students',
      edit: 'Edit',
      analytics: 'Analytics',
      recentStudents: 'Recent Students',
      recentActivity: 'Recent Activity'
    },
    courseBuilder: {
      createCourse: 'Create Course',
      cancel: 'Cancel',
      saveCourse: 'Save Course',
      basic: 'Basic',
      lessons: 'Lessons',
      preview: 'Preview',
      courseTitle: 'Course Title',
      courseTitlePlaceholder: 'Enter your course title',
      category: 'Category',
      price: 'Price',
      difficulty: 'Difficulty',
      courseDescription: 'Course Description',
      courseDescriptionPlaceholder: 'Describe what students will learn in this course',
      publishCourse: 'Publish Course',
      categories: {
        business: 'Business',
        technology: 'Technology',
        language: 'Language',
        health: 'Health',
        lifeSkills: 'Life Skills'
      },
      difficulties: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
      },
      lessonTypes: {
        video: 'Video',
        text: 'Text',
        quiz: 'Quiz',
        assignment: 'Assignment',
        document: 'Document'
      }
    }
  },
  h5p: {
    editor: {
      title: 'Create Interactive Content',
      contentTitle: 'Content Title',
      contentDescription: 'Content Description',
      contentType: 'Content Type',
      contentParameters: 'Content Parameters',
      createContent: 'Create H5P Content'
    },
    player: {
      placeholderNote: 'This is a simplified H5P player. In a full implementation, this would render the actual H5P content with all interactive features.'
    },
    testPage: {
      title: 'H5P Interactive Content Test',
      editorTab: 'Content Editor',
      playerTab: 'Content Player',
      playContent: 'Play H5P Content',
      selectContent: 'Select Content to Play',
      noContentSelected: 'Please select content to play',
      noContentYet: 'No H5P content created yet. Use the editor to create some content!'
    }
  },
  auth: {
    register: 'Register',
    welcome: 'Welcome',
    language: 'Language',
    loading: 'Loading...'
  },
  navigation: {
    home: 'Home',
    courses: 'Courses',
    about: 'About',
    team: 'Team',
    contact: 'Contact',
    terms: 'Terms of Service'
  },
  organization: {
    title: 'Organization'
  },
  affiliate: {
    title: 'Affiliate'
  },
  home: {
    heroTitle: 'Learn Almost Anything with Maiko EDU',
    heroSubtitle: 'We are the Congolese of tomorrow, the better fitted head ones. Join us and build our country with brains. Access affordable courses from $5 to $50 in all fields.',
    getStartedFree: 'Get Started Free',
    exploreCourses: 'Explore All Courses',
    congoleseDiaspora: 'Congolese Diaspora',
    earningTitle: 'Turn Your Knowledge Into Income',
    earningSubtitle: 'Join our affiliate program and earn money by sharing courses with your network. Help others learn while building your own income stream.',
    becomeAffiliate: 'Become an Affiliate',
    startEarning: 'Start Earning',
    whyChooseMaiko: 'Why Choose Maiko EDU?',
    whyChooseMaikoSubtitle: 'We provide comprehensive learning solutions designed specifically for the Congolese community worldwide.',
    learnAnySkill: 'Learn Any Skill, Anywhere',
    learnAnySkillSubtitle: 'Access our comprehensive library of courses designed to help you succeed in today\'s competitive world.',
    features: {
      diverseLibrary: {
        title: 'Diverse Course Library',
        description: 'Access hundreds of courses across multiple disciplines'
      },
      expertInstructors: {
        title: 'Expert Instructors',
        description: 'Learn from industry professionals and experienced educators'
      },
      industryCertifications: {
        title: 'Industry Certifications',
        description: 'Earn recognized certificates to boost your career'
      },
      flexibleLearning: {
        title: 'Flexible Learning',
        description: 'Study at your own pace with 24/7 access to materials'
      }
    },
    courseCategories: {
      business: {
        title: 'Business & Entrepreneurship',
        count: '25+ Courses',
        description: 'Learn business skills and start your own venture'
      },
      technology: {
        title: 'Technology & Programming',
        count: '40+ Courses',
        description: 'Master modern technology and programming languages'
      },
      arts: {
        title: 'Arts & Creative',
        count: '15+ Courses',
        description: 'Explore your creative side with our arts courses'
      },
      language: {
        title: 'Language Learning',
        count: '10+ Courses',
        description: 'Learn new languages and improve communication skills'
      },
      health: {
        title: 'Health & Wellness',
        count: '20+ Courses',
        description: 'Take care of your physical and mental health'
      },
      lifeSkills: {
        title: 'Life Skills & Personal Development',
        count: '30+ Courses',
        description: 'Develop essential life skills for personal growth'
      }
    },
    howToEarn: {
      title: 'How to Earn with Maiko EDU',
      subtitle: 'Join our affiliate program and start earning money by sharing knowledge',
      steps: {
        step1: {
          title: 'Sign Up',
          description: 'Create your affiliate account in minutes'
        },
        step2: {
          title: 'Get Your Link',
          description: 'Receive your unique referral link'
        },
        step3: {
          title: 'Share Courses',
          description: 'Share courses with your network'
        },
        step4: {
          title: 'Earn Money',
          description: 'Get paid for every successful referral'
        }
      },
      cta: {
        title: 'Ready to Start Earning?',
        subtitle: 'Join thousands of affiliates who are already earning with Maiko EDU',
        button: 'Join Affiliate Program',
        secondaryButton: 'Learn More'
      }
    }
  },
  student: {
    dashboard: {
      title: 'Student Dashboard',
      welcome: 'Welcome back',
      overview: 'Overview',
      myCourses: 'My Courses',
      availableCourses: 'Available Courses',
      stats: {
        totalCourses: 'Total Courses',
        enrolledCourses: 'Enrolled Courses',
        completedCourses: 'Completed Courses',
        overallProgress: 'Overall Progress',
        certificatesEarned: 'Certificates Earned',
        studyStreak: 'Study Streak',
        totalStudyTime: 'Total Study Time',
        averageGrade: 'Average Grade'
      },
      courseCard: {
        continue: 'Continue',
        start: 'Start Course',
        viewDetails: 'View Details',
        enrolled: 'Enrolled',
        completed: 'Completed',
        inProgress: 'In Progress',
        notStarted: 'Not Started',
        progress: 'Progress',
        lessons: 'lessons',
        duration: 'Duration',
        difficulty: 'Difficulty',
        instructor: 'Instructor',
        lastAccessed: 'Last Accessed',
        nextLesson: 'Next Lesson',
        timeSpent: 'Time Spent'
      },
      activity: {
        recentActivity: 'Recent Activity',
        noActivity: 'No recent activity',
        lessonStarted: 'Started lesson',
        lessonCompleted: 'Completed lesson',
        quizAttempted: 'Attempted quiz',
        assignmentSubmitted: 'Submitted assignment',
        courseCompleted: 'Completed course',
        certificateEarned: 'Earned certificate',
        forumPost: 'Posted in forum',
        videoWatched: 'Watched video'
      },
      certificates: {
        title: 'My Certificates',
        noCertificates: 'No certificates earned yet',
        noCertificatesDesc: 'Complete courses to earn certificates',
        viewCertificate: 'View Certificate',
        downloadCertificate: 'Download Certificate',
        verifyCertificate: 'Verify Certificate',
        issuedDate: 'Issued Date',
        courseName: 'Course Name',
        grade: 'Grade',
        score: 'Score',
        verificationCode: 'Verification Code',
        status: {
          verified: 'Verified',
          pending: 'Pending',
          expired: 'Expired',
          revoked: 'Revoked'
        }
      },
      progress: {
        courseProgress: 'Course Progress',
        overallProgress: 'Overall Progress',
        lessonsCompleted: 'Lessons Completed',
        totalLessons: 'Total Lessons',
        timeSpent: 'Time Spent',
        averageScore: 'Average Score',
        lastActivity: 'Last Activity',
        nextMilestone: 'Next Milestone',
        completionRate: 'Completion Rate'
      },
      achievements: {
        title: 'Achievements',
        noAchievements: 'No achievements yet',
        noAchievementsDesc: 'Complete courses and activities to earn achievements',
        firstCourse: 'First Course',
        firstCourseDesc: 'Complete your first course',
        studyStreak: 'Study Streak',
        studyStreakDesc: 'Study for consecutive days',
        perfectScore: 'Perfect Score',
        perfectScoreDesc: 'Get a perfect score on a quiz',
        earlyBird: 'Early Bird',
        earlyBirdDesc: 'Complete a course within the first week',
        socialLearner: 'Social Learner',
        socialLearnerDesc: 'Participate in forum discussions'
      }
    }
  },
  about: {
    title: 'About Maiko EDU',
    subtitle: 'We are the Congolese of tomorrow, the better fitted head ones. Join us and build our country with brains.',
    ourStory: 'Our Story',
    storyText1: 'Maiko Ltd was born from a powerful connection that began on TikTok, where Congolese diaspora nationals discovered a shared passion for education and community development.',
    storyText2: 'Through our online interactions, we realized that many Congolese people we encountered lacked access to basic skills and knowledge that could transform their lives and careers.',
    storyText3: 'Instead of just talking about the problem, we decided to be the solution. We came together and created this comprehensive e-learning platform that not only provides knowledge but also creates opportunities for financial growth.',
    fromSocialToImpact: 'From social media connections to real-world impact',
    ourMission: 'Our Mission',
    missionSubtitle: 'To empower the Congolese community worldwide with accessible, affordable, and high-quality education while creating sustainable income opportunities.',
    missionPoints: [
      'Comprehensive course library covering essential skills',
      'Affordable pricing with flexible payment options',
      'Community-driven learning environment',
      'Real-world project opportunities',
      'Certification programs for career advancement',
      'Mobile-friendly learning platform'
    ],
    whatWeOffer: 'What We Offer',
    comprehensiveLibrary: 'Comprehensive Course Library',
    affordablePricing: 'Affordable Pricing & Payment',
    pricingText: 'Our courses range from just $5 to $50, making quality education accessible to everyone.',
    values: {
      communityFirst: {
        title: 'Community First',
        description: 'We believe in the power of community and collective growth'
      },
      excellence: {
        title: 'Excellence',
        description: 'Committed to delivering the highest quality educational content'
      },
      globalReach: {
        title: 'Global Reach',
        description: 'Connecting Congolese worldwide through shared learning experiences'
      },
      inclusivity: {
        title: 'Inclusivity',
        description: 'Making education accessible to everyone, regardless of background'
      }
    }
  }
};

// French translations  
const frTranslations = {
  common: {
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Succès !',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Soumettre',
    close: 'Fermer',
    back: 'Retour',
    home: 'Accueil',
    courses: 'Cours',
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: 'S\'inscrire',
    welcome: 'Bienvenue',
    language: 'Langue',
    creating: 'Création en cours'
  },
  courses: {
    title: 'Tous les Cours',
    searchPlaceholder: 'Rechercher par titre, description ou catégorie...',
    category: 'Catégorie',
    difficulty: 'Difficulté',
    sortBy: 'Trier par',
    showing: 'Affichage',
    of: 'de',
    courses: 'cours',
    for: 'pour',
    in: 'dans',
    noCoursesFound: 'Aucun cours trouvé',
    tryAdjusting: 'Essayez d\'ajuster vos termes de recherche ou filtres',
    clearFilters: 'Effacer les Filtres',
    enrollNow: 'S\'inscrire Maintenant',
    enrolling: 'Inscription...',
    instructor: 'Instructeur',
    duration: 'min',
    free: 'Gratuit',
    categories: {
      all: 'Toutes les Catégories',
      business: 'Business',
      technology: 'Technologie',
      arts: 'Arts',
      language: 'Langue',
      health: 'Santé',
      lifeskills: 'Compétences de Vie'
    },
    difficulties: {
      all: 'Tous les Niveaux',
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé'
    },
    sortOptions: {
      newest: 'Plus Récent',
      oldest: 'Plus Ancien',
      priceLow: 'Prix: Bas à Élevé',
      priceHigh: 'Prix: Élevé à Bas',
      title: 'Titre A-Z',
      rating: 'Mieux Noté'
    },
    payment: {
      title: 'Finalisez votre achat',
      fullAccess: 'Accès complet au cours',
      selectMethod: 'Sélectionnez le mode de paiement',
      pay: 'Payer',
      processing: 'Traitement...',
      secure: 'Vos informations de paiement sont sécurisées et cryptées',
      upgrade: 'Passer à l\'accès complet',
      enrolled: 'Inscrit',
      tryFree: 'Essayer gratuitement + Payer plus tard'
    }
  },
  instructor: {
    dashboard: {
      title: 'Tableau de Bord Instructeur',
      welcome: 'Bon retour',
      totalCourses: 'Total des Cours',
      totalStudents: 'Total des Étudiants',
      totalRevenue: 'Revenus Totaux',
      averageRating: 'Note Moyenne',
      myCourses: 'Mes Cours',
      createCourse: 'Créer un Cours',
      createFirstCourse: 'Créer Votre Premier Cours',
      noCourses: 'Aucun cours pour le moment',
      noCoursesDesc: 'Commencez par créer votre premier cours pour commencer à enseigner',
      students: 'étudiants',
      edit: 'Modifier',
      analytics: 'Analytiques',
      recentStudents: 'Étudiants Récents',
      recentActivity: 'Activité Récente'
    },
    courseBuilder: {
      createCourse: 'Créer un Cours',
      cancel: 'Annuler',
      saveCourse: 'Sauvegarder le Cours',
      basic: 'Basique',
      lessons: 'Leçons',
      preview: 'Aperçu',
      courseTitle: 'Titre du Cours',
      courseTitlePlaceholder: 'Entrez le titre de votre cours',
      category: 'Catégorie',
      price: 'Prix',
      difficulty: 'Difficulté',
      courseDescription: 'Description du Cours',
      courseDescriptionPlaceholder: 'Décrivez ce que les étudiants apprendront dans ce cours',
      publishCourse: 'Publier le Cours',
      categories: {
        business: 'Entreprise',
        technology: 'Technologie',
        language: 'Langue',
        health: 'Santé',
        lifeSkills: 'Compétences de Vie'
      },
      difficulties: {
        beginner: 'Débutant',
        intermediate: 'Intermédiaire',
        advanced: 'Avancé'
      },
      lessonTypes: {
        video: 'Vidéo',
        text: 'Texte',
        quiz: 'Quiz',
        assignment: 'Devoir',
        document: 'Document'
      }
    }
  },
  h5p: {
    editor: {
      title: 'Créer du Contenu Interactif',
      contentTitle: 'Titre du Contenu',
      contentDescription: 'Description du Contenu',
      contentType: 'Type de Contenu',
      contentParameters: 'Paramètres du Contenu',
      createContent: 'Créer du Contenu H5P'
    },
    player: {
      placeholderNote: 'Ceci est un lecteur H5P simplifié. Dans une implémentation complète, cela rendrait le contenu H5P réel avec toutes les fonctionnalités interactives.'
    },
    testPage: {
      title: 'Test de Contenu Interactif H5P',
      editorTab: 'Éditeur de Contenu',
      playerTab: 'Lecteur de Contenu',
      playContent: 'Lire le Contenu H5P',
      selectContent: 'Sélectionner le Contenu à Lire',
      noContentSelected: 'Veuillez sélectionner du contenu à lire',
      noContentYet: 'Aucun contenu H5P créé pour le moment. Utilisez l\'éditeur pour créer du contenu !'
    }
  },
  navigation: {
    home: 'Accueil',
    courses: 'Cours',
    about: 'À propos',
    team: 'Équipe',
    contact: 'Contact',
    terms: 'Conditions d\'utilisation'
  },
  organization: {
    title: 'Organisation'
  },
  affiliate: {
    title: 'Affilié'
  },
  home: {
    heroTitle: 'Apprenez Presque N\'importe Quoi avec Maiko EDU',
    heroSubtitle: 'Nous sommes les Congolais de demain, les mieux adaptés. Rejoignez-nous et construisons notre pays avec nos cerveaux. Accédez à des cours abordables de 5$ à 50$ dans tous les domaines.',
    getStartedFree: 'Commencer Gratuitement',
    exploreCourses: 'Explorer Tous les Cours',
    congoleseDiaspora: 'Diaspora Congolaise',
    earningTitle: 'Transformez Votre Connaissance en Revenus',
    earningSubtitle: 'Rejoignez notre programme d\'affiliation et gagnez de l\'argent en partageant des cours avec votre réseau. Aidez les autres à apprendre tout en construisant votre propre flux de revenus.',
    becomeAffiliate: 'Devenir un Affilié',
    startEarning: 'Commencer à Gagner',
    whyChooseMaiko: 'Pourquoi Choisir Maiko EDU?',
    whyChooseMaikoSubtitle: 'Nous fournissons des solutions d\'apprentissage complètes conçues spécifiquement pour la communauté congolaise mondiale.',
    learnAnySkill: 'Apprenez N\'importe Quelle Compétence, N\'importe Où',
    learnAnySkillSubtitle: 'Accédez à notre bibliothèque complète de cours conçus pour vous aider à réussir dans le monde compétitif d\'aujourd\'hui.',
    features: {
      diverseLibrary: {
        title: 'Bibliothèque de Cours Diversifiée',
        description: 'Accédez à des centaines de cours dans plusieurs disciplines'
      },
      expertInstructors: {
        title: 'Instructeurs Experts',
        description: 'Apprenez auprès de professionnels de l\'industrie et d\'éducateurs expérimentés'
      },
      industryCertifications: {
        title: 'Certifications Industrielles',
        description: 'Obtenez des certificats reconnus pour booster votre carrière'
      },
      flexibleLearning: {
        title: 'Apprentissage Flexible',
        description: 'Étudiez à votre propre rythme avec un accès 24/7 aux matériaux'
      }
    },
    courseCategories: {
      business: {
        title: 'Business & Entrepreneuriat',
        count: '25+ Cours',
        description: 'Apprenez les compétences commerciales et lancez votre propre entreprise'
      },
      technology: {
        title: 'Technologie & Programmation',
        count: '40+ Cours',
        description: 'Maîtrisez la technologie moderne et les langages de programmation'
      },
      arts: {
        title: 'Arts & Créatif',
        count: '15+ Cours',
        description: 'Explorez votre côté créatif avec nos cours d\'arts'
      },
      language: {
        title: 'Apprentissage des Langues',
        count: '10+ Cours',
        description: 'Apprenez de nouvelles langues et améliorez vos compétences de communication'
      },
      health: {
        title: 'Santé et Bien-être',
        count: '20+ Cours',
        description: 'Prenez soin de votre santé physique et mentale'
      },
      lifeSkills: {
        title: 'Compétences de Vie et Développement Personnel',
        count: '30+ Cours',
        description: 'Développez des compétences de vie essentielles pour la croissance personnelle'
      }
    },
    howToEarn: {
      title: 'Comment Gagner avec Maiko EDU',
      subtitle: 'Rejoignez notre programme d\'affiliation et commencez à gagner de l\'argent en partageant des connaissances',
      steps: {
        step1: {
          title: 'S\'inscrire',
          description: 'Créez votre compte d\'affilié en quelques minutes'
        },
        step2: {
          title: 'Obtenez Votre Lien',
          description: 'Recevez votre lien de parrainage unique'
        },
        step3: {
          title: 'Partagez des Cours',
          description: 'Partagez des cours avec votre réseau'
        },
        step4: {
          title: 'Gagnez de l\'Argent',
          description: 'Soyez payé pour chaque parrainage réussi'
        }
      },
      cta: {
        title: 'Prêt à Commencer à Gagner?',
        subtitle: 'Rejoignez des milliers d\'affiliés qui gagnent déjà avec Maiko EDU',
        button: 'Rejoindre le Programme d\'Affiliation',
        secondaryButton: 'En Savoir Plus'
      }
    }
  },
  student: {
    dashboard: {
      title: 'Tableau de Bord Étudiant',
      welcome: 'Bon retour',
      overview: 'Aperçu',
      myCourses: 'Mes Cours',
      availableCourses: 'Cours Disponibles',
      stats: {
        totalCourses: 'Total des Cours',
        enrolledCourses: 'Cours Inscrits',
        completedCourses: 'Cours Terminés',
        overallProgress: 'Progrès Global',
        certificatesEarned: 'Certificats Obtenus',
        studyStreak: 'Série d\'Étude',
        totalStudyTime: 'Temps d\'Étude Total',
        averageGrade: 'Note Moyenne'
      },
      courseCard: {
        continue: 'Continuer',
        start: 'Commencer le Cours',
        viewDetails: 'Voir les Détails',
        enrolled: 'Inscrit',
        completed: 'Terminé',
        inProgress: 'En Cours',
        notStarted: 'Pas Commencé',
        progress: 'Progrès',
        lessons: 'leçons',
        duration: 'Durée',
        difficulty: 'Difficulté',
        instructor: 'Instructeur',
        lastAccessed: 'Dernier Accès',
        nextLesson: 'Prochaine Leçon',
        timeSpent: 'Temps Passé'
      },
      activity: {
        recentActivity: 'Activité Récente',
        noActivity: 'Aucune activité récente',
        lessonStarted: 'A commencé la leçon',
        lessonCompleted: 'A terminé la leçon',
        quizAttempted: 'A tenté le quiz',
        assignmentSubmitted: 'A soumis le devoir',
        courseCompleted: 'A terminé le cours',
        certificateEarned: 'A obtenu un certificat',
        forumPost: 'A posté dans le forum',
        videoWatched: 'A regardé la vidéo'
      },
      certificates: {
        title: 'Mes Certificats',
        noCertificates: 'Aucun certificat obtenu pour le moment',
        noCertificatesDesc: 'Terminez des cours pour obtenir des certificats',
        viewCertificate: 'Voir le Certificat',
        downloadCertificate: 'Télécharger le Certificat',
        verifyCertificate: 'Vérifier le Certificat',
        issuedDate: 'Date d\'Émission',
        courseName: 'Nom du Cours',
        grade: 'Note',
        score: 'Score',
        verificationCode: 'Code de Vérification',
        status: {
          verified: 'Vérifié',
          pending: 'En Attente',
          expired: 'Expiré',
          revoked: 'Révoqué'
        }
      },
      progress: {
        courseProgress: 'Progrès du Cours',
        overallProgress: 'Progrès Global',
        lessonsCompleted: 'Leçons Terminées',
        totalLessons: 'Total des Leçons',
        timeSpent: 'Temps Passé',
        averageScore: 'Score Moyen',
        lastActivity: 'Dernière Activité',
        nextMilestone: 'Prochaine Étape',
        completionRate: 'Taux de Completion'
      },
      achievements: {
        title: 'Réalisations',
        noAchievements: 'Aucune réalisation pour le moment',
        noAchievementsDesc: 'Terminez des cours et des activités pour obtenir des réalisations',
        firstCourse: 'Premier Cours',
        firstCourseDesc: 'Terminez votre premier cours',
        studyStreak: 'Série d\'Étude',
        studyStreakDesc: 'Étudiez pendant des jours consécutifs',
        perfectScore: 'Score Parfait',
        perfectScoreDesc: 'Obtenez un score parfait à un quiz',
        earlyBird: 'Lève-tôt',
        earlyBirdDesc: 'Terminez un cours dans la première semaine',
        socialLearner: 'Apprenant Social',
        socialLearnerDesc: 'Participez aux discussions du forum'
      }
    }
  },
  about: {
    title: 'À propos de Maiko EDU',
    subtitle: 'Nous sommes les Congolais de demain, les mieux adaptés. Rejoignez-nous et construisons notre pays avec nos cerveaux.',
    ourStory: 'Notre Histoire',
    storyText1: 'Maiko Ltd est née d\'une connexion puissante qui a commencé sur TikTok, où les nationaux de la diaspora congolaise ont découvert une passion partagée pour l\'éducation et le développement communautaire.',
    storyText2: 'À travers nos interactions en ligne, nous avons réalisé que de nombreux Congolais que nous avons rencontrés n\'avaient pas accès aux compétences et connaissances de base qui pourraient transformer leur vie et leur carrière.',
    storyText3: 'Au lieu de simplement parler du problème, nous avons décidé d\'être la solution. Nous nous sommes réunis et avons créé cette plateforme d\'apprentissage en ligne complète qui non seulement fournit des connaissances mais crée aussi des opportunités de croissance financière.',
    fromSocialToImpact: 'Des connexions sur les réseaux sociaux à l\'impact dans le monde réel',
    ourMission: 'Notre Mission',
    missionSubtitle: 'Autonomiser la communauté congolaise mondiale avec une éducation accessible, abordable et de haute qualité tout en créant des opportunités de revenus durables.',
    missionPoints: [
      'Bibliothèque de cours complète couvrant les compétences essentielles',
      'Prix abordables avec des options de paiement flexibles',
      'Environnement d\'apprentissage communautaire',
      'Opportunités de projets du monde réel',
      'Programmes de certification pour l\'avancement professionnel',
      'Plateforme d\'apprentissage compatible mobile'
    ],
    whatWeOffer: 'Ce que Nous Offrons',
    comprehensiveLibrary: 'Bibliothèque de Cours Complète',
    affordablePricing: 'Tarification et Paiement Abordables',
    pricingText: 'Nos cours vont de seulement 5$ à 50$, rendant l\'éducation de qualité accessible à tous.',
    values: {
      communityFirst: {
        title: 'Communauté d\'Abord',
        description: 'Nous croyons en la puissance de la communauté et de la croissance collective'
      },
      excellence: {
        title: 'Excellence',
        description: 'Engagés à fournir le contenu éducatif de la plus haute qualité'
      },
      globalReach: {
        title: 'Portée Mondiale',
        description: 'Connecter les Congolais du monde entier à travers des expériences d\'apprentissage partagées'
      },
      inclusivity: {
        title: 'Inclusivité',
        description: 'Rendre l\'éducation accessible à tous, quel que soit le milieu'
      }
    }
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations }
    },
    fallbackLng: 'en',
    debug: false, // Disable debug mode for production
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');
  const [isReady] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    setDirection(languages[savedLanguage]?.direction || 'ltr');
    
    // Change language if i18next is ready
    if (i18n.isInitialized) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language) => {
    if (languages[language]) {
      setCurrentLanguage(language);
      setDirection(languages[language].direction);
      i18n.changeLanguage(language);
      localStorage.setItem('language', language);
      
      document.documentElement.dir = languages[language].direction;
      document.documentElement.lang = language;
    }
  };

  const t = (key, options = {}) => {
    try {
      // Check if it's a privacy key first
      if (privacyTranslations[currentLanguage] && privacyTranslations[currentLanguage][key]) {
        return privacyTranslations[currentLanguage][key];
      }

      // Check if it's a terms key
      if (termsTranslations[currentLanguage] && termsTranslations[currentLanguage][key]) {
        return termsTranslations[currentLanguage][key];
      }

      // Check if it's a team key
      if (teamTranslations[currentLanguage] && teamTranslations[currentLanguage][key]) {
        return teamTranslations[currentLanguage][key];
      }

      // Direct access to translation objects
      const translations = currentLanguage === 'fr' ? frTranslations : enTranslations;
      
      // Navigate through the key path
      const keys = key.split('.');
      let result = translations;
      
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          console.warn(`Translation key "${key}" not found at "${k}" in language "${currentLanguage}"`);
          return key;
        }
      }
      
      if (result !== undefined) {
        return result;
      }
      
      // Fallback to i18n.t if direct access fails
      const translation = i18n.t(key, options);
      if (translation !== key) {
        return translation;
      }
      
      console.warn(`Translation key "${key}" not found in language "${currentLanguage}"`);
      return key;
    } catch (error) {
      console.warn(`Translation key "${key}" not found:`, error);
      return key;
    }
  };

  const value = {
    currentLanguage,
    direction,
    languages,
    changeLanguage,
    t,
    isReady
  };


  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};