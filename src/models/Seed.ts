export type JobStatus = "assigned" | "completed";
export type WorkerStatus = "active" | "on_vacation";

export interface Job {
  id: number;
  status?: JobStatus;
  client: string;
  address: string;
  time: string;
  duration: string;
  priority?: number;
  notes?: string;
  date: string;

  payment?: number;
  type?: string;
  rooms?: number;
  sqft?: number;
}

export interface Worker {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  home: string;
  payRate: number;
  status?: WorkerStatus;
  avatar?: string;
  jobs: Job[];
}

export interface Seed {
  today: string;
  workers: Worker[];
  unassigned: Job[];
}
