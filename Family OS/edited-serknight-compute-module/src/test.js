// src/test.js
const { SendEmail } = require('./index');

(async () => {
  try {
    const result = await SendEmail({
      recipients: ['<YOUR_EMAIL_HERE>'],
      subject: 'OAuth2 is working!',
      message: '<p>If you see this, 🎉 your OAuth2 flow is now correct.</p>'
    });
    console.log('Success:', result);
  } catch (err) {
    console.error('Error:', err);
  }
})();
