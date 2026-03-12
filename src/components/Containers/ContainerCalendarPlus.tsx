import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Image as ImageIcon,
  Settings,
  Home,
  UsersRound,
  BadgeDollarSign,
  Layers,
  RefreshCw,
  Users,
  ListTodo,
  Filter,
  CheckCircle,
  Send,
  ArrowUp,
  ArrowDown,
  ArrowRightLeft,
  X,
  BadgeCheck,
  BadgeAlert,
  Eye,
  CheckSquare,
} from "lucide-react";
import Fab from "../UI/Fab";
import { api } from "../../services/apicalendar";

/* ============================
   DATA HELPERS (API MAPPING)
   ============================ */

function makeDateTimeISO(date: string, time: string) {
  // time: "09:00" -> "2026-03-02T09:00:00"
  const t = time.length === 5 ? time : time.padStart(5, "0");
  return `${date}T${t}:00`;
}

function mapStatusToDispatch(status: string | undefined) {
  const s = String(status || "").toLowerCase();
  if (s === "in-progress") return "In Progress";
  if (s === "assigned") return "Assigned";
  if (s === "dispatched") return "Dispatched";
  if (s === "completed") return "Completed";
  return "Unassigned";
}

/* ============================
   HELPERS
   ============================ */

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function parseISODateOnly(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}

function formatSelectedDate(date: Date) {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
}

function getDaysInMonth(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const total = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: total }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      date: d,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: d.getDate(),
      iso: isoDate(d),
    };
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function diffMinutes(aISO: string, bISO: string) {
  return (new Date(bISO).getTime() - new Date(aISO).getTime()) / 60000;
}

function hoursScheduled(jobs: any[]) {
  const mins = jobs.reduce(
    (acc, job) => acc + Math.max(0, diffMinutes(job.startISO, job.endISO)),
    0,
  );
  return mins / 60;
}

function countGaps(jobs: any[]) {
  if (jobs.length <= 1) return 0;
  const sorted = jobs
    .slice()
    .sort(
      (a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime(),
    );

  let gaps = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = diffMinutes(sorted[i - 1].endISO, sorted[i].startISO);
    if (gap >= 30) gaps++;
  }
  return gaps;
}

function dispatchTone(status: string) {
  const s = String(status || "").toLowerCase();
  if (s.includes("unassigned"))
    return "bg-rose-500/20 border-rose-400/30 text-rose-100";
  if (s.includes("progress"))
    return "bg-amber-500/20 border-amber-400/30 text-amber-100";
  if (s.includes("dispatched"))
    return "bg-sky-500/20 border-sky-400/30 text-sky-100";
  if (s.includes("completed"))
    return "bg-emerald-500/20 border-emerald-400/30 text-emerald-100";
  return "bg-white/10 border-white/15 text-white";
}

function invoiceTone(status: string) {
  const s = String(status || "").toLowerCase();
  if (s.includes("paid"))
    return "bg-emerald-500/20 border-emerald-400/30 text-emerald-100";
  if (s.includes("unpaid"))
    return "bg-rose-500/20 border-rose-400/30 text-rose-100";
  if (s.includes("unsent"))
    return "bg-orange-500/20 border-orange-400/30 text-orange-100";
  if (s.includes("sent")) return "bg-sky-500/20 border-sky-400/30 text-sky-100";
  return "bg-white/10 border-white/15 text-white";
}

function priorityTone(priority: string) {
  if (String(priority).toLowerCase().includes("high")) {
    return "bg-orange-500/20 border-orange-400/30 text-orange-100";
  }
  return "bg-white/10 border-white/15 text-white";
}

