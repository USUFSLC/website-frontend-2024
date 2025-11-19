import Head from "next/head";
import { FormEvent, useState } from "react";

const NAME_REGEXP = /^[a-z][a-z0-9-_.]{0,63}$/;

export default function DiscordSignup() {
  const [errorMessage, setErrorMessage] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const name = fd.get("name")!;
    // we can have a *little* client side checking. as a treat.
    // (and to get rid of some confusing Kanidm errors that I don't want to inject into the page)
    if (!NAME_REGEXP.test(name.toString())) {
      setErrorMessage(
        "Invalid username. See the paragraph above for guidelines.",
      );
      return;
    }
    const payload = {
      name: fd.get("name"),
      displayname: fd.get("displayname"),
    };

    const resp = await fetch("/api/discord/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (resp.ok) {
      const j = await resp.json();
      window.location.assign(j.url);
    } else {
      const j = await resp.json();
      if (j.message) {
        if (typeof j.message === "string") {
          setErrorMessage(j.message);
        } else {
          setErrorMessage(JSON.stringify(j.message));
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Username Selection</title>
      </Head>
      <main>
        <h1>Username Selection</h1>
        <p>
          Great! Now you just need to choose your username and display name.
          Your username must start with a lowercase letter, followed by any
          combination of lowercase letters, numbers, and dashes (-), underscores
          (_), or periods (.).
        </p>

        <form onSubmit={onSubmit}>
          <p>
            <label htmlFor="name">
              Username:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="text" id="name" name="name" />
            </label>
          </p>
          <p>
            <label htmlFor="displayname">
              Display name:&nbsp;
              <input type="text" id="displayname" name="displayname" />
            </label>
          </p>
          <p>
            <input type="submit" value="Create my account" />
          </p>
          <p style={{ color: "var(--gruvbox-mode-red)" }}>{errorMessage}</p>
        </form>
      </main>
    </>
  );
}
