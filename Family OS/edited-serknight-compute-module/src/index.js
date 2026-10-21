/*
 * src/index.js
 * OAuth2-based Gmail sender as a Foundry Compute Module
 */

require('dotenv').config();
const { google } = require('googleapis');
const { Type } = require('@sinclair/typebox');
const ComputeModule = process.env.NODE_ENV !== 'test'
  ? require('@palantir/compute-module').ComputeModule
  : null;

// Input/output schemas
const SendEmailSchemas = {
  input: Type.Object({
    recipients: Type.Array(Type.String()),
    subject: Type.String(),
    message: Type.String()
  }),
  output: Type.Object({
    id: Type.String(),
    threadId: Type.String(),
    labelIds: Type.Array(Type.String())
  })
};

// Instantiate compute module in production
const computeModule = process.env.NODE_ENV !== 'test'
  ? new ComputeModule({
      logger: console,
      sources: {
        GSuiteServiceAccount: {
          credentials: [
            'additionalSecretClientId',
            'additionalSecretClientSecret',
            'additionalSecretRefreshToken'
          ]
        }
      },
      definitions: { SendEmail: SendEmailSchemas }
    })
  : null;

// Utility to base64-decode secrets
function safeBase64Decode(base64String) {
  const clean = base64String.replace(/\s/g, '');
  return Buffer.from(clean, 'base64').toString('utf8');
}

// Fetch OAuth2 credentials (test vs production)
async function getOAuth2Credentials() {
  if (process.env.NODE_ENV === 'test') {
    const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      throw new Error('Missing CLIENT_ID, CLIENT_SECRET or REFRESH_TOKEN in .env');
    }
    return {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN
    };
  }

  // Production: fetch from Foundry secret store
  const [cid, cs, rt] = await Promise.all([
    computeModule.getCredential('GSuiteServiceAccount', 'additionalSecretClientId'),
    computeModule.getCredential('GSuiteServiceAccount', 'additionalSecretClientSecret'),
    computeModule.getCredential('GSuiteServiceAccount', 'additionalSecretRefreshToken')
  ]);

  if (!cid || !cs || !rt) {
    throw new Error('Missing OAuth2 credentials from Foundry');
  }

  return {
    clientId: cid,
    clientSecret: cs,
    refreshToken: rt
  };
}

// Build an authenticated OAuth2 client
async function getOAuth2Client() {
  const { clientId, clientSecret, refreshToken } = await getOAuth2Credentials();
  const oAuth2 = new google.auth.OAuth2(
    clientId,
    clientSecret,
    // redirectUri not used at runtime; refresh token is pre-obtained
    'urn:ietf:wg:oauth:2.0:oob'
  );
  oAuth2.setCredentials({ refresh_token: refreshToken });
  return oAuth2;
}

// Core sendEmail function
async function SendEmail({ recipients, subject, message }) {
  const auth = await getOAuth2Client();
  const gmail = google.gmail({ version: 'v1', auth });

  const rawLines = [
    `From: me`,
    `To: ${[].concat(recipients).join(', ')}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    message
  ];

  const raw = Buffer.from(rawLines.join('\r\n')).toString('base64url');
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw }
  });

  return {
    id: res.data.id,
    threadId: res.data.threadId,
    labelIds: res.data.labelIds || []
  };
}

// Export for local test or register in Foundry
if (process.env.NODE_ENV === 'test') {
  module.exports = { SendEmail };
} else {
  computeModule
    .on('responsive', () => console.log('[Email Module] responsive'))
    .on('error', err => console.error('[Email Module] compute error', err))
    .register('SendEmail', async ctx => {
      try {
        return await SendEmail(ctx);
      } catch (err) {
        console.error('[Email Module] Uncaught error', err);
        throw err;
      }
    });

  module.exports = { computeModule };
}
