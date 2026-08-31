# *FORGE Production Application & Data Architecture*

## *WARNING* This package has not been fully tested. Please reach out on community.palantir.com if you have issues with installation or configuration.

# Foundry Environment Setup

This section defines the account, credential, networking, access-control, and governance prerequisites for operating Plaid in the FORGE production environment. It intentionally precedes the application architecture and connection runbook so that production controls are established before implementation or operations begin.

You should know that this package contains 16 object types, 22 links types, and 37 action types. The ceiling for each on any given dev tier environment is 60 of each.

> **Production safety boundary:** Do not use real financial data until organizational security, privacy, legal, governance, and Plaid production-access reviews are complete. The browser must never receive Plaid client secrets, Plaid access tokens, encryption keys, or source credentials.

## A. Configure and approve the Plaid Production account -> Repeat this process for a Sandbox connection

### Account ownership and security

1. Create or transfer the Plaid account to an organization-controlled identity rather than an individual employee's personal account.
2. Verify the account email, enable multi-factor authentication, and configure appropriate administrator and developer roles.
3. Record the business owner, technical owner, security reviewer, and production support contact and complete the production questionnaire.
   a. Request access to the Transactions product. This can also be done after approval from the Plaid dashboard Products page.
4. Production approval was received after several days of review.

### Production credentials and ownership

After Plaid grants Production access, retrieve the Plaid client ID and Production secret through the approved administrative process. The Production API host is `production.plaid.com` over HTTPS.

## B. Configure the Plaid Production source in Foundry

### Source endpoint and secrets

1. Set up an egress policy for `production.plaid.com` on port 443.
2. Use a dedicated REST API source whose base host is `production.plaid.com`. Do not repurpose a Sandbox source by replacing its credentials.
3. Store the Plaid client ID as `additionalSecretClientId` and the Plaid Production secret as `additionalSecretClientSecret`.
4. Store a dedicated Production encryption key as `additionalSecretEncryptionKey`. The value should be generated and managed under the organization's approved secret-management process.
5. Enable exports to this source and, only where approved, exports without markings validation. Permit code repositories, functions, and compute modules in the code-import configuration.
6. Do not include secret values in source names, descriptions, code-import configuration, documentation, or diagnostics.

| **Secret key** | **Purpose** |
| --- | --- |
| `additionalSecretClientId` | Plaid client ID used only by approved server-side workloads. |
| `additionalSecretClientSecret` | Plaid Production secret; environment-specific and highly privileged. |
| `additionalSecretEncryptionKey` | Dedicated Production token-encryption key when the approved design uses application-level encryption. |

### Plaid Link Content Security Policy

The Plaid Authentication application's website-hosting configuration must allow Plaid Link to load its scripts and embedded frame and to make required network requests. The current manual Content Security Policy configuration is summarized below.

| **CSP directive** | **Observed additions** | **Production guidance** |
| --- | --- | --- |
| `connectSrc` | Plaid CDN, Development, Production, and Sandbox hosts | For a production-only deployment, retain the Plaid CDN and Production hosts. Remove Development and Sandbox unless the same hosted application intentionally supports those environments. |
| `frameSrc` | Plaid CDN | Required for the embedded Plaid Link frame. Keep the origin narrowly scoped. |
| `scriptSrc` | Plaid CDN | Required to load the Plaid Link JavaScript bundle. |
| `imgSrc` | No additions observed | Leave unchanged unless current Plaid documentation or tested production behavior requires another origin. |
| `mediaSrc` | No additions observed | Leave unchanged unless a documented feature requires it. |

> **Production review note:** The current configuration is not proof that every entry is required. Before removing Development or Sandbox origins, confirm whether the deployed application is deliberately reused across environments. After every CSP change, test Plaid Link initialization, institution selection, OAuth return, the public-token callback, and browser-console CSP errors.

### Encryption, isolation, and recovery

- Store encrypted token history—and, only if explicitly approved, any unencrypted recovery material—in a tightly controlled location. If token deletion fails or test token creation needs cleanup, locally maintained records are essential.
- Plaid support can generate a list of active tokens, but this can take several days. Maintain an internal inventory so recovery does not depend on that process.

## C. Configure the Foundry Internal API source

### Source endpoint and secrets

1. Create a source named Foundry Internal API and configure it to use the Foundry internal API.
2. Set up an egress policy for the organization's Foundry site on port 443.
3. Use a dedicated REST API source whose base URL is that Foundry site. Do not repurpose another environment's source by replacing credentials.
4. Generate a Foundry token through the approved settings workflow and save it as `additionalSecretFoundryToken` on the source.
5. Enable exports with webhooks and, only where approved, exports without markings validation. Permit code repositories and webhooks in the code-import configuration.

