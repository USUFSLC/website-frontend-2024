import { FormEvent, useState } from "react";

type Props<T extends "event" | "stream"> = {
  kind: T;
  parent: T extends "event" ? ServerEventIn : ServerStreamIn;
  onComplete?: (res: ServerResource) => void;
};

export default function ResourceUpload<T extends "event" | "stream">({
  kind,
  parent,
  onComplete,
}: Props<T>) {
  const [errorText, setErrorText] = useState("");
  const [filename, setFilename] = useState("");

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const resResponse = await fetch(`/api/${kind}/${parent.id}/resource`, {
      method: "POST",
      body: fd,
    });

    if (resResponse.ok) {
      onComplete?.(await resResponse.json());
      setErrorText("");
      setFilename("");
    } else if (resResponse.headers.get("content-type") === "application/json") {
      setErrorText((await resResponse.json()).message);
    } else {
      setErrorText(resResponse.statusText);
    }
  }

  return (
    <form encType="multipart/form-data" onSubmit={onUpload}>
      <input
        type="file"
        name="file"
        value={filename}
        onChange={(e) => setFilename(e.currentTarget.value)}
      />{" "}
      <input type="submit" value="Upload" />{" "}
      <span style={{ color: "var(--gruvbox-mode-red)" }}>{errorText}</span>
    </form>
  );
}

ResourceUpload.defaultProps = {
  onComplete: undefined,
};
