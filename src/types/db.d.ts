// An event as returned from a server endpoint
type ServerEvent = {
  id: string;
  created_at: number;
  starts_at: number;
  ends_at: number;
  location?: string;
  title: string;
  description?: string;
  // eslint-disable-next-line no-use-before-define
  streams?: ServerStream[];
};

// A stream as returned from a server endpoint
type ServerStream = {
  id: string;
  created_at: number;
  starts_at: number;
  ends_at: number;
  location?: string;
  title: string;
  description?: string;
  event?: ServerEvent;
};
