import Head from "next/head";
import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventOverview from "@/components/event-overview.tsx";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function NewEvent() {
  const [errorText, setErrorText] = useState("");
  const [serverEvent, setServerEvent] = useState<ServerEvent | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      title: fd.get("title"),
      nonmember_presenter: fd.get("presenter"),
      description: fd.get("description"),
      event_id: router.query.uuid,
    };

    await fetch(`/api/event/${router.query.uuid}/stream/`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
    }).then((r) => {
      if (!r.ok) {
        if (r.headers.get("content-type")?.startsWith("text/plain")) {
          r.text().then((t) => {
            setErrorText(t);
          });
        } else {
          setErrorText("Unknown error; see logs");
        }

        return;
      }

      r.json().then((j) => {
        router.push(`/stream/${j.id}`);
      });
    });
  }

  useEffect(() => {
    fetch(`/api/event/${router.query.uuid}/`).then((r) => {
      if (r.ok) {
        r.json().then(setServerEvent);
      } else {
        setErrorText("Event does not exist or cannot be accessed.");
      }
    });
  }, [router.query.uuid]);

  function prefillFromEvent() {
    if (!serverEvent) {
      return;
    }

    setTitle(serverEvent.title);
    setDescription(serverEvent.description ?? "");
  }

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
              <button type="button" onClick={prefillFromEvent}>
                Prefill details from event
              </button>
              <br />
              <br />
            </>
          );
        })()}
        <form onSubmit={onSubmit}>
          <label htmlFor="title">
            Title:{" "}
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <br />
          <br />

          <label htmlFor="presenter">
            Presenter: <input type="text" id="presenter" name="presenter" />
          </label>
          <br />
          <br />

          <label htmlFor="description">
            Description:
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <br />
          <br />

          <p>{errorText}</p>

          <input type="submit" value="Submit" />
        </form>
      </main>
    </>
  );
}
