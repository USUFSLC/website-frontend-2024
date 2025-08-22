import { NextApiRequest, NextApiResponse } from "next";
import {
  OIDC_CLIENT,
  getPublicKey,
  getSessionFromPayload,
  setAuthCookies,
} from "@/authUtils.ts";
import { IdTokenClaims } from "oidc-client-ts";
import { JWTPayload, decodeJwt, jwtVerify } from "jose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const refreshTokenCookie = req.cookies["__Secure-refreshToken"];
  if (refreshTokenCookie === undefined) {
    res.status(401).json({ error: "no refreshToken in cookie" });
    return;
  }
  const idTokenCookie = req.cookies["__Secure-idToken"];
  if (idTokenCookie === undefined) {
    res.status(401).json({ error: "no idToken in cookie" });
    return;
  }

  // NOTE: does not validate. this is fine because the IDM will do that for us.
  // https://github.com/auth0/jwt-decode
  const jwtPayload = decodeJwt(idTokenCookie);

  // If the payload has an expiration date and it is more than 5 minutes out...
  if (jwtPayload.exp !== undefined && Date.now() + 300e3 < jwtPayload.exp) {
    // Verify the token, just to make sure the user did not tamper with it, then
    // return a new session.
    const key = await getPublicKey();
    let payload: JWTPayload | null;
    try {
      payload = (await jwtVerify(idTokenCookie, key)).payload;
    } catch (e) {
      payload = null;
    }

    if (payload !== null) {
      res.status(200).json(getSessionFromPayload(payload));
      return;
    }
  }

  let signInResponse;

  try {
    // for some reason it thinks "useRefreshToken" is a React hook
    // probably because it starts with "use"
    // I hate the linter
    // eslint-disable-next-line react-hooks/rules-of-hooks
    signInResponse = await OIDC_CLIENT.useRefreshToken({
      state: {
        refresh_token: refreshTokenCookie,
        profile: jwtPayload as unknown as IdTokenClaims,
        session_state: null,
      },
    });
  } catch (e) {
    res.status(500).json({ error: "can't refresh" });
    return;
  }

  setAuthCookies(res, signInResponse);

  const claims = decodeJwt(signInResponse.id_token!);
  const session = getSessionFromPayload(claims);

  res.status(200).json(session);
}
