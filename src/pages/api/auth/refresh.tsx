import { NextApiRequest, NextApiResponse } from "next";
import { getSessionFromIdToken } from "@/authUtils.ts";

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

  const session = await getSessionFromIdToken(
    idTokenCookie,
    refreshTokenCookie,
    res,
  ).catch(() => {
    res.status(500).json({ error: "can't refresh" });
  });
  res.status(200).json(session);
}
