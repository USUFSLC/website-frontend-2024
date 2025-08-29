import Link from "next/link";

type Props = {
  stream: ServerStream;
};

export default function StreamOneline({ stream }: Props) {
  let lengthLine;

  if (stream.started_at === null) {
    lengthLine = "Unstarted";
  } else if (stream.ended_at === null) {
    lengthLine = `LIVE`;
  } else {
    const streamLength = stream.ended_at - stream.started_at;
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
