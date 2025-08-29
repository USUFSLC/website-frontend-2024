import Head from "next/head";

import { getServerSidePropsWithAuthDefaults } from "@/authUtils.ts";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import EventOverview from "@/components/event-overview.tsx";

export const getServerSideProps = getServerSidePropsWithAuthDefaults(
  async () => {
    return { props: {} };
  },
);

export default function CalendarPage() {
  const [events, setEvents] = useState<Record<number, ServerEvent[]>>({});
  const [selectedEvents, setSelectedEvents] = useState<ServerEvent[]>([]);

  function loadEvents(year: number, month: number) {
    const start = new Date(year, month);
    const end = new Date(year, month + 1);
    fetch(
      `/api/event/?from=${start.toISOString()}&to=${end.toISOString()}&with-streams`,
    ).then((r) => {
      if (r.ok) {
        r.json().then((j: ServerEvent[]) => {
          const result: Record<number, ServerEvent[]> = {};
          j.forEach((event) => {
            const date = new Date(event.starts_at * 1000);
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

  return (
    <>
      <Head>
        <title>Calendar | USU FSLC</title>
      </Head>
      <main>
        <h1>Calendar</h1>
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
        <h2>Selected Events</h2>
        {selectedEvents.length === 0 ? (
          <p>--- none ---</p>
        ) : (
          selectedEvents.map((event) => (
            <>
              <h3>{event.title}</h3>
              <EventOverview event={event} />
            </>
          ))
        )}
      </main>
    </>
  );
}
