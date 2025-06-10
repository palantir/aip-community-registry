# FamilyOS
*Built on Foundry*. All packaged data is notional. 

By Jay Ambadkar

*Please note: a video demo may be available subject to confirmation*

## Project Description
- This is FamilyOS. An all-in-one tool for your family to streamline your lives, allowing you to spend more time on the things that matter.
- Includes a view for parents/responsible people and separately a view for the kids on the other end. Access control can be optionally included by making use of restricted views (omitted from the .zip package to simplify installation).
- Features include:
    - Chore management
    - Purchase management
    - Automatic evaluation of chore completion status (using LLM vision models) and automatic purchase approval, based on user-defined rules and backed by Machinery
    - Group chat bot to operationalise data from a family group chat (must be on Telegram, sorry Whatsapp!)
    - Nudge family members either via email or group chat
    - Graphs to represent family members visually, the relationships between people, facts about members (added by the responsible folk), and a separate graph to highlight equitable distribution of chores
    - Voting on activities and favourite foods (through an OSDK React app)
    - AIP agents to watch over everything and provide you with natural language access to your Ontology
    - Eval suites to reassure on correctness of AIP Logic functions
    - And more!
- This has initially been made for my Palantir Launch Program project on the Delta track, but happens to include lots of Dev track features too.

Please make me aware of any legitimate issues with these installation instructions and I will do my best to help.

