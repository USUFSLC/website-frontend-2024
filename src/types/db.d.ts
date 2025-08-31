// An event as returned from a server endpoint
type ServerEvent = {
  id: string;
  created_at: number;
  starts_at: number;
  ends_at: number;
  location: string | null;
  title: string;
  description: string | null;
  // eslint-disable-next-line no-use-before-define
  streams?: ServerStream[];
};

// A stream as returned from a server endpoint
type ServerStream = {
  id: string;
  created_at: number;
  started_at: number | null;
  ended_at: number | null;
  processed_at: number | null;
  title: string;
  presenter: string | null;
  nonmember_presenter: string | null;
  description: string;
  event?: ServerEvent;
  event_id: string | null;
  token?: string;
};
