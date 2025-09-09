import type { Client } from "@osdk/client";
import { createClient } from "@osdk/client";
import { $ontologyRid } from "@relar/sdk";
import { createPublicOauthClient } from "@osdk/oauth";
import { env } from "./env";

export const auth = createPublicOauthClient(
  env.clientId,
  env.url,
  env.redirectUrl
);

/**
 * Initialize the client to interact with the Ontology SDK
 */
export const $: Client = createClient(env.url, $ontologyRid, auth);
