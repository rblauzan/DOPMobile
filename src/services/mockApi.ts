import db from "../db/mock-db.json";

const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
  Mock API
  Simula llamadas HTTP reales
*/

export const api = {
  async getWorkers() {
    await delay();
    return db.workers;
  },

  async getWorkerById(id: number) {
    await delay();
    return db.workers.find((w) => w.id === id);
  },

  async getUnassignedJobs() {
    await delay();
    return db.unassigned;
  },

  async getJobsByDate(date: string) {
    await delay();

    return db.workers.flatMap((w) =>
      w.jobs.filter((job) => job.date === date)
    );
  },

  async assignJob(workerId: number, jobId: number) {
    await delay();

    const worker = db.workers.find((w) => w.id === workerId);
    const jobIndex = db.unassigned.findIndex((j) => j.id === jobId);

    if (!worker || jobIndex === -1) return null;

    const job = db.unassigned.splice(jobIndex, 1)[0];

    worker.jobs.push({
      ...job,
      status: "assigned",
      priority: 0,
      payment: 0,
      type: "",
      rooms: 0,
      sqft: 0
    });

    return job;
  },

  async logout() {
    await delay(200);
    return true;
  }
};
