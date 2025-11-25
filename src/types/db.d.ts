type ServerResource = {
  id: string;
  create_time: number;
  filename: string;
  filesize: number;
  content_hash: string;
  stream_id: string;
  event_id: string;
};

// An event as returned from a server endpoint (no
type ServerEvent<D> = {
  id: string;
  create_time: number;
  start_time: D;
  end_time: D;
  location: string | null;
  title: string;
  description: string | null;
  // eslint-disable-next-line no-use-before-define
  streams?: ServerStream[];
  resources?: ServerResource[];
};

type ServerEventOut = ServerEvent<number | string>;

type ServerEventIn = ServerEvent<number>;

// A stream as returned from a server endpoint
type ServerStream<D> = {
  id: string;
  create_time: D;
  start_time: D | null;
  end_time: D | null;
  process_time: D | null;
  title: string;
  presenter: string | null;
  nonmember_presenter: string | null;
  description: string;
  event?: ServerEvent<D>;
  event_id: string | null;
  resources?: ServerResource[];
  token?: string;
};

type ServerStreamOut = ServerStream<number | string>;

type ServerStreamIn = ServerStream<number>;
