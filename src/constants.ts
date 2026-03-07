import i18n from "./i18n";
export const ACCESS = "";
export const USER_STORAGE_KEY = "user";
export const TODAY = new Date().toISOString().slice(0, 10);
export const TOMORROW = new Date(Date.now() + 86400000)
  .toISOString()
  .slice(0, 10);
export const REGISTER =
  "https://saasapp.diamondoperationspro.com/#/subscription/wizard/7,2";
  
export const ADMIN_USER = "admin@gmail.com";
export const VALID_CODE = "123456"; // 6 dígitos
export const DEMO_TOKEN = "demo-token-123";

export const statusPill = {
  completed: "bg-emerald-400/20 text-emerald-100",
  assigned: "bg-white/15 text-white",
};

export const JOB_STATUS_OPTIONS = [
  i18n.t("Customers.all"),
  i18n.t("Customers.Completed"),
  i18n.t("Customers.InProgress"),
  i18n.t("Customers.Scheduled"),
  i18n.t("Customers.Unscheduled"),
  i18n.t("Customers.Cancelled"),
  i18n.t("Customers.Estimated"),
  i18n.t("Customers.Unreviewed"),
  i18n.t("Customers.BadDebt"),
];

export const INVOICE_STATUS_OPTIONS = [
  i18n.t("Customers.all"),
  i18n.t("Customers.Unpaid"),
  i18n.t("Customers.Paid"),
  i18n.t("Customers.Unsent"),
  i18n.t("Customers.Sent"),
  i18n.t("Customers.Estimated"),
  i18n.t("Customers.ToCheck"),
  i18n.t("Customers.ToApproval"),
  i18n.t("Customers.BadDebt"),
  i18n.t("Customers.Batched"),
];
