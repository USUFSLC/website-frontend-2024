import Head from "next/head";
import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import { useRouter } from "next/router";
import EventForm from "@/components/forms/event.tsx";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function NewEvent() {
  const router = useRouter();

  const callback = async (payload: Partial<ServerEventOut>) => {
    return fetch("/api/event", {
      method: "POST",
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
        router.push(`/event/${j.id}`);
      });

      return null;
    });
  };

  return (
    <>
      <Head>
        <title>New Event | USU FSLC</title>
      </Head>
      <main>
        <h1>New Event</h1>
        <EventForm event={null} callback={callback} />
      </main>
    </>
  );
}
