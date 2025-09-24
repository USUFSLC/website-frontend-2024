import Head from "next/head";
import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventOverview from "@/components/event-overview.tsx";
import StreamForm from "@/components/forms/stream.tsx";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function NewEvent() {
  const [errorText, setErrorText] = useState("");
  const [serverEvent, setServerEvent] = useState<ServerEventIn | null>(null);

  const router = useRouter();

  const onSubmit = async (payload: Partial<ServerStreamOut>) => {
    return fetch(`/api/event/${router.query.uuid}/stream`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
    }).then((r) => {
      if (!r.ok) {
        if (r.headers.get("content-type")?.startsWith("text/plain")) {
          return r.text().then((t) => {
            return t;
          });
        }
        return "Unknown error; see logs";
      }

      r.json().then((j) => {
        router.push(`/stream/${j.id}`);
      });

      return null;
    });
  };

  useEffect(() => {
    fetch(`/api/event/${router.query.uuid}`).then((r) => {
      if (r.ok) {
        r.json().then(setServerEvent);
      } else {
        setErrorText("Event does not exist or cannot be accessed.");
      }
    });
  }, [router.query.uuid]);

  return (
    <>
      <Head>
        <title>New Stream | USU FSLC</title>
      </Head>
      <main>
        <h1>New Stream</h1>
        {(() => {
          if (serverEvent === null) {
            if (errorText === null) {
              return <p>Loading event...</p>;
            }
            return <p>{errorText}</p>;
          }
          return (
            <>
              <h2>{serverEvent.title}</h2>
              <EventOverview event={serverEvent} basic />
            </>
          );
        })()}
        <StreamForm
          stream={null}
          serverEvent={serverEvent}
          callback={onSubmit}
        />
      </main>
    </>
  );
}
