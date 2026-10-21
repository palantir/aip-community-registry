// get-token.js
require('dotenv').config();
const { google } = require('googleapis');
const readline = require('readline');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
const oAuth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oAuth2.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log('1) Open this URL in your browser:\n', authUrl);
console.log('\n2) After approving, paste the code here:');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Code> ', async (code) => {
  try {
    const { tokens } = await oAuth2.getToken(code.trim());
    console.log('\nSave these to your .env:\n');
    console.log(`REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (err) {
    console.error('Error while retrieving access token', err);
  } finally {
    rl.close();
  }
});
