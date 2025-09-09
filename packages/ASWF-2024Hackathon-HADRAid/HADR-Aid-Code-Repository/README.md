# hadr-aid

This project was generated with [`@osdk/create-app`](https://www.npmjs.com/package/@osdk/create-app) and demonstrates using the Ontology SDK package `@hadr-aid/sdk` with React on top of Vite. Check out the [Vite](https://vitejs.dev/guide/) docs for further configuration.

## Developing locally

A `FOUNDRY_TOKEN` environment variable is required to authenticate with the NPM registry. When developing locally you may use the token used to git clone the repository (may only be valid for 30 days), or generate a longer lived token [inside Foundry](https://www.palantir.com/docs/foundry/platform-security-third-party/user-generated-tokens/#generation).

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

Production configuration is stored in `.env.production`. A default test is included in `env.test.ts` to verify your production environment variables which runs in Foundry CI whenever git tags are pushed by setting the environment variable `VERIFY_ENV_PRODUCTION=true`.

If you did not yet register a subdomain for Foundry website hosting you will need to first do so and then fill in the `VITE_FOUNDRY_REDIRECT_URL` in `.env.production`. The configured OAuth client must also allow the auth callback on the subdomain as a redirect URL.
