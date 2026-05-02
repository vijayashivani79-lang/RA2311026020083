const Log = require('./middleware/logger');
const authService = require('./services/authService');
const config = require('./config/config');

async function runDemo() {
  console.log('🚀 Starting Logging Middleware Demo...\n');

  // Check if client credentials exist
  if (!config.client.id || !config.client.secret) {
    console.log('⚠️ No CLIENT_ID or CLIENT_SECRET found in .env.');
    console.log('Initiating registration process...');
    
    try {
      await authService.register();
      console.log('\n🛑 Please update your .env file with the credentials above and restart the app.');
      process.exit(0);
    } catch (error) {
      console.error('\n🛑 Could not register. Please check your .env registration details.');
      process.exit(1);
    }
  }

  console.log('✅ Client credentials found. Proceeding to test logs...\n');

  // Test Case 1: Valid Log (Success)
  console.log('--- Test 1: Valid Info Log ---');
  await Log('backend', 'info', 'service', 'User service initialized successfully.');

  // Test Case 2: Valid Log (Error level)
  console.log('\n--- Test 2: Valid Error Log ---');
  await Log('backend', 'error', 'handler', 'received string, expected bool');

  // Test Case 3: Invalid Stack (Failure)
  console.log('\n--- Test 3: Invalid Stack ---');
  await Log('database', 'info', 'db', 'Connecting to database...');

  // Test Case 4: Invalid Package for Stack (Failure)
  console.log('\n--- Test 4: Invalid Package for Stack ---');
  await Log('frontend', 'warn', 'repository', 'Fetching data taking too long...');

  // Test Case 5: Valid Log (Frontend)
  console.log('\n--- Test 5: Valid Frontend Log ---');
  await Log('frontend', 'debug', 'component', 'Rendered dashboard component.');
  
  console.log('\n🎉 Demo execution finished.');
}

runDemo();