## D. Setup the remaining basics

1. Create an admin group that has permissions on all actions. This is the person or who people who manage the budget.
2. Create an engineering/builder group for at least yourself. Privileged permission for certain workflows/certain notifications.
3. Your hosting domain should just be your foundry domain.
4. Upload a png as an icon for your app.
5. Optionally, I integrate historical monarch transactions. You can just ignore 'old_transactions_migration' though.

## E. Upload Package to Your Enrollment

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

## F. Install the Package

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

# System Overview Content

1. System context and visual index
2. FORGE web UI configuration
3. FORGE mobile UI configuration
4. Custom widget architecture and UI conventions
5. Ontology catalog and semantic invariants
6. Upstream data architecture
7. Plaid connection setup and operations runbook
8. Security, monitoring, troubleshooting, and recovery

## 1. System context and visual index

FORGE converts external financial and billing data into curated Ontology objects, then exposes operational workflows through Workshop and shared OSDK custom widgets.

- A production web Workshop application provides the main desktop operational shell.
- A separate mobile Workshop application provides a compact single-page experience.
- Both applications use a shared Forge Widget Set backed by a common code repository.
- A dedicated Plaid Authentication application, backed by its own repository, hosts Plaid Link.
- A maintained lineage graph describes the end-to-end FORGE data flow.
- Operational alerts should cover schedule failures, stale data, account health, and indexing freshness.

## 2. FORGE web UI configuration

The web Workshop is a production navigation shell combining native Workshop controls, action forms, drawers, object tables, and the shared Forge Widget Set.

| **Surface** | **Implementation** | **Primary inputs** | **Events / behavior** |
| --- | --- | --- | --- |
| Dashboard | `budgetResearch` widget | Transaction and Category object sets; current user; reviewer group | Research and review entry point. |
| Spending | `spendingMonitor` widget | Transaction and Category object sets; current user | Emits payout URL and review-count updates. |
| Operations | `operations` widget | Subscription, Bill, Merchant, and supporting object sets | Unified operations; updates pending-review and bills-due counts. |
| Budget Development | `budgetComparison` widget | Budget and Category versions; current user | Compares proposals and supports publication workflows. |
| Accounts | `accountsOverview` widget | Plaid Account and Transaction object sets; current user | Supports account selection and emits an Add Account event. |
| Supporting native flows | Workshop drawers, forms, and tables | Member, Subscription, Discount, Bill, Report, Transaction, and archive objects | Invokes declarative and function-backed actions. |

### Web shell behavior

- The current-user identity is passed into widgets as `currentUserId`, bound to the Workshop current-user value; widgets do not call a separate user endpoint.
- Shared object sets drive widget surfaces and native overlays, keeping filters and selected objects consistent across the shell.
- Connect Account opens the embedded Plaid Authentication application, completes Plaid Link, persists connection state through an Ontology action, and then closes the overlay.
- Other production shell surfaces include AIP Analyst, Data Health, billing and reporting, and supporting overlays where configured.
- A Transactions navigation option remains configured but hidden.

## 3. FORGE mobile UI configuration

The mobile Workshop is a single-page shell over the `mobileDashboard` custom widget. The observed mobile widget release trails the web release by one patch version; this is documented version drift rather than a change made here.

| **Area** | **Configuration** | **Behavior** |
| --- | --- | --- |
| Inputs | Transaction and Plaid Account object sets; current-user and reviewer-group values | Provides user-scoped overview and connected-account context. |
| Internal tabs | Overview, Review, Bills, Accounts | Tabs are internal widget state rather than separate Workshop pages. |
| Detail flows | Category, transaction, and archive experiences | Supports review and archive operations without leaving the mobile shell. |
| Bill upload | `uploadBill` widget event | Opens a bottom drawer bound to the Upload and Parse Verizon Bill action. |

## 4. Custom widget architecture and UI conventions

Both applications consume the shared Forge Widget Set. The repository follows common conventions so multiple widgets remain visually and operationally consistent.

- Use the Radix dark theme with a transparent widget background and the shared main stylesheet; do not create widget-specific stylesheets.
- Use reusable gradient header cards, section cards, standardized row spacing, and managed scroll containers.
- Floating popovers require solid opaque backgrounds; avoid translucent portal surfaces in the widget runtime.
- Use custom dark-theme checkbox styling instead of native browser accent coloring.
- After actions, update React Query caches optimistically and perform a delayed authoritative refetch so Ontology propagation can complete.
- Never fetch the current user separately; accept `currentUserId` from widget configuration.

> **Amount-display convention:** `originalAmount` preserves the source/display sign: positive is income, credit, or refund and negative is expense or debit. The normalized amount used by FORGE spend analysis is inverted: expenses are positive and income or refunds are negative. Use `originalAmount` for display and coloring; use `amount` for spend charts and settled-spending calculations.

