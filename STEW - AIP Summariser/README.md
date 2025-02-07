# STEW
## Summariser, Taskmaster, and Executor for Workflows

I'm the project lead for an open source project, but one issue I had was planning when to tackle the issues outstanding.

Why not use AIP? STEW allows you to have a conversation with your tasks! it:

- summarises your outstanding Github issues
- provides a difficulty rating
- inserts the task into an appropriate time in your calendar.


Whilst there's only a Github issue pipeline currently, you can use anything as an input by customising the pipeline and the ontology.


### Adding Github Data

1) Initalise a Github Data connection.

2) Select Direct Connection and add the appropriate tokens from github - make sure to use a Classic token with sufficient permissions, or else the tables won't show up in preview.

3) Allow it to be imported into pipelines.

4) Self-approve an egress policy to `api.github.com`, port 443

5) Pull in the `Issues` and `IssueComments` from your desired repo and save them somewhere. You'll need these for the import.


Note that when using, the AI prompt can get a bit confused with timestamps. This is normal - simply refresh the bot.

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
   - Configure any required inputs. Input the Issues/IssueComments spreadsheet here!
   - Check project documentation for specific input requirements

3. **Content Review**
   - Review resources to be installed such as Developer Console, the Ontology, and Functions

4. **Validation**
   - System checks for any configuration errors
   - Resolve any flagged issues
   - Initiate installation

