import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiResponse,
} from "next";
import { Log, OidcClient, SigninResponse } from "oidc-client-ts";
import { JWTPayload, importJWK, jwtVerify } from "jose";

const KEY_CACHE_TIME = Number(process.env.KEY_CACHE_TIME ?? 900) * 1000;
let key: CryptoKey | Uint8Array | null = null;
let keyCacheTime: number = 0;

const KEY_URL = `${process.env.OIDC_AUTHORITY}/public_key.jwk`;

export type AuthUserState = {
  after: string;
};

export type AuthSession = {
  uuid?: string;
  name?: string;
  username?: string;
  roles?: string[];
  expires?: number;
};

export type AuthProps = {
  initialAuthSession: AuthSession | null;
  refreshUrl: string;
};

export const OIDC_CLIENT = new OidcClient({
  authority: process.env.OIDC_AUTHORITY!,
  client_id: process.env.OIDC_CLIENT_ID!,
  client_secret: process.env.OIDC_CLIENT_SECRET!,
  scope: "openid profile",
  redirect_uri: `https://${process.env.HOSTNAME}/api/auth/callback`,
});

Log.setLogger(console);
Log.setLevel(Log.INFO);

export function setAuthCookies(
  res: NextApiResponse,
  signInResponse: SigninResponse,
) {
  res.setHeader("Set-Cookie", [
    `__Secure-idToken=${signInResponse.id_token};path=/;httponly;secure`,
    `__Secure-refreshToken=${signInResponse.refresh_token};path=/;httponly;secure`,
  ]);
}

export async function getPublicKey() {
  if (key === null || Date.now() - keyCacheTime > KEY_CACHE_TIME) {
    const jwk = await fetch(KEY_URL).then((r) => r.json());
    key = await importJWK(jwk.keys[0], "ES256");
    keyCacheTime = Date.now();
  }

  return key;
}

export function getSessionFromPayload(claims: JWTPayload): AuthSession {
  return {
    uuid: claims.sub,
    name: claims.name as string,
    username: claims.preferred_username as string,
    roles: claims.roles as string[],
    expires: claims.exp,
  };
}

export function getSessionFromIdToken(token: string): Promise<AuthSession> {
  return getPublicKey()
    .then((k) => jwtVerify(token, k))
    .then((jwt) => getSessionFromPayload(jwt.payload));
}

export function getServerSidePropsWithAuthDefaults<
  T extends { [key: string]: unknown },
>(
  callback: (context: GetServerSidePropsContext) => Promise<{ props: T }>,
): GetServerSideProps<T & AuthProps> {
  return async (context: GetServerSidePropsContext) => {
    const result = (await callback(context)) as { props: T & AuthProps };
    const idToken = context.req.cookies["__Secure-idToken"];
    result.props.initialAuthSession =
      idToken === undefined
        ? null
        : await getSessionFromIdToken(idToken).catch(() => null);
    result.props.refreshUrl = "";
    return result;
  };
}
