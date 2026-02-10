export interface seed {
  today: string;
  workers: {
    id: number;
    name: string;
    role: string;
    phone: string;
    email: string;
    home: string;
    payRate: number;
    jobs: Jobs[];
  }[];
  unassigned: {
    id: number;
    client: string;
    address: string;
    time: string;
    duration: string;
    notes: string;
    date: string;
  }[];
}

interface Jobs {
  id: number;
  status: string;
  client: string;
  address: string;
  time: string;
  duration: string;
  priority: number;
  notes: string;
  date: string;
}