## 5. Ontology catalog and semantic invariants

### Core finance and Plaid

| **Object type** | **Identity / key concept** | **Purpose and important properties** |
| --- | --- | --- |
| Transaction | Plaid transaction identity; current-state row | Amounts, date, pending state, categorization, merchant and account references, review state, and audit links. |
| Plaid Account | Plaid account identity | Balances, display name, type and subtype, connection health, last-seen status, stale or error state, and replacement lineage. |
| Plaid Merchant | Canonical merchant identity | Canonical name, categorization and normalization state, suggested merges, and merge lineage. |
| Plaid Link Token | Per-user Plaid connection identity | Encrypted access token, cursor, item and connection metadata, and ownership. This is a credential-bearing object with restricted export. |
| Archived Transaction | Archive-event identity | Audit history for hidden or archived current-state transactions; it is not a second source of spending totals. |
| Split Transaction Log | Split-operation identity | Audit log for transaction split operations and their source and derived records. |

### Budgeting and household billing

| **Object type** | **Identity / key concept** | **Business role** |
| --- | --- | --- |
| Budget | Budget or version identity | Budget proposal or published snapshot owning a set of Category snapshots. |
| Category | Category snapshot identity | Budget category, limit, hierarchy, and version or replacement lineage. Structural parent links are distinct from replacement links. |
| Subscription | Recurring obligation identity | Recurring service, amount and cadence, Category, lifecycle, and many-to-many Member participation. |
| Discount | Discount identity | Adjustment linked to a Subscription, Member, or generated Bill. |
| Member | Household member identity | Participant in subscriptions, bills, discounts, and Verizon line-item allocation. |
| Bill | Generated bill identity | Amount and status generated for a Subscription and Member combination, with optional discounts. |
| Billing Report | Report identity | Generated billing-period summary and operational reporting artifact. |

### Verizon billing

- Verizon Bill represents parsed bill-level identity, dates, totals, and source-file context.
- Verizon Line Item represents a parsed line-level charge allocated to a Verizon Bill and Member.

### Relationship semantics

- Transaction links to Plaid Account, canonical Plaid Merchant, Parent, Main, and Sub Category, AI-proposed Alternative Category, and Archived Transaction.
- Budget owns Category snapshots. Category's structural parent hierarchy is separate from replacement and version lineage.
- Subscription links to Category and has an editable many-to-many relationship with Member through a dedicated association dataset.
- Bill links to Subscription and Member. Discount can link to Subscription, Member, or a generated Bill.
- Verizon Line Item links to Verizon Bill and Member.
- Plaid Account has replacement-account lineage; Plaid Merchant has merge and suggested-merge self-links.

> **Finance invariants:** Transaction is the authoritative current-state fact. Settled spending normally excludes pending transactions and the Transfer Category. Normalized amount is expense-positive and income or refund-negative. Archived Transaction is audit history and must not be added to current Transaction totals.

### Workshop-facing actions

Representative actions include Category Edits, Update Review Status, Edit Transaction, and Bulk Update Bill Status. The UI also exposes Edit Member; Create, Edit, and Delete Discount; Create, Edit, Delete, Remove, and Link Subscription; Hide Transaction; Add Member; Generate Billing Report; Upload and Parse Verizon Bill; Add Plaid Link Token; Edit Cursor; and Remove Plaid Connection. Some are declarative actions and others are function-backed. Inspect each action's parameters and side effects before changing it.

## 6. Upstream data architecture

### 6.1 Scheduled Plaid ingestion

1. A production REST source targets `production.plaid.com` over HTTPS through an approved egress policy. It is imported into code; source preview is not supported.
2. A restricted Plaid Link Token export supplies per-user encrypted access-token and cursor state.
3. A Polars pull repository calls Plaid's accounts endpoint and the paginated transactions synchronization endpoint in batches of 500, decrypts each access token only in memory, and writes append-oriented raw outputs.
4. Key raw outputs include accounts, added transactions, modified transactions, and removed transactions.
5. A parsing repository normalizes transaction payloads and account lifecycle and health fields, producing parsed transactions and Plaid Account backing data.
6. An Ontology repository combines parsed Plaid data with historical Monarch migration input to produce current Transaction and canonical Plaid Merchant backing datasets.
7. Ontology indexing exposes Transaction, Plaid Account, and Plaid Merchant to the web and mobile applications.

| **Schedule** | **Trigger** | **Failure semantics** | **Purpose** |
| --- | --- | --- | --- |
| Plaid Data | Every three hours at minute 15 in `America/New_York` | Abort downstream work on failure | Pull and parse Plaid accounts and transactions. |
| Plaid Ontology | Update to its parsed input dataset | Continue independent work where possible | Produce current Transaction and canonical Merchant outputs. |

