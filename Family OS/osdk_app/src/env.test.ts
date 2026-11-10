import { loadEnv } from "vite";
import { expect, test } from "vitest";

const ENV_VARS = [
  "VITE_FOUNDRY_API_URL",
  "VITE_FOUNDRY_CLIENT_ID",
  "VITE_FOUNDRY_REDIRECT_URL",
];

for (const envVar of ENV_VARS) {
  test.skipIf(process.env.VERIFY_ENV_PRODUCTION !== "true")(
    `production env should contain ${envVar}`,
    () => {
      const env = loadEnv("production", process.cwd());
      expect(env[envVar], `${envVar} should be defined`).toBeDefined();
      expect(
        env[envVar],
        `${envVar} should not contain placeholder value`,
      ).not.toMatch(/<.*>/);
    },
  );
}
