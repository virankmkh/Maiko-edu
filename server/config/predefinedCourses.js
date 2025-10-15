const predefinedCourses = {
  arts: {
    category: 'Arts & Compétences Créatives',
    subcategories: {
      digital_design: {
        name: 'Digital Design',
        courses: [
          {
            title: 'Foundations of Graphic Design',
            subtitle: 'Core principles of design, typography, color theory, and visual hierarchy',
            description: 'Learn the fundamental principles of graphic design including typography, color theory, layout, and visual hierarchy. This course covers essential design concepts using industry-standard software like Figma and Adobe Illustrator.',
            shortDescription: 'Master the core principles of graphic design with Figma and Adobe Illustrator',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['design', 'typography', 'color-theory', 'figma', 'illustrator'],
            estimatedDuration: '6 weeks',
            prerequisites: ['Basic computer skills', 'Access to design software']
          },
          {
            title: 'Introduction to UI/UX Design',
            subtitle: 'Complete user experience design process from research to prototyping',
            description: 'Comprehensive course covering the entire user experience design process from research and wireframing to prototyping and usability testing for websites and mobile applications.',
            shortDescription: 'Learn the complete UX design process for web and mobile apps',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['ui', 'ux', 'wireframing', 'prototyping', 'usability'],
            estimatedDuration: '8 weeks',
            prerequisites: ['Basic understanding of design principles', 'Access to design tools']
          },
          {
            title: 'Digital Illustration with Procreate',
            subtitle: 'Create digital art on iPad using Procreate app',
            description: 'Master digital illustration techniques using the powerful Procreate app on iPad. Learn about brushes, layers, workflow, and professional digital art creation methods.',
            shortDescription: 'Master digital art creation with Procreate on iPad',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['digital-art', 'procreate', 'illustration', 'ipad', 'brushes'],
            estimatedDuration: '5 weeks',
            prerequisites: ['iPad with Procreate app', 'Basic drawing skills']
          },
          {
            title: 'Branding & Identity Design',
            subtitle: 'Create complete brand identity including logos and style guides',
            description: 'Learn to create comprehensive brand identities including logo design, color palettes, typography choices, and complete brand style guides for businesses and organizations.',
            shortDescription: 'Design complete brand identities and style guides',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['branding', 'logo-design', 'identity', 'style-guide', 'brand-strategy'],
            estimatedDuration: '7 weeks',
            prerequisites: ['Foundations of Graphic Design', 'Basic understanding of business concepts']
          },
          {
            title: 'Motion Graphics for Social Media',
            subtitle: 'Create engaging animated graphics for Instagram, TikTok, and YouTube',
            description: 'Learn to create short, engaging animated graphics and videos for social media platforms using Adobe After Effects. Perfect for content creators and social media marketers.',
            shortDescription: 'Create animated content for social media platforms',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['motion-graphics', 'after-effects', 'social-media', 'animation', 'video'],
            estimatedDuration: '6 weeks',
            prerequisites: ['Basic video editing knowledge', 'Access to Adobe After Effects']
          }
        ]
      },
      visual_arts_photography: {
        name: 'Visual Arts & Photography',
        courses: [
          {
            title: 'Digital Photography Essentials',
            subtitle: 'Master DSLR and mirrorless camera fundamentals',
            description: 'Complete beginner course on using DSLR or mirrorless cameras. Covers exposure, composition, lighting techniques, and post-processing in Adobe Lightroom.',
            shortDescription: 'Learn professional photography with DSLR and mirrorless cameras',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['photography', 'dslr', 'mirrorless', 'lightroom', 'composition'],
            estimatedDuration: '6 weeks',
            prerequisites: ['DSLR or mirrorless camera', 'Access to Adobe Lightroom']
          },
          {
            title: 'Portrait Photography',
            subtitle: 'Master techniques for compelling portrait photography',
            description: 'Learn professional portrait photography techniques including posing, lighting setups, working with models, and creating compelling portraits in various settings.',
            shortDescription: 'Master professional portrait photography techniques',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['portrait', 'photography', 'lighting', 'posing', 'studio'],
            estimatedDuration: '5 weeks',
            prerequisites: ['Digital Photography Essentials', 'Basic lighting equipment']
          },
          {
            title: 'Digital Painting Fundamentals',
            subtitle: 'Learn digital painting techniques and workflows',
            description: 'Master the fundamentals of digital painting including color blending, texture brushes, light and shadow techniques, and professional digital art workflows.',
            shortDescription: 'Master digital painting fundamentals and techniques',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['digital-painting', 'art', 'brushes', 'color-blending', 'texture'],
            estimatedDuration: '7 weeks',
            prerequisites: ['Digital art software (Photoshop, Procreate, etc.)', 'Basic drawing skills']
          },
          {
            title: 'Street Photography',
            subtitle: 'Capture life in public spaces with ethical considerations',
            description: 'Learn the art of candidly capturing life in public spaces. Covers compositional techniques, ethical considerations, and storytelling through street photography.',
            shortDescription: 'Master the art of street and candid photography',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['street-photography', 'candid', 'composition', 'storytelling', 'ethics'],
            estimatedDuration: '4 weeks',
            prerequisites: ['Digital Photography Essentials', 'Comfortable with public photography']
          },
          {
            title: 'Product Photography for E-commerce',
            subtitle: 'Create high-quality product photos for online stores',
            description: 'Learn professional product photography techniques including styling, shooting, and editing high-quality product photos specifically for e-commerce platforms.',
            shortDescription: 'Master product photography for online retail',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['product-photography', 'e-commerce', 'styling', 'editing', 'commercial'],
            estimatedDuration: '5 weeks',
            prerequisites: ['Digital Photography Essentials', 'Basic lighting setup']
          }
        ]
      },
      media_production: {
        name: 'Media & Production',
        courses: [
          {
            title: 'Video Editing with DaVinci Resolve',
            subtitle: 'Professional video editing and color grading',
            description: 'Comprehensive course on professional video editing using DaVinci Resolve. Covers video and audio synchronization, color grading, and final export settings.',
            shortDescription: 'Master professional video editing with DaVinci Resolve',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['video-editing', 'davinci-resolve', 'color-grading', 'post-production'],
            estimatedDuration: '8 weeks',
            prerequisites: ['Basic computer skills', 'Access to DaVinci Resolve (free)']
          },
          {
            title: 'Introduction to 3D Modeling',
            subtitle: 'Create three-dimensional objects and environments with Blender',
            description: 'Learn the fundamentals of creating three-dimensional objects and environments using the free and powerful Blender software.',
            shortDescription: 'Master 3D modeling fundamentals with Blender',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['3d-modeling', 'blender', '3d-art', 'modeling', 'texturing'],
            estimatedDuration: '10 weeks',
            prerequisites: ['Basic computer skills', 'Access to Blender (free)']
          },
          {
            title: 'Audio Production for Beginners',
            subtitle: 'Record, mix, and master audio for podcasts and music',
            description: 'Complete course on recording, mixing, and mastering audio for podcasts, music, and videos using digital audio workstation (DAW) software.',
            shortDescription: 'Master audio production for podcasts and music',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['audio-production', 'podcasting', 'music', 'daw', 'mixing'],
            estimatedDuration: '6 weeks',
            prerequisites: ['Basic computer skills', 'Access to DAW software']
          },
          {
            title: 'Animation Basics (2D & 3D)',
            subtitle: 'Learn animation principles from bouncing balls to keyframe animation',
            description: 'Comprehensive overview of animation principles, from creating simple bouncing balls to advanced keyframe animation using software like Blender.',
            shortDescription: 'Master 2D and 3D animation fundamentals',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['animation', '2d', '3d', 'keyframes', 'blender'],
            estimatedDuration: '9 weeks',
            prerequisites: ['Basic 3D modeling knowledge', 'Access to animation software']
          },
          {
            title: 'Podcasting: From Idea to Launch',
            subtitle: 'Complete guide to creating and launching a podcast',
            description: 'Step-by-step guide through the entire podcast creation process including content planning, recording, editing, and distribution across platforms.',
            shortDescription: 'Launch your own podcast from concept to distribution',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['podcasting', 'audio', 'content-creation', 'distribution', 'marketing'],
            estimatedDuration: '6 weeks',
            prerequisites: ['Basic computer skills', 'Microphone and recording equipment']
          }
        ]
      },
      creative_writing_communication: {
        name: 'Creative Writing & Communication',
        courses: [
          {
            title: 'Creative Writing for Storytelling',
            subtitle: 'Develop plot, characters, and dialogue for fiction and screenwriting',
            description: 'Master the art of creative writing including developing compelling plots, creating memorable characters, and writing engaging dialogue for fiction, non-fiction, and screenwriting.',
            shortDescription: 'Master creative writing for fiction and screenwriting',
            difficulty: 'beginner',
            level: 'basic',
            tags: ['creative-writing', 'storytelling', 'fiction', 'screenwriting', 'characters'],
            estimatedDuration: '8 weeks',
            prerequisites: ['Basic writing skills', 'Access to word processing software']
          },
          {
            title: 'Copywriting for Marketing',
            subtitle: 'Write persuasive text for websites, emails, and advertisements',
            description: 'Learn to write compelling and effective copy for websites, emails, advertisements, and marketing materials that drive action and engagement.',
            shortDescription: 'Master persuasive copywriting for marketing',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['copywriting', 'marketing', 'advertising', 'persuasion', 'sales'],
            estimatedDuration: '6 weeks',
            prerequisites: ['Basic writing skills', 'Understanding of marketing concepts']
          },
          {
            title: 'The Art of Spoken Word Poetry',
            subtitle: 'Performance and writing of poetry for live audiences',
            description: 'Learn the art of spoken word poetry including writing techniques, performance skills, stage presence, and connecting with live audiences.',
            shortDescription: 'Master spoken word poetry writing and performance',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['poetry', 'spoken-word', 'performance', 'writing', 'stage-presence'],
            estimatedDuration: '5 weeks',
            prerequisites: ['Basic writing skills', 'Comfortable with public speaking']
          },
          {
            title: 'Grant Writing for Artists',
            subtitle: 'Write successful grant proposals to fund artistic projects',
            description: 'Learn the essential skills needed to write successful grant proposals to fund artistic projects, exhibitions, and creative endeavors.',
            shortDescription: 'Master grant writing for artistic projects and funding',
            difficulty: 'advanced',
            level: 'advanced',
            tags: ['grant-writing', 'funding', 'proposals', 'arts', 'nonprofit'],
            estimatedDuration: '4 weeks',
            prerequisites: ['Advanced writing skills', 'Understanding of project management']
          },
          {
            title: 'Content Creation for Digital Platforms',
            subtitle: 'Plan, produce, and distribute content across digital platforms',
            description: 'Comprehensive course on planning, producing, and distributing content (articles, videos, social posts) to build an online presence and audience.',
            shortDescription: 'Master content creation and distribution for digital platforms',
            difficulty: 'intermediate',
            level: 'intermediate',
            tags: ['content-creation', 'digital-marketing', 'social-media', 'blogging', 'strategy'],
            estimatedDuration: '7 weeks',
            prerequisites: ['Basic writing skills', 'Access to content creation tools']
          }
        ]
      }
    }
  }
};

module.exports = predefinedCourses;
