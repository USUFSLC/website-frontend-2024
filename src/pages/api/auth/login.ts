import { AuthUserState, OIDC_CLIENT } from "@/utils.ts";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // lol? this was automatically changed from after = req.query.after. wow so much clearer.
  let { after } = req.query;
  // allow for redirecting to a custom location, usually the same page you're trying to access.
  if (after === undefined) {
    after = "/";
  } else if (Array.isArray(after)) {
    // this one, on the other hand, i had to type out myself instead of after = after[0].
    // i kinda hate whoever wrote up this style guide
    [after] = after;
  }

  // normalize to *exactly* one slash beforehand. this way, the link is always relative.
  // this is to prevent any danger that people might put a custom external redirect or something.
  after = `/${after.replace(/^\/+/, "")}`;

  const { url } = await OIDC_CLIENT.createSigninRequest({
    state: { after } as AuthUserState,
  });
  redirect(res, url);
}
