import { useState } from "react";

type Props = {
  resource: ServerResource;
};

const PREFIXES = ["", "k", "M", "G"];

function sizeString(size: number) {
  let finalSize = size;
  let prefix;
  for (let i = 0; i < PREFIXES.length; i += 1) {
    prefix = PREFIXES[i];
    if (finalSize < 1024) {
      break;
    }
    finalSize /= 1024;
  }
  return `${finalSize.toFixed(prefix === "" ? 0 : 1)} ${prefix}B`;
}

export function ResourceOverview({ resource }: Props) {
  const [deleted, setDeleted] = useState(false);
  async function deleteResource() {
    let url;
    if (resource.event_id) {
      url = `/api/event/${resource.event_id}/resource/${resource.id}`;
    } else {
      url = `/api/stream/${resource.stream_id}/resource/${resource.id}`;
    }

    const resResponse = await fetch(url, {
      method: "DELETE",
    });
    if (resResponse.ok) {
      setDeleted(true);
    }
  }

  return (
    <>
      {deleted ? (
        <s>{resource.filename}</s>
      ) : (
        <a
          href={`/content/stream/resources/${resource.id}/${resource.filename}`}
          target="_blank"
          rel="noreferrer"
        >
          {resource.filename}
        </a>
      )}{" "}
      ({sizeString(resource.filesize)}){" "}
      <abbr style={{ fontSize: "0.8em" }} title={resource.content_hash}>
        sha256:
        {resource.content_hash.substring(0, 12)}
      </abbr>{" "}
      <button type="button" onClick={deleteResource} disabled={deleted}>
        Delete
      </button>
    </>
  );
}
