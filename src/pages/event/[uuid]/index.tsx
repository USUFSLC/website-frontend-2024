import Head from "next/head";

import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventOverview from "@/components/event-overview.tsx";
import StreamOneline from "@/components/stream-oneline.tsx";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function EventPage() {
  const [event, setEvent] = useState<ServerEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/event/${router.query.uuid}/?with-streams`).then((r) => {
      if (r.ok) {
        r.json().then(setEvent);
      } else {
        setError("Could not load event");
      }
    });
  }, [router.query.uuid]);

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
            </>
          );
        })()}
      </main>
    </>
  );
}
