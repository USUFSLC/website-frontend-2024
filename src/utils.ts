import { OidcClient } from "oidc-client-ts";

export type AuthUserState = {
  after: string;
};

export const OIDC_CLIENT = new OidcClient({
  authority: process.env.OIDC_AUTHORITY!,
  client_id: process.env.OIDC_CLIENT_ID!,
  client_secret: process.env.OIDC_CLIENT_SECRET!,
  redirect_uri: `https://${process.env.HOSTNAME}/api/auth/callback`,
});
