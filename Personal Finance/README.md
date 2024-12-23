# Personal Finance

Customize your personal finance tools with Palantir Foundry. Build custom front ends and better manage your budgets, subscriptions and more, all in one place. Bring your own data and explore the possibilities as well with low-code and no-code tools. See [this Youtube video](https://youtu.be/aE9mciKh6_Q?si=WYXk-ybwyIpq__Dv) for a demo of similar tooling, slightly tweaked for public consumption.

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


## User Notes

This package was originally built around a CSV of Monarch data with the long-term plan to leverage Plaid APIs. This package may update in the future with that option. For now, feel free to replace the sample transactions dataset with your own Monarch CSV for custom views and tooling in Foundry. 

The package also includes sample budgets - the package is best served with custom inputs for these values and categories. Try it out! You will also need to input subscriptions and any discounts on those subscriptions, and members of your accounts, and whether you share those expenses. The original video highlights shared bills, which were unavailable for public consumption, but which are all possible in Foundry yourself.

This package is most valuable with your own tweaks and experimentation, so feel free to explore AIP for your personal finances!