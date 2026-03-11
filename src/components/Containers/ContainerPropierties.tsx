import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Home,
  Building2,
  Layers,
  Receipt,
  DollarSign,
  CreditCard,
  Clock,
  CalendarDays,
  ArrowLeft,
  SlidersHorizontal,
  Tag,
  Pencil,
  Link2,
  RefreshCw,
  Settings,
  Trash2,
  Image as ImageIcon,
  ListChecks,
  Eye,
  X,
} from "lucide-react";
import Screen from "../Layout/Screen";
import Header from "../UI/Header";


/**
 * ============================================================
 * DOP Owner App – PROPERTIES
 *  • Properties List (global) with professional filtering
 *  • Property Profile (drill-down)
 *  • Edit scenarios: Specs + Note + Service Defaults (Activity-linked) + Address
 *  • Bookings tab: iCal link management + calendar preview
 *  • Jobs tab: filters + photos/checklist signals + job modal
 *  • Invoices tab: filters + view + pay action + invoice modal
 * ============================================================
 */

/* =========================
   TYPES
   ========================= */

type PropertyType = "Residential" | "Business";

type JobStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled";

type InvoiceStatus = "Unsent" | "Sent" | "Unpaid" | "Paid" | "Batched";

type Activity = {
  id: number;
  name: string;
  category: string;
  pricingMode: "Fixed" | "Hourly";
  basePrice?: number;
  baseMinutes?: number;
};

type AddressParts = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

type BookingProvider = "Hostaway" | "Airbnb" | "VRBO" | "Google" | "Other";

type BookingLink = {
  id: number;
  provider: BookingProvider;
  url: string;
  isActive: boolean;
  lastSyncAt?: string; // ISO
};

type BookingEvent = {
  id: number;
  propertyId: number;
  provider: BookingProvider;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (exclusive)
  color: "blue" | "cyan" | "red";
};

type Property = {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  title: string;
  type: PropertyType;

  /** Address fields (recommended). Optional. If not set, fallback to legacyAddress string. */
  address?: AddressParts;
  legacyAddress?: string;

  county: string;
  lastService: string; // YYYY-MM-DD
  lastScheduledService: string; // YYYY-MM-DD

  /** Optional booking link indicator */
  bookingCalendar?: string;

  /** iCal links per property (optional) */
  bookingLinks?: BookingLink[];

  /** Optional property specs (NOT required). */
  specs?: {
    beds?: number;
    baths?: number; // allow decimals like 2.5
    sqft?: number;
  };

  /** Optional defaults (NOT required). Linked to Activities. */
  defaults?: {
    activityId?: number;
    fixedPriceOverride?: number;
    fixedMinutesOverride?: number;
  };

  /** Optional property note (NOT required). */
  propertyNote?: string;
};

type Job = {
  id: number;
  propertyId: number;
  customerId: number;
  customerName: string;
  status: JobStatus;
  service: string;
  startISO: string;
  endISO: string;
  price: number;
  team: string;
  workedH: number;
  estimatedH: number;

  // Proof of completion (optional signals)
  photosCount?: number;
  checklistDone?: boolean;
  invoiceStatus?: InvoiceStatus;
};

type Invoice = {
  id: number;
  propertyId: number;
  customerId: number;
  status: InvoiceStatus;
  service: string;
  date: string;
  amount: number;
  discount: number;
  toPaid: number;
  paid: number;
};

/* =========================
   MOCK DATA
   ========================= */

const MOCK_CUSTOMERS = [
  { id: 1, name: "Nomadic Vacation Rentals", email: "accounting@nomadicvacays.com" },
  { id: 2, name: "Chris Wilson", email: "chris84wilson@gmail.com" },
  { id: 3, name: "Serina Dansker", email: "serina29@gmail.com" },
];

