/**
 * Toggle Payment Mode Script
 * 
 * This script helps you easily switch between development mode (no payments) 
 * and production mode (payments required) for the Maiko EDU platform.
 * 
 * Usage:
 * - node toggle-payment-mode.js dev    (disable payments for development)
 * - node toggle-payment-mode.js prod   (enable payments for production)
 */

const fs = require('fs');
const path = require('path');

const PAYMENT_SERVICE_PATH = path.join(__dirname, 'services', 'paymentService.js');

function togglePaymentMode(mode) {
  try {
    let content = fs.readFileSync(PAYMENT_SERVICE_PATH, 'utf8');
    
    if (mode === 'dev') {
      // Enable development mode
      content = content.replace(
        /\/\/ DEVELOPMENT MODE: Allow access to all lessons/g,
        '// DEVELOPMENT MODE: Allow access to all lessons'
      );
      content = content.replace(
        /\/\* COMMENTED OUT FOR DEVELOPMENT/g,
        '/* COMMENTED OUT FOR DEVELOPMENT'
      );
      console.log('🔓 Development mode enabled - Payment restrictions disabled');
    } else if (mode === 'prod') {
      // Enable production mode
      content = content.replace(
        /\/\/ DEVELOPMENT MODE: Allow access to all lessons/g,
        '// DEVELOPMENT MODE: Allow access to all lessons (DISABLED)'
      );
      content = content.replace(
        /\/\* COMMENTED OUT FOR DEVELOPMENT/g,
        '// COMMENTED OUT FOR DEVELOPMENT'
      );
      console.log('🔒 Production mode enabled - Payment restrictions active');
    } else {
      console.log('❌ Invalid mode. Use "dev" or "prod"');
      return;
    }
    
    fs.writeFileSync(PAYMENT_SERVICE_PATH, content);
    console.log(`✅ Payment mode switched to: ${mode}`);
    
  } catch (error) {
    console.error('❌ Error toggling payment mode:', error.message);
  }
}

// Get command line argument
const mode = process.argv[2];

if (!mode) {
  console.log(`
🔧 Payment Mode Toggle Script

Usage:
  node toggle-payment-mode.js dev   - Disable payments (development)
  node toggle-payment-mode.js prod  - Enable payments (production)

Current status: Check the paymentService.js file for "DEVELOPMENT MODE" comments
  `);
} else {
  togglePaymentMode(mode);
}