## Installation
*Please see [these instructions](https://github.com/jayambadkar/aip-community-registry/blob/develop/INSTALLATION.md) for more details. It is what these instructions are based on anyway.*

The first step is uploading your package to the Foundry Marketplace:

1. Download the project's `.zip` file from this repository
2. Access your enrollment's marketplace at:
{enrollment-url}/workspace/marketplace
3. In the marketplace interface, initiate the upload process:
    - Select or create a store in your preferred project folder
    - Click the "Upload to Store" button
    - Select your downloaded .zip file

For installation, follow the structions below with deference to [official Palantir documentation](https://www.palantir.com/docs/foundry/marketplace/install-product).

1. Click through the menu and install the project into a new folder.
2. Ensure inputs are all set up. This mainly consists of LLMs so make sure you select these!
    - Note: Machinery is not compatible with DevOps, nor enabled on Dev Tier enrolments at time of writing.
        - Based on the pictures below, you should attempt to define your own implementation of the required automation (there is only one and the AIP Logic function needed is included)
        - Please raise an issue on this repo or contact me directly if this presents more issues.
        - This is largely an optional step, but not doing it will prevent auto-purchase decision functionality.
    - Set up the required data connections. See appendix.
    - Create a Developer Console application to use the React app repo with. You will need to configure all of the parameters in the various setup files in the repo ([see Palantir documentation](https://github.com/palantir/aip-community-registry/blob/develop/INSTALLATION.md#sdk-configuration-optional)), such as RIDs, Foundry URLs, OSDK, etc. 
        - Setup and test the React app accordingly and register it in your Foundry website hosting.
    - Creation of [AIPF] Intensity, Order Status, Status value types is optional, and was only really useful for Machinery anyway.
    - For the Ontology object types, set up the following actions (if not clear which action goes with which object, please raise an issue or ask an LLM):

        - Create [AIPF] Chore
        - Create [AIPF] Family Rules
        - Create [AIPF] Images
        - Create [AIPF] Notification Nudges
        - Create [AIPF] Purchase
        - Create [AIPF] Sent Emails
        - Delete [AIPF] Chore
        - Delete [AIPF] Family Rules
        - Modify [AIPF] Chore
        - Set [AIPF] Family Member Credit
        - Update [AIPF] Chore Status
        - Update [AIPF] Purchase Status
    - Do these too, but only after setting up the Data Connections, Compute Modules and Object automations for the email compute module and Telegram bot respectively. The backing objects should be included already.
        - [AIPF] Send Email Action
        - [AIPF] Send GC Message

    - This should be all of the input stuff you need to do, however, if there are issues then raise them.

3. Check that the installation is happy and proceed. Review all bundled content (notional data). Set your own email addresses accordingly.

4. Resolve errors and initiate install.

## Configuation

1. Empty all Ontologies of the bundled sample data - you can do this in Object Explorer or by just defining some action types and a loop in Logic.

2. Add in your family data (again Object Explorer or similar).

3. Onboard family members and show them the ropes.

### Telegram bot
This is much more fiddly.

0. Ensure you have a family group chat set up on Telegram.
1. Message @BotFather
    - `/newbot` and follow through the BotFather's instructions
    - `/setprivacy` and set this to 'Disable' as per the instructions
    - Add your bot to your family group chat in the group chat settings.
    - Get a token for your bot by running `/token` with BotFather. Keep it handy (and safe!)
2. Set up `sentinel.py` by adding a `.env` file in that directory configured with your Foundry URL and a long-lived Foundry access token (be careful with this token!!!!)
    - The Foundry URL you need will be that of the push URL for a Streams dataset. Set this up to get the URL (there should be one bundled with the app already under the Sentinel folder).
    - Expose your running Flask server (i.e. sentinel.py's) using ngrok or an actual deployment. Match the network port when doing this.
    - Using your Telegram bot token, run the following cURL command.

```
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN_HERE>/setWebhook \
     -F "url=<YOUR_NGROK_URL_HERE>" \
     -F "secret_token=some_opaque_string" \
     -F "allowed_updates=[\"message\"]" \
     -F "drop_pending_updates=true"
```

3. Set up the Data Connection in Foundry allowing you to send messages on the group chat. 
    - Needs to be a GET webhook to `https://api.telegram.org/bot<BOT_TOKEN>/sendMessage`
    - Configure BOT_TOKEN as a client secret with your Telegram bot
    - Also set `chat_id` as a query parameter which you can find out from one of the message webhook calls from above or from your Bot or Telegram itself.
    - Set `text` as an input parameter within query parameters
    - Note the API name of the webhook and import it into the functions repo in the Sentinel folder in the bundle, and then test it.


4. Test it all works by sending some messages and seeing if they appear in Foundry. Raise an issue if you are sure it doesn't work.

5. You're all set!

### Gmail Compute Module
First look at Appendix 1. If and only if you're sure you want to continue with mine, tread the path below.

This is a fork of [Serknight's Compute Module](https://github.com/palantir/aip-community-registry/tree/develop/GSuite_Send_Email_Compute_Module), and if you use a Google Workspace account with admin privileges, then just use his.

1. Enable Gmail API in Google Cloud Console. Ensure the Gmail "send" is enabled.
2. Under APIs and Services > Credentials, set up a Desktop application and obtain the client secret and id. Don't bother with redirect uri. Ensure Gmail send scope is included.
3. Clone the `edited-serknight-compute-module` from this repo to your local.
4. Setup your local Docker daemon
5. Put the following in your `.env` locally:

```
CLIENT_ID=<Client Id from G Cloud Console>
CLIENT_SECRET=<Client Secret from G Cloud Console>
REDIRECT_URI=http://localhost
REFRESH_TOKEN=<On its way!>
```

6. Run `get-token.js` using Node (do all the `npm install` etc stuff first) and follow the instructions to get your refresh token.

7. Setup a Data Connection in Foundry with the following:
    - Base URL: gmail.googleapis.com
    - Port 443
    - Secrets:
        - `ClientId`
        - `ClientSecret`
        - `RefreshToken`
    - Ensure the API names respectively match:
        - `additionalSecretClientId`
        - `additionalSecretClientSecret`
        - `additionalSecretRefreshToken`
    - Otherwise update the names in `src/index.js` of the Compute Module accordingly.
    - Ensure this Data Connection can be used within Compute Modules by allowing all the code import settings in setup.
    - Have the following network connectivity, all on port 443:
        - `www.googleapis.com`
        - `gmail.googleapis.com`
        - `oauth2.googleapis.com`

8. Create a new compute module, named appropriately.
9. Follow the instructions under "Configure" to use the provided code and deploy it as an Artifact repository in Foundry for use with the Compute Module.
10. Start the Compute Module.
11. If you've done everything right, then the `SendEmail` function should be auto-detected and you can test it out by emailing some people you like (or don't like if feeling mean) or just yourself.
12. Ensure the AIP Logic function for sending emails references the correct function such that it works.
13. Make an Action that runs that AIP Logic function and configure it as an automation when an object is added to the "\[AIPF\] Sent Emails" object set.
14. Test this all out and ensure the Action works.
15. This is a pretty tedious process so if you run into any issues, check your work, ask an LLM and if you're really stuck then ask a question here.

**Congratulations!!! That should be all the setup done!!** Play around with the application now, check everything works and revolutionise your family life!

## Appendix 1: Gmail Compute Module
While writing this README and scrolling through the AIP Community Repository, I noticed that Tom Mosley has already written a compute module to provide access to personal Gmail accounts. It also provides access to the user's calendar. You can find it [here](https://github.com/palantir/aip-community-registry/tree/develop/Personal%20Gmail%20and%20Calendar%20Connector). It looks far better than the one I ended up when I did my own modification of [Serknight's original compute module](https://github.com/palantir/aip-community-registry/tree/develop/GSuite_Send_Email_Compute_Module) for this purpose, though the methods used to create it seem broadly similar.

Therefore, I have provided a more limited set of instructions for operationalising the compute module code provided in this repo, and strongly advise use of either Serknight's or Tom's, depending on whether you have a Workspace or personal Gmail account respectively.

My compute module does indeed work, however, as this example demonstrates:
![Gmail demo](./images/gmail1.png)

## Appendix 2: Pictures
These are included for demonstrative purposes - all data is notional.

Just keep scrolling. Also check out the video demo if you have access! There are some pictures of the OSDK React App at the bottom.

![1](./images/main1.png)
![2](./images/main2.png)
![3](./images/main3.png)
![4](./images/main4.png)
![5](./images/main5.png)
![6](./images/main6.png)
![7](./images/main7.png)
![8](./images/main8.png)
![9](./images/main9.png)
![10](./images/main10.png)
![11](./images/main11.png)
![12](./images/gc1.png)
![13](./images/kids1.png)
![14](./images/kids2.png)
![15](./images/osdk1.png)
![16](./images/osdk2.png)
![17](./images/osdk3.png)
![18](./images/osdk4.png)