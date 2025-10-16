const axios = require('axios');

const API_BASE_URL = 'https://maiko-edu-backend-1.onrender.com/api';

async function testEventCDAPI() {
  console.log('🧪 Testing Event CD API...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const testResponse = await axios.get(`${API_BASE_URL}/test`);
    console.log('✅ Server is running:', testResponse.data.message);

    // Test 2: Test events endpoint
    console.log('\n2. Testing events endpoint...');
    try {
      const eventsResponse = await axios.get(`${API_BASE_URL}/events`);
      console.log('✅ Events endpoint working:', eventsResponse.data);
    } catch (error) {
      console.log('❌ Events endpoint error:', error.response?.data || error.message);
    }

    // Test 3: Test creating a test event
    console.log('\n3. Testing event creation...');
    try {
      const testEvent = {
        title: 'Test Event',
        description: 'This is a test event',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 7 days + 2 hours
        organizerId: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        category: 'other',
        eventType: 'offline',
        location: 'Test Location',
        isPublic: true,
        isPublished: true,
        status: 'published'
      };

      const createResponse = await axios.post(`${API_BASE_URL}/events`, testEvent);
      console.log('✅ Event creation working:', createResponse.data);
    } catch (error) {
      console.log('❌ Event creation error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
  }
}

testEventCDAPI();