### 6.2 Edit-backed operational objects

Budget, Category, Subscription, Discount, Member, Bill, Billing Report, and Archived Transaction are primarily backed by minimal primary-key datasets with edit-only properties persisted through Ontology Actions. Their operational source of truth is action history and materialized object state rather than a scheduled external pipeline.

### 6.3 Verizon bill ingestion

1. A web or mobile Upload and Parse Verizon Bill action stores the source file in a Verizon bills media set.
2. The parser combines the source document with Member export context and writes parsed output.
3. Downstream derivation produces Verizon Bill and Verizon Line Item backing data.

## 7. Plaid connection setup and operations runbook

### Add or update a connection

1. The FORGE Accounts surface supplies the current user to the embedded Plaid Authentication application.
2. The application requests a Plaid Link token for the current environment and launches Plaid Link.
3. After successful institution authentication, Plaid returns a short-lived public token and connection metadata.
4. The Add Plaid Link Token action exchanges the public token server-side and stores the encrypted access token plus connection metadata in the Plaid Link Token object.
5. The scheduled Plaid Data build reads the restricted export, decrypts the access token only in memory, and begins account and transaction synchronization.
6. Verify the next successful pull, parsed account health, Ontology indexing, and visibility in both FORGE applications.

### Cursor lifecycle

Each transactions synchronization request starts from the persisted cursor and paginates until no further pages remain. The cursor must advance only after all expected outputs for the synchronization have succeeded. Persisting a cursor before output completion can permanently skip changes on the next run. Edit Cursor is therefore the final state transition of a successful synchronization, not an early checkpoint.

### Disconnect a connection

1. Confirm the target user and Plaid item; avoid acting on an account-selection value alone.
2. Invoke Remove Plaid Connection. The function revokes or removes the Plaid item before deleting the local connection record.
3. Verify the connection record is removed, account lifecycle fields become inactive or stale as expected, and no further pull attempts use the revoked item.

### Safe manual-run guidance

- Do not reset or edit a cursor as the first response to a failure.
- Before rerunning, identify whether the failed stage is authentication and egress, raw pull, parsing, current-state curation, or Ontology indexing.
- Rerun the smallest failed stage whose inputs are complete and unchanged.
- After recovery, verify row counts and change categories, cursor advancement, account health, latest successful builds, and application freshness.

## 8. Security, monitoring, troubleshooting, and recovery

### Observed security findings — separate review required

> **No remediation was performed by the documentation task.** These are observed risks to review with the application, data, and security owners.

- Plaid Link Token currently represents access-token and public-token-related properties as strings, and its restricted export contains credential-bearing columns.
- The token object, export, and production source were observed with an inherited organization marking. Confirm markings, roles, and least-privilege access directly; hidden property visibility is not a security boundary.
- The Plaid Authentication front end currently logs the public token and metadata to the browser console. Remove this logging in a separate code change and rotate or review affected credentials if exposure is suspected.
- Never copy token values, raw credential-bearing payloads, client credentials, encryption material, environment-file contents, or browser-console payloads into documentation or visuals.

### Monitoring checklist

- [ ] The Plaid Data schedule is active and its latest build completed successfully.
- [ ] The Plaid Ontology trigger fired after parsed input changed and its outputs succeeded.
- [ ] The latest pull timestamp is within the expected three-hour window plus operational tolerance.
- [ ] Plaid Account last-seen and active-state values match expected institution and account state.
- [ ] Stale-account and item-error flags are reviewed for newly affected connections.
- [ ] Transaction, Account, and Merchant backing datasets and Ontology indexes are fresh.
- [ ] Web Accounts and mobile Accounts and Review surfaces display expected current data.

### Failure decision tree

| **Symptom** | **Likely boundary** | **First safe checks** |
| --- | --- | --- |
| 401, 403, or token error | Plaid credentials, access token, item state, or encryption and decryption | Confirm source credentials are present, the item is valid, the token decrypts in memory, and no secrets changed unexpectedly. Do not print values. |
| Network or host failure | Source or egress policy | Confirm the Production host, TLS policy, source import, and egress approval. |
| Raw succeeds; parsed fails | Schema normalization or unexpected Plaid payload | Inspect non-secret schema and error metadata, isolate the new payload shape, and preserve the current cursor until parsing succeeds. |
| Parsed succeeds; UI is stale | Ontology curation, indexing, or application cache | Check the Ontology trigger and build, backing outputs, object indexing, and then delayed widget refetch behavior. |
| Cursor mismatch or missing deltas | Connection state transition | Stop automatic cursor edits, compare last successful raw outputs with the persisted cursor, and recover from a known-good state under owner review. |
```
