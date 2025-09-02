import Head from "next/head";
import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import { useEffect, useState } from "react";
import Link from "next/link";
import HlsVideoPlayer from "@/components/HlsVideoPlayer.tsx";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function Watch() {
  const [streams, setStreams] = useState<ServerStream[]>([]);

  async function getStreams() {
    const response = await fetch(`/api/stream/live/`);
    if (response.ok) {
      const j = await response.json();
      setStreams(j);
    }
  }

  useEffect(() => {
    getStreams();
  }, []);

  return (
    <>
      <Head>
        <title>Streams | USU FSLC</title>
      </Head>
      <main>
        <h1>Watch</h1>
        {streams.length === 0 ? (
          <p>
            No streams are ongoing! Check out{" "}
            <strong>
              <Link href="/calendar">the calendar page</Link>
            </strong>{" "}
            to look for past or future events, or just wait here for a stream to
            start.
          </p>
        ) : null}
        {streams.map((s) => {
          return (
            <>
              <h2>{s.title}</h2>
              <HlsVideoPlayer
                src={`content/stream/hls/${s.id}.${s.token}.m3u8`}
              />
              <p>
                <i>Presented by {s.presenter}</i>
              </p>
              <p>{s.description}</p>
            </>
          );
        })}
      </main>
    </>
  );
}
