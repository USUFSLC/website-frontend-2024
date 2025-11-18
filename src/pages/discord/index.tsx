import Head from "next/head";

export default function StartDiscord() {
  return (
    <>
      <Head>
        <title>Create your FSLC Account with Discord</title>
      </Head>
      <main>
        <h1>Create your FSLC Account</h1>
        <p>
          As of now, you must create your FSLC account using Discord. This is
          because Discord is where our community is concentrated, so it is easy
          to ensure the legitimacy of account applicants.
        </p>
        <p>
          <strong>Here&apos;s how it works:</strong>
        </p>

        <ol>
          <li>
            First, create a Discord account, and{" "}
            <a href="https://discord.gg/PvgG6N2hsU">join the FSLC server</a>.
          </li>
          <li>
            Then, click the link at the bottom of the page to authorize our bot
            to take a look at your profile.
          </li>
          <li>
            Once you&apos;re logged in, you will be returned to this website to
            choose a username and display name.
          </li>
          <li>
            Upon choosing those details, you will be prompted to update the
            credentials of your newly-created account.
          </li>
        </ol>

        <p>
          If you do not want to join Discord, but want an FSLC account, for now,
          at least, reach out to FSLC leadership. We can create the account
          manually.
        </p>

        <p style={{ textAlign: "center" }}>
          <button
            type="button"
            onClick={() =>
              window.location.assign("/api/discord/login?after=/discord/signup")
            }
          >
            Let&apos;s go!
          </button>
        </p>
      </main>
    </>
  );
}
