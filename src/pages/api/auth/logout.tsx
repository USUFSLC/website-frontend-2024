import { unsetAuthCookies } from "@/authUtils.ts";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  unsetAuthCookies(res);

  redirect(res, "/");
}
