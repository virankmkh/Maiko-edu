const { sequelize, models } = require('./config/database');

async function checkCourses() {
  try {
    const courses = await models.Course.findAll({
      attributes: ['id', 'title', 'slug', 'category', 'price']
    });
    
    console.log('Existing courses:');
    courses.forEach(course => {
      console.log(`- ${course.title} (${course.slug}) - $${course.price} - ${course.category}`);
    });
    
    console.log(`\nTotal courses: ${courses.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkCourses();