/* ============================
   UI
   ============================ */

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs border backdrop-blur-xl ${className}`}
    >
      {children}
    </span>
  );
}

function CircleIconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-lg backdrop-blur-xl text-white/90"
    >
      {children}
    </button>
  );
}

function MiniIconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-11 h-11 rounded-2xl bg-slate-900/20 border border-white/10 flex items-center justify-center"
    >
      {children}
    </button>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="py-3 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center gap-2"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function Sheet({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-3xl bg-[#062874]/95 border-t border-white/20 backdrop-blur-2xl p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            {subtitle ? (
              <p className="text-xs opacity-70 mt-1 truncate">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function JobCard({ job, onOpen }: { job: any; onOpen: (job: any) => void }) {
  return (
    <div
      onClick={() => onOpen(job)}
      className="rounded-[26px] bg-white/10 border border-white/10 shadow-2xl backdrop-blur-xl p-4 text-white cursor-pointer"
    >
      <div className="flex justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <Pill className={dispatchTone(job.dispatchStatus)}>
              {job.dispatchStatus}
            </Pill>
            <Pill className={invoiceTone(job.invoiceStatus)}>
              {job.invoiceStatus}
            </Pill>
            <Pill className={priorityTone(job.priority)}>{job.priority}</Pill>
            <Pill className="bg-slate-900/20 border-white/10">#{job.id}</Pill>
          </div>

          <h3 className="text-lg font-semibold leading-tight">
            {job.customer}
          </h3>
          <p className="text-white/85 text-sm mt-1">
            {job.property} · {job.service}
          </p>

          <div className="mt-3 space-y-2 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              <span>
                {fmtTime(job.startISO)} - {fmtTime(job.endISO)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={15} />
              <span className="truncate">{job.address}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Pill className="bg-slate-900/20 border-white/10">
              ${job.price}
            </Pill>
            <Pill className="bg-slate-900/20 border-white/10">
              Travel {job.travelMin}m
            </Pill>
            <Pill className="bg-slate-900/20 border-white/10">
              Crew {job.crew}
            </Pill>
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0">
          <MiniIconButton
            title="Open"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(job);
            }}
          >
            <Eye size={18} />
          </MiniIconButton>

          <MiniIconButton
            title="Photos"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Photos for #${job.id}`);
            }}
          >
            <ImageIcon size={18} />
          </MiniIconButton>

          {String(job.dispatchStatus).toLowerCase() === "completed" ? (
            <MiniIconButton
              title="Checklist"
              onClick={(e) => {
                e.stopPropagation();
                alert(`Checklist for #${job.id}`);
              }}
            >
              <CheckSquare size={18} />
            </MiniIconButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EmployeeAccordion({
  employee,
  jobs,
  open,
  onToggle,
  onOpenJob,
}: {
  employee: any;
  jobs: any[];
  open: boolean;
  onToggle: () => void;
  onOpenJob: (job: any) => void;
}) {
  const totalHours = hoursScheduled(jobs);
  const gaps = countGaps(jobs);

  return (
    <div className="rounded-[28px] bg-white/8 border border-white/10 overflow-hidden backdrop-blur-xl">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between gap-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-white/65 text-sm">
            {employee.role} · {employee.home}
          </p>
          <h2 className="text-xl font-semibold truncate mt-1">
            {employee.name}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Pill className="bg-white/10 border-white/15">
            {jobs.length} Jobs
          </Pill>
          <Pill className="bg-white/10 border-white/15">
            {totalHours.toFixed(1)}h
          </Pill>
          <Pill
            className={
              gaps
                ? "bg-amber-500/20 border-amber-400/30 text-amber-100"
                : "bg-white/10 border-white/15"
            }
          >
            Gaps {gaps}
          </Pill>
        </div>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[2200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-4">
          {jobs.length === 0 ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-6 text-center text-white/60">
              No jobs for this day
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} onOpen={onOpenJob} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================
   MAIN
   ============================ */

export default function ContainerCalendarRedesign() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(
    new Date("2026-03-01T00:00:00"),
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date("2026-03-02T00:00:00"),
  );

  const [fabOpen, setFabOpen] = useState(false);
  const [openEmployees, setOpenEmployees] = useState<Record<number, boolean>>(
    {},
  );
  const [empSet, setEmpSet] = useState<Set<number>>(
    () => new Set<number>(),
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [unassignedOpen, setUnassignedOpen] = useState(false);
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState(isoDate(new Date("2026-03-02T00:00:00")));
  const [jobSheet, setJobSheet] = useState<any>(null);

  const daysScrollRef = useRef<HTMLDivElement | null>(null);

  const monthDays = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);
  const selectedISO = isoDate(selectedDate);
  const todayISO = isoDate(new Date());

  const jobsForDay = useMemo(
    () => jobs.filter((job) => job.day === selectedISO),
    [jobs, selectedISO],
  );

  const unassigned = useMemo(
    () => jobsForDay.filter((job) => job.employeeId == null),
    [jobsForDay],
  );

  const employeesVisible = useMemo(
    () => employees.filter((employee) => empSet.has(employee.id)),
    [employees, empSet],
  );

  const employeesWithJobs = useMemo(() => {
    return employeesVisible.map((employee) => ({
      ...employee,
      jobs: jobsForDay
        .filter((job) => job.employeeId === employee.id)
        .sort(
          (a, b) =>
            new Date(a.startISO).getTime() - new Date(b.startISO).getTime(),
        ),
    }));
  }, [jobsForDay, employeesVisible]);

  function toggleEmployeeAccordion(employeeId: number) {
    setOpenEmployees((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  }

  function toggleEmp(id: number) {
    setEmpSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) return prev;
      return next;
    });
  }

  function selectAll() {
    setEmpSet(new Set(employees.map((e: any) => e.id)));
  }

  function selectNone() {
    if (!employees.length) return;
    setEmpSet(new Set([employees[0].id]));
  }

  function openJob(job: any) {
    setJobSheet(job);
  }

  function setJobStatus(jobId: number, next: string) {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, dispatchStatus: next } : job,
      ),
    );
    setJobSheet((prev: any) =>
      prev && prev.id === jobId ? { ...prev, dispatchStatus: next } : prev,
    );
  }

  function assignJob(jobId: number, employeeId: number | null) {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              employeeId,
              dispatchStatus: employeeId == null ? "Unassigned" : "Assigned",
            }
          : job,
      ),
    );

    setJobSheet((prev: any) =>
      prev && prev.id === jobId
        ? {
            ...prev,
            employeeId,
            dispatchStatus: employeeId == null ? "Unassigned" : "Assigned",
          }
        : prev,
    );
  }

  function moveWithinEmployee(jobId: number, direction: "up" | "down") {
    setJobs((prev) => {
      const copy = prev.map((x) => ({ ...x }));
      const job = copy.find((j) => j.id === jobId);
      if (!job || job.employeeId == null) return prev;

      const lane = copy
        .filter((j) => j.day === selectedISO && j.employeeId === job.employeeId)
        .sort(
          (a, b) =>
            new Date(a.startISO).getTime() - new Date(b.startISO).getTime(),
        );

      const idx = lane.findIndex((j) => j.id === jobId);
      const swap = direction === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= lane.length) return prev;

      const a = lane[idx];
      const b = lane[swap];

      const aS = a.startISO;
      const aE = a.endISO;

      a.startISO = b.startISO;
      a.endISO = b.endISO;
      b.startISO = aS;
      b.endISO = aE;

      return copy;
    });
  }

  function refreshCalendar() {
    alert("Refresh (call API)");
  }

  function prevMonth() {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    setCurrentMonth(next);
    setSelectedDate(new Date(next.getFullYear(), next.getMonth(), 1));
  }

  function nextMonth() {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    );
    setCurrentMonth(next);
    setSelectedDate(new Date(next.getFullYear(), next.getMonth(), 1));
  }

  function goToday() {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  }

  function openDateSheetFromFab() {
    setPendingDate(isoDate(selectedDate));
    setDateSheetOpen(true);
    setFabOpen(false);
  }

  function prevDay() {
    const d = parseISODateOnly(selectedISO);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
    setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  function nextDay() {
    const d = parseISODateOnly(selectedISO);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
    setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  useEffect(() => {
    const container = daysScrollRef.current;
    if (!container) return;

    const index = monthDays.findIndex((d) => d.iso === selectedISO);
    if (index === -1) return;

    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;

    const childLeft = child.offsetLeft;
    const childWidth = child.offsetWidth;
    const containerWidth = container.clientWidth;

    container.scrollTo({
      left: childLeft - containerWidth / 2 + childWidth / 2,
      behavior: "smooth",
    });
  }, [selectedISO, monthDays]);

  // Load data from mock API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const workers = await api.getWorkers();
      const unassignedRaw = await api.getUnassignedJobs();

      const mappedEmployees = workers.map((w: any) => ({
        id: w.id,
        name: w.name,
        role: w.role,
        home: w.home,
      }));

      const jobsFromWorkers = workers.flatMap((w: any) =>
        (w.jobs || []).map((j: any) => ({
          id: j.id,
          day: j.date,
          employeeId: w.id,
          customer: j.customer ?? j.client,
          property: j.property,
          service: j.service,
          address: j.address,
          startISO: makeDateTimeISO(j.date, j.start),
          endISO: makeDateTimeISO(j.date, j.end),
          price: j.price ?? j.payment ?? 0,
          priority: j.priority ?? "Normal",
          travelMin: j.travelMin ?? 0,
          crew: j.crew ?? 1,
          dispatchStatus: mapStatusToDispatch(j.status),
          invoiceStatus: j.invoiceStatus ?? "Unsent",
          photos: j.photos ?? 0,
          checklistDone: j.checklistDone ?? false,
          notes: j.notes ?? "",
        })),
      );

      const jobsFromUnassigned = (unassignedRaw || []).map((j: any) => ({
        id: j.id,
        day: j.date,
        employeeId: null,
        customer: j.customer ?? j.client,
        property: j.property,
        service: j.service,
        address: j.address,
        startISO: makeDateTimeISO(j.date, j.start),
        endISO: makeDateTimeISO(j.date, j.end),
        price: j.price ?? j.payment ?? 0,
        priority: j.priority ?? "High",
        travelMin: j.travelMin ?? 0,
        crew: j.crew ?? 1,
        dispatchStatus: "Unassigned",
        invoiceStatus: j.invoiceStatus ?? "Unsent",
        photos: j.photos ?? 0,
        checklistDone: j.checklistDone ?? false,
        notes: j.notes ?? "",
      }));

      setEmployees(mappedEmployees);
      setJobs([...jobsFromWorkers, ...jobsFromUnassigned]);
      setOpenEmployees(
        Object.fromEntries(mappedEmployees.map((e: any) => [e.id, true])),
      );
      setEmpSet(new Set(mappedEmployees.map((e: any) => e.id)));
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#184f80_0%,#0b2f73_35%,#08245f_70%,#071d4d_100%)] text-white">
      <div className="max-w-md mx-auto px-4 pt-8 pb-36">
        {loading ? (
          <div className="text-center text-sm opacity-70">Loading calendar...</div>
        ) : null}

        {/* top header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Calendar · Daily Dispatch</p>
            <h1 className="text-2xl font-semibold mt-1 capitalize">
              {formatSelectedDate(selectedDate)}
            </h1>
          </div>

          {/* <div className="flex items-center gap-3">
            <CircleIconButton title="Refresh" onClick={refreshCalendar}>
              <RefreshCw size={18} />
            </CircleIconButton>
            <CircleIconButton
              title="Filter workers"
              onClick={() => setFilterOpen(true)}
            >
              <Users size={18} />
            </CircleIconButton>
            <CircleIconButton
              title="Unassigned"
              onClick={() => setUnassignedOpen(true)}
            >
              <ListTodo size={18} />
            </CircleIconButton>
            <CircleIconButton
              title="Settings"
              onClick={() => alert("Settings")}
            >
              <SlidersHorizontal size={18} />
            </CircleIconButton>
          </div> */}
        </div>

        {/* calendar card */}
        <div className="mt-5 rounded-[28px] bg-white/5 text-slate-800 p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={prevMonth}
              className="
              w-10 h-10
              rounded-full
              bg-white/10
              border border-white/20
              backdrop-blur-xl
              shadow-[0_8px_24px_rgba(0,0,0,0.18)]
              flex items-center justify-center
              text-white/90
              active:scale-95
              transition
            "
            >
              <ChevronLeft size={18} />
            </button>

            <div className="text-center flex-1 min-w-0">
              <p className="text-sm text-slate-50">Appointment date</p>
              <h2 className="text-lg font-semibold capitalize truncate text-slate-50">
                {formatMonthYear(currentMonth)}
              </h2>
            </div>

            <button
              onClick={nextMonth}
              className="      w-10 h-10
      rounded-full
      bg-white/10
      border border-white/20
      backdrop-blur-xl
      shadow-[0_8px_24px_rgba(0,0,0,0.18)]
      flex items-center justify-center
      text-white/90
      active:scale-95
      transition
    "
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* 7 visibles */}
          <div
            ref={daysScrollRef}
            className="overflow-x-auto scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-2 min-w-max">
              {monthDays.map((d) => {
                const active = d.iso === selectedISO;

                return (
                  <button
                    key={d.iso}
                    onClick={() => setSelectedDate(d.date)}
                    className="w-[44px] shrink-0 flex flex-col items-center gap-2"
                  >
                    <span className="text-[11px] text-slate-50">
                      {d.dayName}
                    </span>
                    <div
                      className={[
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition",
                        active
                          ? "bg-orange-400 text-white shadow-lg"
                          : "text-slate-50 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {d.dayNumber}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={prevDay}
              className="
      w-10 h-10
      rounded-full
      bg-white/10
      border border-white/20
      backdrop-blur-xl
      shadow-[0_8px_24px_rgba(0,0,0,0.18)]
      flex items-center justify-center
      text-white/90
      active:scale-95
      transition
    "
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={goToday}
              className="
      px-5 h-12
      rounded-full
      bg-white/10
      border border-white/20
      backdrop-blur-xl
      shadow-[0_8px_24px_rgba(0,0,0,0.18)]
      flex items-center justify-center
      text-white/90 font-medium
      active:scale-95
      transition
    "
            >
              Today
            </button>

            <button
              onClick={nextDay}
              className="
      w-10 h-10
      rounded-full
      bg-white/10
      border border-white/20
      backdrop-blur-xl
      shadow-[0_8px_24px_rgba(0,0,0,0.18)]
      flex items-center justify-center
      text-white/90
      active:scale-95
      transition
    "
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* summary */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex gap-4 flex-wrap justify-start">
            <Pill className="bg-white/10 border-white/15">
              <Filter size={12} className="inline mr-1" />
              {employeesVisible.length} workers
            </Pill>
            <Pill className="bg-white/10 border-white/15">
              <Layers size={12} className="inline mr-1" />
              {jobsForDay.filter((j) => j.employeeId != null).length} jobs
            </Pill>
            <Pill
              className={
                unassigned.length
                  ? "bg-orange-500/20 border-orange-400/30 text-orange-100"
                  : "bg-white/10 border-white/15"
              }
            >
              Unassigned: {unassigned.length}
            </Pill>
            <Pill className="bg-white/10 border-white/15">
              <BadgeDollarSign size={12} className="inline mr-1" />$
              {jobsForDay.reduce((acc, job) => acc + job.price, 0)}
            </Pill>
          </div>
        </div>

        {/* employees */}
        <div className="mt-6 space-y-4">
          {employeesWithJobs.map((employee) => (
            <EmployeeAccordion
              key={employee.id}
              employee={employee}
              jobs={employee.jobs}
              open={!!openEmployees[employee.id]}
              onToggle={() => toggleEmployeeAccordion(employee.id)}
              onOpenJob={openJob}
            />
          ))}
        </div>

        {employeesVisible.length === 0 ? (
          <div className="text-center text-sm opacity-70 mt-10">
            No employees selected
          </div>
        ) : null}
      </div>

      {/* FILTER SHEET */}
      {filterOpen ? (
        <Sheet
          title="Filter employees"
          subtitle="Select who appears on the calendar"
          onClose={() => setFilterOpen(false)}
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              className="py-3 rounded-2xl bg-white/10 border border-white/20"
              onClick={selectAll}
            >
              Select all
            </button>
            <button
              className="py-3 rounded-2xl bg-white/10 border border-white/20"
              onClick={selectNone}
            >
              Select none
            </button>
          </div>

          <div className="mt-4 space-y-2">
              {employees.map((employee) => {
              const checked = empSet.has(employee.id);

              return (
                <button
                  key={employee.id}
                  onClick={() => toggleEmp(employee.id)}
                  className={`w-full px-4 py-3 rounded-2xl border flex items-center justify-between ${
                    checked
                      ? "bg-[#148dcd]/20 border-[#148dcd]/35"
                      : "bg-white/10 border-white/15"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{employee.name}</p>
                    <p className="text-xs opacity-70">
                      {employee.role} · {employee.home}
                    </p>
                  </div>

                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      checked
                        ? "bg-[#148dcd] border-[#148dcd]"
                        : "bg-transparent border-white/20"
                    }`}
                  >
                    {checked ? (
                      <BadgeCheck size={16} />
                    ) : (
                      <BadgeAlert size={16} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            className="mt-4 w-full py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
            onClick={() => setFilterOpen(false)}
          >
            Done
          </button>
        </Sheet>
      ) : null}

      {/* DATE SHEET (FAB) */}
      {dateSheetOpen ? (
        <Sheet
          title="Seleccionar fecha"
          subtitle="Cambia el día del calendario"
          onClose={() => setDateSheetOpen(false)}
        >
          <div className="mt-1 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
            <label className="text-sm opacity-80">Fecha</label>
            <input
              type="date"
              value={pendingDate}
              onChange={(e) => setPendingDate(e.target.value)}
              className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                className="py-3 rounded-2xl bg-white/10 border border-white/20"
                onClick={() => setDateSheetOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
                onClick={() => {
                  const d = parseISODateOnly(pendingDate);
                  setSelectedDate(d);
                  setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                  setDateSheetOpen(false);
                }}
              >
                Aplicar
              </button>
            </div>
          </div>
        </Sheet>
      ) : null}

      {/* UNASSIGNED SHEET */}
      {unassignedOpen ? (
        <Sheet
          title="Unassigned"
          subtitle={`Jobs without a worker · ${formatSelectedDate(
            selectedDate,
          )}`}
          onClose={() => setUnassignedOpen(false)}
        >
          {unassigned.length === 0 ? (
            <div className="text-sm opacity-80">
              No unassigned jobs for this day.
            </div>
          ) : (
            <div className="space-y-3">
              {unassigned
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.startISO).getTime() -
                    new Date(b.startISO).getTime(),
                )
                .map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl bg-white/10 border border-white/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex gap-2 flex-wrap">
                          <span
                            className={`text-[10px] px-2 py-1 rounded-full border ${priorityTone(
                              job.priority,
                            )}`}
                          >
                            {job.priority}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-1 rounded-full border ${invoiceTone(
                              job.invoiceStatus,
                            )}`}
                          >
                            {job.invoiceStatus}
                          </span>
                          <span className="text-[10px] px-2 py-1 rounded-full bg-black/20 border border-white/10">
                            #{job.id}
                          </span>
                        </div>

                        <p className="mt-2 font-semibold truncate">
                          {job.customer}
                        </p>
                        <p className="text-xs opacity-80 truncate">
                          {job.property} · {job.service}
                        </p>
                        <p className="text-xs mt-1 flex items-center gap-1 opacity-80">
                          <Clock3 size={12} /> {fmtTime(job.startISO)} -{" "}
                          {fmtTime(job.endISO)}
                        </p>
                        <p className="text-xs mt-1 flex items-center gap-1 opacity-80 truncate">
                          <MapPin size={12} /> {job.address}
                        </p>
                        <p className="text-xs mt-2 opacity-70">{job.notes}</p>
                      </div>

                      <button
                        className="px-3 py-2 rounded-xl bg-[#148dcd] border border-[#148dcd] text-sm"
                        onClick={() => openJob(job)}
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Sheet>
      ) : null}

      {/* JOB SHEET */}
      {jobSheet ? (
        <Sheet
          title={`Job #${jobSheet.id}`}
          subtitle="Dispatch & manage"
          onClose={() => setJobSheet(null)}
        >
          <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full border ${dispatchTone(
                  jobSheet.dispatchStatus,
                )}`}
              >
                {jobSheet.dispatchStatus}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full border ${invoiceTone(
                  jobSheet.invoiceStatus,
                )}`}
              >
                {jobSheet.invoiceStatus}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full border ${priorityTone(
                  jobSheet.priority,
                )}`}
              >
                {jobSheet.priority}
              </span>
            </div>

            <p className="mt-3 text-lg font-semibold">{jobSheet.customer}</p>
            <p className="text-sm opacity-80">
              {jobSheet.property} · {jobSheet.service}
            </p>
            <p className="text-sm opacity-80 mt-2 flex items-start gap-2">
              <MapPin size={16} className="mt-[2px] opacity-80" />
              {jobSheet.address}
            </p>
            <p className="text-sm opacity-80 mt-2 flex items-center gap-2">
              <Clock3 size={16} className="opacity-80" />
              {fmtTime(jobSheet.startISO)} - {fmtTime(jobSheet.endISO)}
            </p>

            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="text-xs px-3 py-1 rounded-full bg-black/20 border border-white/10">
                ${jobSheet.price}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-black/20 border border-white/10">
                Travel {jobSheet.travelMin}m
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-black/20 border border-white/10">
                Crew {jobSheet.crew}
              </span>
            </div>

            {jobSheet.notes ? (
              <p className="mt-3 text-xs opacity-75">{jobSheet.notes}</p>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <ActionBtn
              icon={<CheckCircle size={16} />}
              label="Dispatch"
              onClick={() => setJobStatus(jobSheet.id, "Dispatched")}
            />
            <ActionBtn
              icon={<Send size={16} />}
              label="Send Invoice"
              onClick={() => alert("Send invoice")}
            />
            <ActionBtn
              icon={<ArrowUp size={16} />}
              label="Move Up"
              onClick={() => moveWithinEmployee(jobSheet.id, "up")}
            />
            <ActionBtn
              icon={<ArrowDown size={16} />}
              label="Move Down"
              onClick={() => moveWithinEmployee(jobSheet.id, "down")}
            />
          </div>

          <div className="mt-4 rounded-2xl bg-white/10 border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Reassign</p>
              <span className="text-xs opacity-60">Tap a worker</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {employees.map((employee) => (
                <button
                  key={employee.id}
                  className={`px-3 py-3 rounded-2xl border text-left ${
                    jobSheet.employeeId === employee.id
                      ? "bg-[#148dcd]/25 border-[#148dcd]/35"
                      : "bg-white/10 border-white/15"
                  }`}
                  onClick={() => assignJob(jobSheet.id, employee.id)}
                >
                  <p className="text-sm font-semibold">{employee.name}</p>
                  <p className="text-xs opacity-70">{employee.role}</p>
                </button>
              ))}
            </div>

            <button
              className="mt-3 w-full py-3 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center gap-2"
              onClick={() => {
                assignJob(jobSheet.id, null);
                setJobSheet(null);
                setUnassignedOpen(true);
              }}
            >
              <ArrowRightLeft size={16} />
              Move to Unassigned
            </button>
          </div>

          <button
            className="mt-4 w-full py-3 rounded-2xl bg-white/10 border border-white/20"
            onClick={() => setJobSheet(null)}
          >
            Close
          </button>
        </Sheet>
      ) : null}

      {/* FAB ACTIONS */}
      <Fab
        open={fabOpen}
        onToggle={() => setFabOpen((v) => !v)}
        onToday={() => {
          goToday();
          setFabOpen(false);
        }}
        onSelectDate={openDateSheetFromFab}
        onUnassigned={() => {
          setUnassignedOpen(true);
          setFabOpen(false);
        }}
      />
    </div>
  );
}
