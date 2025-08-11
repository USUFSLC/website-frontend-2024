import { AuthUserState, OIDC_CLIENT } from "@/utils.ts";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const url = req.url!;
  const signInResponse = await OIDC_CLIENT.processSigninResponse(url);

  const userState = signInResponse.userState as AuthUserState;

  res.setHeader("Set-Cookie", [
    `__Secure-idToken=${signInResponse.id_token};samesite=strict;secure`,
    `__Secure-refreshToken=${signInResponse.refresh_token};samesite=strict;secure`,
  ]);
  redirect(res, userState.after);
}
