import db from "../db/mock-customers.json";

const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
  Mock API
  Simula llamadas HTTP reales
*/

export const api = {
  async getCustomers() {
    await delay();
    return db.customers;
  },

}