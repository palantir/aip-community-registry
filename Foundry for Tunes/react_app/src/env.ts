declare const __APP_VERSION__: string;

const get = (key: string): string | undefined => {
  return import.meta.env ? import.meta.env![key] : undefined;
};

const getOrError = (key: string): string => {
  const value = get(key);
  if (value === undefined) throw Error(`"${key}" is not defined`);
  return value;
};

export const env = {
  url: getOrError("VITE_FOUNDRY_API_URL"),
  clientId: getOrError("VITE_FOUNDRY_CLIENT_ID"),
  redirectUrl: getOrError("VITE_FOUNDRY_REDIRECT_URL"),
  version: __APP_VERSION__,
};
