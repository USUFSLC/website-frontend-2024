import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import EventOverview from "@/components/event-overview.tsx";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/Watch.module.css";
import { AuthContext } from "@/components/auth-context.tsx";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function StreamPage() {
  const [stream, setStream] = useState<ServerStreamIn | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamKey, setStreamKey] = useState<string>("");
  const [streamKeyCopyMessage, setStreamKeyCopyMessage] = useState<string>("");

  const router = useRouter();

  const { session } = useContext(AuthContext);

  useEffect(() => {
    fetch(`/api/stream/${router.query.uuid}?with-event`).then((r) => {
      if (r.ok) {
        r.json().then(setStream);
      } else {
        setError("Could not load event");
      }
    });
  }, [router.query.uuid]);

  async function getStreamKey() {
    const response = await fetch(`/api/stream/${router.query.uuid}/token`);
    if (response.ok) {
      const j = await response.json();
      setStreamKey(j.token);
      try {
        await navigator.clipboard.writeText(j.token);
        setStreamKeyCopyMessage("Copied key to clipboard");
      } catch (e) {
        setStreamKeyCopyMessage("Could not copy key to clipboard");
      }
    }
  }

  return (
    <>
      <Head>
        <title>{stream === null ? "Loading..." : stream.title}</title>
      </Head>
      <main>
        {(() => {
          if (error !== null) {
            return (
              <p>
                <span className="error">{error}</span>
              </p>
            );
          }
          if (stream === null) {
            return <p>Loading...</p>;
          }

          return (
            <>
              <h1>Stream: {stream.title}</h1>
              <p>
                {stream.event === undefined ? (
                  ""
                ) : (
                  <details>
                    <summary>
                      This stream is associated with an event:{" "}
                      <Link href={`/event/${stream.event.id}`}>
                        {stream.event.title}
                      </Link>
                    </summary>
                    <EventOverview event={stream.event} basic />
                  </details>
                )}
              </p>
              <p>
                {(() => {
                  if (stream.start_time === null) {
                    return (
                      <>
                        This stream has not yet started. Once the stream is
                        live, it will show up{" "}
                        <Link href="/stream">on the live stream page</Link>.
                      </>
                    );
                  }
                  if (stream.end_time === null) {
                    return (
                      <>
                        This stream is live! Visit{" "}
                        <Link href="/stream">the live stream page</Link> to
                        watch.
                      </>
                    );
                  }
                  if (stream.process_time === null) {
                    return (
                      <>
                        This stream is currently being transcoded. Check back
                        later to watch.
                      </>
                    );
                  }
                  return (
                    <video
                      className={styles.video}
                      controls
                      src={`/content/stream/vod/${stream.id}/${stream.id}.mp4`}
                    />
                  );
                })()}
              </p>
              <p>
                <i>Presented by {stream.presenter}</i>
              </p>
              {stream.description === null ? "" : <p>{stream.description}</p>}
            </>
          );
        })()}
        {session?.roles === undefined ||
        session.roles.findIndex((s) => s === "streamer") === -1 ? (
          ""
        ) : (
          <p>
            <input
              type="password"
              value={streamKey}
              disabled
              placeholder="Stream Key"
            />{" "}
            <button type="button" onClick={getStreamKey}>
              Get Stream Key
            </button>{" "}
            {streamKeyCopyMessage}
          </p>
        )}
      </main>
    </>
  );
}
