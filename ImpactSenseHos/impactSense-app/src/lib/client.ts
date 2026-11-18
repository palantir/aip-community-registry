import type { Client } from "@osdk/client";
import type { PublicOauthClient } from "@osdk/oauth";
import { createClient } from "@osdk/client";
import { $ontologyRid } from "@impactsense/sdk";
import { createPublicOauthClient } from "@osdk/oauth";

const url = process.env.NEXT_PUBLIC_FOUNDRY_API_URL;
const clientId = process.env.NEXT_PUBLIC_FOUNDRY_CLIENT_ID;
const redirectUrl = process.env.NEXT_PUBLIC_FOUNDRY_REDIRECT_URL;
checkEnv(url, "NEXT_PUBLIC_FOUNDRY_API_URL");
checkEnv(clientId, "NEXT_PUBLIC_FOUNDRY_CLIENT_ID");
checkEnv(redirectUrl, "NEXT_PUBLIC_FOUNDRY_REDIRECT_URL");

function checkEnv(
  value: string | undefined,
  name: string,
): asserts value is string {
  if (value == null) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

export const auth =
    createPublicOauthClient(
      clientId,
      url,
      redirectUrl,
    );

export const getAuth = () => {
  if (auth == null) {
    createPublicOauthClient(
      clientId,
      url,
      redirectUrl,
    );
  }
  return auth;
}
const client: Client = createClient(
  url,
  $ontologyRid,
  auth
);

export default client;