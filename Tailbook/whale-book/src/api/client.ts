import { Client, createClient } from "@osdk/client";
import { createPublicOauthClient } from "@osdk/oauth";
import { $ontologyRid } from "@whaletail/sdk"

// Client setup
const client_id = import.meta.env.VITE_FOUNDRY_CLIENT_ID;
const url = import.meta.env.VITE_FOUNDRY_API_URL;
const ontologyRid = $ontologyRid;
const redirectUrl = import.meta.env.VITE_FOUNDRY_REDIRECT_URL;

const auth = createPublicOauthClient(client_id, url, redirectUrl);
export const client: Client = createClient(url, ontologyRid, auth); 