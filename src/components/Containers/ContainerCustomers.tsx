import { useEffect, useMemo, useState } from "react";
import Screen  from "../Layout/Screen"
import {
  Home,
  Layers,
  Receipt,
  CreditCard,
  Plus,
  ChevronRight,
  CalendarDays,
  MapPin,
  DollarSign,
} from "lucide-react";
import Header from "../UI/Header";
import SearchBar from "../UI/SearchBar";
import  List  from "../UI/List";
import Card from "../UI/Card";
import Pill from "../UI/Pill";
import  PrimaryButton  from "../UI/PrimaryButton";
import IconSquare from "../UI/IconSquare";
import { Grid } from "../UI/Grid";
import  StatCard  from "../UI/StatCard";
import  TopTabs  from "../UI/TopTabs";
import { FilterRow } from "../UI/FilterRow";
import SectionHeader from "../Layout/SectionHeader";
import JobRow from "../UI/JobRow";
import InvoiceRow from "../UI/InvoiceRow";
import BottomSheet from "../UI/BottomSheet";
import SheetTitle from "../UI/SheetTitle";
import { JOB_STATUS_OPTIONS, INVOICE_STATUS_OPTIONS } from "../../constants";
import { textIncludesAny, fmtMoney, fmtDateShort, jobMatchesStatus, inDateRange, invoiceMatchesStatus } from "../../helpers/helpersCustomers";
import DateRangeEditor from "../UI/DateRangeEditor";
import SecondaryButton from "../UI/SecondaryButton";
import { api } from "../../services/apicustomers";
import { Customer } from "../../models/Customers";
import { EmployeesSkeleton } from "../UI/CardSkeleton";
import { useTranslation } from "react-i18next";

/**
 * ============================================================
 * DOP OWNER APP – CUSTOMER CRM (RESTORED + IMPROVED)
 * ============================================================
 * Restored full module set (was accidentally simplified):
 *  • Customers list
 *  • Customer profile tabs: Dashboard / Properties / Jobs / Invoices / Batches / Transactions
 *  • Property drill-down tabs: Dashboard / Jobs / Invoices
 *  • Aggregated Jobs & Invoices across ALL properties (customer level)
 *  • Scoped Jobs & Invoices within a property (property level)
 *
 * Improvements requested:
 *  • Remove horizontal scrolling status tabs → use Filter BottomSheet
 *  • Jobs cards include actions: View + Photos + Checklist (Checklist only for Completed)
 *
 * Notes:
 *  • All actions are UI placeholders (alerts) for now.
 *  • Mobile-first, glass UI, DOP colors.
 * ============================================================
 */

/* =========================
   MOCK DATA (RICH + REALISTIC)
   ========================= */

// const MOCK = {
//   customers: [
//     {
//       id: 1,
//       name: "Nomadic Vacation Rentals",
//       email: "accounting@nomadicvacays.com",
//       phone: "(239) 317-6096",
//       admissionDate: "2026-02-13",
//       active: true,
//       notes: "Hello@nomadicvacays.com",
//       properties: [
//         {
//           id: 101,
//           title: "Beach Breeze 290",
//           type: "Residential",
//           address: "32 1st St, Bonita Springs, FL 34134",
//           county: "Lee",
//           lastService: "2026-02-12",
//           lastScheduledService: "2027-03-18",
//         },
//         {
//           id: 102,
//           title: "Blue Wave",
//           type: "Business",
//           address: "600 100th Ave N, Naples, FL 34108",
//           county: "Collier",
//           lastService: "2026-02-10",
//           lastScheduledService: "2026-02-20",
//         },
//       ],
//       jobs: [
//         {
//           id: 181484,
//           status: "Scheduled",
//           propertyId: 101,
//           propertyName: "Beach Breeze 290",
//           propertyAddress: "32 1st St, Bonita Springs, FL",
//           service: "Rental Cleaning",
//           price: 260,
//           start: "2026-03-30T10:00:00",
//           dateCompleted: null,
//           estimatedH: 2,
//           workedH: 0,
//           team: "Team A",
//           photosCount: 0,
//           checklistDone: false,
//         },
//         {
//           id: 1814842,
//           status: "In Progress",
//           propertyId: 102,
//           propertyName: "Blue Wave",
//           propertyAddress: "600 100th Ave N, Naples, FL",
//           service: "Outdoor",
//           price: 0,
//           start: "2026-03-30T13:15:00",
//           dateCompleted: null,
//           estimatedH: 0.3,
//           workedH: 0,
//           team: "Team B",
//           photosCount: 6,
//           checklistDone: false,
//         },
//         {
//           id: 1814841,
//           status: "Completed",
//           propertyId: 102,
//           propertyName: "Blue Wave",
//           propertyAddress: "600 100th Ave N, Naples, FL",
//           service: "PM",
//           price: 180,
//           start: "2026-03-29T16:00:00",
//           dateCompleted: "2026-03-29",
//           estimatedH: 0.3,
//           workedH: 0.4,
//           team: "Team B",
//           photosCount: 12,
//           checklistDone: true,
//         },
//       ],
//       invoices: [
//         {
//           id: 183023,
//           status: "Unpaid",
//           propertyId: 102,
//           propertyName: "Blue Wave",
//           service: "Rental Cleaning",
//           date: "2026-02-16",
//           amount: 200,
//           discount: 0,
//           toPaid: 200,
//           paid: 0,
//         },
//         {
//           id: 183022,
//           status: "Paid",
//           propertyId: 101,
//           propertyName: "Beach Breeze 290",
//           service: "Rental Cleaning",
//           date: "2026-02-16",
//           amount: 260,
//           discount: 0,
//           toPaid: 260,
//           paid: 260,
//         },
//       ],
//       batches: [
//         {
//           id: "B-2026-02",
//           status: "To Approval",
//           count: 24,
//           total: 4860,
//           date: "2026-02-20",
//         },
//       ],
//       transactions: [
//         { id: 1, type: "Payment", amount: 200, date: "2026-02-16", method: "Card" },
//         { id: 2, type: "Refund", amount: -50, date: "2026-02-14", method: "Card" },
//       ],
//     },
//     {
//       id: 2,
//       name: "Marco Luxe Retreat LLC",
//       email: "info@marcoluxe.com",
//       phone: "(239) 555-1000",
//       admissionDate: "2026-02-07",
//       active: true,
//       notes: "",
//       properties: [
//         {
//           id: 201,
//           title: "Marco Luxe Retreat",
//           type: "Residential",
//           address: "840 Rose Ct, Marco Island, FL 34145",
//           county: "Collier",
//           lastService: "2026-02-10",
//           lastScheduledService: "2026-02-20",
//         },
//       ],
//       jobs: [],
//       invoices: [],
//       batches: [],
//       transactions: [],
//     },
//   ],
// };

