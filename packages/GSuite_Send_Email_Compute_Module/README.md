<div align="center">
  <img src="images/GSuite.png" alt="Google Workspace" height="60">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="images/Palantir.png" alt="Palantir Foundry" height="60">
  
  # Gmail Compute Module for Foundry
  
  Send emails through Gmail API using domain-wide delegation in Foundry
  
  ---
</div>

> [!IMPORTANT]  
> You need admin access to both Google Workspace and Foundry to set this up.

## Quick Start

1. **Setup Google Workspace**
   - Enable Gmail API in Google Cloud Console
   - Create service account with domain delegation
   - Grant `https://www.googleapis.com/auth/gmail.send` scope
   - Create/Download service account credentials as JSON

2. **Prepare Credentials**
   ```bash
   echo "$(cat service_account.json)" | base64
   => ewogICJ0...
   ```
   > [!TIP]
   > Base64 encoding helps handle the complex JSON cleanly in Foundry's secrets

3. **Configure Foundry**
   - Create REST API Data Connection
   - Set egress policies for Gmail API
   - Import the compute module
   - Add base64 credentials as secret

## Detailed Setup Guide

<details>
<summary>Click to expand step-by-step instructions with screenshots</summary>

### 1. Google Workspace Setup

<table>
<tr>
<td>Create Service Account</td>
</tr>
<tr>
<td><img src="images/[Step%203.a]%20Create%20Service%20Account%20Credentials.png" alt="Service Account Setup" width="600"></td>
</tr>
</table>

### 2. Foundry Configuration
#### Data Connection
![Create Connection](images/[Step%201]%20Create%20Data%20Connection%20Rest%20API%20source.png)
![Configure Domain](images/[Step%202]%20Setup%20Source%20domain:port.png)

#### Module Setup
<table>
<tr>
<td>Enable exports</td>
<td>Set import rules</td>
<td>Name your API</td>
</tr>
<tr>
<td><img src="images/[Step%205]%20Enable%20Exports.png" alt="Exports" width="600"></td>
<td><img src="images/[Step%206]%20Enable%20relevant%20import%20rules.png" alt="Rules" width="600"></td>
<td><img src="images/[Step%207]%20Name%20your%20Source's%20API.png" alt="Name API" width="600"></td>
</tr>
</table>

#### Secret Configuration
<table>
<tr>
<td>Store Service Account</td>
</tr>
<tr>
<td><img src="images/[Step%203.b]%20Store%20service%20account%20as%20JSON%20on%20Foundry%20Data%20Connection.png" alt="Store Secret" width="600"></td>
</tr>
</table>

#### Build & Deploy
<table>
<tr>
<td>Create compute module</td>
<td>Choose Functions mode</td>
</tr>
<tr>
<td><img src="images/[Step%208]%20Create%20Compute%20Module.png" alt="Create Module" width="600"></td>
<td><img src="images/[Step%209]%20Choose%20Functions%20Mode.png" alt="Functions" width="600"></td>
</tr>
<tr>
<td>Import data connection</td>
<td>Build function</td>
</tr>
<tr>
<td><img src="images/[Step%2010]%20Import%20Data%20Connection%20Source.png" alt="Import" width="600"></td>
<td><img src="images/[Step%2011]%20Build%20a%20Compute%20Module%20backed%20function.png" alt="Build" width="600"></td>
</tr>
</table>

#### Deploy & Verify
<table>
<tr>
<td>Create artifact</td>
<td>Deploy container</td>
</tr>
<tr>
<td><img src="images/[Step%2012]%20Create%20artifact%20%26%20name%20image.png" alt="Artifact" width="600"></td>
<td><img src="images/[Step%2013]%20Run%20commands%20to%20create:publish%20container%20%26%20code.png" alt="Deploy" width="600"></td>
</tr>
<tr>
<td>Update configuration</td>
<td>Verify deployment</td>
</tr>
<tr>
<td><img src="images/[Step%2014]%20Update%20Config%20to%20point%20to%20image:tag.png" alt="Config" width="600"></td>
<td><img src="images/[Step%2015]%20Confirm%20container:source%20added.png" alt="Verify" width="600"></td>
</tr>
</table>

#### Final Steps
<div align="left">
<table>
<tr>
<td>Import Function</td>
<td>Test Email</td>
</tr>
<tr>
<td><img src="images/[Step%2017]%20ensure%20sendEmail%20is%20registered%20%26%20accept%20import.png" alt="Import Function" width="600"></td>
<td><img src="images/[Step%2018]%20Test%20Email.png" alt="Test Email" width="600"></td>
</tr>
</table>
</div>

</details>

## Usage

Whatever you called your `namespace` in compute module config is how you import the module in code: `@<namespace>/computemodules`

```typescript
import { sendEmail } from "@gmail/computemodules"; 

await sendEmail({
  recipients: ['user@domain.com'],
  subject: 'Hello from Foundry!',
  message: '<h1>It works!</h1><p>Email sent via Gmail API.</p>'
});
```

> [!TIP]
> Supports HTML formatting in email messages

## Development

> [!WARNING]
> Due to the limitations of importing the Foundry Data Connection source locally the project has a test.js feature and some Compute Module initialization logic that only runs once you deploy the module. (likely chance this was just a 'me' problem)

```bash
# Local testing
npm run test

# Expected output:
Starting email test...
[Email Module] Processing email request: {...}
Test completed successfully!
```

## Troubleshooting

> [!IMPORTANT]  
> Common issues:
> - Check service account delegation
> - Verify OAuth scopes
> - Confirm egress policies
> - Validate base64 credentials

## Security

> [!CAUTION]
> - Never commit credentials -- if you test locally name the 'secret' `service_account.json`
> - Ensure .gitignore and .dockerignore are up to date
> - Rotate keys regularly
> - Monitor API usage
> - Limit permissions

---

<div align="center">
  <h3>🚀 Part of <a href="https://www.youtube.com/@codestrap8031">Codestrap</a> CommsForge</h3>
  
  <a href="https://www.youtube.com/watch?v=9Xjx6gdaQpY">
    <h3>🎥 Watch Demo</h3>
    <img src="https://img.shields.io/youtube/views/9Xjx6gdaQpY?style=for-the-badge&logo=youtube&logoColor=red&color=white" alt="Watch Demo">
  </a>

  Part of CommsForge - Open source for Palantir Developers (Q2 2025)

  *Ontology is all you need.*
</div>
