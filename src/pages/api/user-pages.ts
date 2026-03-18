import { shallowCloneRef, httpFetchUsing } from "git-clone-client";
import { NextApiRequest, NextApiResponse } from "next";

export type ResponseData = {
  users: ReadonlyArray<{
    name: string;
    content: string;
  }>;
};

const fetchRepository = httpFetchUsing(fetch);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const files = await shallowCloneRef("refs/heads/main", {
    makeRequest: fetchRepository(
      "https://github.com/USUFSLC/fslc-user-pages.git",
    ),
    filter: (filepath) => filepath.startsWith("people/"),
  });
  const users = files.map(({ content, filepath }) => {
    const stem = filepath.split("/").at(-1) ?? filepath;
    const basename = stem.split(".").at(0) ?? stem;
    return {
      name: basename,
      content: content.toString("utf8"),
    };
  });
  res.status(200).json({ users });
}
