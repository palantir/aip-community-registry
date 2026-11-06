import { createClient, type Client } from "@osdk/client";
import { createConfidentialOauthClient } from "@osdk/oauth";

export interface FoundryEnvironment { apiUrl: string; ontologyRid: string; clientId: string; clientSecret: string; }
export function readFoundryEnvironment(env: NodeJS.ProcessEnv = process.env): FoundryEnvironment | null {
  const apiUrl=env.FOUNDRY_API_URL, ontologyRid=env.FOUNDRY_ONTOLOGY_RID, clientId=env.FOUNDRY_CLIENT_ID, clientSecret=env.FOUNDRY_CLIENT_SECRET;
  return apiUrl && ontologyRid && clientId && clientSecret ? { apiUrl, ontologyRid, clientId, clientSecret } : null;
}
export function createFoundryClient(config: FoundryEnvironment): Client {
  const auth = createConfidentialOauthClient(config.clientId, config.clientSecret, config.apiUrl);
  return createClient(config.apiUrl, config.ontologyRid, auth);
}
// Generated Developer Console ontology bindings are intentionally tenant-supplied.
// Use: client(YourObjectType).fetchPage() and client(YourAction).applyAction(...).
