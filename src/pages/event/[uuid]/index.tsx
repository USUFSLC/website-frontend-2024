import Head from "next/head";

import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventOverview from "@/components/event-overview.tsx";
import StreamOneline from "@/components/stream-oneline.tsx";
import { AuthContext } from "@/components/auth-context.tsx";
import EventForm from "@/components/forms/event.tsx";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function EventPage() {
  const [event, setEvent] = useState<ServerEventIn | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/event/${router.query.uuid}?with-streams`).then((r) => {
      if (r.ok) {
        r.json().then(setEvent);
      } else {
        setError("Could not load event");
      }
    });
  }, [router.query.uuid]);

  const { session } = useContext(AuthContext);

  const formCallback = async (payload: Partial<ServerEventOut>) => {
    return fetch(`/api/event/${router.query.uuid}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
    }).then((r) => {
      if (!r.ok) {
        if (r.headers.get("content-type")?.startsWith("text/plain")) {
          return r.text();
        }
        return "Unknown error; see logs";
      }

      r.json().then((j) => {
        setEvent(j);
      });

      return null;
    });
  };

  return (
    <>
      <Head>
        <title>{event === null ? "Loading..." : event.title}</title>
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
          if (event === null) {
            return <p>Loading...</p>;
          }
          return (
            <>
              <h1>{event.title}</h1>
              <EventOverview event={event} basic />
              {event.streams && event.streams.length > 0 ? (
                <h2>Streams</h2>
              ) : (
                ""
              )}
              {event.streams?.map((s) => {
                return (
                  <>
                    <StreamOneline stream={s} />
                    <br />
                  </>
                );
              })}
              {session?.roles?.findIndex((s) => s === "leadership") !== -1 ? (
                <>
                  <h2>Edit Details</h2>
                  <EventForm event={event} callback={formCallback} />
                </>
              ) : null}
            </>
          );
        })()}
      </main>
    </>
  );
}
