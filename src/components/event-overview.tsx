import { compile, format } from "date-and-time";
import Link from "next/link";

type Props = {
  event: ServerEvent;
};

const DPATTERN = compile("D MMM YYYY");
const TPATTERN = compile("HH:mm");

export default function EventOverview({ event }: Props) {
  const startDate = new Date(event.starts_at * 1000);
  const endDate = new Date(event.ends_at * 1000);

  let dateLine;
  if (event.starts_at === event.ends_at) {
    dateLine = `${format(startDate, DPATTERN)}`;
  } else if (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()
  ) {
    dateLine = `${format(startDate, DPATTERN)} ${format(startDate, TPATTERN)} - ${format(endDate, TPATTERN)}`;
  } else {
    dateLine = `${format(startDate, DPATTERN)} ${format(startDate, TPATTERN)} - ${format(endDate, DPATTERN)} ${format(endDate, TPATTERN)}`;
  }

  return (
    <ul>
      <li key="when">
        <b>When?</b> {dateLine}
      </li>
      {!event.location ? (
        ""
      ) : (
        <li key="where">
          <b>Where?</b> {event.location}
        </li>
      )}
      {!event.description || event.description === "" ? (
        ""
      ) : (
        <li key="desc">
          <b>What?</b> {event.description}
        </li>
      )}
      <li>
        <b>Streams:</b>{" "}
        {event.streams === undefined || event.streams.length === 0 ? (
          "none"
        ) : (
          <ul>
            {event.streams.map((s) => (
              <li>
                <Link href={`/stream/${s.id}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
}
