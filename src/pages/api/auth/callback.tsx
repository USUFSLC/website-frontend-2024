import { AuthUserState, OIDC_CLIENT, setAuthCookies } from "@/authUtils.ts";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const url = req.url!;
  const signInResponse = await OIDC_CLIENT.processSigninResponse(url);

  const userState = signInResponse.userState as AuthUserState;

  setAuthCookies(res, signInResponse);

  redirect(res, userState.after);
}
