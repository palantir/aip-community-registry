import { Client, createClient } from "@osdk/client";
import { $ontologyRid } from "@whaletail/sdk";
import { createPublicOauthClient } from "@osdk/oauth";

const url = import.meta.env.VITE_FOUNDRY_API_URL;
const clientId = import.meta.env.VITE_FOUNDRY_CLIENT_ID;
const redirectUrl = import.meta.env.DEV 
  ? import.meta.env.VITE_FOUNDRY_REDIRECT_URL
  : import.meta.env.VITE_FOUNDRY_REDIRECT_URL_PROD;

checkEnv(url, "VITE_FOUNDRY_API_URL");
checkEnv(clientId, "VITE_FOUNDRY_CLIENT_ID");
checkEnv(redirectUrl, import.meta.env.DEV 
  ? "VITE_FOUNDRY_REDIRECT_URL"
  : "VITE_FOUNDRY_REDIRECT_URL_PROD");

function checkEnv(
  value: string | undefined,
  name: string,
): asserts value is string {
  if (value == null) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

export const auth = createPublicOauthClient(
  clientId,
  url,
  redirectUrl,
  )
/**
 * Initialize the client to interact with the Ontology SDK
 */
const client: Client = createClient(
  url,
  $ontologyRid,
  auth,
);

export default client;