/* =========================
   FILTER OPTIONS
   ========================= */

// const JOB_STATUS_OPTIONS = [
//   "All",
//   "Completed",
//   "In Progress",
//   "Scheduled",
//   "Unscheduled",
//   "Cancelled",
//   "Estimated",
//   "Unreviewed",
//   "Bad Debt",
// ];

// const INVOICE_STATUS_OPTIONS = [
//   "All",
//   "Unpaid",
//   "Paid",
//   "Unsent",
//   "Sent",
//   "Estimated",
//   "To Check",
//   "To Approval",
//   "Bad Debt",
//   "Batched",
// ];

/* =========================
   HELPERS
   ========================= */

// function fmtMoney(n) {
//   const v = Number(n || 0);
//   return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
// }

// function fmtDateShort(dateStr) {
//   if (!dateStr) return "—";
//   const d = new Date(dateStr);
//   if (Number.isNaN(d.getTime())) return String(dateStr);
//   return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
// }

// function fmtDateTimeShort(iso) {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return String(iso);
//   return d.toLocaleString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "2-digit",
//     hour: "numeric",
//     minute: "2-digit",
//   });
// }

// function inDateRange(dateISO, range) {
//   if (!range?.start && !range?.end) return true;
//   const d = new Date(dateISO);
//   if (Number.isNaN(d.getTime())) return true;
//   const start = range.start ? new Date(range.start) : null;
//   const end = range.end ? new Date(range.end) : null;
//   if (start && d < start) return false;
//   if (end) {
//     const endPlus = new Date(end);
//     endPlus.setHours(23, 59, 59, 999);
//     if (d > endPlus) return false;
//   }
//   return true;
// }

// function jobMatchesStatus(job, status) {
//   if (!status || status === "All") return true;
//   return String(job.status).toLowerCase() === status.toLowerCase();
// }

// function invoiceMatchesStatus(inv, status) {
//   if (!status || status === "All") return true;
//   return String(inv.status).toLowerCase() === status.toLowerCase();
// }

// function textIncludesAny(obj, q, fields) {
//   const needle = (q || "").trim().toLowerCase();
//   if (!needle) return true;
//   return fields.some((f) => String(obj?.[f] ?? "").toLowerCase().includes(needle));
// }

/* =========================
   MAIN
   ========================= */

