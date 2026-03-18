import { useState, useEffect } from "react";
import Head from "next/head";
import Markdown from "react-markdown";
import { ResponseData } from "../api/user-pages.ts";

type UserPage = ResponseData["users"][number];
const noUsersYet: UserPage[] = [];
export default function UserPages() {
  const [userPages, setUserPages] = useState(noUsersYet);
  useEffect(() => {
    let canceled = false;
    fetch("/api/user-pages")
      .then((res) => res.json())
      .then(({ users }) => {
        if (!canceled) {
          setUserPages(users);
        }
      });
    return () => {
      canceled = true;
    };
  }, []);

  const prLink = "https://github.com/USUFSLC/fslc-user-pages";
  const hasUserPages = userPages !== noUsersYet;

  return (
    <>
      <Head>
        <title>User pages | USU FSLC</title>
      </Head>
      <main style={{ padding: "0 1.5rem" }}>
        <div>
          <h2>User pages</h2>
          Have strong opinions about some obscure or not-so obscure tool? Share
          them here! Make a pull request against
          <div style={{ margin: "1em 40px" }}>
            <a href={prLink}>{prLink}</a>
          </div>
        </div>
        <div style={{ marginTop: "2rem", width: "100%" }}>
          {!hasUserPages && <div>loading...</div>}
          {userPages.map(({ name, content }) => (
            <div key={name}>
              <details>
                <summary>{name}</summary>
                <Markdown>{content}</Markdown>
              </details>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
