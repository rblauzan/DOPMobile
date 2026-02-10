export type Worker = {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  home: string;
  payRate: number;
  jobs: Job[];
};

export type Job = {
  id: number;
  client: string;
  address: string;
  time: string;
  duration: string;
  priority: number;
  notes: string;
  status?: "assigned" | "completed";
  date: string;
};

type MockDB = {
  meta: { today: string };
  workers: Worker[];
  unassignedJobs: Job[];
};

const DB_URL = "db/mock-db.json";

/* =========================
   FETCH DB
   ========================= */

export async function getMockDB(): Promise<MockDB> {
  const res = await fetch(DB_URL);
  if (!res.ok) throw new Error("Failed to load mock db");
  return res.json();
}

/* =========================
   HELPERS (igual backend real)
   ========================= */

export function jobsForDate(worker: Worker, date: string) {
  return worker.jobs.filter((j) => j.date === date);
}

export function workersWithJobsForDate(workers: Worker[], date: string) {
  return workers.filter((w) => jobsForDate(w, date).length > 0);
}

export function unassignedForDate(jobs: Job[], date: string) {
  return jobs.filter((j) => j.date === date);
}
