# Google Connector V2

## Contents

This package provides a bi-directional interface between your personal Gmail, Google Calendar accounts and your Palantir Foundry enrollment. This package will deploy external transforms and Pipeline Builder logic to create the following Ontology Objects from your Google data:

* Email
* Email Attachment
* Calendar Event
* Calendar Event Attendee

This package also deploys a Compute Module to allow writing back to your Google accounts and includes the following functions:

* SendEmail
* CreateEvent

This Compute Module is a forked version of [SerKnights Gmail Compute Module](https://github.com/palantir/aip-community-registry/tree/develop/GSuite_Send_Email_Compute_Module) to adapt it to support OAuth authentication for personal accounts, and to add a Calendar integration.

## Installation Prerequisites

### 1. Google OAuth Credentials

For the Connector to be able to have read and write access to your Gmail account and Google Calendar, you need to configure access via a [Google Client](https://developers.google.com/workspace/guides/create-credentials#oauth-client-id).

#### Create client

Follow this link (https://console.cloud.google.com/auth/clients) to create a Google Client with details:

* Type: Web application
* Name: Palantir Foundry
* Authorised JavaScript origins: <insert the base URL of your Foundry account>
* Authorised redirect URIs: https://developers.google.com/oauthplayground

Once you have created, copy your CLIENT_ID and CLIENT_SECRET, you will need them later. You can always access them at any time by viewing your client [here](https://console.cloud.google.com/auth/clients).

#### Enable APIs

Follow [this guide](https://support.google.com/googleapi/answer/6158841?hl=en) to enable the GMail and Calendar APIs for your client.

#### Add relevant scopes

You will need to specify the scopes required by Foundry in your client. Navigate to the “Data Access” section at [this link](https://console.cloud.google.com/auth/scopes), and add the following scopes:

* https://www.googleapis.com/auth/gmail.modify
* https://www.googleapis.com/auth/calendar


#### Get refresh token

You will need to obtain a refresh token to enable long-lived access from Foundry. To obtain a refresh token, follow this guide: https://amandevelops.medium.com/how-to-generate-refresh-token-and-use-them-to-access-google-api-f7565413c548. In step 2 of the guide, you should add all the scopes outlined in “Add relevant scopes” above.


### 2. Set Up a Data Source

The Marketplace package will require a Data Source with your google credentials as an input.

1. On your Foundry instance, create a new Data Connection REST API source. Config:
    1. Connection Type: Direct connection
    2. Domain base URL: googleapis.com
    3. Authentication: None
    4. Define Additional Secrets
        1. Name: “RefreshToken”, Value: copy and paste your refresh token from the step above Untitled
        2. Name: “ClientId”, Value: copy and paste your Client Id from Untitled
        3. Name: “ClientSecret”, Value: copy and paste your Client Secret Untitled
    5. Network connectivity: add the following egress policies
        1. gmail.googleapis.com (for Gmail API access)
        2. www.googleapis.com (for other services e.g. Calendar API access)
        3. oauth2.googleapis.com (for authentication)
        4. 
    6. Code import configuration: toggle “Allow this source to be imported into code repositories” and “Allow this to be used in Compute Modules”
    7. Export configuration: toggle “Enable exports to this source”
    8. Save

## Upload Package to Your Enrollment

The first step is uploading your package to the Foundry Marketplace:

1. Download the project's Personal_Ontology_Store.mkt.zip file from this repository
2. Access your enrollment's marketplace at:
   ```
   {enrollment-url}/workspace/marketplace
   ```
3. In the marketplace interface, initiate the upload process:

    * Select or create a store in your preferred project folder
    * Click the "Upload to Store" button
    * Select your downloaded .zip file



## Install the Package

After upload, you'll need to install the package in your environment. For detailed instructions, see the official Palantir documentation.

The installation process has four main stages:

1. **General Setup**
   - Configure package name
   - Select installation location
3. **Input Configuration**
   - Configure any required inputs. The required inputs are “Google OAuth Client” where you will map the Data Source you created above. You will also have to map the GPT-4o mini and text-embedding-ada-002 models - you should map to the same models on your enrollment.
   - Check project documentation for specific input requirements
4. **Content Review**
   - Review resources to be installed such as Code Repositories, Pipeline Builder, the Ontology, and Functions
5. **Validation**
   - System checks for any configuration errors
   - Resolve any flagged issues
