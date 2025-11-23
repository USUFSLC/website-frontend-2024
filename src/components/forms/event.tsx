import * as dat from "date-and-time";

import { permissiveDateToInputString } from "@/timeUtils.ts";
import { FormEvent, MouseEvent, useState } from "react";

const INFORMAT = dat.compile("YYYY-MM-DD[T]HH:mm");

type Props = {
  event: ServerEventIn | null;
  callback: (event: Partial<ServerEventOut>) => Promise<string | null>;
};

export default function EventForm({ event, callback }: Props) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [startTime, setStartTime] = useState(
    event?.start_time ? permissiveDateToInputString(event.start_time) : "",
  );
  const [endTime, setEndTime] = useState(
    event?.end_time ? permissiveDateToInputString(event.end_time) : "",
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [description, setDescription] = useState(event?.description ?? "");

  const [errorText, setErrorText] = useState("");

  async function onSubmit(fevt: FormEvent<HTMLFormElement>) {
    fevt.preventDefault();

    const fd = new FormData(fevt.currentTarget);
    const payload: Partial<ServerEventOut> = {
      title: fd.get("title")?.toString() ?? undefined,
      location: fd.get("location")?.toString() ?? undefined,
      description: fd.get("description")?.toString() ?? undefined,
    };

    const st =
      dat.parse(fd.get("start")!.toString(), INFORMAT).getTime() / 1000;
    if (!Number.isNaN(st)) {
      payload.start_time = st;
    }

    if (fd.get("end") !== "") {
      const et =
        dat.parse(fd.get("end")!.toString(), INFORMAT).getTime() / 1000;
      if (!Number.isNaN(st)) {
        payload.end_time = et;
      }
    }

    await callback(payload).then((et) => {
      setErrorText(et ?? "");
    });
  }

  async function matchTimes(mevt: MouseEvent<HTMLButtonElement>) {
    mevt.preventDefault();
    setEndTime(startTime);
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="title">
        Title:{" "}
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label htmlFor="start">
        Start Time:{" "}
        <input
          type="datetime-local"
          id="start"
          name="start"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label htmlFor="end">
        End Time:&nbsp;&nbsp;{" "}
        <input
          type="datetime-local"
          id="end"
          name="end"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />{" "}
      </label>
      <button id="match" name="match" type="button" onClick={matchTimes}>
        Match with Start Time
      </button>
      <br />
      <br />

      <label htmlFor="location">
        Location:{" "}
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label htmlFor="description">
        Description:
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <br />
      <br />

      <p>{errorText}</p>

      <input type="submit" value="Submit" />
    </form>
  );
}
