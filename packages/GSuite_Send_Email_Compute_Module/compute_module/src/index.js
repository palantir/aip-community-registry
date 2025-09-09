const { google } = require('googleapis');
const { Type } = require('@sinclair/typebox');
// Only import ComputeModule if not in test mode
const ComputeModule = process.env.NODE_ENV !== 'test' ? require("@palantir/compute-module").ComputeModule : null;

// Configuration constants
const IMPERSONATED_USER = null; // Please set your own GSuite Service Account email that has domain-wide delegation enabled
const LOG_PREFIX = '[Email Module]';

// Validate configuration
if (!IMPERSONATED_USER) {
  throw new Error(
    '\n🚫 Email configuration error!\n\n' +
    'Please set IMPERSONATED_USER to your domain-delegated Gmail account.\n' +
    'This account must have domain-wide delegation enabled in Google Workspace.\n\n' +
    'Example: const IMPERSONATED_USER = "your.name@your-domain.com";\n\n' +
    '❗ Hint: The email must be from the same domain as your service account delegation.\n'
  );
}

// Define input/output schemas
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

// Only create compute module instance if not in test mode
const computeModule = process.env.NODE_ENV !== 'test' ? new ComputeModule({
  logger: console,
  sources: {
    GSuiteServiceAccount: {
      credentials: ["additionalSecretJsonSecretBase64Encoded"]
    }
  },
  definitions: {
    SendEmail: SendEmailSchemas
  }
}) : null;

// Email footer template
const EMAIL_FOOTER = `
<br/>
<div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px; font-family: Arial, sans-serif;">
    <strong>Best,</strong><br/>
    <a href="mailto:${IMPERSONATED_USER}">${IMPERSONATED_USER}</a>
</div>
`;

// Credential processing utilities
function formatPrivateKey(key) {
  try {
    // Remove any existing headers/footers and whitespace
    const cleanKey = key
      .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '')
      .replace(/\s/g, '');
    
    // Validate the cleaned key
    if (!/^[A-Za-z0-9+/=]+$/.test(cleanKey)) {
      throw new Error('Private key contains invalid characters');
    }
    
    // Split into 64-character chunks
    const chunks = cleanKey.match(/.{1,64}/g);
    if (!chunks) {
      throw new Error('Failed to chunk private key');
    }
    
    return `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----`;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error formatting private key:`, error);
    throw new Error(`Invalid private key format: ${error.message}`);
  }
}

function validateServiceAccountCredentials(credentials) {
  try {
    const formattedKey = formatPrivateKey(credentials.private_key);
    
    if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----') ||
        !formattedKey.includes('-----END PRIVATE KEY-----')) {
      throw new Error('Invalid private key format after formatting');
    }

    credentials.private_key = formattedKey;
    return credentials;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error processing private key:`, error);
    throw new Error(`Failed to process private key: ${error.message}`);
  }
}

function safeBase64Decode(base64String) {
  try {
    const cleanBase64 = base64String.replace(/\s/g, '');
    
    const decodeAttempts = [
      () => Buffer.from(cleanBase64, 'base64').toString('utf-8'),
      () => {
        const padded = cleanBase64.padEnd(Math.ceil(cleanBase64.length / 4) * 4, '=');
        return Buffer.from(padded, 'base64').toString('utf-8');
      },
      () => {
        const urlSafe = cleanBase64.replace(/-/g, '+').replace(/_/g, '/');
        const padded = urlSafe.padEnd(Math.ceil(urlSafe.length / 4) * 4, '=');
        return Buffer.from(padded, 'base64').toString('utf-8');
      }
    ];

    let lastError;
    for (const attempt of decodeAttempts) {
      try {
        return attempt();
      } catch (e) {
        lastError = e;
        continue;
      }
    }
    
    throw lastError || new Error('All decode attempts failed');
  } catch (error) {
    console.error(`${LOG_PREFIX} Base64 decoding error:`, error);
    throw new Error(`Failed to decode Base64: ${error.message}`);
  }
}

