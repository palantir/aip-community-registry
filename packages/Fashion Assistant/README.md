# Fashion Assistant

Digitize your wardrobe and get personalized outfits

Watch [this video](https://www.linkedin.com/posts/calaisalexandre_palantir-buildwithaip-slowfashion-activity-7264910420753223681-8Spd/?utm_source=share&utm_medium=member_desktop) to understand the workflow!

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

## Manual Setup
5. Open the Ontology Manager.
6. In the left menu, navigate to Action Types and click on Create Item. (You can also find this action type under the object type "Item"). In the Rules section, add the property Media Reference. Click Save.
7. Open the Workshop. Add your first item
8. [Optional] The assistant can suggest an outfit based on your preferred style and current weather conditions. Note that the app does not include a webhook, so you will need to manually input data for precipitation, temperature, and wind speed. Alternatively, you can create your own webhook to fetch weather data from a public API for a specific day and location.

Every morning, you might face the same problem: a packed wardrobe, but nothing to wear. Sound familiar? Upload Marketplace Bundle and get a fashion assistant that:

- Digitizes your wardrobe
- Suggests outfits based on your preferences and weather
- Recommends items to maximize outfit options
Spend less time deciding and more time enjoying all your clothes using Palantir AIP.

