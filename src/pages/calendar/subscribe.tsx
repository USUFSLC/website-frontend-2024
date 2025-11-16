import Head from "next/head";
import { FormEvent, useState } from "react";

export default function CalendarSubscribe() {
  const [semesterYear, setSemesterYear] = useState(new Date().getFullYear());
  const [url, setURL] = useState("");
  const [urlCopyMessage, setUrlCopyMessage] = useState("");

  async function onSubmit(fevt: FormEvent<HTMLFormElement>) {
    fevt.preventDefault();

    const fd = new FormData(fevt.currentTarget);

    let localURL = `https://${window.location.host}/api/event?format=ics`;

    const calendarType = fd.get("type-chooser")!;
    if (calendarType === "semester") {
      const season = fd.get("semester-fs");
      const year = fd.get("semester-year");
      const startDate = `${year}-${season === "fall" ? "08" : "01"}-01T00:00`;
      const endDate = `${year}-${season === "fall" ? "12" : "05"}-31T23:59`;
      localURL += `&from=${startDate}&to=${endDate}`;
    } else if (calendarType === "range") {
      const rangeStart = fd.get("range-start")!.toString();
      const rangeEnd = fd.get("range-end")!.toString();
      localURL += `&from=${rangeStart}&to=${rangeEnd}`;
    }

    setURL(localURL);

    try {
      await navigator.clipboard.writeText(localURL);
      setUrlCopyMessage("Calendar URL copied to clipboard");
    } catch (e) {
      setUrlCopyMessage("Could not copy URL to clipboard");
    }
  }

  return (
    <>
      <Head>
        <title>Subscribe to Calendar | USU FSLC</title>
      </Head>
      <main>
        <h1>Subscribe to FSLC Events</h1>
        <p>
          To add FSLC events to your calendar application, follow the
          instructions below. There are two steps: first choose which events you
          want, then add the link to your calendar.
        </p>
        <h2>Choose your events</h2>
        <form onSubmit={onSubmit}>
          <p>
            <label htmlFor="all">
              <input
                id="all"
                type="radio"
                name="type-chooser"
                defaultChecked
                value="all"
              />{" "}
              All events
            </label>
          </p>
          <p>
            <label htmlFor="semester">
              <input
                id="semester"
                type="radio"
                name="type-chooser"
                value="semester"
              />{" "}
              Semester:{" "}
            </label>
            <select name="semester-fs">
              <option value="fall">Fall</option>
              <option value="spring">Spring</option>
            </select>{" "}
            <input
              id="semester-year"
              type="number"
              name="semester-year"
              value={semesterYear}
              onChange={(e) => setSemesterYear(Number(e.target.value))}
            />
          </p>
          <p>
            <label htmlFor="range">
              <input
                id="range"
                type="radio"
                name="type-chooser"
                value="range"
              />{" "}
              Date range:{" "}
            </label>
            <input id="range-start" name="range-start" type="datetime-local" />
            {" through "}
            <input id="range-end" name="range-end" type="datetime-local" />
          </p>
          <p>
            <input type="submit" value="Generate and copy URL" />{" "}
            {urlCopyMessage}
          </p>
          <p style={{ textAlign: "center" }}>
            <input
              type="text"
              id="url"
              name="url"
              value={url}
              disabled
              style={{ width: "90%" }}
            />
          </p>
        </form>

        <h2>Add to calendar application</h2>
        <p>
          The specifics of this vary based on calendar application, but they are
          generally fairly similar. If you don&apos;t see your exact calendar
          app below, one of the described methods will get you close.
        </p>

        <ul>
          <li key="thunderbird">
            For Thunderbird:
            <ol>
              <li>
                Click <strong>New Calendar</strong>, then{" "}
                <strong>From the Network</strong>.
              </li>
              <li>
                Paste the URL into the <strong> Location</strong> box (leave{" "}
                <strong>Username</strong> blank; no login is necessary).
              </li>
              <li>
                Click <strong>Properties</strong> to give the calendar a
                user-friendly name and a color. It is also a good idea to make
                it read-only.
              </li>
              <li>
                Optionally, you can also set a global reminder for all events in
                the calendar in this screen. The links from this page do not
                provide notifications.
              </li>
              <li>
                Click <strong>Subscribe</strong>.
              </li>
            </ol>
          </li>
          <li key="google">
            For Google Calendar:
            <ol>
              <li>
                In the sidebar, under <strong>Other calendars</strong>, click
                the plus icon and then <strong>From URL</strong> (or use{" "}
                <a
                  href="https://calendar.google.com/calendar/r/settings/addbyurl"
                  target="_blank"
                  rel="noreferrer"
                >
                  this link
                </a>
                ).
              </li>
              <li>
                Paste the link you just copied into the page that appears.
              </li>
              <li>
                Click <strong>Add calendar</strong>.
              </li>
            </ol>
          </li>
          <li key="outlook">
            For Outlook
            <ol>
              <li>
                Open your calendar screen and click{" "}
                <strong>Add calendar</strong> (or use{" "}
                <a
                  href="https://outlook.office.com/calendar/addcalendar"
                  target="_blank"
                  rel="noreferrer"
                >
                  this link
                </a>
                ).
              </li>
              <li>
                Click <strong>Subscribe from web</strong> and paste your copied
                link.
              </li>
              <li>Set a calendar name, color, and optional charm.</li>
              <li>
                Click <strong>Import</strong>.
              </li>
            </ol>
          </li>
        </ul>
      </main>
    </>
  );
}
