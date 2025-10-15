const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testServerLogin() {
  try {
    console.log('🧪 Testing server login...\n');
    
    // Test 1: Check if server is responding
    console.log('1. Testing server health...');
    try {
      const healthResponse = await fetch('http://localhost:5001/api/auth');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('✅ Server is responding');
        console.log('Auth endpoints:', healthData.endpoints);
      } else {
        console.log('❌ Server health check failed:', healthResponse.status);
      }
    } catch (healthError) {
      console.log('❌ Server health error:', healthError.message);
      return;
    }
    
    // Test 2: Test login with correct credentials
    console.log('\n2. Testing login with correct credentials...');
    try {
      const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'sarah.johnson@maiko.edu',
          password: 'password'
        })
      });
      
      console.log('Login response status:', loginResponse.status);
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful!');
        console.log('User:', loginData.user.firstName, loginData.user.lastName);
        console.log('Role:', loginData.user.role);
        console.log('Token length:', loginData.token ? loginData.token.length : 'No token');
      } else {
        const errorText = await loginResponse.text();
        console.log('❌ Login failed:', loginResponse.status, errorText);
      }
    } catch (loginError) {
      console.log('❌ Login error:', loginError.message);
    }
    
    // Test 3: Test login with wrong credentials
    console.log('\n3. Testing login with wrong credentials...');
    try {
      const wrongResponse = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'sarah.johnson@maiko.edu',
          password: 'wrongpassword'
        })
      });
      
      console.log('Wrong login response status:', wrongResponse.status);
      const wrongError = await wrongResponse.text();
      console.log('Wrong login error:', wrongError);
    } catch (wrongError) {
      console.log('❌ Wrong login error:', wrongError.message);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testServerLogin();
