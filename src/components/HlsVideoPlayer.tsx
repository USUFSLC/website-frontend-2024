// components/HlsVideoPlayer.js
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

import styles from "@/styles/Watch.module.css";

type Props = {
  src: string;
};

function HlsVideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video === null) {
      return () => {};
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      // Cleanup function to destroy HLS instance
      return () => {
        hls.destroy();
      };
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {};
  }, [src]);

  return <video ref={videoRef} controls className={styles.video} />;
}

export default HlsVideoPlayer;
