// Debug utility to check user status and permissions
export const debugUser = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  console.log('🔍 User Debug Information:');
  console.log('========================');
  console.log('Token exists:', !!token);
  console.log('Token length:', token ? token.length : 0);
  console.log('User data:', user);
  
  if (user) {
    console.log('User role:', user.role);
    console.log('Can create courses:', user.role === 'instructor' || user.role === 'organization_admin');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
  } else {
    console.log('❌ No user data found in localStorage');
  }
  
  return { token, user };
};

// Test course creation API
export const testCourseCreation = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('❌ No token found - please log in first');
    return;
  }
  
  try {
    console.log('🧪 Testing course creation API...');
    
    const testCourseData = {
      title: 'Debug Test Course',
      category: 'technology',
      shortDescription: 'A test course for debugging',
      fullDescription: 'This is a test course created for debugging purposes',
      difficulty: 'beginner',
      language: 'english',
      price: 10,
      duration: '1 hour'
    };
    
    const response = await fetch('http://localhost:5001/api/courses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCourseData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Course creation test successful!');
      console.log('Created course:', result);
    } else {
      console.log('❌ Course creation test failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
    
  } catch (error) {
    console.log('❌ Course creation test error:', error.message);
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.debugUser = debugUser;
  window.testCourseCreation = testCourseCreation;
}
