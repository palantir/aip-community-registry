# ASWF 2024 Hackathon - SARR APP

The Army Software Factory, U.S. Army Futures Command was the host for their first ever 40 + hour Hackathon. The Hackathon included teams comprised of both Soldiers and Department of the Army Civilians from across the Department of Defense highlighting their ability to create and facilitate technology solutions in a rapid response scenario - wherein a fictional typhoon impacted Hawaii. The event took place December 10th-13th, 2024, Austin Community College, Austin, Texas.

CPT Matthew Moellering, Operations Officer and team built an OSDK React application in Code Workspaces, making use of Leaflet to plot medical report data, nearby units, and hospitals to gain rapid situational awareness to support relief efforts.

![SARR App](./images/sarr_screenshot.png)

## Upload Package to Your Enrollment

The first step is uploading your package to the Foundry Marketplace:

1. Download the project's `.zip` file from this repository
2. Access your enrollment's marketplace at:
   ```
   {enrollment-url}/workspace/marketplace
   ```
3. In the marketplace interface, initiate the upload process:
   - Select or create a store in your preferred project folder
   - Click the "Upload to Store" button
   - Select your downloaded `.zip` file

![Marketplace Interface](./../_static/upload_product_banner.png)

## Install the Package

After upload, you'll need to install the package in your environment. For detailed instructions, see the [official Palantir documentation](https://www.palantir.com/docs/foundry/marketplace/install-product).

The installation process has four main stages:

1. **General Setup**
   - Configure package name
   - Select installation location

2. **Input Configuration**
   - Configure any required inputs. If no inputs are needed, proceed to next step
   - Check project documentation for specific input requirements

3. **Content Review**
   - Review resources to be installed such as Developer Console, the Ontology, and Functions

4. **Validation**
   - System checks for any configuration errors
   - Resolve any flagged issues
   - Initiate installation


## SDK Configuration

Some packages include applications built with the Ontology SDK. These require additional setup:

1. **Locate the SDK application code** in the `Code/` directory of the project repository
<br>

2. **Note configuration detailis**
   - Navigate to Developer Console: `{enrollment-url}/workspace/developer-console`
   - Find the installed application - "SARR App Hackathon Project"
   - Copy the following details:
     - CLIENT ID
     - Enrollment URL `{enrollment-url}`
<br>

3. **Configure your development environment** 
   - Edit the `.env.code-workspaces`, `.env.development`, and `.env.production` to set the Foundry API URL and the Foundry CLIENT ID that you copied in the previous step
      - To run locally, the `.env.development` configuration is needed and you will need to set the redirect URL to localhost:
      <br>

      ```
      VITE_FOUNDRY_API_URL=<enrollment-url>
      VITE_FOUNDRY_REDIRECT_URL=http://localhost:8080/auth/callback
      VITE_FOUNDRY_CLIENT_ID=<client-id>
      ```


## Run the Application
1. **Install dependencies**
   - Navigate back to the "SARR App Hackathon Project" Developer Console Application
   - Select the "SDK versions" tab and click "Generate New Version," ensuring `npm` is selected
   - Note the generated SDK version and update the `Code/package.json` file to ensure the version for `@sarr-app-hackathon-project/sdk` (under "dependencies") matches the newly generated SDK version
   <br>

      ![NPM Version](./images/sarr_npm_version.png)

      <br>
      
      &rarr; `"@sarr-app-hackathon-project/sdk": "^0.2.0",`

   <br>
   - Select the "Start Developing" tab and select the "Add the Ontology SDK to an existing project" option
   - Follow the Prerequisite steps to configure your Foundry token and check your Node version
   - Follow the steps to "Set up the NPM registry" which includes populating an `.npmrc` file in the `Code/` directory
   - Run `npm install` from the root of the `Code/` directory
<br>

2. **Configure CORS**
   - Configure CORS in your control panel to allow `http://localhost:8080` - see [official Palantir documentation](https://www.palantir.com/docs/foundry/administration/configure-cors) for more details
<br>

3. **Run the application**
   - Run `npm run dev` from the root of the `Code/` directory
   - Navigate to http://localhost:8080 to access the application

<br>

### (Optional) Deploy the application
Check out the "Deploying applications" of the `SARR App Hackathon Project` Developer Console application to explore different deployment options