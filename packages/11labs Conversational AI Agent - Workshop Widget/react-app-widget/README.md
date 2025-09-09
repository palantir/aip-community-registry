# eleven-labs-customer-support-demo

# Before using

1. Set your third party appId in `./foundry.config.json` under `site.application`. It should look like `ri.third-party-applications.main.application.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx`
2. Set your foundry URL in `./foundry.config.json` under `foundryUrl`. It should start with `https://`

# Intro
This project was generated with [`@osdk/create-app`](https://www.npmjs.com/package/@osdk/create-app) and demonstrates using the Ontology SDK package `@eleven-labs-customer-support-demo/sdk` with React on top of Vite. Check out the [Vite](https://vitejs.dev/guide/) docs for further configuration.

## Developing locally

A `FOUNDRY_TOKEN` environment variable is required to authenticate with the NPM registry. When developing locally you may use the token used to git clone the repository (may only be valid for 7 days), or generate a longer lived token [inside Foundry](https://www.palantir.com/docs/foundry/platform-security-third-party/user-generated-tokens/#generation).

Install project dependencies:

```sh
npm install
```

Run the following command from the project root to start a local development server on `http://localhost:8080`:

```sh
npm run dev
```

Development configuration is stored in `.env.development`.

In order to make API requests to Foundry, CORS must be configured for the stack to allow `http://localhost:8080` to load resources. The configured OAuth client must also allow `http://localhost:8080/auth/callback` as a redirect URL.

## Developing with Code Workspaces

Run the following command in a VS Code workspace terminal from the project root to start a development server on the workspace:

```sh
npm run dev:remote
```

Open the preview panel to see the application from the development server.

## Deploying

Foundry CI has been configured to automatically deploy production builds of this project to Foundry website hosting whenever git tags are pushed.

```
git tag <x.y.z>
git push origin tag <x.y.z>
```

By default, a new site version will be uploaded and deployed as the production version immediately. If instead, you prefer to only upload the version and manually deploy it as the production version later you can set the `site.uploadOnly` property in the `foundry.config.json` file to `true`.