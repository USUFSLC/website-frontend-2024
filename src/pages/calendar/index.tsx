import Head from "next/head";

import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import Calendar from "react-calendar";
import { useContext, useEffect, useState } from "react";
import EventOverview from "@/components/event-overview.tsx";
import { AuthContext } from "@/components/auth-context.tsx";
import Link from "next/link";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function CalendarPage() {
  const [events, setEvents] = useState<Record<number, ServerEventIn[]>>({});
  const [selectedEvents, setSelectedEvents] = useState<ServerEventIn[]>([]);

  function loadEvents(year: number, month: number) {
    const start = new Date(year, month);
    const end = new Date(year, month + 1);
    fetch(
      `/api/event?from=${start.toISOString()}&to=${end.toISOString()}&with-streams`,
    ).then((r) => {
      if (r.ok) {
        r.json().then((j: ServerEventIn[]) => {
          const result: Record<number, ServerEventIn[]> = {};
          j.forEach((event) => {
            const date = new Date(event.start_time * 1000);
            const dayNumber = date.getDate();
            if (Object.hasOwn(result, dayNumber)) {
              result[dayNumber].push(event);
            } else {
              result[dayNumber] = [event];
            }
          });
          setEvents(result);
        });
      } else {
        setEvents({});
      }
    });
  }

  useEffect(() => {
    const now = new Date();
    loadEvents(now.getFullYear(), now.getMonth());
  }, []);

  const { session } = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>Calendar | USU FSLC</title>
      </Head>
      <main>
        <h1>Calendar</h1>
        <p>
          <strong>
            <Link href="/calendar/subscribe">
              &gt;&gt; Add FSLC events to your calendar application
            </Link>
          </strong>
        </p>
        <Calendar
          showNeighboringMonth={false}
          tileDisabled={(d) => {
            if (d.view === "month") {
              return !Object.hasOwn(events, d.date.getDate());
            }
            return false;
          }}
          onClickDay={(d) => setSelectedEvents(events[d.getDate()] ?? [])}
          onActiveStartDateChange={(d) => {
            if (d.view === "month") {
              if (d.activeStartDate !== null) {
                loadEvents(
                  d.activeStartDate.getFullYear(),
                  d.activeStartDate.getMonth(),
                );
              }
            }
          }}
        />
        {session?.roles === undefined ||
        session.roles.findIndex((s) => s === "leadership") === -1 ? (
          ""
        ) : (
          <p>
            <strong>
              <Link href="/event/new">Create New Event</Link>
            </strong>
          </p>
        )}
        <h2>Selected Events</h2>
        {selectedEvents.length === 0 ? (
          <p>--- none ---</p>
        ) : (
          selectedEvents.map((event) => (
            <>
              <h3>
                <Link href={`/event/${event.id}`}>{event.title}</Link>
              </h3>
              <EventOverview event={event} />
            </>
          ))
        )}
      </main>
    </>
  );
}