export default function DOPOwnerCRM() {
  const [view, setView] = useState(
    /** @type {"customers"|"customer"|"property"} */
    ("customers")
  );

  const [customerTab, setCustomerTab] = useState(
    /** @type {"Dashboard"|"Properties"|"Jobs"|"Invoices"|"Batches"|"Transactions"} */
    ("Dashboard")
  );

  const [propertyTab, setPropertyTab] = useState(
    /** @type {"Dashboard"|"Jobs"|"Invoices"} */
    ("Dashboard")
  );
  const { t } = useTranslation("");
  const [search, setSearch] = useState("");
  const [isloading,setisLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState(/** @type {number|null} */ (null));
  const [selectedPropertyId, setSelectedPropertyId] = useState(/** @type {number|null} */ (null));

  // Filters
  const [jobStatus, setJobStatus] = useState("All");
  const [invoiceStatus, setInvoiceStatus] = useState("All");
  const [dateRange, setDateRange] = useState({ [t("Customers.start")]: "", [t("Customers.end")]: ""});

  // Sheets
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [statusSheetKind, setStatusSheetKind] = useState(/** @type {"jobs"|"invoices"} */ ("jobs"));

  const [customers, setCustomer] = useState<Customer[]>([]);

  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [selectedCustomerId, customers]);

  const selectedProperty = useMemo(() => {
    if (!selectedCustomer) return null;
    return selectedCustomer.properties.find((p) => p.id === selectedPropertyId) || null;
  }, [selectedCustomer, selectedPropertyId]);

  const customerJobs = useMemo(() => selectedCustomer?.jobs || [], [selectedCustomer]);
  const customerInvoices = useMemo(() => selectedCustomer?.invoices || [], [selectedCustomer]);

  const propertyJobs = useMemo(() => {
    if (!selectedCustomer || !selectedProperty) return [];
    return (selectedCustomer.jobs || []).filter((j) => j.propertyId === selectedProperty.id);
  }, [selectedCustomer, selectedProperty]);

  const propertyInvoices = useMemo(() => {
    if (!selectedCustomer || !selectedProperty) return [];
    return (selectedCustomer.invoices || []).filter((i) => i.propertyId === selectedProperty.id);
  }, [selectedCustomer, selectedProperty]);

  const openJobStatusFilter = () => {
    setStatusSheetKind("jobs");
    setStatusSheetOpen(true);
  };

  const openInvoiceStatusFilter = () => {
    setStatusSheetKind("invoices");
    setStatusSheetOpen(true);
  };


   useEffect(() => {
    const loadData = async () => {
      setisLoading(true);
      const customerResponse = await api.getCustomers();
      setCustomer(customerResponse as Customer[]);
      setisLoading(false);    
    };    
    loadData();
    
  }, []);

  
  /* =========================
     CUSTOMERS LIST
     ========================= */


     if(isloading){
    return(
      <EmployeesSkeleton/>    
    )
  }

  
  if (view === "customers") {
    const filtered = customers.filter((c) => textIncludesAny(c, search, ["name", "email", "phone"]));

    return (
      <Screen>
        <Header
          title={t("Customers.title1")}
          subtitle={t("Customers.subtitle1")}
          right={
            <PrimaryButton
              icon={<Plus size={16} />}
              label={t("Customers.button1")}
              onClick={() => alert("Add customer (UI placeholder)")}
            />
          }
        />

        <SearchBar value={search} onChange={setSearch} entity= {t("SearchBar.customer")} />

        <List>
          {filtered.map((c) => {
            const billed = (c.invoices || []).reduce((s, i) => s + (i.amount || 0), 0);
            const revenue = (c.invoices || []).reduce((s, i) => s + (i.paid || 0), 0);

            return (
              <Card
                key={c.id}
                onClick={() => {
                  setSelectedCustomerId(c.id);
                  setCustomerTab(t("Customers.tab1"));
                  setView("customer");
                  setSearch("");
                  setJobStatus(t("Customers.all"));
                  setInvoiceStatus(t("Customers.all"));
                  setDateRange({ start: "", end: "" });
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold truncate">{c.name}</h3>
                    <p className="text-xs opacity-70 truncate">{c.email}</p>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Pill icon={<Home size={14} />} label={`${c.properties.length} ${t("Customers.tab2")}`} accent={false} />
                      <Pill icon={<Layers size={14} />} label={`${(c.jobs || []).length} ${t("Customers.tab3")}`} accent={false} />
                    </div>

                    <div className="mt-3 text-xs opacity-80 space-y-1">
                      <div>
                        <span className="opacity-70">{t("Customers.Billed")}:</span> {fmtMoney(billed)} ·
                        <span className="opacity-70"> {t("Customers.Revenue")}:</span> {fmtMoney(revenue)}
                      </div>
                      <div className="opacity-70">{t("Customers.Admission")}: {fmtDateShort(c.admissionDate)}</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="opacity-60 shrink-0" />
                </div>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center text-sm opacity-70 mt-10">{t("Customers.div1")}</div>
          )}
        </List>

        <DevSelfTests />
      </Screen>
    );
  }

  /* =========================
     CUSTOMER PROFILE
     ========================= */

  if (view === "customer") {
    if (!selectedCustomer) {
      return (
        <Screen>
          <Header title={t("Customers.title2")} onBack={() => setView("customers")} subtitle={""} />
          <div className="px-4 text-sm opacity-80">{t("Customers.div2")}.</div>
          <DevSelfTests />
        </Screen>
      );
    }

    const headerRight = (
      <div className="flex items-center gap-2">
        <IconSquare
          title={t("Customers.iconSquare1")}
          icon={<CalendarDays size={16} />}
          onClick={() => setDateSheetOpen(true)}
        />
        <IconSquare
          title={t("Customers.iconSquare2")}
          icon={<Plus size={16} />}
          onClick={() => alert("Customer actions (UI placeholder)")}
        />
      </div>
    );

    return (
      <Screen>
        <Header
          title={selectedCustomer.name}
          subtitle={t("Customers.subtitle2")}
          onBack={() => setView("customers")}
          right={headerRight}
        />

        <TopTabs
          tabs={[t("Customers.tab1"), t("Customers.tab2"), t("Customers.tab3"), t("Customers.tab4"), t("Customers.tab5"), t("Customers.tab6")]}
          active={customerTab}
          onChange={(t) => {
            setCustomerTab(t);
            setSearch("");
          }}
        />

        {customerTab === t("Customers.tab1") && (
          <>
            <Grid>
              <StatCard
                icon={<Layers />}
                label={t("Customers.statCard1")}
                value={String((selectedCustomer.jobs || []).filter((j) => j.status === t("Customers.Completed")).length)}
              />
              <StatCard
                icon={<Layers />}
                label={t("Customers.statCard2")}
                value={String((selectedCustomer.jobs || []).filter((j) => j.status !== t("Customers.Completed")).length)}
              />
              <StatCard
                icon={<DollarSign />}
                label={t("Customers.statCard3")}
                value={fmtMoney((selectedCustomer.invoices || []).reduce((s, i) => s + (i.paid || 0), 0))}
              />
              <StatCard
                icon={<CreditCard />}
                label={t("Customers.statCard4")}
                value={fmtMoney(
                  (selectedCustomer.invoices || []).reduce(
                    (s, i) => s + ((i.toPaid || 0) - (i.paid || 0)),
                    0
                  )
                )}
              />
            </Grid>

            <div className="px-4 mt-4">
              <div className="rounded-3xl p-4 bg-white/12 border border-white/20 backdrop-blur-2xl shadow-xl">
                <p className="text-xs opacity-70">{t("Customers.QuickActions")}</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <SecondaryButton
                    icon={<Home size={18} />}
                    label={t("Customers.button2")}
                    onClick={() => alert("Add property (UI placeholder)")}
                  />
                  <SecondaryButton
                    icon={<Receipt size={18} />}
                    label={t("Customers.button3")}
                    onClick={() => alert("Send invoice (UI placeholder)")}
                  />
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="mt-4 rounded-3xl p-4 bg-white/12 border border-white/20 backdrop-blur-2xl shadow-xl">
                  <p className="text-xs opacity-70">{t("Customers.Notes")}</p>
                  <p className="mt-2 text-sm opacity-90">{selectedCustomer.notes}</p>
                </div>
              )}
            </div>
          </>
        )}

        {customerTab === t("Customers.tab2") && (
          <List>
            <SectionHeader
              title={t("Customers.title3")}
              subtitle={t("Customers.subtitle3")}
              right={
                <PrimaryButton
                  icon={<Plus size={16} />}
                  label={t("Customers.button1")}
                  onClick={() => alert("Add property (UI placeholder)")}
                />
              }
            />

            {selectedCustomer.properties.map((p) => (
              <Card
                key={p.id}
                onClick={() => {
                  setSelectedPropertyId(p.id);
                  setPropertyTab(t("Customers.tab1"));
                  setView("property");
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{p.title}</h3>
                    <p className="text-xs opacity-70 mt-1 flex items-center gap-2">
                      <MapPin size={14} className="opacity-80" />
                      <span className="truncate">{p.address}</span>
                    </p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Pill label={p.type} icon={undefined} accent={false} />
                      <Pill label={`${p.county} ${t("Customers.County")}`} icon={undefined} accent={false} />
                      <Pill
                        icon={<Layers size={14} />}
                        label={`${(selectedCustomer.jobs || []).filter((j) => j.propertyId === p.id).length} ${t("Customers.Jobs")}`} accent={false}                      />
                      <Pill
                        icon={<Receipt size={14} />}
                        label={`${(selectedCustomer.invoices || []).filter((i) => i.propertyId === p.id).length} ${t("Customers.Invoices")}`} accent={false}                      />
                    </div>
                  </div>
                  <ChevronRight size={18} className="opacity-60 shrink-0" />
                </div>
              </Card>
            ))}

            <DevSelfTests />
          </List>
        )}

        {customerTab === t("Customers.tab3") && (
          <>
            <FilterRow
              search={search}
              setSearch={setSearch}
              leftLabel={t("Customers.Jobs")}
              onOpenDate={() => setDateSheetOpen(true)}
              onOpenStatus={openJobStatusFilter}
              statusLabel={jobStatus}
              rightAction={
                <PrimaryButton
                  icon={<Plus size={16} />}
                  label={t("Customers.button4")}
                  onClick={() => alert("New job (UI placeholder)")}
                />
              }
            />

            <List>
              {customerJobs
                .filter((j) => jobMatchesStatus(j, jobStatus))
                .filter((j) => inDateRange(j.start, dateRange))
                .filter((j) =>
                  textIncludesAny(j, search, [
                    "service",
                    "propertyName",
                    "propertyAddress",
                    "status",
                    "team",
                    "id",
                  ])
                )
                .map((j) => (
                  <JobRow key={j.id} job={j} />
                ))}

              {customerJobs.length === 0 && (
                <div className="text-center text-sm opacity-70 mt-10">{t("Customers.NoJobs")}</div>
              )}
            </List>
          </>
        )}

        {customerTab === t("Customers.tab4") && (
          <>
            <FilterRow
              search={search}
              setSearch={setSearch}
              leftLabel={t("Customers.leftlabel1")}
              onOpenDate={() => setDateSheetOpen(true)}
              onOpenStatus={openInvoiceStatusFilter}
              statusLabel={invoiceStatus}
              rightAction={
                <PrimaryButton
                  icon={<Receipt size={16} />}
                  label={t("Customers.button5")}
                  onClick={() => alert("Send invoice (UI placeholder)")}
                />
              }
            />

            <List>
              {customerInvoices
                .filter((i) => invoiceMatchesStatus(i, invoiceStatus))
                .filter((i) => inDateRange(i.date, dateRange))
                .filter((i) => textIncludesAny(i, search, ["propertyName", "service", "status", "id"])) 
                .map((i) => (
                  <InvoiceRow key={i.id} inv={i} />
                ))}

              {customerInvoices.length === 0 && (
                <div className="text-center text-sm opacity-70 mt-10">{t("Customers.NoInvoices")}</div>
              )}
            </List>
          </>
        )}

        {customerTab === t("Customers.tab5") && (
          <List>
            <SectionHeader
              title={t("Customers.title4")}
              subtitle={t("Customers.subtitle4")}
              right={
                <PrimaryButton
                  icon={<Plus size={16} />}
                  label={t("Customers.button4")}
                  onClick={() => alert("Create batch (UI placeholder)")}
                />
              }
            />

            {(selectedCustomer.batches || []).map((b) => (
              <Card key={b.id}  onClick={function (): void {
                throw new Error("Function not implemented.");
              } }>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{b.id}</h3>
                    <p className="text-xs opacity-70 mt-1">
                      {fmtDateShort(b.date)} · {b.count} {t("Customers.invoices")}
                    </p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Pill label={b.status} icon={undefined} accent={false} />
                      <Pill icon={<DollarSign size={14} />} label={fmtMoney(b.total)} accent={false} />
                    </div>
                  </div>
                  <ChevronRight size={18} className="opacity-60" />
                </div>
              </Card>
            ))}

            {(selectedCustomer.batches || []).length === 0 && (
              <div className="text-center text-sm opacity-70 mt-10">{t("Customers.NoBatches")}</div>
            )}
          </List>
        )}

        {customerTab === t("Customers.tab6" ) && (
          <List>
            <SectionHeader 
            title={t("Customers.title5" )}
            subtitle={t("Customers.subtitle5" )}
            right={undefined} />

            {(selectedCustomer.transactions || []).map((t) => (
              <Card key={t.id}  onClick={function (): void {
                throw new Error("Function not implemented.");
              } }>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{t.type}</h3>
                    <p className="text-xs opacity-70 mt-1">
                      {fmtDateShort(t.date)} · {t.method}
                    </p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Pill icon={<DollarSign size={14} />} label={fmtMoney(t.amount)} accent={false} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {(selectedCustomer.transactions || []).length === 0 && (
              <div className="text-center text-sm opacity-70 mt-10">{t("Customers.NoTransactions")}</div>
            )}
          </List>
        )}

        {/* Date range sheet (shared) */}
        {dateSheetOpen && (
          <BottomSheet onClose={() => setDateSheetOpen(false)}>
            <SheetTitle
              title={t("Customers.sheetTitle")}
              subtitle={t("Customers.sheetSubtitle")}
              onClose={() => setDateSheetOpen(false)}
            />

            <DateRangeEditor
              value={dateRange}
              onChange={setDateRange}
              onClear={() => {
                setDateRange({ start: "", end: "" });
                setDateSheetOpen(false);
              }}
              onApply={() => setDateSheetOpen(false)}
            />
          </BottomSheet>
        )}

        {/* Status filter sheet */}
        {statusSheetOpen && (
          <BottomSheet onClose={() => setStatusSheetOpen(false)}>
            <SheetTitle
              title={statusSheetKind === "jobs" ? t("Customers.JobStatus") : t("Customers.InvoiceStatus")}
              subtitle={t("Customers.subtitle6")}
              onClose={() => setStatusSheetOpen(false)}
            />

            <div className="mt-4 space-y-2">
              {(statusSheetKind === "jobs" ? JOB_STATUS_OPTIONS : INVOICE_STATUS_OPTIONS).map((s) => {
                const active = statusSheetKind === "jobs" ? jobStatus === s : invoiceStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      if (statusSheetKind === "jobs") setJobStatus(s);
                      else setInvoiceStatus(s);
                      setStatusSheetOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-2xl border text-left ${
                      active
                        ? "bg-[#148dcd]/30 border-[#148dcd]/40"
                        : "bg-white/10 border-white/15"
                    }`}
                  >
                    <span className="text-sm">{s}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                className="py-3 rounded-2xl bg-white/10 border border-white/20"
                onClick={() => {
                  if (statusSheetKind === "jobs") setJobStatus(t("Customers.all"));
                  else setInvoiceStatus(t("Customers.all"));
                  setStatusSheetOpen(false);
                }}
              >
                {t("Customers.Clear")}
              </button>
              <button
                className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
                onClick={() => setStatusSheetOpen(false)}
              >
                {t("Customers.Done")}
              </button>
            </div>
          </BottomSheet>
        )}

        <DevSelfTests />
      </Screen>
    );
  }

  /* =========================
     PROPERTY PROFILE
     ========================= */

  if (view === "property") {
    if (!selectedCustomer || !selectedProperty) {
      return (
        <Screen>
          <Header title={t("Customers.title6")} onBack={() => setView("customer")} subtitle={""} />
          <div className="px-4 text-sm opacity-80">{t("Customers.div2")}</div>
          <DevSelfTests />
        </Screen>
      );
    }

    return (
      <Screen>
        <Header
          title={selectedProperty.title}
          subtitle={selectedCustomer.name}
          onBack={() => setView("customer")}
          right={
            <PrimaryButton
              icon={<Plus size={16} />}
              label={t("Customers.button1")}
              onClick={() => alert("Property actions (UI placeholder)")}
            />
          }
        />

        <TopTabs
          tabs={[t("Customers.tab1"), t("Customers.tab3"), t("Customers.tab4")]}
          active={propertyTab}
          onChange={(t) => {
            setPropertyTab(t);
            setSearch("");
          }}
        />

        {propertyTab === t("Customers.tab1") && (
          <>
            <div className="px-4 mt-2">
              <div className="rounded-3xl p-4 bg-white/12 border border-white/20 backdrop-blur-2xl shadow-xl">
                <p className="text-xs opacity-70">{t("Customers.Address")}</p>
                <p className="mt-2 text-sm flex items-start gap-2">
                  <MapPin size={16} className="mt-[2px] opacity-80" />
                  <span>{selectedProperty.address}</span>
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Pill label={selectedProperty.type} icon={undefined} accent={false} />
                  <Pill label={`${selectedProperty.county} ${t("Customers.County")}`} icon={undefined} accent={false} />
                  <Pill label={`Last: ${fmtDateShort(selectedProperty.lastService)}`} icon={undefined} accent={false} />
                  <Pill label={`Next: ${fmtDateShort(selectedProperty.lastScheduledService)}`} icon={undefined} accent={false} />
                </div>
              </div>
            </div>

            <Grid>
              <StatCard icon={<Layers />} label={t("Customers.Jobs")} value={String(propertyJobs.length)} />
              <StatCard icon={<Receipt />} label={t("Customers.Invoices")} value={String(propertyInvoices.length)} />
              <StatCard
                icon={<DollarSign />}
                label={t("Customers.Billed")}
                value={fmtMoney(propertyInvoices.reduce((s, i) => s + (i.amount || 0), 0))}
              />
              <StatCard
                icon={<CreditCard />}
                label={t("Customers.Paid")}
                value={fmtMoney(propertyInvoices.reduce((s, i) => s + (i.paid || 0), 0))}
              />
            </Grid>
          </>
        )}

        {propertyTab === t("Customers.tab3") && (
          <>
            <FilterRow
              search={search}
              setSearch={setSearch}
              leftLabel={t("Customers.leftlabel2")}
              onOpenDate={() => setDateSheetOpen(true)}
              onOpenStatus={openJobStatusFilter}
              statusLabel={jobStatus}
              rightAction={
                <PrimaryButton
                  icon={<Plus size={16} />}
                  label={t("Customers.button4")}
                  onClick={() => alert("New job (UI placeholder)")}
                />
              }
            />

            <List>
              {propertyJobs
                .filter((j) => jobMatchesStatus(j, jobStatus))
                .filter((j) => inDateRange(j.start, dateRange))
                .filter((j) => textIncludesAny(j, search, ["service", "status", "team", "id"]))
                .map((j) => (
                  <JobRow key={j.id} job={j} compactProperty />
                ))}

              {propertyJobs.length === 0 && (
                <div className="text-center text-sm opacity-70 mt-10">{t("Customers.NoJobs")}</div>
              )}
            </List>
          </>
        )}

        {propertyTab === t("Customers.tab4") && (
          <>
            <FilterRow
              search={search}
              setSearch={setSearch}
              leftLabel={t("Customers.leftLabel1")}
              onOpenDate={() => setDateSheetOpen(true)}
              onOpenStatus={openInvoiceStatusFilter}
              statusLabel={invoiceStatus}
              rightAction={
                <PrimaryButton
                  icon={<Receipt size={16} />}
                  label={t("Customers.button5")}
                  onClick={() => alert("Send invoice (UI placeholder)")}
                />
              }
            />

            <List>
              {propertyInvoices
                .filter((i) => invoiceMatchesStatus(i, invoiceStatus))
                .filter((i) => inDateRange(i.date, dateRange))
                .filter((i) => textIncludesAny(i, search, ["service", "status", "id"]))
                .map((i) => (
                  <InvoiceRow key={i.id} inv={i} compactProperty />
                ))}

              {propertyInvoices.length === 0 && (
                <div className="text-center text-sm opacity-70 mt-10">{t("Customers.NoInvoices")}</div>
              )}
            </List>
          </>
        )}

        {/* Date range sheet */}
        {dateSheetOpen && (
          <BottomSheet onClose={() => setDateSheetOpen(false)}>
            <SheetTitle
              title={t("Customers.sheetTitle")}
              subtitle={t("Customers.sheetSubtitle")}
              onClose={() => setDateSheetOpen(false)}
            />

            <DateRangeEditor
              value={dateRange}
              onChange={setDateRange}
              onClear={() => {
                setDateRange({ start: "", end: "" });
                setDateSheetOpen(false);
              }}
              onApply={() => setDateSheetOpen(false)}
            />
          </BottomSheet>
        )}

        {/* Status sheet */}
        {statusSheetOpen && (
          <BottomSheet onClose={() => setStatusSheetOpen(false)}>
            <SheetTitle
              title={statusSheetKind === "jobs" ? t("Customers.JobStatus") : t("Customers.InvoiceStatus")}
              subtitle={t("Customers.subtitle6")}
              onClose={() => setStatusSheetOpen(false)}
            />

            <div className="mt-4 space-y-2">
              {(statusSheetKind === "jobs" ? JOB_STATUS_OPTIONS : INVOICE_STATUS_OPTIONS).map((s) => {
                const active = statusSheetKind === "jobs" ? jobStatus === s : invoiceStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      if (statusSheetKind === "jobs") setJobStatus(s);
                      else setInvoiceStatus(s);
                      setStatusSheetOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-2xl border text-left ${
                      active
                        ? "bg-[#148dcd]/30 border-[#148dcd]/40"
                        : "bg-white/10 border-white/15"
                    }`}
                  >
                    <span className="text-sm">{s}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                className="py-3 rounded-2xl bg-white/10 border border-white/20"
                onClick={() => {
                  if (statusSheetKind === "jobs") setJobStatus(t("Customers.all"));
                  else setInvoiceStatus(t("Customers.all"));
                  setStatusSheetOpen(false);
                }}
              >
                {t("Customers.Clear")}
              </button>
              <button
                className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
                onClick={() => setStatusSheetOpen(false)}
              >
                {t("Customers.Done")}
              </button>
            </div>
          </BottomSheet>
        )}

        <DevSelfTests />
      </Screen>
    );
  }

  return null;
}

/* =========================
   UI
   ========================= */

// function Screen({ children }) {
//   return (
//     <div className="h-screen bg-gradient-to-br from-[#041b4d] to-[#062874] text-white flex flex-col">
//       {children}
//     </div>
//   ); 
// }

// function Header({ title, subtitle, onBack, right }) {
//   return (
//     <div className="px-4 pt-6 pb-4 flex items-start justify-between gap-3">
//       <div className="min-w-0">
//         <h1 className="text-2xl font-semibold truncate">{title}</h1>
//         {subtitle && <p className="text-xs opacity-70 mt-1 truncate">{subtitle}</p>}
//       </div>
//       <div className="flex items-center gap-2 shrink-0">
//         {right}
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
//             aria-label="Back"
//           >
//             <X size={18} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// function SearchBar({ value, onChange, placeholder = "Search..." }) {
//   return (
//     <div className="px-4">
//       <div className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-3 flex items-center gap-2">
//         <Search size={16} className="opacity-70" />
//         <input
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           className="w-full bg-transparent outline-none placeholder:text-white/50"
//         />
//       </div>
//     </div>
//   );
// }



// function Card({ children, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       role={onClick ? "button" : undefined}
//       tabIndex={onClick ? 0 : undefined}
//       className={`rounded-3xl p-4 bg-white/15 border border-white/20 backdrop-blur-2xl shadow-xl ${
//         onClick ? "active:scale-[0.99] transition" : ""
//       }`}
//     >
//       {children}
//     </div>
//   );
// }

// function Pill({ icon, label }) {
//   return (
//     <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-white/10 border-white/20">
//       {icon}
//       {label}
//     </span>
//   );
// }

// function PrimaryButton({ icon, label, onClick }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="px-4 py-2 rounded-2xl bg-[#148dcd] shadow-lg flex items-center gap-2"
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

// function IconSquare({ icon, onClick, title }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       title={title}
//       className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
//     >
//       {icon}
//     </button>
//   );
// }

// function Grid({ children }) {
//   return <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
// }

// function StatCard({ icon, label, value }) {
//   return (
//     <div className="rounded-3xl p-4 bg-white/15 border border-white/20 backdrop-blur-2xl shadow-xl">
//       <div className="flex items-center justify-between gap-3">
//         <div className="min-w-0">
//           <p className="text-xs opacity-70">{label}</p>
//           <h3 className="text-xl font-semibold mt-1 truncate">{value}</h3>
//         </div>
//         <div className="w-12 h-12 rounded-2xl bg-[#148dcd]/25 border border-white/15 flex items-center justify-center shrink-0">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function TopTabs({ tabs, active, onChange }) {
//   return (
//     <div className="px-4">
//       <div className="flex gap-2 overflow-x-auto pb-2">
//         {tabs.map((t) => (
//           <button
//             key={t}
//             onClick={() => onChange(t)}
//             className={`px-4 py-2 rounded-2xl border whitespace-nowrap ${
//               active === t
//                 ? "bg-white/20 border-white/30"
//                 : "bg-white/10 border-white/15"
//             }`}
//           >
//             <span className="text-sm">{t}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// function FilterRow({ search, setSearch, leftLabel, onOpenDate, onOpenStatus, statusLabel, rightAction }) {
//   return (
//     <div className="px-4">
//       <div className="mt-2 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-3 flex items-center gap-2">
//         <Search size={16} className="opacity-70" />
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder={`Search ${leftLabel.toLowerCase()}...`}
//           className="w-full bg-transparent outline-none placeholder:text-white/50"
//         />

//         {rightAction}

//         <button
//           onClick={onOpenDate}
//           className="ml-1 w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
//           title="Date range"
//         >
//           <CalendarDays size={16} />
//         </button>

//         <button
//           onClick={onOpenStatus}
//           className="ml-1 w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
//           title={`Status: ${statusLabel}`}
//         >
//           <Filter size={16} />
//         </button>
//       </div>

//       <div className="mt-2 flex gap-2 flex-wrap">
//         <Pill icon={<Filter size={14} />} label={`Status: ${statusLabel}`} accent={false} />
//       </div>
//     </div>
//   );
// }

// function SectionHeader({ title, subtitle, right }) {
//   return (
//     <div className="flex items-start justify-between gap-3">
//       <div>
//         <h2 className="text-lg font-semibold">{title}</h2>
//         {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
//       </div>
//       {right}
//     </div>
//   );
// }

// function JobRow({ job, compactProperty = false }) {
//   const isCompleted = String(job.status).toLowerCase() === "completed";

//   return (
//     <Card  onClick={function (): void {
//       throw new Error("Function not implemented.");
//     } }>
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className={`text-xs px-3 py-1 rounded-full border ${statusTone(job.status)}`}>{job.status}</span>
//             <span className="text-xs px-3 py-1 rounded-full border bg-white/10 border-white/15">#{job.id}</span>
//             <span className="text-xs px-3 py-1 rounded-full border bg-white/10 border-white/15">{fmtMoney(job.price || 0)}</span>
//           </div>

//           {!compactProperty && (
//             <div className="mt-3">
//               <p className="font-semibold">{job.propertyName}</p>
//               <p className="text-xs opacity-70 mt-1">{job.propertyAddress}</p>
//             </div>
//           )}

//           <div className="mt-3">
//             <p className="font-semibold">{job.service}</p>
//           </div>

//           <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
//             <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
//               <p className="text-xs opacity-70">Start</p>
//               <p className="mt-1 font-semibold flex items-center gap-2"><Clock size={14} /> {fmtDateTimeShort(job.start)}</p>
//             </div>
//             <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
//               <p className="text-xs opacity-70">Hours</p>
//               <p className="mt-1 font-semibold">Est: {job.estimatedH} · Worked: {job.workedH}</p>
//             </div>
//           </div>

//           <div className="mt-3 flex gap-2 flex-wrap">
//             <Pill label={`Team: ${job.team}`} icon={undefined} accent={false} />
//             <Pill label={`Completed: ${fmtDateShort(job.dateCompleted)}`} icon={undefined} accent={false} />
//           </div>
//         </div>

//         <div className="flex flex-col gap-2 items-end shrink-0">
//           <IconSquare
//             title="View"
//             icon={<Eye size={16} />}
//             onClick={() => alert(`View job #${job.id} (UI placeholder)`) }
//           />
//           <IconSquare
//             title={`Photos (${job.photosCount ?? 0})`}
//             icon={<ImageIcon size={16} />}
//             onClick={() => alert(`Open photos for job #${job.id} (UI placeholder)`) }
//           />
//           {isCompleted && (
//             <IconSquare
//               title={job.checklistDone ? "Checklist complete" : "Checklist"}
//               icon={<CheckSquare size={16} />}
//               onClick={() => alert(`Open checklist for job #${job.id} (UI placeholder)`) }
//             />
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// }

// export default function InvoiceRow({ inv, compactProperty = false }) {
//   return (
//     <Card children={undefined} onClick={function (): void {
//       throw new Error("Function not implemented.");
//     } }>
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className={`text-xs px-3 py-1 rounded-full border ${invoiceTone(inv.status)}`}>{inv.status}</span>
//             <span className="text-xs px-3 py-1 rounded-full border bg-white/10 border-white/15">#{inv.id}</span>
//             <span className="text-xs px-3 py-1 rounded-full border bg-white/10 border-white/15">{fmtMoney(inv.amount)}</span>
//           </div>

//           {!compactProperty && (
//             <div className="mt-3">
//               <p className="font-semibold">{inv.propertyName}</p>
//               <p className="text-xs opacity-70 mt-1">Service: {inv.service}</p>
//             </div>
//           )}

//           <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
//             <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
//               <p className="text-xs opacity-70">Date</p>
//               <p className="mt-1 font-semibold">{fmtDateShort(inv.date)}</p>
//             </div>
//             <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
//               <p className="text-xs opacity-70">Payment</p>
//               <p className="mt-1 font-semibold">To pay: {fmtMoney(inv.toPaid)} · Paid: {fmtMoney(inv.paid)}</p>
//             </div>
//           </div>

//           <div className="mt-3 flex gap-2 flex-wrap">
//             <Pill label={`Discount: ${fmtMoney(inv.discount)}`} icon={undefined} accent={false} />
//           </div>
//         </div>

//         <button
//           className="px-3 py-2 rounded-2xl bg-[#148dcd] shadow-lg text-sm"
//           onClick={() => alert(`View invoice #${inv.id} (UI placeholder)`)}
//         >
//           View
//         </button>
//       </div>
//     </Card>
//   );
// }

// function statusTone(status) {
//   const s = String(status || "").toLowerCase();
//   if (s.includes("completed")) return "bg-emerald-400/20 border-emerald-400/30 text-emerald-100";
//   if (s.includes("progress")) return "bg-amber-400/20 border-amber-400/30 text-amber-100";
//   if (s.includes("scheduled")) return "bg-sky-400/20 border-sky-400/30 text-sky-100";
//   if (s.includes("cancel")) return "bg-rose-400/20 border-rose-400/30 text-rose-100";
//   return "bg-white/10 border-white/15 text-white";
// }

// function invoiceTone(status) {
//   const s = String(status || "").toLowerCase();
//   if (s.includes("paid")) return "bg-emerald-400/20 border-emerald-400/30 text-emerald-100";
//   if (s.includes("unpaid")) return "bg-rose-400/20 border-rose-400/30 text-rose-100";
//   if (s.includes("sent")) return "bg-sky-400/20 border-sky-400/30 text-sky-100";
//   if (s.includes("approval")) return "bg-amber-400/20 border-amber-400/30 text-amber-100";
//   return "bg-white/10 border-white/15 text-white";
// }

// function BottomSheet({ children, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-end" onClick={onClose}>
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="w-full rounded-t-3xl bg-[#062874]/95 border-t border-white/20 backdrop-blur-2xl p-6"
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// function SheetTitle({ title, subtitle, onClose }) {
//   return (
//     <div className="flex items-start justify-between gap-4">
//       <div>
//         <h3 className="text-lg font-semibold">{title}</h3>
//         {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
//       </div>
//       <button
//         onClick={onClose}
//         className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
//         aria-label="Close"
//       >
//         <X size={18} />
//       </button>
//     </div>
//   );
// }

// export default function DateRangeEditor({ value, onChange, onClear, onApply }) {
//   return (
//     <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="text-xs opacity-70">Start</label>
//           <input
//             type="date"
//             value={value.start}
//             onChange={(e) => onChange((p) => ({ ...p, start: e.target.value }))}
//             className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
//           />
//         </div>
//         <div>
//           <label className="text-xs opacity-70">End</label>
//           <input
//             type="date"
//             value={value.end}
//             onChange={(e) => onChange((p) => ({ ...p, end: e.target.value }))}
//             className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
//           />
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-2 gap-3">
//         <button className="py-3 rounded-2xl bg-white/10 border border-white/20" onClick={onClear}>
//           Clear
//         </button>
//         <button className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold" onClick={onApply}>
//           Apply
//         </button>
//       </div>
//     </div>
//   );
// }

/* =========================
   SELF TESTS
   ========================= */

function DevSelfTests() {
  useMemo(() => {
    if (typeof window === "undefined") return true;
    if (window.__DOP_CRM_TESTS_V3__) return true;
    window.__DOP_CRM_TESTS_V3__ = true;

    console.assert(MOCK.customers.length >= 2, "Expected at least 2 customers");
    console.assert(MOCK.customers[0].properties.length >= 1, "Customer should have properties");

    const c = MOCK.customers[0];
    const allJobs = c.jobs.length;
    const propJobs = c.jobs.filter((j) => j.propertyId === c.properties[0].id).length;
    console.assert(allJobs >= propJobs, "Property jobs must be subset of customer jobs");

    console.assert(JOB_STATUS_OPTIONS.includes("All"), "Job status list should include All");
    console.assert(INVOICE_STATUS_OPTIONS.includes("All"), "Invoice status list should include All");

    console.assert(
      inDateRange("2026-02-16", { start: "2026-02-01", end: "2026-02-28" }) === true,
      "Date range should include date"
    );

    return true;
  }, []);

  return null;
}
