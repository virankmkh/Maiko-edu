const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    console.log('🧪 Testing bcrypt directly...\n');
    
    const password = 'password';
    console.log('🔐 Testing password:', password);
    
    // Hash the password
    const hash = await bcrypt.hash(password, 10);
    console.log('🔑 Generated hash:', hash);
    
    // Test verification
    const isValid = await bcrypt.compare(password, hash);
    console.log('✅ Verification result:', isValid ? 'Valid' : 'Invalid');
    
    // Test with different password
    const isInvalid = await bcrypt.compare('wrongpassword', hash);
    console.log('❌ Wrong password test:', isInvalid ? 'Valid (ERROR!)' : 'Invalid (CORRECT)');
    
    // Test with empty string
    const isEmpty = await bcrypt.compare('', hash);
    console.log('🔍 Empty password test:', isEmpty ? 'Valid (ERROR!)' : 'Invalid (CORRECT)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBcrypt();
