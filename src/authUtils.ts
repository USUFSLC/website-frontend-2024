import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { IdTokenClaims, Log, OidcClient, SigninResponse } from "oidc-client-ts";
import { JWTPayload, decodeJwt, importJWK, jwtVerify } from "jose";
import { ServerResponse } from "http";

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
  redirect_uri: `https://${process.env.REAL_HOSTNAME}/api/auth/callback`,
});

Log.setLogger(console);
Log.setLevel(Log.INFO);

export function setAuthCookies(
  res: ServerResponse,
  signInResponse: SigninResponse,
) {
  res.setHeader("Set-Cookie", [
    `__Secure-idToken=${signInResponse.id_token};path=/;httponly;secure`,
    `__Secure-refreshToken=${signInResponse.refresh_token};path=/;httponly;secure`,
  ]);
}

export function unsetAuthCookies(res: ServerResponse) {
  res.setHeader("Set-Cookie", [
    `__Secure-idToken=;path=/;httponly;secure;expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `__Secure-refreshToken=;path=/;httponly;secure;Thu, 01 Jan 1970 00:00:00 GMT`,
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

export async function getSessionFromIdToken(
  idToken: string,
  refreshToken: string,
  res: ServerResponse,
): Promise<AuthSession> {
  // NOTE: does not validate. this is fine because the IDM will do that for us.
  // https://github.com/auth0/jwt-decode
  const jwtPayload = decodeJwt(idToken);

  // If the payload has an expiration date and it is more than 5 minutes out...
  if (jwtPayload.exp !== undefined && Date.now() + 300e3 < jwtPayload.exp) {
    // Verify the token, just to make sure the user did not tamper with it, then
    // return a new session.
    const jwk = await getPublicKey();
    let payload: JWTPayload | null;
    try {
      payload = (await jwtVerify(idToken, jwk)).payload;
    } catch (e) {
      payload = null;
    }

    if (payload !== null) {
      return getSessionFromPayload(payload);
    }
  }

  let signInResponse;

  // I don't know why, but this sometimes breaks without the catch
  // I think it's because errors are thrown in different call stacks
  // so the error does not propagate as you'd expect.
  // eslint-disable-next-line
  try {
    // for some reason it thinks "useRefreshToken" is a React hook
    // probably because it starts with "use"
    // I hate the linter
    // eslint-disable-next-line react-hooks/rules-of-hooks
    signInResponse = await OIDC_CLIENT.useRefreshToken({
      state: {
        refresh_token: refreshToken,
        profile: jwtPayload as unknown as IdTokenClaims,
        session_state: null,
      },
    });
  } catch (e) {
    throw e;
  }

  setAuthCookies(res, signInResponse);

  const claims = decodeJwt(signInResponse.id_token!);
  return getSessionFromPayload(claims);
}

export function getServerSidePropsWithAuthDefaults<
  T extends { [key: string]: unknown },
>(
  callback: (context: GetServerSidePropsContext) => Promise<{ props: T }>,
): GetServerSideProps<T & AuthProps> {
  return async (context: GetServerSidePropsContext) => {
    const result = (await callback(context)) as { props: T & AuthProps };
    const idToken = context.req.cookies["__Secure-idToken"];
    const refreshToken = context.req.cookies["__Secure-refreshToken"];
    result.props.initialAuthSession =
      idToken === undefined || refreshToken === undefined
        ? null
        : await getSessionFromIdToken(idToken, refreshToken, context.res).catch(
            () => null,
          );
    result.props.refreshUrl = "";
    return result;
  };
}
