**This is the WhatsApp Compute Module for outbound communication**

At a high level, the process for installing it is:
1. At the Meta/FB developer portal, configure your WhatsApp API connection and obtain details.
2. Set up the message templates - either identically to my demo or tailored for your use case. The latter option will require some changes to the code but you should just be able to tell an LLM to make the changes or figure it out yourself
3. Test the code using `npm test`
4. Upload this NPM project into Foundry as an Artifact repo
5. Add the required sources with Magritte
6. Create a compute module for this, adding both the artifact repo and the configured sources (remembering to set the credentials from Meta Cloud API as source secrets)
7. Test and confirm functionality on Foundry

Please see the main page for full instructions.
