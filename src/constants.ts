import { configuration } from "./lib/config";

export const ACCESS = ''
export const USER_STORAGE_KEY = 'user';
export const TODAY = new Date().toISOString().slice(0, 10);
export const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
// export const LOGIN = `${configuration.IDP_URL}Access/Login?ReturnUrl=${configuration.BASE_URL}login`
// export const LOGOUT = `${configuration.IDP_URL}Home/Logout`
 export const AVATAR = `${configuration.AVATAR_URL}`
export const statusPill = {
  completed: "bg-emerald-400/20 text-emerald-100",
  assigned: "bg-white/15 text-white",
};
export const JOB_STATUS_OPTIONS = [
    "All",
    "Completed",
    "In Progress",
    "Scheduled",
    "Unscheduled",
    "Cancelled",
    "Estimated",
    "Unreviewed",
    "Bad Debt",
];

export const INVOICE_STATUS_OPTIONS = [
    "All",
    "Unpaid",
    "Paid",
    "Unsent",
    "Sent",
    "Estimated",
    "To Check",
    "To Approval",
    "Bad Debt",
    "Batched",
];
