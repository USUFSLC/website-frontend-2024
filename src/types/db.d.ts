// An event as returned from a server endpoint
type ServerEvent = {
  id: string;
  create_time: number;
  start_time: number;
  end_time: number;
  location: string | null;
  title: string;
  description: string | null;
  // eslint-disable-next-line no-use-before-define
  streams?: ServerStream[];
};

// A stream as returned from a server endpoint
type ServerStream = {
  id: string;
  create_time: number;
  start_time: number | null;
  end_time: number | null;
  process_time: number | null;
  title: string;
  presenter: string | null;
  nonmember_presenter: string | null;
  description: string;
  event?: ServerEvent;
  event_id: string | null;
  token?: string;
};