const MOCK_CUSTOMERS_EXT = [
  "Austin Lister",
  "Daniella",
  "Kevin Hurley",
  "Michael and Tammy Bozworth",
  "Abby Shemesh",
  "Abigail Curry",
  "Adam Brown",
  "Adrian and Ella Palmer",
  "Adriane Turow",
  "Adriel Farinas",
  "Aerox",
  "Agbor Bate",
  "Aimilia Vassiliou",
  "Aira Berroa",
  "Alberta Davis",
  "Alberto Nikodimov",
].map((name, idx) => ({
  id: 100 + idx,
  name,
  email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@example.com`,
}));

const ALL_CUSTOMERS = [...MOCK_CUSTOMERS, ...MOCK_CUSTOMERS_EXT];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 501,
    name: "Turnover Cleaning",
    category: "Cleaning",
    pricingMode: "Fixed",
    basePrice: 260,
    baseMinutes: 150,
  },
  {
    id: 502,
    name: "Deep Cleaning",
    category: "Cleaning",
    pricingMode: "Fixed",
    basePrice: 340,
    baseMinutes: 210,
  },
  {
    id: 503,
    name: "Standard Cleaning",
    category: "Cleaning",
    pricingMode: "Fixed",
    basePrice: 160,
    baseMinutes: 120,
  },
  {
    id: 504,
    name: "Move-Out Cleaning",
    category: "Cleaning",
    pricingMode: "Fixed",
    basePrice: 420,
    baseMinutes: 240,
  },
  {
    id: 601,
    name: "Inspection",
    category: "Operations",
    pricingMode: "Fixed",
    basePrice: 95,
    baseMinutes: 90,
  },
  { id: 701, name: "Hourly Cleaning", category: "Cleaning", pricingMode: "Hourly" },
];

const MOCK_PROPERTIES_SEED: Property[] = [
  {
    id: 101,
    customerId: 1,
    customerName: "Nomadic Vacation Rentals",
    customerEmail: "accounting@nomadicvacays.com",
    title: "Peaceful Paradise",
    type: "Business",
    address: {
      street: "575 93rd Ave N",
      city: "Naples",
      state: "FL",
      zip: "34108",
      country: "USA",
    },
    legacyAddress: "575 93rd Ave N, Naples, FL 34108",
    county: "Collier",
    lastService: "2026-02-12",
    lastScheduledService: "2027-03-18",
    bookingCalendar: "iCal",
    bookingLinks: [
      {
        id: 1,
        provider: "Hostaway",
        url: "https://platform.hostaway.com/ical/2s0neC72vb8ZBcIho.../listings/309021.ics",
        isActive: true,
        lastSyncAt: "2026-03-01T10:12:00",
      },
    ],
    specs: { beds: 4, baths: 3.5, sqft: 2850 },
    defaults: { activityId: 501 },
    propertyNote:
      "Door code: 7850# | Garage: 2023 | WiFi: BeachBum | Pass: Snowbird29 | Lockbox: 12B | Supplies: 6 trash bags, 4 pods | Owner rules: no bleach on marble.",
  },
  {
    id: 102,
    customerId: 1,
    customerName: "Nomadic Vacation Rentals",
    customerEmail: "accounting@nomadicvacays.com",
    title: "Blue Wave",
    type: "Business",
    address: {
      street: "600 100th Ave N",
      city: "Naples",
      state: "FL",
      zip: "34108",
      country: "USA",
    },
    legacyAddress: "600 100th Ave N, Naples, FL 34108",
    county: "Collier",
    lastService: "2026-02-10",
    lastScheduledService: "2026-02-20",
    bookingCalendar: "iCal",
    bookingLinks: [
      {
        id: 2,
        provider: "Hostaway",
        url: "https://platform.hostaway.com/ical/xxxxx/listings/309023.ics",
        isActive: true,
        lastSyncAt: "2026-03-01T10:12:00",
      },
    ],
    specs: { beds: 3, baths: 2, sqft: 1650 },
    defaults: { activityId: 501, fixedPriceOverride: 200, fixedMinutesOverride: 120 },
    propertyNote:
      "Gate: 4431 | Pool heater OFF | Notes: replace 2 towels in master closet | Parking: guest spot #7.",
  },
  {
    id: 103,
    customerId: 2,
    customerName: "Chris Wilson",
    customerEmail: "chris84wilson@gmail.com",
    title: "Residential",
    type: "Residential",
    legacyAddress: "1460 Jewel Box Ave, Naples, FL 34102",
    county: "Collier",
    lastService: "2025-06-24",
    lastScheduledService: "2025-06-24",
  },
  {
    id: 104,
    customerId: 3,
    customerName: "Serina Dansker",
    customerEmail: "serina29@gmail.com",
    title: "Cypress Way Home",
    type: "Residential",
    address: {
      street: "603 Cypress Way E",
      city: "Naples",
      state: "FL",
      zip: "34110",
      country: "USA",
    },
    legacyAddress: "603 Cypress Way E, Naples, FL 34110",
    county: "Collier",
    lastService: "2026-02-22",
    lastScheduledService: "2026-02-22",
    specs: { beds: 5, baths: 4, sqft: 3200 },
    defaults: { activityId: 503 },
  },
  {
    id: 105,
    customerId: 3,
    customerName: "Serina Dansker",
    customerEmail: "serina29@gmail.com",
    title: "Cypress Ln",
    type: "Residential",
    address: {
      street: "5993 Cypress Ln",
      city: "Bonita Springs",
      state: "FL",
      zip: "34134",
      country: "USA",
    },
    legacyAddress: "5993 Cypress Ln, Bonita Springs, FL 34134",
    county: "Lee",
    lastService: "2026-03-02",
    lastScheduledService: "2026-03-02",
    specs: { beds: 3, baths: 2.5, sqft: 1900 },
    defaults: { activityId: 503, fixedPriceOverride: 160, fixedMinutesOverride: 120 },
    propertyNote:
      "Alarm: OFF (code 1122) | Pets: small dog | Supplies: use green mop pads | Parking: guest spot #7.",
  },
];

const MOCK_BOOKINGS: BookingEvent[] = [
  {
    id: 1,
    propertyId: 101,
    provider: "Hostaway",
    title: "Hostaway: Darci (vrboical)",
    startDate: "2026-03-02",
    endDate: "2026-03-06",
    color: "blue",
  },
  {
    id: 2,
    propertyId: 101,
    provider: "Hostaway",
    title: "Hostaway: Mike (vrboical)",
    startDate: "2026-03-06",
    endDate: "2026-03-09",
    color: "cyan",
  },
  {
    id: 3,
    propertyId: 101,
    provider: "Hostaway",
    title: "Hostaway: Michael Horne (airbnb)",
    startDate: "2026-03-12",
    endDate: "2026-03-15",
    color: "cyan",
  },
  {
    id: 4,
    propertyId: 101,
    provider: "Hostaway",
    title: "Hostaway: Frank (vrboical)",
    startDate: "2026-03-15",
    endDate: "2026-03-19",
    color: "red",
  },
];

const MOCK_JOBS: Job[] = [
  {
    id: 181484,
    propertyId: 101,
    customerId: 1,
    customerName: "Nomadic Vacation Rentals",
    status: "Scheduled",
    service: "Rental Cleaning",
    startISO: "2026-03-30T10:00:00",
    endISO: "2026-03-30T12:00:00",
    price: 260,
    team: "Team A",
    workedH: 0,
    estimatedH: 2,
    photosCount: 0,
    checklistDone: false,
    invoiceStatus: "Unsent",
  },
  {
    id: 181485,
    propertyId: 102,
    customerId: 1,
    customerName: "Nomadic Vacation Rentals",
    status: "In Progress",
    service: "Outside/Inside Window Cleaning",
    startISO: "2026-03-30T13:15:00",
    endISO: "2026-03-30T15:30:00",
    price: 385,
    team: "Team B",
    workedH: 1.2,
    estimatedH: 2.0,
    photosCount: 3,
    checklistDone: false,
    invoiceStatus: "Unpaid",
  },
  {
    id: 181486,
    propertyId: 102,
    customerId: 1,
    customerName: "Nomadic Vacation Rentals",
    status: "Completed",
    service: "PM",
    startISO: "2026-03-29T16:00:00",
    endISO: "2026-03-29T16:20:00",
    price: 0,
    team: "Team B",
    workedH: 0.4,
    estimatedH: 0.3,
    photosCount: 10,
    checklistDone: true,
    invoiceStatus: "Paid",
  },
  {
    id: 178729,
    propertyId: 105,
    customerId: 1,
    customerName: "Luxstays Vacations",
    status: "Scheduled",
    service: "Garbage Service Recurrent",
    startISO: "2026-09-02T17:15:00",
    endISO: "2026-09-02T17:25:00",
    price: 0,
    team: "Y",
    workedH: 0,
    estimatedH: 0.15,
    photosCount: 0,
    checklistDone: false,
    invoiceStatus: "Unsent",
  },
  {
    id: 178685,
    propertyId: 105,
    customerId: 1,
    customerName: "Luxstays Vacations",
    status: "Scheduled",
    service: "Garbage Service Recurrent",
    startISO: "2026-09-01T17:15:00",
    endISO: "2026-09-01T17:25:00",
    price: 0,
    team: "Y",
    workedH: 0,
    estimatedH: 0.15,
    photosCount: 0,
    checklistDone: false,
    invoiceStatus: "Unsent",
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: 183023,
    propertyId: 102,
    customerId: 1,
    status: "Unpaid",
    service: "Rental Cleaning",
    date: "2026-02-16",
    amount: 200,
    discount: 0,
    toPaid: 200,
    paid: 0,
  },
  {
    id: 183022,
    propertyId: 101,
    customerId: 1,
    status: "Paid",
    service: "Rental Cleaning",
    date: "2026-02-16",
    amount: 260,
    discount: 0,
    toPaid: 260,
    paid: 260,
  },
];

/* =========================
   HELPERS
   ========================= */

function fmtDateShort(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function fmtMoney(n: number) {
  return `$${Number(n || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

function fmtBaths(n?: number) {
  if (n == null) return "—";
  return Number.isInteger(n) ? String(n) : String(n);
}

function addressToLine(a?: AddressParts, legacy?: string) {
  if (!a || (!a.street && !a.city && !a.state && !a.zip && !a.country)) {
    return legacy || "—";
  }
  const street = a.street?.trim() || "";
  const city = a.city?.trim() || "";
  const state = a.state?.trim() || "";
  const zip = a.zip?.trim() || "";

  let line = "";
  if (street) line += street;
  if (city) line += (line ? ", " : "") + city;
  if (state || zip) line += (line ? ", " : "");
  if (state) line += state;
  if (state && zip) line += " ";
  if (zip) line += zip;

  return line || legacy || "—";
}

function fmtSpecLine(p: Property) {
  const s = p.specs;
  if (!s || (s.beds == null && s.baths == null && s.sqft == null)) return null;
  const parts: string[] = [];
  if (s.beds != null) parts.push(`${s.beds} bd`);
  if (s.baths != null) parts.push(`${fmtBaths(s.baths)} ba`);
  if (s.sqft != null) parts.push(`${s.sqft.toLocaleString()} sqft`);
  return parts.join(" · ");
}

function activityById(id?: number) {
  if (!id) return null;
  return MOCK_ACTIVITIES.find((a) => a.id === id) || null;
}

function fmtDefaultsLine(p: Property) {
  const d = p.defaults;
  if (!d || !d.activityId) return null;
  const act = activityById(d.activityId);
  if (!act) return null;

  const price = d.fixedPriceOverride ?? act.basePrice;
  const mins = d.fixedMinutesOverride ?? act.baseMinutes;

  const parts: string[] = [`${act.name}`];
  if (price != null) parts.push(`Fixed ${fmtMoney(price)}`);
  if (mins != null) parts.push(`${mins} min`);
  return parts.join(" · ");
}

function includesQ(value: any, q: string) {
  const needle = (q || "").trim().toLowerCase();
  if (!needle) return true;
  return String(value ?? "").toLowerCase().includes(needle);
}

function parseDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

function compareDates(a: string, b: string) {
  return parseDate(a).getTime() - parseDate(b).getTime();
}

function ymd(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addMonths(date: Date, delta: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  d.setDate(1);
  return d;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthLabel(date: Date) {
  return date
    .toLocaleDateString(undefined, { month: "long", year: "numeric" })
    .toUpperCase();
}

function isBetween(dateYMD: string, startYMD: string, endYMDExclusive: string) {
  // inclusive start, exclusive end
  return dateYMD >= startYMD && dateYMD < endYMDExclusive;
}

function inRangeISO(iso: string, from: string, to: string) {
  const d = new Date(iso).getTime();
  if (from) {
    const f = new Date(`${from}T00:00:00`).getTime();
    if (d < f) return false;
  }
  if (to) {
    const t = new Date(`${to}T23:59:59`).getTime();
    if (d > t) return false;
  }
  return true;
}

/* =========================
   MAIN
   ========================= */

type View =
  | { name: "list" }
  | {
      name: "property";
      propertyId: number;
      tab: "Dashboard" | "Bookings" | "Jobs" | "Invoices";
    };

type SortKey = "title" | "lastService" | "lastScheduledService";

type Filters = {
  q: string;
  type: "All" | PropertyType;
  county: "All" | string;
  upcomingOnly: boolean;
  hasBookingCalendarOnly: boolean;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
};

export default function DOPOwnerPropertiesModule() {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES_SEED);

  /* -------- Add Property modal -------- */
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    type: "" as "" | PropertyType,
    customerId: "" as "" | number,
    description: "",
    propertyNote: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [customerSelectOpen, setCustomerSelectOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const customerOptions = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return ALL_CUSTOMERS;
    return ALL_CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customerSearch]);

  function openAddModal() {
    setAddForm({
      title: "",
      type: "",
      customerId: "",
      description: "",
      propertyNote: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
    setCustomerSearch("");
    setCustomerSelectOpen(false);
    setAddOpen(true);
  }

  function closeAddModal() {
    setAddOpen(false);
    setCustomerSelectOpen(false);
  }

  function saveAddModal() {
    alert(
      `Create property:\nTitle: ${addForm.title}\nType: ${addForm.type}\nCustomerId: ${addForm.customerId}\nAddress: ${addForm.street}, ${addForm.city}, ${addForm.state} ${addForm.zip}`
    );
    closeAddModal();
  }

  /* -------- View + global filters -------- */
  const [view, setView] = useState<View>({ name: "list" });

  const [filters, setFilters] = useState<Filters>({
    q: "",
    type: "All",
    county: "All",
    upcomingOnly: false,
    hasBookingCalendarOnly: false,
    sortKey: "lastScheduledService",
    sortDir: "desc",
  });

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [page, setPage] = useState(1);
  const pageSizeOptions = [10, 25, 50];
  const [pageSize, setPageSize] = useState(25);

  const counties = useMemo(() => {
    const set = new Set(properties.map((p) => p.county));
    return ["All", ...Array.from(set).sort()];
  }, [properties]);

  const nowISO = "2026-03-02";

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    let list = properties.filter((p) => {
      const addr = addressToLine(p.address, p.legacyAddress);
      const matchesQ =
        !q ||
        includesQ(p.customerName, q) ||
        includesQ(p.title, q) ||
        includesQ(addr, q) ||
        includesQ(p.county, q) ||
        includesQ(p.type, q);

      const matchesType = filters.type === "All" || p.type === filters.type;
      const matchesCounty = filters.county === "All" || p.county === filters.county;

      const upcomingOk =
        !filters.upcomingOnly ||
        parseDate(p.lastScheduledService).getTime() >=
          parseDate(nowISO).getTime();

      const hasBookingOk =
        !filters.hasBookingCalendarOnly ||
        ((p.bookingLinks?.some((l) => l.isActive) ?? false) ||
          Boolean(p.bookingCalendar));

      return matchesQ && matchesType && matchesCounty && upcomingOk && hasBookingOk;
    });

    const dir = filters.sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const key = filters.sortKey;
      if (key === "title") return a.title.localeCompare(b.title) * dir;
      if (key === "lastService") return compareDates(a.lastService, b.lastService) * dir;
      return compareDates(a.lastScheduledService, b.lastScheduledService) * dir;
    });

    return list;
  }, [filters, nowISO, properties]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / pageSize)),
    [filtered.length, pageSize]
  );

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  /* -------- Edit scenarios -------- */
  const [editSpecsOpen, setEditSpecsOpen] = useState(false);
  const [editNoteOpen, setEditNoteOpen] = useState(false);
  const [editDefaultsOpen, setEditDefaultsOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState<number | null>(null);

  const [specDraft, setSpecDraft] = useState({ beds: "", baths: "", sqft: "" });
  const [noteDraft, setNoteDraft] = useState("");
  const [addressDraft, setAddressDraft] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    county: "",
    country: "",
  });

  const [defaultsDraft, setDefaultsDraft] = useState({
    activityId: "" as "" | number,
    fixedPriceOverride: "" as "" | number,
    fixedMinutesOverride: "" as "" | number,
  });

  function openSpecsEditor(propertyId: number) {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;
    setEditPropertyId(propertyId);
    setSpecDraft({
      beds: prop.specs?.beds != null ? String(prop.specs.beds) : "",
      baths: prop.specs?.baths != null ? String(prop.specs.baths) : "",
      sqft: prop.specs?.sqft != null ? String(prop.specs.sqft) : "",
    });
    setEditSpecsOpen(true);
  }

  function saveSpecsEditor() {
    if (editPropertyId == null) return;
    const beds = specDraft.beds.trim() ? Number(specDraft.beds) : undefined;
    const baths = specDraft.baths.trim() ? Number(specDraft.baths) : undefined;
    const sqft = specDraft.sqft.trim() ? Number(specDraft.sqft) : undefined;

    setProperties((prev) =>
      prev.map((p) =>
        p.id === editPropertyId
          ? {
              ...p,
              specs:
                beds == null && baths == null && sqft == null
                  ? undefined
                  : { beds, baths, sqft },
            }
          : p
      )
    );

    setEditSpecsOpen(false);
    setEditPropertyId(null);
  }

  function openNoteEditor(propertyId: number) {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;
    setEditPropertyId(propertyId);
    setNoteDraft(prop.propertyNote || "");
    setEditNoteOpen(true);
  }

  function saveNoteEditor() {
    if (editPropertyId == null) return;
    const note = noteDraft.trim();
    setProperties((prev) =>
      prev.map((p) =>
        p.id === editPropertyId
          ? { ...p, propertyNote: note ? note : undefined }
          : p
      )
    );
    setEditNoteOpen(false);
    setEditPropertyId(null);
  }

  function openDefaultsEditor(propertyId: number) {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;
    setEditPropertyId(propertyId);
    setDefaultsDraft({
      activityId: prop.defaults?.activityId ?? "",
      fixedPriceOverride: prop.defaults?.fixedPriceOverride ?? "",
      fixedMinutesOverride: prop.defaults?.fixedMinutesOverride ?? "",
    });
    setEditDefaultsOpen(true);
  }

  function saveDefaultsEditor() {
    if (editPropertyId == null) return;

    const activityId =
      defaultsDraft.activityId === "" ? undefined : Number(defaultsDraft.activityId);
    const fixedPriceOverride =
      defaultsDraft.fixedPriceOverride === ""
        ? undefined
        : Number(defaultsDraft.fixedPriceOverride);
    const fixedMinutesOverride =
      defaultsDraft.fixedMinutesOverride === ""
        ? undefined
        : Number(defaultsDraft.fixedMinutesOverride);

    setProperties((prev) =>
      prev.map((p) =>
        p.id === editPropertyId
          ? {
              ...p,
              defaults:
                !activityId && fixedPriceOverride == null && fixedMinutesOverride == null
                  ? undefined
                  : { activityId, fixedPriceOverride, fixedMinutesOverride },
            }
          : p
      )
    );

    setEditDefaultsOpen(false);
    setEditPropertyId(null);
  }

  function openAddressEditor(propertyId: number) {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    setEditPropertyId(propertyId);
    setAddressDraft({
      street: prop.address?.street || "",
      city: prop.address?.city || "",
      state: prop.address?.state || "",
      zip: prop.address?.zip || "",
      country: prop.address?.country || "",
      county: prop.county || "",
    });

    setEditAddressOpen(true);
  }

  function saveAddressEditor() {
    if (editPropertyId == null) return;

    const nextAddr: AddressParts = {
      street: addressDraft.street.trim() || undefined,
      city: addressDraft.city.trim() || undefined,
      state: addressDraft.state.trim() || undefined,
      zip: addressDraft.zip.trim() || undefined,
      country: addressDraft.country.trim() || undefined,
    };

    const hasAny = !!(
      nextAddr.street ||
      nextAddr.city ||
      nextAddr.state ||
      nextAddr.zip ||
      nextAddr.country
    );

    setProperties((prev) =>
      prev.map((p) =>
        p.id === editPropertyId
          ? {
              ...p,
              address: hasAny ? nextAddr : undefined,
              county: addressDraft.county.trim() || p.county,
              legacyAddress: hasAny
                ? addressToLine(nextAddr, p.legacyAddress)
                : p.legacyAddress,
            }
          : p
      )
    );

    setEditAddressOpen(false);
    setEditPropertyId(null);
  }

  /* -------- Bookings (iCal links) -------- */
  const [bookingLinksOpen, setBookingLinksOpen] = useState(false);
  const [bookingLinkEditorOpen, setBookingLinkEditorOpen] = useState(false);
  const [bookingLinkEditId, setBookingLinkEditId] = useState<number | null>(null);
  const [bookingLinkDraft, setBookingLinkDraft] = useState({
    provider: "Hostaway" as BookingProvider,
    url: "",
    isActive: true,
  });

  const [bookingViewMode, setBookingViewMode] = useState<"Month" | "Week" | "Day">(
    "Month"
  );
  const [bookingMonth, setBookingMonth] = useState(
    () => new Date("2026-03-01T00:00:00")
  );

  function openBookingLinks(propertyId: number) {
    setEditPropertyId(propertyId);
    setBookingLinksOpen(true);
    setBookingLinkEditorOpen(false);
    setBookingLinkEditId(null);
    setBookingLinkDraft({ provider: "Hostaway", url: "", isActive: true });
  }

  function closeBookingLinks() {
    setBookingLinksOpen(false);
    setBookingLinkEditorOpen(false);
    setBookingLinkEditId(null);
    setBookingLinkDraft({ provider: "Hostaway", url: "", isActive: true });
  }

  function openBookingLinkEditor(existing?: BookingLink) {
    setBookingLinkEditorOpen(true);
    if (existing) {
      setBookingLinkEditId(existing.id);
      setBookingLinkDraft({
        provider: existing.provider,
        url: existing.url,
        isActive: existing.isActive,
      });
    } else {
      setBookingLinkEditId(null);
      setBookingLinkDraft({ provider: "Hostaway", url: "", isActive: true });
    }
  }

  function saveBookingLink() {
    if (editPropertyId == null) return;

    const url = bookingLinkDraft.url.trim();
    if (!url) {
      alert("Please paste the iCal URL.");
      return;
    }

    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== editPropertyId) return p;
        const current = p.bookingLinks ? [...p.bookingLinks] : [];

        if (bookingLinkEditId != null) {
          const idx = current.findIndex((x) => x.id === bookingLinkEditId);
          if (idx >= 0) {
            current[idx] = {
              ...current[idx],
              provider: bookingLinkDraft.provider,
              url,
              isActive: bookingLinkDraft.isActive,
            };
          }
        } else {
          const newId = Math.max(0, ...current.map((x) => x.id)) + 1;
          current.push({
            id: newId,
            provider: bookingLinkDraft.provider,
            url,
            isActive: bookingLinkDraft.isActive,
            lastSyncAt: "2026-03-01T12:00:00",
          });
        }

        return { ...p, bookingLinks: current, bookingCalendar: "iCal" };
      })
    );

    setBookingLinkEditorOpen(false);
    setBookingLinkEditId(null);
    setBookingLinkDraft({ provider: "Hostaway", url: "", isActive: true });
  }

  function deleteBookingLink(linkId: number) {
    if (editPropertyId == null) return;
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== editPropertyId) return p;
        const next = (p.bookingLinks || []).filter((x) => x.id !== linkId);
        return {
          ...p,
          bookingLinks: next,
          bookingCalendar: next.length ? "iCal" : undefined,
        };
      })
    );
  }

  function refreshBookings() {
    alert("Refresh bookings (call iCal sync endpoint)");
  }

  /* -------- Jobs filters (property profile) -------- */
  const [jobStatus, setJobStatus] = useState<"All" | JobStatus>("All");
  const [jobQ, setJobQ] = useState("");
  const [jobFrom, setJobFrom] = useState("");
  const [jobTo, setJobTo] = useState("");
  const [jobsFilterOpen, setJobsFilterOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState<Job | null>(null);

  /* -------- Invoices filters (property profile) -------- */
  const [invStatus, setInvStatus] = useState<"All" | InvoiceStatus>("All");
  const [invQ, setInvQ] = useState("");
  const [invFrom, setInvFrom] = useState("");
  const [invTo, setInvTo] = useState("");
  const [invFilterOpen, setInvFilterOpen] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<Invoice | null>(null);

  /* =========================
     PROPERTY PROFILE VIEW
     ========================= */

  if (view.name === "property") {
    const prop = properties.find((p) => p.id === view.propertyId);
    if (!prop) {
      return (
        <Screen>
          <TopBar
            title="Property"
            subtitle="Not found"
            left={
              <IconBtn title="Back" onClick={() => setView({ name: "list" })}>
                <ArrowLeft size={18} />
              </IconBtn>
            }
          />
          <div className="px-4 text-sm opacity-80">Property not found.</div>
        </Screen>
      );
    }

    const jobs = MOCK_JOBS.filter((j) => j.propertyId === prop.id);
    const invoices = MOCK_INVOICES.filter((i) => i.propertyId === prop.id);

    const billed = invoices.reduce((s, i) => s + (i.amount || 0), 0);
    const paid = invoices.reduce((s, i) => s + (i.paid || 0), 0);
    const receivable = invoices.reduce(
      (s, i) => s + ((i.toPaid || 0) - (i.paid || 0)),
      0
    );

    const completedJobs = jobs.filter((j) => j.status === "Completed").length;
    const pendingJobs = jobs.filter((j) => j.status !== "Completed").length;

    const defaultsLine = fmtDefaultsLine(prop);
    const addressLine = addressToLine(prop.address, prop.legacyAddress);

    const bookingLinks = prop.bookingLinks || [];
    const propertyBookings = MOCK_BOOKINGS.filter((b) => b.propertyId === prop.id);

    return (
      <Screen>
        <TopBar
          title={prop.title}
          subtitle={`${prop.customerName} · ${prop.type}`}
          left={
            <IconBtn title="Back" onClick={() => setView({ name: "list" })}>
              <ArrowLeft size={18} />
            </IconBtn>
          }
          right={
            <PrimaryBtn
              icon={<Plus size={16} />}
              label="Add"
              onClick={() => alert("Add action")}
            />
          }
        />

        <Tabs
          tabs={["Dashboard", "Bookings", "Jobs", "Invoices"]}
          active={view.tab}
          onChange={(t: string) => setView({ ...view, tab: t as any })}
        />

        <div className="flex-1 overflow-y-auto">
          {/* DASHBOARD */}
          {view.tab === "Dashboard" && (
            <div className="px-4 py-4 space-y-4">
              {/* OPTIONAL PROPERTY SPECS */}
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs opacity-70">Property Specs</p>
                    {fmtSpecLine(prop) ? (
                      <p className="mt-2 text-sm font-semibold">{fmtSpecLine(prop)}</p>
                    ) : (
                      <p className="mt-2 text-sm opacity-80">Not set — optional.</p>
                    )}

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Chip label={`Beds: ${prop.specs?.beds ?? "—"}`} />
                      <Chip label={`Baths: ${prop.specs?.baths ?? "—"}`} />
                      <Chip
                        label={`SqFt: ${
                          prop.specs?.sqft ? prop.specs.sqft.toLocaleString() : "—"
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 text-sm inline-flex items-center gap-2"
                    type="button"
                    onClick={() => openSpecsEditor(prop.id)}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                </div>
              </Card>

              {/* DEFAULT FIXED SERVICE (linked to activities) */}
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs opacity-70">Service Defaults</p>
                    {defaultsLine ? (
                      <p className="mt-2 text-sm font-semibold">{defaultsLine}</p>
                    ) : (
                      <p className="mt-2 text-sm opacity-80">Not set — optional.</p>
                    )}

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Chip
                        icon={<Tag size={14} />}
                        label={
                          prop.defaults?.activityId
                            ? `Activity #${prop.defaults.activityId}`
                            : "Activity: —"
                        }
                      />
                      <Chip
                        label={
                          prop.defaults?.fixedPriceOverride != null
                            ? `Override: ${fmtMoney(prop.defaults.fixedPriceOverride)}`
                            : "Price override: —"
                        }
                      />
                      <Chip
                        label={
                          prop.defaults?.fixedMinutesOverride != null
                            ? `Override: ${prop.defaults.fixedMinutesOverride} min`
                            : "Time override: —"
                        }
                      />
                    </div>

                    <p className="mt-2 text-xs opacity-60">
                      Price/time comes from the linked Activity. Overrides optional.
                    </p>
                  </div>

                  <button
                    className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 text-sm inline-flex items-center gap-2"
                    type="button"
                    onClick={() => openDefaultsEditor(prop.id)}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                </div>
              </Card>

              {/* PROPERTY NOTE */}
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs opacity-70">Property Note</p>
                    {prop.propertyNote ? (
                      <p className="mt-2 text-sm opacity-90 whitespace-pre-wrap">
                        {prop.propertyNote}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm opacity-80">No note yet — optional.</p>
                    )}

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Chip label="Door code" />
                      <Chip label="WiFi" />
                      <Chip label="Lockbox" />
                      <Chip label="Gate" />
                      <Chip label="Supplies" />
                      <Chip label="Owner rules" />
                    </div>
                  </div>

                  <button
                    className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 text-sm inline-flex items-center gap-2"
                    type="button"
                    onClick={() => openNoteEditor(prop.id)}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                </div>
              </Card>

              {/* Address (structured) */}
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs opacity-70">Address</p>
                    <p className="mt-2 text-sm flex items-start gap-2">
                      <MapPin size={16} className="mt-[2px] opacity-80" />
                      <span>{addressLine}</span>
                    </p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Chip
                        icon={
                          prop.type === "Residential" ? (
                            <Home size={14} />
                          ) : (
                            <Building2 size={14} />
                          )
                        }
                        label={prop.type}
                      />
                      <Chip label={`${prop.county} County`} />
                      <Chip label={`Last: ${fmtDateShort(prop.lastService)}`} />
                      <Chip
                        label={`Next: ${fmtDateShort(prop.lastScheduledService)}`}
                      />
                    </div>
                  </div>

                  <button
                    className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 text-sm inline-flex items-center gap-2"
                    type="button"
                    onClick={() => openAddressEditor(prop.id)}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                </div>
              </Card>

              <Grid>
                <StatCard
                  icon={<Layers size={18} />}
                  label="Completed Jobs"
                  value={String(completedJobs)}
                />
                <StatCard
                  icon={<Layers size={18} />}
                  label="Pending Jobs"
                  value={String(pendingJobs)}
                />
                <StatCard
                  icon={<DollarSign size={18} />}
                  label="Billed"
                  value={fmtMoney(billed)}
                />
                <StatCard
                  icon={<CreditCard size={18} />}
                  label="Paid"
                  value={fmtMoney(paid)}
                />
                <StatCard
                  icon={<Receipt size={18} />}
                  label="Receivable"
                  value={fmtMoney(receivable)}
                />
                <StatCard
                  icon={<CalendarDays size={18} />}
                  label="Bookings"
                  value={bookingLinks.length ? "Linked" : "—"}
                />
              </Grid>

              <Card>
                <p className="text-xs opacity-70">Quick actions</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <PrimaryBtn
                    icon={<Plus size={16} />}
                    label="New Job"
                    onClick={() => alert("New job")}
                  />
                  <PrimaryBtn
                    icon={<Receipt size={16} />}
                    label="Send Invoice"
                    onClick={() => alert("Send invoice")}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* BOOKINGS */}
          {view.tab === "Bookings" && (
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Booking Calendar</h2>
                  <p className="text-xs opacity-70">
                    Link iCal calendars (Hostaway/Airbnb/VRBO) and preview bookings.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 h-10 rounded-2xl bg-white/10 border border-white/15 inline-flex items-center gap-2 text-sm"
                    onClick={refreshBookings}
                    type="button"
                  >
                    <RefreshCw size={16} /> Refresh
                  </button>
                  <button
                    className="px-4 h-10 rounded-2xl bg-white/10 border border-white/15 inline-flex items-center gap-2 text-sm"
                    onClick={() => openBookingLinks(prop.id)}
                    type="button"
                  >
                    <Settings size={16} /> Settings
                  </button>
                </div>
              </div>

              <Card>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {(["Month", "Week", "Day"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setBookingViewMode(m)}
                        className={`px-4 py-2 rounded-xl border text-sm ${
                          bookingViewMode === m
                            ? "bg-white/20 border-white/30"
                            : "bg-white/10 border-white/15"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="text-sm font-semibold tracking-wide">
                    {monthLabel(bookingMonth)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="w-10 h-10 rounded-xl bg-white/10 border border-white/15"
                      type="button"
                      onClick={() => setBookingMonth((d) => addMonths(d, -12))}
                      title="Prev year"
                    >
                      «
                    </button>
                    <button
                      className="w-10 h-10 rounded-xl bg-white/10 border border-white/15"
                      type="button"
                      onClick={() => setBookingMonth((d) => addMonths(d, -1))}
                      title="Prev month"
                    >
                      ‹
                    </button>
                    <button
                      className="w-10 h-10 rounded-xl bg-white/10 border border-white/15"
                      type="button"
                      onClick={() => setBookingMonth((d) => addMonths(d, 1))}
                      title="Next month"
                    >
                      ›
                    </button>
                    <button
                      className="w-10 h-10 rounded-xl bg-white/10 border border-white/15"
                      type="button"
                      onClick={() => setBookingMonth((d) => addMonths(d, 12))}
                      title="Next year"
                    >
                      »
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <BookingMonthGrid
                    month={bookingMonth}
                    events={propertyBookings}
                    onClickEvent={(ev) =>
                      alert(`${ev.title}\n${ev.startDate} → ${ev.endDate}`)
                    }
                  />
                </div>

                <div className="mt-4 text-xs opacity-70">
                  Showing mock bookings. In production, populate from your iCal sync.
                </div>
              </Card>

              <Card>
                <p className="text-xs opacity-70">Linked calendars</p>
                {bookingLinks.length === 0 ? (
                  <p className="mt-2 text-sm opacity-80">
                    No iCal links yet. Add one in Settings.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {bookingLinks.map((l) => (
                      <div
                        key={l.id}
                        className="rounded-2xl bg-white/10 border border-white/15 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">{l.provider}</div>
                            <div className="text-xs opacity-70 break-all">{l.url}</div>
                            <div className="text-xs opacity-60 mt-1">
                              {l.isActive ? "Active" : "Disabled"}
                              {l.lastSyncAt
                                ? ` · Last sync ${new Date(l.lastSyncAt).toLocaleString()}`
                                : ""}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-sm"
                            onClick={() => openBookingLinks(prop.id)}
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* JOBS */}
          {view.tab === "Jobs" && (
            <div className="px-4 py-4 space-y-4">
              <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold">Jobs</h2>
                    <p className="text-xs opacity-70">
                      Filter by status, date range, search, proof.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-4 h-10 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg text-sm"
                      onClick={() => alert("New Job (open wizard)")}
                    >
                      New ▾
                    </button>
                    <button
                      type="button"
                      className="px-4 h-10 rounded-2xl bg-white/10 border border-white/15 text-sm"
                      onClick={() => alert("Reports")}
                    >
                      Reports ▾
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between px-4 text-sm"
                    onClick={() => setJobsFilterOpen(true)}
                  >
                    <span className="opacity-85">Date range filter…</span>
                    <span className="text-xs opacity-70">
                      {jobFrom || "—"} → {jobTo || "—"}
                    </span>
                  </button>

                  <div className="h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2 px-4">
                    <Search size={16} className="opacity-70" />
                    <input
                      value={jobQ}
                      onChange={(e) => setJobQ(e.target.value)}
                      placeholder="Search…"
                      className="w-full bg-transparent outline-none placeholder:text-white/50 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {([
                    "All",
                    "Completed",
                    "In Progress",
                    "Scheduled",
                    "Cancelled",
                  ] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setJobStatus(s as any)}
                      className={`px-4 py-2 rounded-2xl border text-sm whitespace-nowrap ${
                        jobStatus === s
                          ? "bg-white/20 border-white/30"
                          : "bg-white/10 border-white/15"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const list = MOCK_JOBS.filter((j) => j.propertyId === prop.id)
                  .filter((j) => (jobStatus === "All" ? true : j.status === jobStatus))
                  .filter((j) => inRangeISO(j.startISO, jobFrom, jobTo))
                  .filter((j) => {
                    const q = jobQ.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      String(j.id).includes(q) ||
                      j.service.toLowerCase().includes(q) ||
                      (j.team || "").toLowerCase().includes(q) ||
                      (j.invoiceStatus || "").toLowerCase().includes(q)
                    );
                  })
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.startISO).getTime() - new Date(a.startISO).getTime()
                  );

                if (list.length === 0) return <Empty text="No jobs match these filters." />;

                return (
                  <div className="space-y-3">
                    {list.map((j) => (
                      <Card key={j.id}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex gap-2 flex-wrap">
                              <Badge tone={jobTone(j.status)}>{j.status}</Badge>
                              {j.invoiceStatus && (
                                <Badge tone={invoiceStatusTone(j.invoiceStatus)}>
                                  {j.invoiceStatus}
                                </Badge>
                              )}
                              <Badge tone="bg-white/10 border-white/15">#{j.id}</Badge>
                              <Badge tone="bg-white/10 border-white/15">{fmtMoney(j.price)}</Badge>
                            </div>

                            <p className="mt-2 font-semibold">{j.service}</p>
                            <p className="text-xs opacity-80 mt-1 flex items-center gap-2">
                              <Clock size={14} /> {fmtDT(j.startISO)} – {fmtT(j.endISO)}
                            </p>

                            <div className="mt-2 flex gap-2 flex-wrap">
                              <Chip label={`Team: ${j.team}`} />
                              <Chip label={`Est: ${j.estimatedH}h`} />
                              <Chip label={`Worked: ${j.workedH}h`} />
                            </div>

                            <div className="mt-3 flex gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-white/10 border-white/20">
                                <ImageIcon size={14} className="opacity-80" />
                                Photos: {j.photosCount ?? 0}
                              </span>
                              <span
                                className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border ${
                                  j.checklistDone
                                    ? "bg-emerald-500/20 border-emerald-400/30"
                                    : "bg-white/10 border-white/20"
                                }`}
                              >
                                <ListChecks size={14} className="opacity-80" />
                                Checklist: {j.checklistDone ? "Done" : "—"}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <button
                              className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
                              type="button"
                              onClick={() => setJobDetails(j)}
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                );
              })()}

              {jobsFilterOpen && (
                <Sheet
                  title="Job Filters"
                  subtitle="Date range"
                  onClose={() => setJobsFilterOpen(false)}
                >
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                      <p className="text-sm font-semibold">Date range</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                          <div className="text-xs opacity-70">From</div>
                          <input
                            type="date"
                            value={jobFrom}
                            onChange={(e) => setJobFrom(e.target.value)}
                            className="mt-2 w-full bg-transparent outline-none"
                          />
                        </div>
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                          <div className="text-xs opacity-70">To</div>
                          <input
                            type="date"
                            value={jobTo}
                            onChange={(e) => setJobTo(e.target.value)}
                            className="mt-2 w-full bg-transparent outline-none"
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-xs opacity-70">
                        Tip: leave empty to include all dates.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className="py-3 rounded-2xl bg-white/10 border border-white/20"
                        type="button"
                        onClick={() => {
                          setJobFrom("");
                          setJobTo("");
                          setJobsFilterOpen(false);
                        }}
                      >
                        Clear
                      </button>
                      <button
                        className="py-3 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg font-semibold"
                        type="button"
                        onClick={() => setJobsFilterOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </Sheet>
              )}

              {jobDetails && (
                <Modal title={`Job #${jobDetails.id}`} onClose={() => setJobDetails(null)}>
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/8 border border-white/12 p-4">
                      <div className="flex gap-2 flex-wrap">
                        <Badge tone={jobTone(jobDetails.status)}>{jobDetails.status}</Badge>
                        {jobDetails.invoiceStatus && (
                          <Badge tone={invoiceStatusTone(jobDetails.invoiceStatus)}>
                            {jobDetails.invoiceStatus}
                          </Badge>
                        )}
                        <Badge tone="bg-white/10 border-white/15">{fmtMoney(jobDetails.price)}</Badge>
                      </div>
                      <p className="mt-3 text-lg font-semibold">{jobDetails.service}</p>
                      <p className="text-sm opacity-80 mt-2 flex items-center gap-2">
                        <Clock size={16} className="opacity-80" />
                        {fmtDT(jobDetails.startISO)} – {fmtT(jobDetails.endISO)}
                      </p>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <Chip label={`Team: ${jobDetails.team}`} />
                        <Chip label={`Est: ${jobDetails.estimatedH}h`} />
                        <Chip label={`Worked: ${jobDetails.workedH}h`} />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/8 border border-white/12 p-4">
                      <p className="text-sm font-semibold">Proof</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="py-3 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center gap-2"
                          onClick={() => alert("Open photos")}
                        >
                          <ImageIcon size={16} /> Photos ({jobDetails.photosCount ?? 0})
                        </button>
                        <button
                          type="button"
                          className={`py-3 rounded-2xl border flex items-center justify-center gap-2 ${
                            jobDetails.checklistDone
                              ? "bg-emerald-500/20 border-emerald-400/30"
                              : "bg-white/10 border-white/20"
                          }`}
                          onClick={() => alert("Open checklist")}
                        >
                          <ListChecks size={16} /> Checklist
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="py-3 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg font-semibold"
                        onClick={() => alert("Dispatch / reschedule")}
                      >
                        Dispatch
                      </button>
                      <button
                        type="button"
                        className="py-3 rounded-2xl bg-white/10 border border-white/20"
                        onClick={() => alert("Invoice")}
                      >
                        Invoice
                      </button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          )}

          {/* INVOICES */}
          {view.tab === "Invoices" && (
            <div className="px-4 py-4 space-y-4">
              <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold">Invoices</h2>
                    <p className="text-xs opacity-70">
                      Filter by status, date range, search, and pay.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 h-10 rounded-2xl bg-white/10 border border-white/15 inline-flex items-center gap-2 text-sm"
                    onClick={() => setInvFilterOpen(true)}
                  >
                    <Filter size={16} /> Date range
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between px-4 text-sm"
                    onClick={() => setInvFilterOpen(true)}
                  >
                    <span className="opacity-85">Date range filter…</span>
                    <span className="text-xs opacity-70">
                      {invFrom || "—"} → {invTo || "—"}
                    </span>
                  </button>

                  <div className="h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2 px-4">
                    <Search size={16} className="opacity-70" />
                    <input
                      value={invQ}
                      onChange={(e) => setInvQ(e.target.value)}
                      placeholder="Search…"
                      className="w-full bg-transparent outline-none placeholder:text-white/50 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {([
                    "All",
                    "Unpaid",
                    "Paid",
                    "Unsent",
                    "Sent",
                    "Batched",
                  ] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInvStatus(s as any)}
                      className={`px-4 py-2 rounded-2xl border text-sm whitespace-nowrap ${
                        invStatus === s
                          ? "bg-white/20 border-white/30"
                          : "bg-white/10 border-white/15"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const list = MOCK_INVOICES.filter((i) => i.propertyId === prop.id)
                  .filter((i) => (invStatus === "All" ? true : i.status === invStatus))
                  .filter((i) => {
                    if (invFrom && i.date < invFrom) return false;
                    if (invTo && i.date > invTo) return false;
                    return true;
                  })
                  .filter((i) => {
                    const q = invQ.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      String(i.id).includes(q) ||
                      i.service.toLowerCase().includes(q) ||
                      i.status.toLowerCase().includes(q) ||
                      String(i.amount).includes(q)
                    );
                  })
                  .slice()
                  .sort((a, b) => compareDates(b.date, a.date));

                if (list.length === 0) return <Empty text="No invoices match these filters." />;

                return (
                  <div className="space-y-3">
                    {list.map((i) => {
                      const canPay = i.status === "Unpaid" && i.toPaid > i.paid;
                      return (
                        <Card key={i.id}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex gap-2 flex-wrap">
                                <Badge tone={invoiceStatusTone(i.status)}>{i.status}</Badge>
                                <Badge tone="bg-white/10 border-white/15">#{i.id}</Badge>
                                <Badge tone="bg-white/10 border-white/15">{fmtMoney(i.amount)}</Badge>
                              </div>
                              <p className="mt-2 font-semibold">{i.service}</p>
                              <p className="text-xs opacity-80 mt-1">Date: {fmtDateShort(i.date)}</p>
                              <div className="mt-2 grid grid-cols-2 gap-3">
                                <MiniStat label="To pay" value={fmtMoney(i.toPaid)} />
                                <MiniStat label="Paid" value={fmtMoney(i.paid)} />
                              </div>
                            </div>

                            <div className="shrink-0 flex flex-col items-end gap-2">
                              <button
                                className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 text-sm inline-flex items-center gap-2"
                                type="button"
                                onClick={() => setInvoiceDetails(i)}
                              >
                                <Eye size={16} /> View
                              </button>
                              {canPay && (
                                <button
                                  className="px-3 py-2 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg text-sm inline-flex items-center gap-2"
                                  type="button"
                                  onClick={() => alert(`Pay invoice #${i.id} (Stripe)`)}
                                >
                                  <CreditCard size={16} /> Pay
                                </button>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                );
              })()}

              {invFilterOpen && (
                <Sheet title="Invoice Filters" subtitle="Date range" onClose={() => setInvFilterOpen(false)}>
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                      <p className="text-sm font-semibold">Date range</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                          <div className="text-xs opacity-70">From</div>
                          <input
                            type="date"
                            value={invFrom}
                            onChange={(e) => setInvFrom(e.target.value)}
                            className="mt-2 w-full bg-transparent outline-none"
                          />
                        </div>
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                          <div className="text-xs opacity-70">To</div>
                          <input
                            type="date"
                            value={invTo}
                            onChange={(e) => setInvTo(e.target.value)}
                            className="mt-2 w-full bg-transparent outline-none"
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-xs opacity-70">Tip: leave empty to include all dates.</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        className="py-3 rounded-2xl bg-white/10 border border-white/20"
                        type="button"
                        onClick={() => {
                          setInvFrom("");
                          setInvTo("");
                          setInvFilterOpen(false);
                        }}
                      >
                        Clear
                      </button>
                      <button
                        className="py-3 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg font-semibold"
                        type="button"
                        onClick={() => setInvFilterOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </Sheet>
              )}

              {invoiceDetails && (
                <Modal title={`Invoice #${invoiceDetails.id}`} onClose={() => setInvoiceDetails(null)}>
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/8 border border-white/12 p-4">
                      <div className="flex gap-2 flex-wrap">
                        <Badge tone={invoiceStatusTone(invoiceDetails.status)}>
                          {invoiceDetails.status}
                        </Badge>
                        <Badge tone="bg-white/10 border-white/15">
                          {fmtMoney(invoiceDetails.amount)}
                        </Badge>
                      </div>
                      <p className="mt-3 text-lg font-semibold">{invoiceDetails.service}</p>
                      <p className="text-sm opacity-80 mt-2">Date: {fmtDateShort(invoiceDetails.date)}</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <MiniStat label="Amount" value={fmtMoney(invoiceDetails.amount)} />
                        <MiniStat label="Discount" value={fmtMoney(invoiceDetails.discount)} />
                        <MiniStat label="To pay" value={fmtMoney(invoiceDetails.toPaid)} />
                        <MiniStat label="Paid" value={fmtMoney(invoiceDetails.paid)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="py-3 rounded-2xl bg-white/10 border border-white/20"
                        onClick={() => alert("View PDF / preview")}
                      >
                        View
                      </button>
                      {invoiceDetails.status === "Unpaid" && invoiceDetails.toPaid > invoiceDetails.paid ? (
                        <button
                          type="button"
                          className="py-3 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg font-semibold"
                          onClick={() => alert(`Pay invoice #${invoiceDetails.id} (Stripe)`)}
                        >
                          Pay
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="py-3 rounded-2xl bg-white/10 border border-white/20"
                          onClick={() => alert("Send / resend")}
                        >
                          Send
                        </button>
                      )}
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          )}
        </div>

        {/* Booking Links Modal */}
        {bookingLinksOpen && (
          <Modal title="Booking Links" onClose={closeBookingLinks}>
            <div className="space-y-3">
              {(() => {
                const p = properties.find((x) => x.id === editPropertyId);
                const links = p?.bookingLinks || [];

                if (links.length === 0) {
                  return (
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-4 text-sm opacity-85">
                      No links yet. Add your iCal URL from Hostaway / Airbnb / VRBO.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {links.map((l) => (
                      <div key={l.id} className="rounded-2xl bg-white/10 border border-white/15 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">{l.provider}</div>
                            <div className="text-xs opacity-70 break-all mt-1">{l.url}</div>
                            <div className="text-xs opacity-60 mt-2">
                              {l.isActive ? "Active" : "Disabled"}
                              {l.lastSyncAt ? ` · Last sync ${new Date(l.lastSyncAt).toLocaleString()}` : ""}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
                              onClick={() => openBookingLinkEditor(l)}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
                              onClick={() => deleteBookingLink(l.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <button
                type="button"
                className="w-full h-11 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg font-semibold inline-flex items-center justify-center gap-2"
                onClick={() => openBookingLinkEditor()}
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </Modal>
        )}

        {/* Booking Link Editor */}
        {bookingLinkEditorOpen && (
          <Modal
            title={bookingLinkEditId != null ? "Edit iCal Link" : "Add iCal Link"}
            onClose={() => setBookingLinkEditorOpen(false)}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldDark label="Provider">
                  <select
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                    value={bookingLinkDraft.provider}
                    onChange={(e) => setBookingLinkDraft((p) => ({ ...p, provider: e.target.value as BookingProvider }))}
                  >
                    {(["Hostaway", "Airbnb", "VRBO", "Google", "Other"] as BookingProvider[]).map((p) => (
                      <option key={p} value={p} className="text-black">
                        {p}
                      </option>
                    ))}
                  </select>
                </FieldDark>
                <FieldDark label="Status">
                  <select
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                    value={bookingLinkDraft.isActive ? "active" : "disabled"}
                    onChange={(e) => setBookingLinkDraft((p) => ({ ...p, isActive: e.target.value === "active" }))}
                  >
                    <option value="active" className="text-black">Active</option>
                    <option value="disabled" className="text-black">Disabled</option>
                  </select>
                </FieldDark>
              </div>

              <FieldDark label="iCal URL">
                <textarea
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white min-h-[120px]"
                  value={bookingLinkDraft.url}
                  onChange={(e) => setBookingLinkDraft((p) => ({ ...p, url: e.target.value }))}
                  placeholder="Paste iCal URL from Hostaway / Airbnb / VRBO..."
                />
              </FieldDark>

              <div className="rounded-2xl bg-white/8 border border-white/12 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Link2 size={16} /> Tips
                </div>
                <ul className="mt-2 text-xs opacity-80 space-y-1 list-disc pl-5">
                  <li>Use a read-only iCal export URL from your channel manager.</li>
                  <li>Sync happens server-side in DOP; this screen only stores the link.</li>
                  <li>You can add multiple links per property.</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <GhostBtn onClick={() => setBookingLinkEditorOpen(false)}>Cancel</GhostBtn>
                <PrimarySolid onClick={saveBookingLink}>Save</PrimarySolid>
              </div>
            </div>
          </Modal>
        )}

        {/* EDIT MODALS */}
        {editSpecsOpen && (
          <Modal title="Edit Property Specs" onClose={() => setEditSpecsOpen(false)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FieldDark label="Bedrooms">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={specDraft.beds}
                  onChange={(e) => setSpecDraft((p) => ({ ...p, beds: e.target.value }))}
                  placeholder="e.g. 3"
                />
              </FieldDark>
              <FieldDark label="Bathrooms">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={specDraft.baths}
                  onChange={(e) => setSpecDraft((p) => ({ ...p, baths: e.target.value }))}
                  placeholder="e.g. 2.5"
                />
              </FieldDark>
              <FieldDark label="Sq Ft">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={specDraft.sqft}
                  onChange={(e) => setSpecDraft((p) => ({ ...p, sqft: e.target.value }))}
                  placeholder="e.g. 1900"
                />
              </FieldDark>
            </div>

            <div className="mt-5 text-xs opacity-70">Optional. Leave blank to remove specs.</div>

            <div className="mt-5 flex justify-end gap-2">
              <GhostBtn onClick={() => setEditSpecsOpen(false)}>Cancel</GhostBtn>
              <PrimarySolid onClick={saveSpecsEditor}>Save</PrimarySolid>
            </div>
          </Modal>
        )}

        {editNoteOpen && (
          <Modal title="Edit Property Note" onClose={() => setEditNoteOpen(false)}>
            <FieldDark label="Property note (codes / WiFi / access / rules)">
              <textarea
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white min-h-[160px]"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Door code, lockbox, WiFi, gate, parking, supplies, owner rules..."
              />
            </FieldDark>
            <div className="mt-5 flex justify-end gap-2">
              <GhostBtn onClick={() => setEditNoteOpen(false)}>Cancel</GhostBtn>
              <PrimarySolid onClick={saveNoteEditor}>Save</PrimarySolid>
            </div>
          </Modal>
        )}

        {editDefaultsOpen && (
          <Modal title="Edit Service Defaults" onClose={() => setEditDefaultsOpen(false)}>
            <div className="rounded-2xl bg-white/8 border border-white/12 p-4">
              <p className="text-sm font-semibold">Link to Activity</p>
              <p className="text-xs opacity-70 mt-1">Select an activity. Overrides optional.</p>

              <div className="mt-3">
                <select
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={defaultsDraft.activityId}
                  onChange={(e) => setDefaultsDraft((p) => ({ ...p, activityId: e.target.value ? Number(e.target.value) : "" }))}
                >
                  <option value="">— None —</option>
                  {MOCK_ACTIVITIES.map((a) => (
                    <option key={a.id} value={a.id} className="text-black">
                      {a.name} · {a.pricingMode}
                      {a.pricingMode === "Fixed" && a.basePrice != null ? ` · ${fmtMoney(a.basePrice)}` : ""}
                      {a.pricingMode === "Fixed" && a.baseMinutes != null ? ` · ${a.baseMinutes}m` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldDark label="Fixed Price Override (optional)">
                  <input
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                    value={defaultsDraft.fixedPriceOverride === "" ? "" : String(defaultsDraft.fixedPriceOverride)}
                    onChange={(e) => setDefaultsDraft((p) => ({ ...p, fixedPriceOverride: e.target.value ? Number(e.target.value) : "" }))}
                    placeholder="e.g. 200"
                  />
                </FieldDark>
                <FieldDark label="Fixed Time Override (minutes) (optional)">
                  <input
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                    value={defaultsDraft.fixedMinutesOverride === "" ? "" : String(defaultsDraft.fixedMinutesOverride)}
                    onChange={(e) => setDefaultsDraft((p) => ({ ...p, fixedMinutesOverride: e.target.value ? Number(e.target.value) : "" }))}
                    placeholder="e.g. 120"
                  />
                </FieldDark>
              </div>

              <div className="mt-3 text-xs opacity-70">If activity is Hourly, fixed values are ignored.</div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <GhostBtn onClick={() => setEditDefaultsOpen(false)}>Cancel</GhostBtn>
              <PrimarySolid onClick={saveDefaultsEditor}>Save</PrimarySolid>
            </div>
          </Modal>
        )}

        {editAddressOpen && (
          <Modal title="Edit Address" onClose={() => setEditAddressOpen(false)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldDark label="Street">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={addressDraft.street}
                  onChange={(e) => setAddressDraft((p) => ({ ...p, street: e.target.value }))}
                />
              </FieldDark>
              <FieldDark label="City">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={addressDraft.city}
                  onChange={(e) => setAddressDraft((p) => ({ ...p, city: e.target.value }))}
                />
              </FieldDark>
              <FieldDark label="State">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={addressDraft.state}
                  onChange={(e) => setAddressDraft((p) => ({ ...p, state: e.target.value }))}
                  placeholder="e.g. FL"
                />
              </FieldDark>
              <FieldDark label="Zip Code">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={addressDraft.zip}
                  onChange={(e) => setAddressDraft((p) => ({ ...p, zip: e.target.value }))}
                  placeholder="e.g. 34108"
                />
              </FieldDark>
              <FieldDark label="Country">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={addressDraft.country}
                  onChange={(e) => setAddressDraft((p) => ({ ...p, country: e.target.value }))}
                  placeholder="e.g. USA"
                />
              </FieldDark>
              <FieldDark label="County">
                <input
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none text-white"
                  value={addressDraft.county}
                  onChange={(e) => setAddressDraft((p) => ({ ...p, county: e.target.value }))}
                  placeholder="e.g. Collier"
                />
              </FieldDark>

              <div className="md:col-span-2 rounded-2xl bg-white/8 border border-white/12 p-4">
                <p className="text-sm font-semibold">Preview</p>
                <p className="text-xs opacity-70 mt-1">This is what users will see.</p>
                <div className="mt-3 text-sm opacity-90">
                  {addressToLine(
                    {
                      street: addressDraft.street,
                      city: addressDraft.city,
                      state: addressDraft.state,
                      zip: addressDraft.zip,
                      country: addressDraft.country,
                    },
                    ""
                  )}
                </div>
                <div className="text-xs opacity-70 mt-1">County: {addressDraft.county || "—"}</div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <GhostBtn onClick={() => setEditAddressOpen(false)}>Cancel</GhostBtn>
              <PrimarySolid onClick={saveAddressEditor}>Save</PrimarySolid>
            </div>
          </Modal>
        )}

        <DevSelfTests />
      </Screen>
    );
  }

  /* =========================
     LIST VIEW
     ========================= */

  return (
    <Screen>
      <Header
        title="Properties"
        subtitle="All properties across customers"
        left={null}
        right={
          <div className="flex items-center gap-2">
            <PrimaryBtn icon={<Plus size={16} />} label="Add" onClick={openAddModal} />
            <IconBtn title="Filters" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={18} />
            </IconBtn>
          </div>
        }
      />

      <div className="px-4">
        <SearchBar
          value={filters.q}
          onChange={(v: string) => {
            setFilters((p) => ({ ...p, q: v }));
            setPage(1);
          }}
          placeholder="Search customer, address, property..."
        />

        <div className="mt-3 flex gap-2 flex-wrap">
          <Chip icon={<Filter size={14} />} label={`Type: ${filters.type}`} />
          <Chip label={`County: ${filters.county}`} />
          {filters.upcomingOnly && <Chip label="Upcoming only" />}
          {filters.hasBookingCalendarOnly && <Chip label="Bookings linked" />}
          <Chip label={`Sort: ${filters.sortKey} (${filters.sortDir})`} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {pageItems.length === 0 ? (
          <Empty text="No properties match your filters." />
        ) : (
          pageItems.map((p) => {
            const specLine = fmtSpecLine(p);
            const defLine = fmtDefaultsLine(p);
            const addr = addressToLine(p.address, p.legacyAddress);

            return (
              <Card
                key={p.id}
                onClick={() => setView({ name: "property", propertyId: p.id, tab: "Dashboard" })}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs opacity-70">{p.type}</p>
                    <p className="text-sm font-semibold truncate">{p.title}</p>
                    <p className="text-xs opacity-75 mt-1 truncate">{addr}</p>

                    <p className="text-xs opacity-80 mt-2 truncate">
                      <span className="font-semibold">{p.customerName}</span>
                      <span className="opacity-60"> · {p.county} County</span>
                    </p>

                    {specLine && <p className="text-xs opacity-70 mt-2">{specLine}</p>}
                    {defLine && <p className="text-xs opacity-70 mt-1">Defaults: {defLine}</p>}

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Badge
                        tone={
                          p.type === "Residential"
                            ? "bg-white/10 border-white/15"
                            : "bg-[#148dcd]/20 border-[#148dcd]/30"
                        }
                      >
                        {p.type}
                      </Badge>
                      <Badge tone="bg-white/10 border-white/15">Last: {fmtDateShort(p.lastService)}</Badge>
                      <Badge tone="bg-white/10 border-white/15">Next: {fmtDateShort(p.lastScheduledService)}</Badge>
                      {p.bookingLinks?.length ? (
                        <Badge tone="bg-white/10 border-white/15">Bookings</Badge>
                      ) : null}
                      {p.propertyNote ? (
                        <Badge tone="bg-white/10 border-white/15">Note</Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="px-3 py-2 rounded-2xl bg-black/20 border border-white/10 text-xs">
                      Open
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        )}

        <div className="pt-2 pb-10">
          <div className="rounded-3xl bg-white/8 border border-white/12 p-4 backdrop-blur-2xl flex items-center justify-between gap-3">
            <div className="text-xs opacity-70">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs outline-none"
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n} className="text-black">
                    Show {n}
                  </option>
                ))}
              </select>

              <button
                className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                title="Prev"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-3 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs">
                {page}/{totalPages}
              </div>
              <button
                className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                title="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <Sheet title="Filters" subtitle="Refine the properties list" onClose={() => setFiltersOpen(false)}>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
              <p className="text-sm font-semibold">Type</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["All", "Residential", "Business"] as const).map((t) => (
                  <TogglePill
                    key={t}
                    active={filters.type === (t as any)}
                    onClick={() => {
                      setFilters((p) => ({ ...p, type: t as any }));
                      setPage(1);
                    }}
                    label={t}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
              <p className="text-sm font-semibold">County</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {counties.map((c) => (
                  <TogglePill
                    key={c}
                    active={filters.county === c}
                    onClick={() => {
                      setFilters((p) => ({ ...p, county: c }));
                      setPage(1);
                    }}
                    label={c}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
              <p className="text-sm font-semibold">Upcoming</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm opacity-80">Only properties with upcoming scheduled service</span>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.upcomingOnly}
                    onChange={(e) => {
                      setFilters((p) => ({ ...p, upcomingOnly: e.target.checked }));
                      setPage(1);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
              <p className="text-sm font-semibold">Booking Calendar</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm opacity-80">Only properties with linked booking calendars (iCal)</span>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.hasBookingCalendarOnly}
                    onChange={(e) => {
                      setFilters((p) => ({ ...p, hasBookingCalendarOnly: e.target.checked }));
                      setPage(1);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
              <p className="text-sm font-semibold">Sort</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {([
                  { k: "title", label: "Name" },
                  { k: "lastService", label: "Last Service" },
                  { k: "lastScheduledService", label: "Next Scheduled" },
                ] as const).map((o) => (
                  <TogglePill
                    key={o.k}
                    active={filters.sortKey === o.k}
                    onClick={() => setFilters((p) => ({ ...p, sortKey: o.k }))}
                    label={o.label}
                  />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["asc", "desc"] as const).map((d) => (
                  <TogglePill
                    key={d}
                    active={filters.sortDir === d}
                    onClick={() => setFilters((p) => ({ ...p, sortDir: d }))}
                    label={d.toUpperCase()}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="py-3 rounded-2xl bg-white/10 border border-white/20"
                onClick={() => {
                  setFilters({
                    q: "",
                    type: "All",
                    county: "All",
                    upcomingOnly: false,
                    hasBookingCalendarOnly: false,
                    sortKey: "lastScheduledService",
                    sortDir: "desc",
                  });
                  setPage(1);
                }}
              >
                Reset
              </button>
              <button
                className="py-3 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg font-semibold"
                onClick={() => setFiltersOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </Sheet>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={closeAddModal}>
          <div className="w-full max-w-3xl rounded-3xl bg-white text-slate-900 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Property Manager</h3>
              <button className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center" onClick={closeAddModal} aria-label="Close" type="button">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Title">
                  <input className="w-full rounded-xl border px-4 py-3 outline-none" value={addForm.title} onChange={(e) => setAddForm((p) => ({ ...p, title: e.target.value }))} />
                </Field>

                <Field label="Type">
                  <select className="w-full rounded-xl border px-4 py-3 outline-none" value={addForm.type} onChange={(e) => setAddForm((p) => ({ ...p, type: e.target.value as any }))}>
                    <option value="">--</option>
                    <option value="Residential">Residential</option>
                    <option value="Business">Business</option>
                  </select>
                </Field>

                <Field label="Customer">
                  <div className="relative">
                    <button type="button" className="w-full rounded-xl border px-4 py-3 text-left flex items-center justify-between" onClick={() => setCustomerSelectOpen((v) => !v)}>
                      <span className={addForm.customerId ? "text-slate-900" : "text-slate-500"}>
                        {addForm.customerId ? ALL_CUSTOMERS.find((c) => c.id === addForm.customerId)?.name || "--" : "--"}
                      </span>
                      <span className="text-slate-400">▾</span>
                    </button>

                    {customerSelectOpen && (
                      <div className="absolute z-20 mt-2 w-full rounded-2xl border bg-white shadow-xl overflow-hidden">
                        <div className="p-3 border-b">
                          <input className="w-full rounded-xl border px-3 py-2 outline-none" placeholder="Search customer..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} />
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          <button type="button" className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-600" onClick={() => { setAddForm((p) => ({ ...p, customerId: "" })); setCustomerSelectOpen(false); }}>--</button>
                          {customerOptions.map((c) => (
                            <button key={c.id} type="button" className="w-full text-left px-4 py-3 hover:bg-slate-50" onClick={() => { setAddForm((p) => ({ ...p, customerId: c.id })); setCustomerSelectOpen(false); }}>
                              <div className="font-medium">{c.name}</div>
                              <div className="text-xs text-slate-500">{c.email}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Field>

                <Field label="Description" className="md:col-span-3">
                  <input className="w-full rounded-xl border px-4 py-3 outline-none" value={addForm.description} onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))} />
                </Field>

                <Field label="Property Note" className="md:col-span-3">
                  <textarea className="w-full rounded-xl border px-4 py-3 outline-none min-h-[110px]" value={addForm.propertyNote} onChange={(e) => setAddForm((p) => ({ ...p, propertyNote: e.target.value }))} placeholder="Door code, WiFi, lockbox, gate, owner rules, supplies..." />
                </Field>
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold text-slate-700">Address</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Street" className="md:col-span-2">
                    <input className="w-full rounded-xl border px-4 py-3 outline-none" value={addForm.street} onChange={(e) => setAddForm((p) => ({ ...p, street: e.target.value }))} />
                  </Field>
                  <Field label="City">
                    <input className="w-full rounded-xl border px-4 py-3 outline-none" value={addForm.city} onChange={(e) => setAddForm((p) => ({ ...p, city: e.target.value }))} />
                  </Field>
                  <Field label="State">
                    <input className="w-full rounded-xl border px-4 py-3 outline-none" value={addForm.state} onChange={(e) => setAddForm((p) => ({ ...p, state: e.target.value }))} />
                  </Field>
                  <Field label="Zip Code">
                    <input className="w-full rounded-xl border px-4 py-3 outline-none" value={addForm.zip} onChange={(e) => setAddForm((p) => ({ ...p, zip: e.target.value }))} />
                  </Field>
                  <Field label="Country">
                    <input className="w-full rounded-xl border px-4 py-3 outline-none" value={addForm.country} onChange={(e) => setAddForm((p) => ({ ...p, country: e.target.value }))} />
                  </Field>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
              <button type="button" className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50" onClick={closeAddModal}>Cancel</button>
              <button type="button" className="px-5 py-2 rounded-xl bg-[#148dcd] text-white shadow-lg" onClick={saveAddModal}>Save</button>
            </div>
          </div>
        </div>
      )}

      <DevSelfTests />
    </Screen>
  );
}

/* =========================
   BOOKING CALENDAR UI
   ========================= */

function BookingMonthGrid({
  month,
  events,
  onClickEvent,
}: {
  month: Date;
  events: BookingEvent[];
  onClickEvent: (ev: BookingEvent) => void;
}) {
  const start = startOfMonth(month);

  // align to Sunday (0)
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  // 6 weeks x 7 days
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }

  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7));
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Convert an event into per-week segments so it spans across days
  function segmentsForWeek(weekDays: Date[]) {
    const weekStart = ymd(weekDays[0]);
    const weekEndExclusive = ymd(addDays(weekDays[6], 1));

    const segs: {
      ev: BookingEvent;
      startCol: number;
      endColExclusive: number;
    }[] = [];

    for (const ev of events) {
      const overlaps = ev.startDate < weekEndExclusive && ev.endDate > weekStart;
      if (!overlaps) continue;

      const segStart = ev.startDate > weekStart ? ev.startDate : weekStart;
      const segEnd = ev.endDate < weekEndExclusive ? ev.endDate : weekEndExclusive;

      const startIdx = weekDays.findIndex((d) => ymd(d) === segStart);
      const lastDay = addDaysStr(segEnd, -1);
      const endIdx = weekDays.findIndex((d) => ymd(d) === lastDay);

      const endExclusive = endIdx >= 0 ? endIdx + 1 : 7;

      segs.push({
        ev,
        startCol: Math.max(0, startIdx),
        endColExclusive: Math.max(1, endExclusive),
      });
    }

    segs.sort((a, b) => {
      if (a.startCol !== b.startCol) return a.startCol - b.startCol;
      return (b.endColExclusive - b.startCol) - (a.endColExclusive - a.startCol);
    });

    // greedy lane assignment
    const lanes: typeof segs[] = [];
    for (const s of segs) {
      let placed = false;
      for (let li = 0; li < lanes.length; li++) {
        const lane = lanes[li];
        const last = lane[lane.length - 1];
        if (s.startCol >= last.endColExclusive) {
          lane.push(s);
          placed = true;
          break;
        }
      }
      if (!placed) lanes.push([s]);
    }

    return lanes;
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="grid grid-cols-7 bg-white/5 border-b border-white/10">
        {dayNames.map((n) => (
          <div key={n} className="py-2 text-center text-xs opacity-70">
            {n}
          </div>
        ))}
      </div>

      <div className="divide-y divide-white/10">
        {weeks.map((weekDays, wi) => {
          const lanes = segmentsForWeek(weekDays);
          const visibleLaneCount = 3;
          const laneHeight = 26;
          const headerHeight = 22;
          const weekHeight = headerHeight + visibleLaneCount * laneHeight + 10;

          return (
            <div key={wi} className="relative" style={{ height: weekHeight }}>
              {/* day cells */}
              <div className="absolute inset-0 grid grid-cols-7">
                {weekDays.map((d) => {
                  const inMonth = d.getMonth() === month.getMonth();
                  return (
                    <div
                      key={ymd(d)}
                      className={`border-r border-white/5 p-2 ${inMonth ? "bg-white/0" : "bg-white/5"}`}
                    >
                      <div className={`text-xs ${inMonth ? "opacity-80" : "opacity-40"}`}>{d.getDate()}</div>
                    </div>
                  );
                })}
              </div>

              {/* event overlay */}
              <div className="absolute inset-0 grid grid-cols-7" style={{ paddingTop: headerHeight }}>
                {lanes.slice(0, visibleLaneCount).flatMap((lane, li) =>
                  lane.map((s) => (
                    <button
                      key={`${s.ev.id}-${wi}-${li}`}
                      type="button"
                      onClick={() => onClickEvent(s.ev)}
                      className={`mx-1 my-1 h-[22px] rounded-lg border px-2 text-left text-[10px] flex items-center gap-2 overflow-hidden ${eventTone(s.ev.color)}`}
                      style={{
                        gridColumn: `${s.startCol + 1} / ${s.endColExclusive + 1}`,
                        gridRow: li + 1,
                      }}
                      title={`${s.ev.title} (${s.ev.startDate} → ${s.ev.endDate})`}
                    >
                      <span className="font-semibold shrink-0">12:00</span>
                      <span className="truncate">{s.ev.title}</span>
                    </button>
                  ))
                )}

                {lanes.length > visibleLaneCount && (
                  <div className="col-span-7 px-2 pt-1 text-[10px] opacity-70">
                    +{lanes.length - visibleLaneCount} more overlapping booking(s) this week
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function addDaysStr(ymdStr: string, n: number) {
  const d = new Date(`${ymdStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return ymd(d);
}

function eventTone(c: BookingEvent["color"]) {
  if (c === "blue") return "bg-[#062874]/25 border-[#062874]/40";
  if (c === "cyan") return "bg-[#148dcd]/25 border-[#148dcd]/40";
  return "bg-rose-500/25 border-rose-400/40";
}

/* =========================
   UI PRIMITIVES
   ========================= */



function TopBar({ title, subtitle, left, right }: any) {
  return (
    <div className="sticky top-0 z-20 bg-[#062874]/70 backdrop-blur-2xl border-b border-white/10 px-4 pt-4 pb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold truncate">{title}</h1>
          {subtitle && <p className="text-xs opacity-70 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {left}
          {right}
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: any) {
  return (
    <div className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-3 flex items-center gap-2">
      <Search size={16} className="opacity-70" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-white/50"
      />
    </div>
  );
}

function Card({ children, onClick }: any) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`rounded-3xl p-4 bg-white/15 border border-white/20 backdrop-blur-2xl shadow-xl ${
        onClick ? "active:scale-[0.99] transition" : ""
      }`}
    >
      {children}
    </div>
  );
}

function Chip({ icon, label }: any) {
  return (
    <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-white/10 border-white/20">
      {icon}
      {label}
    </span>
  );
}

function Badge({ children, tone }: any) {
  return <span className={`text-[11px] px-2 py-1 rounded-full border ${tone}`}>{children}</span>;
}

function Grid({ children }: any) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="rounded-3xl p-4 bg-white/12 border border-white/18 backdrop-blur-2xl shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs opacity-70">{label}</p>
          <p className="mt-1 text-lg font-semibold truncate">{value}</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-[#148dcd]/25 border border-white/15 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
      <p className="text-xs opacity-70">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Empty({ text }: any) {
  return (
    <div className="rounded-3xl bg-white/10 border border-white/15 p-6 text-center text-sm opacity-80">
      {text}
    </div>
  );
}

function PrimaryBtn({ icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="px-4 h-11 rounded-2xl bg-[#148dcd] border border-[#148dcd] shadow-lg flex items-center gap-2 text-sm"
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function IconBtn({ children, onClick, title }: any) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
      type="button"
    >
      {children}
    </button>
  );
}

function Tabs({ tabs, active, onChange }: any) {
  return (
    <div className="px-4 pt-3">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t: string) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-4 py-2 rounded-2xl border whitespace-nowrap ${
              active === t ? "bg-white/20 border-white/30" : "bg-white/10 border-white/15"
            }`}
          >
            <span className="text-sm">{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TogglePill({ active, label, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-2xl border text-sm ${
        active ? "bg-[#148dcd]/20 border-[#148dcd]/35" : "bg-white/10 border-white/15"
      }`}
    >
      {label}
    </button>
  );
}

function Sheet({ title, subtitle, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-3xl bg-[#062874]/95 border-t border-white/20 backdrop-blur-2xl p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            {subtitle && <p className="text-xs opacity-70 mt-1 truncate">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-3xl bg-[#062874]/95 text-white overflow-hidden shadow-2xl border border-white/20 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: any) {
  return (
    <div className={className}>
      <div className="text-sm font-medium text-slate-700 mb-2">{label}</div>
      {children}
    </div>
  );
}

function FieldDark({ label, children, className = "" }: any) {
  return (
    <div className={className}>
      <div className="text-sm font-medium text-white/85 mb-2">{label}</div>
      {children}
    </div>
  );
}

function GhostBtn({ children, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15"
    >
      {children}
    </button>
  );
}

function PrimarySolid({ children, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-5 py-2 rounded-xl bg-[#148dcd] border border-[#148dcd] shadow-lg font-semibold"
    >
      {children}
    </button>
  );
}

function jobTone(status: JobStatus) {
  if (status === "Completed") return "bg-emerald-500/20 border-emerald-400/30 text-emerald-200";
  if (status === "In Progress") return "bg-amber-500/20 border-amber-400/30 text-amber-200";
  if (status === "Scheduled") return "bg-sky-500/20 border-sky-400/30 text-sky-200";
  return "bg-rose-500/20 border-rose-400/30 text-rose-200";
}

function invoiceStatusTone(status: InvoiceStatus) {
  if (status === "Paid") return "bg-emerald-500/20 border-emerald-400/30 text-emerald-200";
  if (status === "Unpaid") return "bg-rose-500/20 border-rose-400/30 text-rose-200";
  if (status === "Sent") return "bg-sky-500/20 border-sky-400/30 text-sky-200";
  return "bg-white/10 border-white/15 text-white";
}

function fmtDT(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fmtT(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/* =========================
   SELF TESTS
   ========================= */

function DevSelfTests() {
  useMemo(() => {
    if (typeof window === "undefined") return true;
    if ((window as any).__DOP_PROPERTIES_TESTS__) return true;
    (window as any).__DOP_PROPERTIES_TESTS__ = true;

    console.assert(MOCK_PROPERTIES_SEED.length > 0, "Properties should exist");
    console.assert(MOCK_ACTIVITIES.length > 0, "Activities should exist");

    const p = MOCK_PROPERTIES_SEED.find((x) => x.defaults?.activityId);
    if (p?.defaults?.activityId) {
      console.assert(activityById(p.defaults.activityId), "Activity should resolve by id");
    }

    const line = addressToLine({ street: "1 Main", city: "Naples", state: "FL", zip: "34108" }, "");
    console.assert(line.includes("Naples"), "Address line should include city");

    // Booking overlap helper
    const ev = MOCK_BOOKINGS[0];
    console.assert(isBetween(ev.startDate, ev.startDate, ev.endDate), "isBetween should include start");

    // Booking filter: at least one property has bookingLinks
    console.assert(MOCK_PROPERTIES_SEED.some((x) => (x.bookingLinks || []).length > 0), "Some properties should have booking links");

    return true;
  }, []);

  return null;
}
