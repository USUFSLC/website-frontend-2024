import { FormEvent, useState } from "react";

type Props = {
  stream: ServerStreamIn | null;
  serverEvent: ServerEventIn | null;
  callback: (event: Partial<ServerStreamOut>) => Promise<string | null>;
};

export default function StreamForm({ stream, serverEvent, callback }: Props) {
  const [title, setTitle] = useState(stream?.title ?? "");
  const [presenter, setPresenter] = useState(stream?.presenter ?? "");
  const [description, setDescription] = useState(stream?.description ?? "");

  const [errorText, setErrorText] = useState("");

  async function onSubmit(fevt: FormEvent<HTMLFormElement>) {
    fevt.preventDefault();

    const fd = new FormData(fevt.currentTarget);
    const payload: Record<string, unknown> = {
      title: fd.get("title"),
      presenter: fd.get("presenter"),
      description: fd.get("description"),
    };

    await callback(payload).then((et) => {
      setErrorText(et ?? "");
    });
  }

  function prefillFromEvent() {
    if (!serverEvent) {
      return;
    }

    setTitle(serverEvent.title);
    setDescription(serverEvent.description ?? "");
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="button" onClick={prefillFromEvent}>
        Copy details from event
      </button>
      <br />
      <br />

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

      <label htmlFor="presenter">
        Presenter:{" "}
        <input
          type="text"
          id="presenter"
          name="presenter"
          value={presenter}
          onChange={(e) => setPresenter(e.target.value)}
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
