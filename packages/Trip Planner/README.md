# Trip Planner

My partner and I were tired of planning trips with separate spreadsheets, docs, and maps...

Plan your trips using AIP! Trip Planner uses **AIP Logic** to turn raw itineraries from the web, or emails, into structured trip accommodations, events, and travel.

Enrich your data using a **webhook connection** to Open Street Maps so you can view all your trip activity on the pop-out map!

Make **ontology edits** to trip activity by adding costs or adding comments.

Finally, **use LLM agents** to generate an itinerary of your trip activity.

Can you figure out how to connect the LLM generated itinerary button so that it texts the itinerary to you?

Check out my [YouTube video](https://www.youtube.com/watch?v=0FdHouw0yXg) to see the app live in action.


## Create Open Street Maps Data Connection

Before you install the Trip Planner app on your enrollment, you'll have to create and configure a Data Connection to the Open Street Maps API.

1. Start by navigating to **Data Connection** using the left-hand side search bar and selecting the Sources tab. Then, select **New source** and **REST API**.
![data connectors page](images/data%20connectors%20page.png)
2. For **connection type**, select **Direct Connection**.
3. Give the Data Connection a name (Open Street Maps API) and create a new project called 'Trip Planner', or use a pre-existing project.
4. For **connection details**, paste `nominatim.openstreetmap.org` under Domain based URL. Keep the port as 443, and Authentication as None.
5. Make sure to **Request and self-approve a new policy**.
![connection details page](images/connection%20details.png)
6. Press **Save and continue**.
7. On the **Code import configuration** tab, toggle `Allow this source to be imported into code repositories` to be on. Set the API name to `OpenStreetMaps`.
8. You've created a data connection to Open Street Maps, congratulations! Proceed to the below steps on uploading the `zip` file in this folder.

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
   - Configure any required inputs. (Open Street Maps Data Connection)

3. **Content Review**
   - Review resources to be installed

4. **Validation**
   - System checks for any configuration errors
   - Resolve any flagged issues
   - Initiate installation
