# Expense Reporting

This application is developed for simple, mobile submissions of receipts. Receipts are parsed, classified, embedded, and when they fall within corporate policy, automatically approved. When they do not meet corporate policy, they are routed to an approvals application for “managers” to approve or reject. 

Once approved or rejected, this is the end of the flow. There are many ways to extend – for example, expenses may be integrated with a payment platform for reimbursement once approved. They may be invoiced to a client or customer. This is the foundation for expense management, not the end-all-be-all and it is expected that users will take and extend upon this framework to meet their own business needs.


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


## Update Create Expense action

- Open the Ontology Manager.
- In the left menu, navigate to Action Types and click on Create Expense, the action downloaded in this package. (You can also find this action type under the object type "Expense"). I
- In the Rules section, add the properties Receipt Attachment (PDF) and Receipt Image.
- Click Save.

### Common Terminology:
**Expense:**
- An expense refers to a financial outlay or cost incurred by an individual or organization to purchase goods or services, fulfill business obligations, or achieve operational goals. In a business context, expenses are typically tracked to ensure accurate financial reporting, budgeting, and compliance with organizational policies.

**Project:**
- A project is a temporary and unique endeavor undertaken to achieve specific objectives, create deliverables, or produce a defined outcome. It involves coordinating resources, tasks, and activities within a set timeframe and budget. Projects can vary in size, scope, and complexity but share common characteristics, including defined goals, timelines, and a clear structure for execution.

- The project will remain a notional object, defined in Palantir as a Primary Key and a Title. Users are expected to enrich and define their own project ontology if they wish to leverage the ability to tie expenses to a project. 


## Notes to Users: 
- Expense Properties
Billable – We are marking this as “true” by default within the “Create Expense Action”. In reality, this is likely determined by a project or cost code associated to the receipt and will likely need to be updated in users deployment.

Expense Approver – Approver is set by to default to be the “created user”. This would likely either be a project-based approver or a management-based approver. This logic should be updated based on ties to either a project or an employee hierarchy. 

- Automatic Approval Agent
   - Currently, this is deployed via a prompt that describes the corporate policy. This could be replaced with an ontology object describing the various policies by expense category and even have different policies based on role. A new prompt could look directionally like the following:
   - “Based on the expense category and the submitted user, search for the appropriate expense policy in the policy ontology. (Enable Query for Expense Policy). Determine whether the expense fits the expense policy. If it does approve it. (Enable Action: Approve Expense) If it does not, do nothing.” 
   - Additionally, the policy is deployed in two places – within the Review Expenses application, and within the Automatic Approval Agent AIP Logic function. Keep them in sync for accurate results.

- Create Expense Action
   - Currently only supports creating one expense at a time – the idea being that you take a photo of your receipt while at dinner and you’re done, etc. There is a use case for loading all other receipts (Lyft/Uber, Hotel, Airfare, etc.) at once at the end of a business trip and a “Create Multiple Expenses Action” that leverage the same underlying data and then iterates through a set of files could be a good addition. 
