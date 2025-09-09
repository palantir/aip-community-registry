const { SendEmail } = require('./index.js');

const TEST_USERS = null; // Please set your own email to test sending them locally before deploying to Foundry

function validateTestSetup() {
  if (!TEST_USERS || !Array.isArray(TEST_USERS) || TEST_USERS.length === 0) {
    console.error('\n🚫 Test configuration error!\n');
    console.error('Please set TEST_USERS in test.js to your test email address(es).');
    console.error('\nExample: const TEST_USERS = ["your.name@your-domain.com"];\n');
    console.error('❗ Hint: Use an email address you can verify the test email was received.\n');
    process.exit(1);
  }
}

async function runTest() {
  try {
    console.log('Starting email test...');
    
    // Validate test configuration
    validateTestSetup();

    const testContext = {
      subject: "Test Email from Local Environment",
      message: `
        <p>This is a test email sent from the local development environment.</p>
        <p>If you're seeing this, the email module is working correctly!</p>
      `,
      recipients: TEST_USERS
    };

    console.log('Sending test email with context:', testContext);

    const result = await SendEmail(testContext);
    
    console.log('Email send result:', result);
    
    if (result.success === false) {
      console.error('Email send failed:', result.error);
      process.exit(1);
    }

    console.log('Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed with error:', error);
    process.exit(1);
  }
}

// Run the test
runTest(); 