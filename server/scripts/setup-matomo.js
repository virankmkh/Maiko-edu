const { sequelize, models } = require('../config/database');
const matomoService = require('../services/matomoService');

const setupMatomo = async () => {
  try {
    console.log('🔧 Setting up Matomo Analytics...\n');
    
    // Initialize Matomo service
    console.log('1. Initializing Matomo service...');
    const initialized = await matomoService.initialize();
    
    if (!initialized) {
      console.log('⚠️ Matomo service not available. Please ensure Matomo is running.');
      console.log('💡 To set up Matomo:');
      console.log('   1. Download Matomo from https://matomo.org/download/');
      console.log('   2. Install it on your server (e.g., http://localhost:8080)');
      console.log('   3. Create a site and get the Site ID');
      console.log('   4. Generate an auth token in Matomo admin');
      console.log('   5. Update your .env file with:');
      console.log('      MATOMO_URL=http://localhost:8080');
      console.log('      MATOMO_SITE_ID=1');
      console.log('      MATOMO_AUTH_TOKEN=your_auth_token_here');
      console.log('      MATOMO_TRACKING_ENABLED=true');
      return;
    }
    
    console.log('✅ Matomo service initialized successfully');
    
    // Test basic tracking
    console.log('\n2. Testing basic tracking...');
    await matomoService.trackPageView(1, 'Matomo Setup Test', '/setup-test');
    console.log('✅ Basic tracking test completed');
    
    // Test course enrollment tracking
    console.log('\n3. Testing course enrollment tracking...');
    const course = await models.Course.findOne();
    if (course) {
      await matomoService.trackCourseEnrollment(1, course.id, course.title, course.price || 0);
      console.log(`✅ Course enrollment tracking test completed for: ${course.title}`);
    } else {
      console.log('⚠️ No courses found for testing');
    }
    
    // Test lesson completion tracking
    console.log('\n4. Testing lesson completion tracking...');
    const lesson = await models.Lesson.findOne();
    if (lesson) {
      await matomoService.trackLessonCompletion(1, lesson.courseId, lesson.id, lesson.title, lesson.lessonType, 30);
      console.log(`✅ Lesson completion tracking test completed for: ${lesson.title}`);
    } else {
      console.log('⚠️ No lessons found for testing');
    }
    
    // Test H5P interaction tracking
    console.log('\n5. Testing H5P interaction tracking...');
    await matomoService.trackH5PInteraction(1, 1, 1, 'H5P.InteractiveVideo', 'Start', null);
    console.log('✅ H5P interaction tracking test completed');
    
    // Test video watch tracking
    console.log('\n6. Testing video watch tracking...');
    await matomoService.trackVideoWatch(1, 1, 1, 'Test Video', 120, 300, 0.4);
    console.log('✅ Video watch tracking test completed');
    
    // Test quiz submission tracking
    console.log('\n7. Testing quiz submission tracking...');
    await matomoService.trackQuizSubmission(1, 1, 1, 'Test Quiz', 8, 10, 300);
    console.log('✅ Quiz submission tracking test completed');
    
    // Test Jitsi session tracking
    console.log('\n8. Testing Jitsi session tracking...');
    await matomoService.trackJitsiSession(1, 1, 'session-123', 'Live Lesson', 1800, 5);
    console.log('✅ Jitsi session tracking test completed');
    
    // Test forum activity tracking
    console.log('\n9. Testing forum activity tracking...');
    await matomoService.trackForumActivity(1, 1, 1, 'Post', 'Test Forum Post');
    console.log('✅ Forum activity tracking test completed');
    
    console.log('\n🎉 Matomo setup completed successfully!');
    console.log('\n📊 Analytics Features Ready:');
    console.log('✅ Page view tracking');
    console.log('✅ Course enrollment tracking');
    console.log('✅ Lesson completion tracking');
    console.log('✅ H5P interaction tracking');
    console.log('✅ Video watch time tracking');
    console.log('✅ Quiz submission tracking');
    console.log('✅ Jitsi session tracking');
    console.log('✅ Forum activity tracking');
    
    console.log('\n🔗 Next Steps:');
    console.log('1. Access your Matomo dashboard to view analytics');
    console.log('2. Configure custom dashboards for instructors');
    console.log('3. Set up automated reports');
    console.log('4. Integrate analytics into the frontend');
    
  } catch (error) {
    console.error('❌ Matomo setup failed:', error);
  } finally {
    await sequelize.close();
  }
};

setupMatomo();
