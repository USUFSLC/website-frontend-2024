import Link from "next/link";

type Props = {
  stream: ServerStreamIn;
};

export default function StreamOneline({ stream }: Props) {
  let lengthLine;

  if (stream.start_time === null) {
    lengthLine = "Unstarted";
  } else if (stream.end_time === null) {
    lengthLine = `LIVE`;
  } else {
    const streamLength = stream.end_time - stream.start_time;
    const seconds = streamLength % 60 | 0;
    const minutes = (streamLength / 60) % 60 | 0;
    const hours = (streamLength / 3600) % 60 | 0;
    lengthLine = `${minutes}m ${seconds}s`;
    if (hours > 0) {
      lengthLine = `${hours}h ${lengthLine}`;
    }
  }

  return (
    <>
      <i>
        <Link href={`/stream/${stream.id}`}>{stream.title}</Link>
      </i>{" "}
      ({lengthLine})
    </>
  );
}