// Gmail service functions
async function getGmailCredentials() {
  try {
    let credentials;
    
    if (process.env.NODE_ENV === 'test') {
      credentials = require('../service_account.json');
    } else {
      const base64Secret = await computeModule.getCredential("GSuiteServiceAccount", "additionalSecretJsonSecretBase64Encoded");
      
      if (!base64Secret) {
        throw new Error('Received empty secret from Foundry');
      }

      const decodedSecret = safeBase64Decode(base64Secret);
      
      try {
        // Clean the JSON string before parsing
        const cleanedSecret = decodedSecret
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
          .replace(/\\"/g, '"')  // Fix escaped quotes
          .replace(/\\\\/g, '\\'); // Fix double escaped backslashes
        
        credentials = JSON.parse(cleanedSecret);
        
        // Validate required fields
        const requiredFields = ['private_key', 'client_email', 'project_id'];
        const missingFields = requiredFields.filter(field => !credentials[field]);
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
      } catch (parseError) {
        console.error(`${LOG_PREFIX} JSON parsing error:`, parseError.message);
        throw new Error(`Failed to parse JSON: ${parseError.message}`);
      }
    }
    
    return validateServiceAccountCredentials(credentials);
  } catch (error) {
    throw new Error(`Failed to process service account credentials: ${error.message}`);
  }
}

async function getGmailClient() {
  try {
    console.log('Impersonating user:', IMPERSONATED_USER);
    
    const credentials = await getGmailCredentials();
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      clientOptions: { subject: IMPERSONATED_USER }
    });

    const client = await auth.getClient();

    if (!client.getRequestHeaders) {
      throw new Error('Invalid auth client - missing required methods');
    }

    return google.gmail({ version: 'v1', auth: client });
  } catch (error) {
    console.error(`${LOG_PREFIX} Error in getGmailClient:`, error);
    throw error;
  }
}

function createEmailContent(message, subject, recipients) {
  const boundary = `boundary_${Date.now().toString(36)}`;
  const recipientList = Array.isArray(recipients) ? recipients.join(', ') : recipients;
  
  const emailParts = [
    'MIME-Version: 1.0',
    `From: ${IMPERSONATED_USER}`,
    `To: ${recipientList}`,
    `Subject: ${Buffer.from(subject).toString('utf8')}`,
    'Content-Type: multipart/alternative; boundary="' + boundary + '"',
    'Content-Transfer-Encoding: 7bit',
    '',
    '--' + boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    Buffer.from(message.replace(/<[^>]+>/g, '')).toString('utf8') + `${IMPERSONATED_USER}`,
    '',
    '--' + boundary,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="UTF-8">',
    '<style>',
    'body { font-family: Arial, sans-serif; line-height: 1.6; }',
    'a { color: #0066cc; text-decoration: none; }',
    'a:hover { text-decoration: underline; }',
    '</style>',
    '</head>',
    '<body>',
    Buffer.from(message).toString('utf8'),
    EMAIL_FOOTER,
    '</body>',
    '</html>',
    '',
    '--' + boundary + '--'
  ];

  return emailParts.join('\r\n');
}

async function prepareGmailClient() {
  const gmail = await getGmailClient();
  if (!gmail) {
    throw new Error('Failed to initialize Gmail client');
  }
  return gmail;
}

function prepareEmailContent(context) {
  const { message, subject, recipients } = context;
  return createEmailContent(message, subject, recipients);
}

function encodeEmailForTransport(emailContent) {
  const encoded = Buffer.from(emailContent)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  if (!encoded) {
    throw new Error('Failed to encode email content');
  }
  
  return encoded;
}

function createGmailRequest(encodedContent) {
  return {
    userId: 'me',
    requestBody: {
      raw: encodedContent,
      payload: {
        mimeType: 'multipart/alternative',
        headers: [{ 
          name: 'Content-Transfer-Encoding', 
          value: 'base64url' 
        }]
      }
    }
  };
}

function createErrorResponse(error) {
  return { 
    success: false, 
    error: error.message,
    details: error.stack,
    response: error.response ? JSON.stringify(error.response.data) : undefined
  };
}

// Core email sending functionality
async function SendEmail(context) {
  console.log(`${LOG_PREFIX} Processing email request:`, {
    subject: context.subject,
    recipients: context.recipients
  });

  try {
    // Step 1: Setup Gmail client
    const gmail = await prepareGmailClient();
    
    // Step 2: Prepare email content
    const emailContent = prepareEmailContent(context);
    
    // Step 3: Encode for transport
    const encodedContent = encodeEmailForTransport(emailContent);
    
    // Step 4: Send email
    const request = createGmailRequest(encodedContent);
    const response = await gmail.users.messages.send(request);
    
    return response.data;
  } catch (error) {
    console.error(`${LOG_PREFIX} Email sending failed:`, {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    return createErrorResponse(error);
  }
}

// Export SendEmail directly for local testing mode
if (process.env.NODE_ENV === 'test') {
  module.exports = { SendEmail };
} else {
  // Initialize and register the compute module for production
  computeModule
    .on("responsive", () => console.log(`${LOG_PREFIX} Compute module responsive`))
    .on("error", (error) => console.error(`${LOG_PREFIX} Compute module error:`, error))
    .register("SendEmail", async (context) => {
      try {
        return await SendEmail(context);
      } catch (error) {
        console.error(`${LOG_PREFIX} Uncaught error:`, error);
        throw error;
      }
    });

  module.exports = { computeModule };
}
