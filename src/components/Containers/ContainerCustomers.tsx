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

      </Screen>
    );
  }

  return null;
}

