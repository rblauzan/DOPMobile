import Screen from "./Layout/Screen.js";
import Header from "./UI/Header.js";
import SearchBar from "./UI/SearchBar.jsx";
import { useMemo, useState } from "react";
import Card from "./UI/Card.jsx";
import {
  Home,
  BadgeDollarSign,
  Clock,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import Fab from "./UI/Fab.js";
import BottomSheet from "./UI/BottomSheet.js";
import IconBtn from "./UI/IconBtn.js";
import SheetTitle from "./UI/SheetTitle.js";
import Badge from "./UI/Badge.js";
import { EmptyWorkersState } from "./UI/Empty.js";
import { useTranslation } from "react-i18next";

interface ContainerProps {
  name: string;
}
const TODAY = new Date().toISOString().slice(0, 10);
const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

const seed = {
  today: TODAY,
  workers: [
    {
      id: 1,
      name: "Kaytea Moreno",
      role: "Team Lead",
      phone: "(239) 317-6096",
      email: "kaytea@dop.local",
      home: "Bonita Springs, FL",
      payRate: 22.5,
      jobs: [
        {
          id: 180044,
          status: "completed",
          client: "Beach Breeze 290",
          address: "32 1st St, Bonita Springs",
          time: "8:30am – 11:00am",
          duration: "2h 30m",
          priority: 2,
          notes: "Standard turnover, no issues reported",
          date: TODAY,
        },
        {
          id: 182514,
          status: "assigned",
          client: "Nomadic Vacation Rentals",
          address: "587 99th Ave N, Naples",
          time: "11:30am – 3:00pm",
          duration: "3h 30m",
          priority: 1,
          notes: "Guest arriving early – high priority",
          date: TODAY,
        },
        {
          id: 182900,
          status: "assigned",
          client: "Blue Diamond Beach Home",
          address: "3542 McComb Ave, Naples",
          time: "4:00pm – 6:00pm",
          duration: "2h 0m",
          priority: 3,
          notes: "Owner inspection tomorrow",
          date: TOMORROW,
        },
      ],
    },
    {
      id: 2,
      name: "Yailen Figuereido",
      role: "Cleaner Pro",
      phone: "(239) 763-3972",
      email: "yailen@dop.local",
      home: "Naples, FL",
      payRate: 18,
      jobs: [
        {
          id: 190210,
          status: "assigned",
          client: "Marco Luxe Retreat",
          address: "840 Rose Ct, Marco Island",
          time: "9:00am – 12:00pm",
          duration: "3h 0m",
          priority: 2,
          notes: "Deep clean requested",
          date: TODAY,
        },
      ],
    },
    {
      id: 3,
      name: "Yurleidys Rivero",
      role: "Cleaner Pro",
      phone: "(239) 555-1099",
      email: "yurleidys@dop.local",
      home: "Cape Coral, FL",
      payRate: 19.5,
      jobs: [],
    },    
    {
      "id": 4,
      "name": "Carlos Rodriguez",
      "role": "Cleaner",
      "phone": "(239) 456-7890",
      "email": "carlos@dop.local",
      "home": "Fort Myers, FL",
      "payRate": 17.5,
      "status": "active",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      "jobs": [
        {
          "id": 190415,
          "status": "assigned",
          "client": "Sunset Villa",
          "address": "789 Sunset Dr, Fort Myers Beach, FL 33931",
          "time": "10:00am – 1:00pm",
          "duration": "3h 0m",
          "priority": 2,
          "notes": "Pet-friendly unit. Extra vacuuming needed.",
          "date": TODAY,
          "payment": 78.75,
          "type": "standard_clean",
          "rooms": 3,
          "sqft": 1500
        }
      ]
    },
    {
      "id": 5,
      "name": "Maria Gonzalez",
      "role": "Team Lead",
      "phone": "(239) 123-4567",
      "email": "maria@dop.local",
      "home": "Estero, FL",
      "payRate": 21.0,
      "status": "on_vacation",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      "jobs": []
    },
     {
      "id": 4,
      "name": "Alfredo Perez",
      "role": "Cleaner",
      "phone": "(239) 456-7890",
      "email": "carlos@dop.local",
      "home": "Fort Myers, FL",
      "payRate": 17.5,
      "status": "active",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      "jobs": [
        {
          "id": 190415,
          "status": "assigned",
          "client": "Sunset Villa",
          "address": "789 Sunset Dr, Fort Myers Beach, FL 33931",
          "time": "10:00am – 1:00pm",
          "duration": "3h 0m",
          "priority": 2,
          "notes": "Pet-friendly unit. Extra vacuuming needed.",
          "date": "2026-02-25",
          "payment": 78.75,
          "type": "standard_clean",
          "rooms": 3,
          "sqft": 1500
        }
      ]
    },
  ],
  unassigned: [
    {
      id: 300101,
      client: "Marco Luxe Retreat",
      address: "840 Rose Ct, Marco Island",
      time: "2:00pm – 5:00pm",
      duration: "3h",
      notes: "Same-day turnover",
      date: TODAY,
    },
    {
      id: 300202,
      client: "Sea La Vie Beach House",
      address: "28124 Sunset Dr, Bonita Springs",
      time: "Anytime (flex)",
      duration: "2h 30m",
      notes: "Flexible window",
      date: TODAY,
    },
     {
      "id": 300303,
      "client": "Palm Paradise",
      "address": "456 Palm Tree Ln, Naples, FL 34109",
      "time": "9:00am – 12:00pm",
      "duration": "3h",
      "notes": "Post-construction clean. Dust control needed.",
      "date": TODAY,
      "priority": 2,
      "payment": 120.0,
      "type": "post_construction",
      "rooms": 4,
      "sqft": 2400
    },
    {
      "id": 300404,
      "client": "Island View Resort",
      "address": "789 Island Blvd, Sanibel, FL 33957",
      "time": "1:00pm – 4:00pm",
      "duration": "3h",
      "notes": "Weekly maintenance clean. Focus on common areas.",
      "date": TOMORROW,
      "priority": 2,
      "payment": 85.0,
      "type": "maintenance",
      "rooms": 5,
      "sqft": 2800
    }
  ],
};

const statusPill = {
  completed: "bg-emerald-400/20 text-emerald-100",
  assigned: "bg-white/15 text-white",
};

const ownerUser = {
  name: "Roberto Lauzan",
  role: "Owner",
  avatar: null,
};

/* =========================
   SELF TESTS (NO DEPENDENCIES)
   ========================= */

function DevSelfTests() {
  useMemo(() => {
    if (typeof window === "undefined") return true;
    if (window.__DOP_SELFTESTS_RAN__) return true;
    window.__DOP_SELFTESTS_RAN__ = true;

    // Test 1: jobsForDate
    const w = seed.workers[0];
    const todaysJobs = jobsForDate(w, seed.today);
    console.assert(
      Array.isArray(todaysJobs),
      "jobsForDate should return array",
    );
    console.assert(
      todaysJobs.length >= 1,
      "jobsForDate should find today's jobs",
    );

    // Test 2: filterEmployees
    const list = seed.workers;
    console.assert(
      filterEmployees("kay", list).length === 1,
      "filterEmployees name search failed",
    );
    console.assert(
      filterEmployees("naples", list).length >= 1,
      "filterEmployees home search failed",
    );

    return true;
  }, []);

  return null;
}

/* =========================
   HELPERS
   ========================= */

function jobsForDate(worker, date) {
  return (worker?.jobs || []).filter((j) => j.date === date);
}

function filterEmployees(query, workers) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return workers;
  return workers.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.role.toLowerCase().includes(q) ||
      w.home.toLowerCase().includes(q) ||
      w.phone.toLowerCase().includes(q) ||
      w.email.toLowerCase().includes(q),
  );
}

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [view, setView] = useState("employees"); // employees | dispatch | unassigned
  const [date, setDate] = useState(seed.today);
  const [query, setQuery] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const { t } = useTranslation("");

  // Sheets
  const [dispatchJob, setDispatchJob] = useState(null);
  const [dateSheetOpen, setDateSheetOpen] = useState(false);

  // Date sheet temp value (lets you decide whether apply is required)
  const [pendingDate, setPendingDate] = useState(date);

  // Only workers with jobs for the selected day
  const workersWithJobsForDay = useMemo(() => {
    return seed.workers.filter((w) => jobsForDate(w, date).length > 0);
  }, [date]);

  const filteredWorkers = useMemo(() => {
    return filterEmployees(query, workersWithJobsForDay);
  }, [query, workersWithJobsForDay]);

  const openDateSheet = () => {
    setPendingDate(date);
    setDateSheetOpen(true);
    setFabOpen(false);
  };

  const applyDate = () => {
    setDate(pendingDate);
    setDateSheetOpen(false);
  };

    if (filteredWorkers.length === 0) {
          return (
            <>
            <EmptyWorkersState />
            
        <Fab
          open={fabOpen}
          onToggle={() => setFabOpen((v) => !v)}
          onToday={() => {
            setDate(seed.today);
            setFabOpen(false);
          }}
          onSelectDate={openDateSheet}
          onUnassigned={() => {
            setView("unassigned");
            setFabOpen(false);
          }}
        />
        </>
          )
        }
        
  if (view === "employees") {
    return (
      <Screen>
        <Header
          title={t("Header.title")}
          subtitle={`${t("Header.subtitle")} ${date}`} onBack={undefined}        />
        <SearchBar value={query} onChange={setQuery} />
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {filteredWorkers.map((emp) => (
            <Card
              key={emp.id}
              onClick={() => {
                setSelectedWorker(emp);
                setView("dispatch");
              }}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{emp.name}</h3>
                  <p className="text-xs opacity-70">{emp.role}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge icon={<Home size={14} />} label={emp.home} />
                    <Badge
                      icon={<BadgeDollarSign size={14} />}
                      label={`$${emp.payRate.toFixed(2)}/hr`}
                    />
                    <Badge
                      icon={<Layers size={14} />}
                      label={`${jobsForDate(emp, date).length} jobs`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <IconBtn
                    icon={<Phone size={16} />}
                    onCli ck={(e) => {
                      e.stopPropagation();
                      window.open(`tel: ${emp.phone}`,'_system');
                    }}
                  />
                  <IconBtn
                    icon={<MessageCircle size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`sms: ${emp.phone}`,'_system');
                    }}
                  />
                  <IconBtn
                    icon={<Mail size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`mailto: ${emp.email}`);
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>       

        <Fab
          open={fabOpen}
          onToggle={() => setFabOpen((v) => !v)}
          onToday={() => {
            setDate(seed.today);
            setFabOpen(false);
          }}
          onSelectDate={openDateSheet}
          onUnassigned={() => {
            setView("unassigned");
            setFabOpen(false);
          }}
        />

        {dateSheetOpen && (
          <BottomSheet onClose={() => setDateSheetOpen(false)}>
            <SheetTitle
              title={t("ModalDate.title")}
              subtitle={t("ModalDate.subtitle")}
              onClose={() => setDateSheetOpen(false)}
            />

            <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
              <label className="text-sm opacity-80">{t("ModalDate.subtitlecard")}</label>
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
                  {t("ModalDate.button2")}
                </button>
                <button
                  className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
                  onClick={applyDate}
                >
                  {t("ModalDate.button1")}
                </button>
              </div>
            </div>
          </BottomSheet>
        )}

        <DevSelfTests />
      </Screen>
    );
  }

  /* =========================
       UNASSIGNED JOBS
       ========================= */

  if (view === "unassigned") {
    const unassignedForDay = seed.unassigned.filter((j) => j.date === date);

    return (
      <Screen>
        <Header
          title={t("Unassigned.title")}
          subtitle={`${t("Unassigned.subtitle")} · ${date}`}
          onBack={() => setView("employees")}
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {unassignedForDay.map((job) => (
            <Card key={job.id}>
              <h3 className="font-semibold">{job.client}</h3>
              <div className="mt-2 text-sm opacity-80 flex items-center gap-2">
                <MapPin size={14} /> {job.address}
              </div>
              <div className="mt-1 text-sm opacity-70 flex items-center gap-2">
                <Clock size={14} /> {job.time} · {job.duration}
              </div>
              <p className="mt-2 text-xs opacity-60">{job.notes}</p>

              <button
                className="mt-4 w-full py-3 rounded-xl bg-[#148dcd] shadow-lg flex items-center justify-center gap-2"
                onClick={() => setDispatchJob({ ...job, _unassigned: true })}
              >
                <Layers size={14} /> {t("Unassigned.button")}
              </button>
            </Card>
          ))}
        </div>

        {dispatchJob && (
          <BottomSheet onClose={() => setDispatchJob(null)}>
            <SheetTitle
              title={t("ModalDispatch.button")}
              subtitle={
                dispatchJob._unassigned ? t("ModalDispatch.subtitle") : t("ModalDispatch.subtitle2")
              }
              onClose={() => setDispatchJob(null)}
            />

            <div className="mt-3 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
              <p className="text-sm opacity-80">{dispatchJob.client}</p>
              <p className="mt-1 text-xs opacity-70">{dispatchJob.address}</p>
              <p className="mt-3 text-xs opacity-60">
                {t("ModalDispatch.cardsubtitle")} (demo).
              </p>

              <button
                className="mt-5 w-full py-3 rounded-xl bg-[#ff6d00] shadow-2xl font-semibold"
                onClick={() => {
                  alert("Confirm Dispatch (demo)");
                  setDispatchJob(null);
                }}
              >
                {t("ModalDispatch.button")}
              </button>
            </div>
          </BottomSheet>
        )}

        <Fab
          open={fabOpen}
          onToggle={() => setFabOpen((v) => !v)}
          onToday={() => {
            setDate(seed.today);
            setFabOpen(false);
          }}
          onSelectDate={openDateSheet}
          onUnassigned={() => {
            // already here
            setFabOpen(false);
          }}
        />

        {dateSheetOpen && (
          <BottomSheet onClose={() => setDateSheetOpen(false)}>
            <SheetTitle
              title={t("SheetTitle.title")}
              subtitle={t("SheetTitle.subtitle")}
              onClose={() => setDateSheetOpen(false)}
            />

            <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
              <label className="text-sm opacity-80">{t("SheetTitle.title2")}</label>
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
                  {t("SheetTitle.button2")}
                </button>
                <button
                  className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
                  onClick={applyDate}
                >
                  {t("SheetTitle.button1")}
                </button>
              </div>
            </div>
          </BottomSheet>
        )}
        <DevSelfTests />
      </Screen>
    );
  }

  /* =========================
     DISPATCH – WORKER VIEW
     ========================= */
  const jobsToday = jobsForDate(selectedWorker, date);

  if (view === "dispatch") {
    return (
      <Screen>
        <Header
          title={selectedWorker.name}
          subtitle={`Dispatch · ${date}`}
          onBack={() => setView("employees")}
        />

        <div className="px-4 flex gap-2 flex-wrap">
          <Badge label={selectedWorker.role} icon={undefined} />
          <Badge
            label={`$${selectedWorker.payRate.toFixed(2)}/hr`}
            icon={undefined}
          />
          <Badge label={`${jobsToday.length} jobs`} icon={undefined} />
          {reorderMode && <Badge label="Reorder ON" accent />}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {jobsToday.map((job) => (
            <Card key={job.id} onClick={undefined}>
              <div className="flex justify-between">
                <div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${statusPill[job.status]}`}
                  >
                    {job.status}
                  </span>
                  <h3 className="mt-2 font-semibold">{job.client}</h3>
                  <div className="mt-2 text-sm opacity-80 flex items-center gap-2">
                    <MapPin size={14} /> {job.address}
                  </div>
                  <div className="mt-1 text-sm opacity-70 flex items-center gap-2">
                    <Clock size={14} /> {job.time} · {job.duration}
                  </div>
                  <p className="mt-2 text-xs opacity-60">{job.notes}</p>
                </div>
                <button
                  onClick={() => setReorderMode((v) => !v)}
                  className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
                  title="Toggle reorder"
                >
                  <ArrowUpDown size={16} />
                </button>
              </div>

              {reorderMode ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    className="py-2 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-2"
                    onClick={() => alert("Move Up (demo)")}
                  >
                    <ArrowUp size={14} /> {t("Move.up")}
                  </button>
                  <button
                    className="py-2 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-2"
                    onClick={() => alert("Move Down (demo)")}
                  >
                    <ArrowDown size={14} /> {t("Move.down")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDispatchJob(job)}
                  className="mt-4 w-full py-3 rounded-xl bg-[#148dcd] shadow-lg flex items-center justify-center gap-2"
                >
                  <Layers size={14} /> {t("Unassigned.button")}
                </button>
              )}
            </Card>
          ))}
        </div>

        {dispatchJob && (
          <BottomSheet onClose={() => setDispatchJob(null)}>
            <SheetTitle
              title={t("ModalDispatch.title")}
              subtitle={
                dispatchJob._unassigned ? t("ModalDispatch.subtitle") : t("ModalDispatch.subtitle2")
              }
              onClose={() => setDispatchJob(null)}
            />

            <div className="mt-3 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
              <p className="text-sm opacity-80">{dispatchJob.client}</p>
              <p className="mt-1 text-xs opacity-70">{dispatchJob.address}</p>
              <p className="mt-4 text-xs opacity-60">
                {t("ModalDispatch.cardsubtitle2")}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  className="py-3 rounded-2xl bg-white/10 border border-white/20"
                  onClick={() => setDispatchJob(null)}
                >
                  {t("ModalDispatch.button3")}
                </button>
                <button
                  className="py-3 rounded-2xl bg-[#ff6d00] shadow-2xl font-semibold"
                  onClick={() => {
                    alert("Confirm Dispatch (demo)");
                    setDispatchJob(null);
                  }}
                >
                  {t("ModalDispatch.button2")}
                </button>
              </div>
            </div>
          </BottomSheet>
        )}

        <Fab
          open={fabOpen}
          onToggle={() => setFabOpen((v) => !v)}
          onToday={() => {
            setDate(seed.today);
            setFabOpen(false);
          }}
          onSelectDate={openDateSheet}
          onUnassigned={() => {
            setView("unassigned");
            setFabOpen(false);
          }}
        />

        {dateSheetOpen && (
          <BottomSheet onClose={() => setDateSheetOpen(false)}>
            <SheetTitle
              title="Select date"
              subtitle="Change the dispatch day"
              onClose={() => setDateSheetOpen(false)}
            />

            <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
              <label className="text-sm opacity-80">Date</label>
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
                  Cancel
                </button>
                <button
                  className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
                  onClick={applyDate}
                >
                  Apply
                </button>
              </div>
            </div>
          </BottomSheet>
        )}
        <DevSelfTests />
      </Screen>
    );
  }
};

export default ExploreContainer;
