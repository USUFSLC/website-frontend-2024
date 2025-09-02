import Head from "next/head";
import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import { FormEvent, MouseEvent, useState } from "react";
import { useRouter } from "next/router";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function NewEvent() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorText, setErrorText] = useState("");

  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      title: fd.get("title"),
      start: fd.get("start"),
      location: fd.get("location"),
      description: fd.get("description"),
    };

    if (fd.get("end") !== "") {
      payload.end = fd.get("end");
    }

    await fetch("/api/event/", {
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
        router.push(`/event/${j.id}`);
      });
    });
  }

  async function matchTimes(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setEndTime(startTime);
  }

  return (
    <>
      <Head>
        <title>New Event | USU FSLC</title>
      </Head>
      <main>
        <h1>New Event</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor="title">
            Title: <input type="text" id="title" name="title" />
          </label>
          <br />
          <br />

          <label htmlFor="start">
            Start Time:{" "}
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <br />
          <br />

          <label htmlFor="end">
            End Time:&nbsp;&nbsp;{" "}
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />{" "}
          </label>
          <button id="match" name="match" type="button" onClick={matchTimes}>
            Match with Start Time
          </button>
          <br />
          <br />

          <label htmlFor="location">
            Location: <input type="text" id="location" name="location" />
          </label>
          <br />
          <br />

          <label htmlFor="description">
            Description:
            <textarea id="description" name="description" />
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
