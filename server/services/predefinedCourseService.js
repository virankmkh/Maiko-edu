const predefinedCourses = require('../config/predefinedCourses');

class PredefinedCourseService {
  /**
   * Get all available categories
   */
  static getCategories() {
    return Object.keys(predefinedCourses).map(key => ({
      key,
      name: predefinedCourses[key].category
    }));
  }

  /**
   * Get subcategories for a specific category
   */
  static getSubcategories(categoryKey) {
    if (!predefinedCourses[categoryKey]) {
      return [];
    }
    
    return Object.keys(predefinedCourses[categoryKey].subcategories).map(key => ({
      key,
      name: predefinedCourses[categoryKey].subcategories[key].name
    }));
  }

  /**
   * Get predefined courses for a specific category and subcategory
   */
  static getPredefinedCourses(categoryKey, subcategoryKey = null) {
    if (!predefinedCourses[categoryKey]) {
      return [];
    }

    if (subcategoryKey) {
      // Return courses for specific subcategory
      const subcategory = predefinedCourses[categoryKey].subcategories[subcategoryKey];
      return subcategory ? subcategory.courses : [];
    }

    // Return all courses for the category
    const allCourses = [];
    Object.values(predefinedCourses[categoryKey].subcategories).forEach(subcategory => {
      allCourses.push(...subcategory.courses);
    });
    return allCourses;
  }

  /**
   * Get a specific predefined course by title
   */
  static getPredefinedCourseByTitle(categoryKey, title) {
    const courses = this.getPredefinedCourses(categoryKey);
    return courses.find(course => course.title === title);
  }

  /**
   * Check if a course title is predefined for a category
   */
  static isPredefinedCourse(categoryKey, title) {
    const course = this.getPredefinedCourseByTitle(categoryKey, title);
    return !!course;
  }

  /**
   * Get course template data for creation
   */
  static getCourseTemplate(categoryKey, title) {
    const course = this.getPredefinedCourseByTitle(categoryKey, title);
    if (!course) {
      throw new Error('Predefined course not found');
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      shortDescription: course.shortDescription,
      category: categoryKey,
      subcategory: this.getSubcategoryForCourse(categoryKey, title),
      tags: course.tags,
      difficulty: course.difficulty,
      level: course.level,
      slug,
      estimatedDuration: course.estimatedDuration,
      prerequisites: course.prerequisites
    };
  }

  /**
   * Get subcategory for a specific course
   */
  static getSubcategoryForCourse(categoryKey, title) {
    if (!predefinedCourses[categoryKey]) {
      return null;
    }

    for (const [subcategoryKey, subcategory] of Object.entries(predefinedCourses[categoryKey].subcategories)) {
      const course = subcategory.courses.find(c => c.title === title);
      if (course) {
        return subcategoryKey;
      }
    }
    return null;
  }

  /**
   * Validate if a course can be created for a category
   */
  static validateCourseCreation(categoryKey, title) {
    // For arts category, only predefined courses are allowed
    if (categoryKey === 'arts') {
      if (!this.isPredefinedCourse(categoryKey, title)) {
        throw new Error('Only predefined courses are allowed for Arts & Compétences Créatives category. Please select from the available course templates.');
      }
    }
    return true;
  }

  /**
   * Get all predefined courses formatted for frontend display
   */
  static getFormattedCourses(categoryKey) {
    if (!predefinedCourses[categoryKey]) {
      return [];
    }

    const formatted = [];
    Object.entries(predefinedCourses[categoryKey].subcategories).forEach(([subcategoryKey, subcategory]) => {
      subcategory.courses.forEach(course => {
        formatted.push({
          ...course,
          subcategory: subcategoryKey,
          subcategoryName: subcategory.name,
          category: categoryKey
        });
      });
    });

    return formatted;
  }
}

module.exports = PredefinedCourseService;
