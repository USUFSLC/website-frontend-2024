import { compile, format } from "date-and-time";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "./auth-context.tsx";
import StreamOneline from "./stream-oneline.tsx";

type Props = {
  event: ServerEvent;
  basic?: boolean;
};

const DPATTERN = compile("D MMM YYYY");
const TPATTERN = compile("HH:mm");

export default function EventOverview({ event, basic }: Props) {
  const startDate = new Date(event.starts_at * 1000);
  const endDate = new Date(event.ends_at * 1000);

  const { session } = useContext(AuthContext);

  let dateLine;
  if (event.starts_at === event.ends_at) {
    dateLine = `${format(startDate, DPATTERN)} ${format(startDate, TPATTERN)}`;
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
      {basic ? (
        ""
      ) : (
        <>
          <li key="streams">
            <b>{event.streams?.length === 1 ? "Stream" : "Streams"}: </b>
            {(() => {
              if (event.streams === undefined || event.streams.length === 0) {
                return "[none]";
              }
              if (event.streams.length === 1) {
                return <StreamOneline stream={event.streams[0]} />;
              }
              return (
                <ul>
                  {event.streams.map((s) => (
                    <li key={s.id}>
                      <StreamOneline stream={s} />
                    </li>
                  ))}
                </ul>
              );
            })()}
          </li>
          {session?.roles === undefined ||
          session.roles.findIndex((s) => s === "streamer") === -1 ? (
            ""
          ) : (
            <li key="newstream">
              <Link href={`event/${event.id}/add-stream`}>Add Stream</Link>
            </li>
          )}
          <li key="more">
            <strong>
              <Link href={`/event/${event.id}`}>More info...</Link>
            </strong>
          </li>
        </>
      )}
    </ul>
  );
}

EventOverview.defaultProps = {
  basic: false,
};
