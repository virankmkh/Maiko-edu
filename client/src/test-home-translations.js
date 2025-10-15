// Comprehensive Home Page Translation Test
import { useLanguage } from './context/LanguageContext';

export const testHomeTranslations = () => {
  const { t, currentLanguage } = useLanguage();
  
  console.log(`🧪 Testing Home Page Translations in ${currentLanguage.toUpperCase()}`);
  console.log('='.repeat(60));
  
  // Test all home page translation keys
  const testKeys = [
    // Hero Section
    'home.heroTitle',
    'home.heroSubtitle',
    'home.exploreCourses',
    'home.getStartedFree',
    'home.congoleseDiaspora',
    
    // Earning Section
    'home.earningTitle',
    'home.earningSubtitle',
    'home.becomeAffiliate',
    'home.startEarning',
    
    // Why Choose Section
    'home.whyChooseMaiko',
    'home.whyChooseMaikoSubtitle',
    
    // Features
    'home.features.diverseLibrary.title',
    'home.features.diverseLibrary.description',
    'home.features.expertInstructors.title',
    'home.features.expertInstructors.description',
    'home.features.industryCertifications.title',
    'home.features.industryCertifications.description',
    'home.features.flexibleLearning.title',
    'home.features.flexibleLearning.description',
    
    // Course Categories
    'home.learnAnySkill',
    'home.learnAnySkillSubtitle',
    'home.courseCategories.business.title',
    'home.courseCategories.business.count',
    'home.courseCategories.business.description',
    'home.courseCategories.technology.title',
    'home.courseCategories.technology.count',
    'home.courseCategories.technology.description',
    'home.courseCategories.arts.title',
    'home.courseCategories.arts.count',
    'home.courseCategories.arts.description',
    'home.courseCategories.language.title',
    'home.courseCategories.language.count',
    'home.courseCategories.language.description',
    'home.courseCategories.health.title',
    'home.courseCategories.health.count',
    'home.courseCategories.health.description',
    'home.courseCategories.lifeSkills.title',
    'home.courseCategories.lifeSkills.count',
    'home.courseCategories.lifeSkills.description',
    
    // How to Earn Section
    'home.howToEarn.title',
    'home.howToEarn.subtitle',
    'home.howToEarn.steps.step1.title',
    'home.howToEarn.steps.step1.description',
    'home.howToEarn.steps.step2.title',
    'home.howToEarn.steps.step2.description',
    'home.howToEarn.steps.step3.title',
    'home.howToEarn.steps.step3.description',
    'home.howToEarn.steps.step4.title',
    'home.howToEarn.steps.step4.description',
    
    // Benefits Section
    'home.howToEarn.benefits.title',
    'home.howToEarn.benefits.highCommission.title',
    'home.howToEarn.benefits.highCommission.description',
    'home.howToEarn.benefits.easyPayments.title',
    'home.howToEarn.benefits.easyPayments.description',
    'home.howToEarn.benefits.marketingMaterials.title',
    'home.howToEarn.benefits.marketingMaterials.description',
    
    // CTA Section
    'home.howToEarn.cta.title',
    'home.howToEarn.cta.subtitle',
    'home.howToEarn.cta.button',
    'home.howToEarn.cta.secondaryButton',
    
    // Popular Courses
    'home.popularCourses',
    'home.popularCoursesSubtitle'
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  const failedKeys = [];
  
  console.log('📋 Testing Translation Keys:');
  console.log('-'.repeat(60));
  
  testKeys.forEach((key, index) => {
    const translation = t(key);
    const isTranslated = translation !== key && translation.length > 0;
    
    if (isTranslated) {
      console.log(`✅ ${index + 1}. ${key}: "${translation}"`);
      passedTests++;
    } else {
      console.log(`❌ ${index + 1}. ${key}: "${translation}" (FAILED)`);
      failedTests++;
      failedKeys.push(key);
    }
  });
  
  console.log('-'.repeat(60));
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${Math.round((passedTests / testKeys.length) * 100)}%`);
  
  if (failedKeys.length > 0) {
    console.log('\n❌ Failed Keys:');
    failedKeys.forEach(key => console.log(`   - ${key}`));
  }
  
  console.log('\n🎯 Expected Results:');
  if (currentLanguage === 'en') {
    console.log('   - All text should be in English');
    console.log('   - No raw translation keys should be visible');
    console.log('   - Benefits section should show "Why Join Our Affiliate Program?"');
  } else if (currentLanguage === 'fr') {
    console.log('   - All text should be in French');
    console.log('   - No raw translation keys should be visible');
    console.log('   - Benefits section should show "Pourquoi Rejoindre Notre Programme d\'Affiliation?"');
  }
  
  return {
    passed: passedTests,
    failed: failedTests,
    successRate: Math.round((passedTests / testKeys.length) * 100),
    failedKeys,
    currentLanguage
  };
};

// Test both languages
export const testBothLanguages = () => {
  console.log('🌍 Testing Both Languages');
  console.log('='.repeat(60));
  
  // This would need to be called from within a component that has access to the language context
  // For now, we'll provide instructions for manual testing
  console.log('📝 Manual Testing Instructions:');
  console.log('1. Switch to English and run testHomeTranslations()');
  console.log('2. Switch to French and run testHomeTranslations()');
  console.log('3. Compare results between both languages');
};
