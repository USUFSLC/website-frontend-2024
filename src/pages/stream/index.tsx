import Head from "next/head";
import styles from "@/styles/Watch.module.css";

import ReactHlsPlayer from "react-hls-video-player/dist/components/ReactHlsPlayer";

export default function Watch() {
  return (
    <>
      <Head>
        <title>Streams @ USU FSLC</title>
      </Head>
      <main>
        <h1>Watch</h1>
        <ReactHlsPlayer
          src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
          autoPlay={false}
          controls
          id="video"
          className={styles.video}
        />
      </main>
    </>
  );
}
