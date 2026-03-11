// import Screen from "../Layout/Screen.js";
// import Header from "../UI/Header.js";
// import SearchBar from "../UI/SearchBar.js";
// import { useEffect, useMemo, useState } from "react";
// import Card from "../UI/Card.js";
// import {
//   Home,
//   BadgeDollarSign,
//   Clock,
//   Layers,
//   Mail,
//   MapPin,
//   MessageCircle,
//   Phone,
//   ArrowDown,
//   ArrowUp,
//   ArrowUpDown,
// } from "lucide-react";
// import Fab from "../UI/Fab.js";
// import BottomSheet from "../UI/BottomSheet.js";
// import IconBtn from "../UI/IconBtn.js";
// import SheetTitle from "../UI/SheetTitle.js";
// import Badge from "../UI/Badge.js";
// import { EmptyWorkersState, EmptySearchResults, EmptyUnassignedJobsState } from "../UI/Empty.js";
// import { useTranslation } from "react-i18next";
// import { filterEmployees, jobsForDate } from "../../helpers/helpersCalendar.js";
// import { statusPill, TODAY } from "../../constants.js";
// import { api } from "../../services/apicalendar.js";
// import type { Worker, Job } from "../../models/Seed.js";
// import { EmployeesSkeleton } from "../UI/CardSkeleton.js";

// interface ContainerProps {
//   name: string;
// }

// const ContainerCalendar: React.FC<ContainerProps> = () => {
//   const [view, setView] = useState("employees"); // employees | dispatch | unassigned
//   const [date, setDate] = useState(TODAY);
//   const [query, setQuery] = useState("");
//   const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
//   const [reorderMode, setReorderMode] = useState(false);
//   const [fabOpen, setFabOpen] = useState(false);
//   const [workers, setWorkers] = useState<Worker[]>([]);
//   const [unassignedJobs, setUnassignedJobs] = useState<Job[]>([]);
//   const [isloading, setisLoading] = useState(true);
//   const { t } = useTranslation("");

//   // Sheets
//   const [dispatchJob, setDispatchJob] = useState(null);
//   const [dateSheetOpen, setDateSheetOpen] = useState(false);

//   // Date sheet temp value (lets you decide whether apply is required)
//   const [pendingDate, setPendingDate] = useState(date);

//   // Only workers with jobs for the selected day
//   const workersWithJobsForDay = useMemo(() => {
//     return workers.filter((w) => jobsForDate(w, date).length > 0);
//   }, [workers, date]);

//   const filteredWorkers = useMemo(() => {
//     return filterEmployees(query, workersWithJobsForDay);
//   }, [query, workersWithJobsForDay]);

//   const openDateSheet = () => {
//     setPendingDate(date);
//     setDateSheetOpen(true);
//     setFabOpen(false);
//   };

//   const applyDate = () => {
//     setDate(pendingDate);
//     setDateSheetOpen(false);
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       setisLoading(true);
//       const workersResponse = await api.getWorkers();
//       setWorkers(workersResponse as Worker[]);
//       const unassignedResponse = await api.getUnassignedJobs();
//       setUnassignedJobs(unassignedResponse as Job[]);
//       setDate(TODAY);
//       setisLoading(false);
//     };
//     loadData();
//   }, []);

//   if (isloading) {
//     return <EmployeesSkeleton />;
//   }

//   if (view === "employees") {
//     // No hay trabajadores en general para este día
//     if (workersWithJobsForDay.length === 0) {
//       return (
//         <>
//           <EmptyWorkersState />
//           <Fab
//             open={fabOpen}
//             onToggle={() => setFabOpen((v) => !v)}
//             onToday={() => {
//               setDate(TODAY);
//               setFabOpen(false);
//             }}
//             onSelectDate={openDateSheet}
//             onUnassigned={() => {
//               setView("unassigned");
//               setFabOpen(false);
//             }}
//           />
//           {dateSheetOpen && (
//             <BottomSheet onClose={() => setDateSheetOpen(false)}>
//               <SheetTitle
//                 title={t("ModalDate.title")}
//                 subtitle={t("ModalDate.subtitle")}
//                 onClose={() => setDateSheetOpen(false)}
//               />

//               <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//                 <label className="text-sm opacity-80">
//                   {t("ModalDate.subtitlecard")}
//                 </label>
//                 <input
//                   type="date"
//                   value={pendingDate}
//                   onChange={(e) => setPendingDate(e.target.value)}
//                   className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
//                 />
//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                   <button
//                     className="py-3 rounded-2xl bg-white/10 border border-white/20"
//                     onClick={() => setDateSheetOpen(false)}
//                   >
//                     {t("ModalDate.button2")}
//                   </button>
//                   <button
//                     className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
//                     onClick={applyDate}
//                   >
//                     {t("ModalDate.button1")}
//                   </button>
//                 </div>
//               </div>
//             </BottomSheet>
//           )}
//         </>
//       );
//     }

//     // La búsqueda no encontró resultados (pero hay trabajadores disponibles)
//     if (query.trim() !== "" && filteredWorkers.length === 0) {
//       return (
//         <Screen>
//           <Header
//             title={t("Header.title")}
//             subtitle={`${t("Header.subtitle")} ${date}`}
//             onBack={undefined}
//           />
//           <SearchBar
//             value={query}
//             onChange={setQuery}
//             entity={t("SearchBar.employee")}
//           />
//           <div className="flex-1 overflow-y-auto px-4 py-4">
//             <EmptySearchResults />
//           </div>

//           <Fab
//             open={fabOpen}
//             onToggle={() => setFabOpen((v) => !v)}
//             onToday={() => {
//               setDate(TODAY);
//               setFabOpen(false);
//             }}
//             onSelectDate={openDateSheet}
//             onUnassigned={() => {
//               setView("unassigned");
//               setFabOpen(false);
//             }}
//           />

//           {dateSheetOpen && (
//             <BottomSheet onClose={() => setDateSheetOpen(false)}>
//               <SheetTitle
//                 title={t("ModalDate.title")}
//                 subtitle={t("ModalDate.subtitle")}
//                 onClose={() => setDateSheetOpen(false)}
//               />

//               <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//                 <label className="text-sm opacity-80">
//                   {t("ModalDate.subtitlecard")}
//                 </label>
//                 <input
//                   type="date"
//                   value={pendingDate}
//                   onChange={(e) => setPendingDate(e.target.value)}
//                   className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
//                 />
//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                   <button
//                     className="py-3 rounded-2xl bg-white/10 border border-white/20"
//                     onClick={() => setDateSheetOpen(false)}
//                   >
//                     {t("ModalDate.button2")}
//                   </button>
//                   <button
//                     className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
//                     onClick={applyDate}
//                   >
//                     {t("ModalDate.button1")}
//                   </button>
//                 </div>
//               </div>
//             </BottomSheet>
//           )}
//         </Screen>
//       );
//     }
//     return (
//       <Screen>
//         <Header
//           title={t("Header.title")}
//           subtitle={`${t("Header.subtitle")} ${date}`}
//           onBack={undefined}
//         />
//         <SearchBar
//           value={query}
//           onChange={setQuery}
//           entity={t("SearchBar.employee")}
//         />
//         <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//           {filteredWorkers.map((emp) => (
//             <Card
//               key={emp.id}
//               onClick={() => {
//                 setSelectedWorker(emp);
//                 setView("dispatch");
//               }}
//             >
//               <div className="flex justify-between gap-3">
//                 <div>
//                   <h3 className="text-lg font-semibold">{emp.name}</h3>
//                   <p className="text-xs opacity-70">{emp.role}</p>

//                   <div className="mt-2 flex flex-wrap gap-2">
//                     <Badge icon={<Home size={14} />} label={emp.home} />
//                     <Badge
//                       icon={<BadgeDollarSign size={14} />}
//                       label={`$${emp.payRate.toFixed(2)}/hr`}
//                     />
//                     <Badge
//                       icon={<Layers size={14} />}
//                       label={`${jobsForDate(emp, date).length} jobs`}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   <IconBtn
//                     icon={<Phone size={16} />}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       window.open(`tel: ${emp.phone}`, "_system");
//                     }}
//                   />
//                   <IconBtn
//                     icon={<MessageCircle size={16} />}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       window.open(`sms: ${emp.phone}`, "_system");
//                     }}
//                   />
//                   <IconBtn
//                     icon={<Mail size={16} />}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       window.open(`mailto: ${emp.email}`);
//                     }}
//                   />
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>

//         <Fab
//           open={fabOpen}
//           onToggle={() => setFabOpen((v) => !v)}
//           onToday={() => {
//             setDate(TODAY);
//             setFabOpen(false);
//           }}
//           onSelectDate={openDateSheet}
//           onUnassigned={() => {
//             setView("unassigned");
//             setFabOpen(false);
//           }}
//         />

//         {dateSheetOpen && (
//           <BottomSheet onClose={() => setDateSheetOpen(false)}>
//             <SheetTitle
//               title={t("ModalDate.title")}
//               subtitle={t("ModalDate.subtitle")}
//               onClose={() => setDateSheetOpen(false)}
//             />

//             <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//               <label className="text-sm opacity-80">
//                 {t("ModalDate.subtitlecard")}
//               </label>
//               <input
//                 type="date"
//                 value={pendingDate}
//                 onChange={(e) => setPendingDate(e.target.value)}
//                 className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
//               />
//               <div className="mt-4 grid grid-cols-2 gap-3">
//                 <button
//                   className="py-3 rounded-2xl bg-white/10 border border-white/20"
//                   onClick={() => setDateSheetOpen(false)}
//                 >
//                   {t("ModalDate.button2")}
//                 </button>
//                 <button
//                   className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
//                   onClick={applyDate}
//                 >
//                   {t("ModalDate.button1")}
//                 </button>
//               </div>
//             </div>
//           </BottomSheet>
//         )}
//       </Screen>
//     );
//   }

//   /* =========================
//        UNASSIGNED JOBS
//        ========================= */

//   if (view === "unassigned") {
//     const unassignedForDay = unassignedJobs.filter(
//       (job: Job) => job.date === date,
//     );
//     if (unassignedForDay.length === 0) {
//       return (
//         <>
//           <Header onBack={() => setView("employees")} />
//           <EmptyUnassignedJobsState />
//           <Fab
//             open={fabOpen}
//             onToggle={() => setFabOpen((v) => !v)}
//             onToday={() => {
//               setDate(TODAY);
//               setFabOpen(false);
//             }}
//             onSelectDate={openDateSheet}
//             onUnassigned={() => {
//               setView("unassigned");
//               setFabOpen(false);
//             }}
//           />
//           {dateSheetOpen && (
//             <BottomSheet onClose={() => setDateSheetOpen(false)}>
//               <SheetTitle
//                 title={t("ModalDate.title")}
//                 subtitle={t("ModalDate.subtitle")}
//                 onClose={() => setDateSheetOpen(false)}
//               />

//               <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//                 <label className="text-sm opacity-80">
//                   {t("ModalDate.subtitlecard")}
//                 </label>
//                 <input
//                   type="date"
//                   value={pendingDate}
//                   onChange={(e) => setPendingDate(e.target.value)}
//                   className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
//                 />
//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                   <button
//                     className="py-3 rounded-2xl bg-white/10 border border-white/20"
//                     onClick={() => setDateSheetOpen(false)}
//                   >
//                     {t("ModalDate.button2")}
//                   </button>
//                   <button
//                     className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
//                     onClick={applyDate}
//                   >
//                     {t("ModalDate.button1")}
//                   </button>
//                 </div>
//               </div>
//             </BottomSheet>
//           )}
//         </>
//       );
//     }

//     return (
//       <Screen>
//         <Header
//           title={t("Unassigned.title")}
//           subtitle={`${t("Unassigned.subtitle")} · ${date}`}
//           onBack={() => setView("employees")}
//         />

//         <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//           {unassignedForDay.map((job: Job) => (
//             <Card key={job.id}>
//               <h3 className="font-semibold">{job.client}</h3>
//               <div className="mt-2 text-sm opacity-80 flex items-center gap-2">
//                 <MapPin size={14} /> {job.address}
//               </div>
//               <div className="mt-1 text-sm opacity-70 flex items-center gap-2">
//                 <Clock size={14} /> {job.time} · {job.duration}
//               </div>
//               <p className="mt-2 text-xs opacity-60">{job.notes}</p>

//               <button
//                 className="mt-4 w-full py-3 rounded-xl bg-[#148dcd] shadow-lg flex items-center justify-center gap-2"
//                 onClick={() => setDispatchJob({ ...job, _unassigned: true })}
//               >
//                 <Layers size={14} /> {t("Unassigned.button")}
//               </button>
//             </Card>
//           ))}
//         </div>

//         {dispatchJob && (
//           <BottomSheet onClose={() => setDispatchJob(null)}>
//             <SheetTitle
//               title={t("ModalDispatch.button")}
//               subtitle={
//                 dispatchJob._unassigned
//                   ? t("ModalDispatch.subtitle")
//                   : t("ModalDispatch.subtitle2")
//               }
//               onClose={() => setDispatchJob(null)}
//             />

//             <div className="mt-3 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//               <p className="text-sm opacity-80">{dispatchJob.client}</p>
//               <p className="mt-1 text-xs opacity-70">{dispatchJob.address}</p>
//               <p className="mt-3 text-xs opacity-60">
//                 {t("ModalDispatch.cardsubtitle")} (demo).
//               </p>

//               <button
//                 className="mt-5 w-full py-3 rounded-xl bg-[#ff6d00] shadow-2xl font-semibold"
//                 onClick={() => {
//                   alert("Confirm Dispatch (demo)");
//                   setDispatchJob(null);
//                 }}
//               >
//                 {t("ModalDispatch.button")}
//               </button>
//             </div>
//           </BottomSheet>
//         )}

//         <Fab
//           open={fabOpen}
//           onToggle={() => setFabOpen((v) => !v)}
//           onToday={() => {
//             setDate(TODAY);
//             setFabOpen(false);
//           }}
//           onSelectDate={openDateSheet}
//           onUnassigned={() => {
//             // already here
//             setFabOpen(false);
//           }}
//         />

//         {dateSheetOpen && (
//           <BottomSheet onClose={() => setDateSheetOpen(false)}>
//             <SheetTitle
//               title={t("SheetTitle.title")}
//               subtitle={t("SheetTitle.subtitle")}
//               onClose={() => setDateSheetOpen(false)}
//             />

//             <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//               <label className="text-sm opacity-80">
//                 {t("SheetTitle.title2")}
//               </label>
//               <input
//                 type="date"
//                 value={pendingDate}
//                 onChange={(e) => setPendingDate(e.target.value)}
//                 className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
//               />
//               <div className="mt-4 grid grid-cols-2 gap-3">
//                 <button
//                   className="py-3 rounded-2xl bg-white/10 border border-white/20"
//                   onClick={() => setDateSheetOpen(false)}
//                 >
//                   {t("SheetTitle.button2")}
//                 </button>
//                 <button
//                   className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
//                   onClick={applyDate}
//                 >
//                   {t("SheetTitle.button1")}
//                 </button>
//               </div>
//             </div>
//           </BottomSheet>
//         )}
//       </Screen>
//     );
//   }

//   /* =========================
//      DISPATCH – WORKER VIEW
//      ========================= */

//   if (view === "dispatch") {
//     if (!selectedWorker) {
//       return (
//         <Screen>
//           <Header
//             title="Error"
//             subtitle="No worker selected"
//             onBack={() => setView("employees")}
//           />
//         </Screen>
//       );
//     }

//     const jobsToday = jobsForDate(selectedWorker, date);

//     return (
//       <Screen>
//         <Header
//           title={selectedWorker.name}
//           subtitle={`Dispatch · ${date}`}
//           onBack={() => setView("employees")}
//         />

//         <div className="px-4 flex gap-2 flex-wrap">
//           <Badge label={selectedWorker.role} icon={undefined} />
//           <Badge
//             label={`$${selectedWorker.payRate.toFixed(2)}/hr`}
//             icon={undefined}
//           />
//           <Badge label={`${jobsToday.length} jobs`} icon={undefined} />
//           {reorderMode && <Badge label="Reorder ON" accent />}
//         </div>

//         <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//           {jobsToday.map((job) => (
//             <Card key={job.id} onClick={undefined}>
//               <div className="flex justify-between">
//                 <div>
//                   <span
//                     className={`text-xs px-3 py-1 rounded-full ${statusPill[job.status]}`}
//                   >
//                     {job.status}
//                   </span>
//                   <h3 className="mt-2 font-semibold">{job.client}</h3>
//                   <div className="mt-2 text-sm opacity-80 flex items-center gap-2">
//                     <MapPin size={14} /> {job.address}
//                   </div>
//                   <div className="mt-1 text-sm opacity-70 flex items-center gap-2">
//                     <Clock size={14} /> {job.time} · {job.duration}
//                   </div>
//                   <p className="mt-2 text-xs opacity-60">{job.notes}</p>
//                 </div>
//                 <button
//                   onClick={() => setReorderMode((v) => !v)}
//                   className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
//                   title="Toggle reorder"
//                 >
//                   <ArrowUpDown size={16} />
//                 </button>
//               </div>

//               {reorderMode ? (
//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                   <button
//                     className="py-2 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-2"
//                     onClick={() => alert("Move Up (demo)")}
//                   >
//                     <ArrowUp size={14} /> {t("Move.up")}
//                   </button>
//                   <button
//                     className="py-2 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-2"
//                     onClick={() => alert("Move Down (demo)")}
//                   >
//                     <ArrowDown size={14} /> {t("Move.down")}
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setDispatchJob(job)}
//                   className="mt-4 w-full py-3 rounded-xl bg-[#148dcd] shadow-lg flex items-center justify-center gap-2"
//                 >
//                   <Layers size={14} /> {t("Unassigned.button")}
//                 </button>
//               )}
//             </Card>
//           ))}
//         </div>

//         {dispatchJob && (
//           <BottomSheet onClose={() => setDispatchJob(null)}>
//             <SheetTitle
//               title={t("ModalDispatch.title")}
//               subtitle={
//                 dispatchJob._unassigned
//                   ? t("ModalDispatch.subtitle")
//                   : t("ModalDispatch.subtitle2")
//               }
//               onClose={() => setDispatchJob(null)}
//             />

//             <div className="mt-3 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//               <p className="text-sm opacity-80">{dispatchJob.client}</p>
//               <p className="mt-1 text-xs opacity-70">{dispatchJob.address}</p>
//               <p className="mt-4 text-xs opacity-60">
//                 {t("ModalDispatch.cardsubtitle2")}
//               </p>

//               <div className="mt-4 grid grid-cols-2 gap-3">
//                 <button
//                   className="py-3 rounded-2xl bg-white/10 border border-white/20"
//                   onClick={() => setDispatchJob(null)}
//                 >
//                   {t("ModalDispatch.button3")}
//                 </button>
//                 <button
//                   className="py-3 rounded-2xl bg-[#ff6d00] shadow-2xl font-semibold"
//                   onClick={() => {
//                     alert("Confirm Dispatch (demo)");
//                     setDispatchJob(null);
//                   }}
//                 >
//                   {t("ModalDispatch.button2")}
//                 </button>
//               </div>
//             </div>
//           </BottomSheet>
//         )}

//         <Fab
//           open={fabOpen}
//           onToggle={() => setFabOpen((v) => !v)}
//           onToday={() => {
//             setDate(TODAY);
//             setFabOpen(false);
//           }}
//           onSelectDate={openDateSheet}
//           onUnassigned={() => {
//             setView("unassigned");
//             setFabOpen(false);
//           }}
//         />

//         {dateSheetOpen && (
//           <BottomSheet onClose={() => setDateSheetOpen(false)}>
//             <SheetTitle
//               title="Select date"
//               subtitle="Change the dispatch day"
//               onClose={() => setDateSheetOpen(false)}
//             />

//             <div className="mt-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4">
//               <label className="text-sm opacity-80">Date</label>
//               <input
//                 type="date"
//                 value={pendingDate}
//                 onChange={(e) => setPendingDate(e.target.value)}
//                 className="mt-2 w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 outline-none"
//               />
//               <div className="mt-4 grid grid-cols-2 gap-3">
//                 <button
//                   className="py-3 rounded-2xl bg-white/10 border border-white/20"
//                   onClick={() => setDateSheetOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold"
//                   onClick={applyDate}
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </BottomSheet>
//         )}
//       </Screen>
//     );
//   }
// };

// export default ContainerCalendar;
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Settings,
  Users,
  Filter,
  ListTodo,
  Plus,
  Clock,
  MapPin,
  DollarSign,
  BadgeCheck,
  BadgeAlert,
  CheckCircle,
  ArrowRightLeft,
  ArrowUp,
  ArrowDown,
  Send,
  Eye,
  Image as ImageIcon,
  CheckSquare,
  X,
} from "lucide-react";

/**
 * ============================================================
 * DOP Owner – Daily Calendar (PRO Dispatch v3)
 * ============================================================
 * Designed for home-service businesses (cleaning, HVAC, maintenance, etc.)
 * “Delivery-like” operations: routes, load, dispatch, unassigned, and fast reassignment.
 *
 * What’s included:
 *  ✅ Daily timeline with hour rail + now line
 *  ✅ Multi-employee stacked lanes (mobile-pro pattern)
 *  ✅ Employee multi-select filter (mark/unmark + select all/none)
 *  ✅ Unassigned tray (assign + dispatch)
 *  ✅ Job cards: dispatch status + invoice status + priority + address + time window
 *  ✅ Owner actions:
 *      - Dispatch
 *      - Send invoice
 *      - Reassign
 *      - Move Up/Down (reorder within employee for the day)
 *  ✅ “Ops signals” per employee:
 *      - Jobs count
 *      - Scheduled hours
 *      - Gaps indicator
 *
 * Notes:
 *  • No overlap per employee is assumed (your web scheduler enforces conflicts).
 *  • Reorder here is UI demo; in production call your scheduler endpoint.
 * ============================================================
 */

/* ============================
   CONFIG
   ============================ */

const START_HOUR = 6;
const END_HOUR = 20;
const PX_PER_MIN = 0.9; // compact
const RAIL_STEP_HOURS = 2;

/* ============================
   MOCK DATA
   ============================ */

const EMPLOYEES = [
  { id: 1, name: "Amarelis", role: "Cleaner Pro", home: "Bonita Springs" },
  { id: 2, name: "Danisley", role: "Cleaner Pro", home: "Naples" },
  { id: 3, name: "Emilio", role: "Lead Tech", home: "Cape Coral" },
  { id: 4, name: "Yadira", role: "Cleaner Pro", home: "Naples" },
];

// employeeId null => unassigned
const INITIAL_JOBS = [
  // Amarelis
  {
    id: 1001,
    day: "2026-03-02",
    employeeId: 1,
    customer: "Nomadic Vacation Rentals",
    property: "Beach Breeze 290",
    service: "Turnover Cleaning",
    address: "32 1st St, Bonita Springs",
    startISO: "2026-03-02T09:00:00",
    endISO: "2026-03-02T11:30:00",
    price: 260,
    priority: "High",
    travelMin: 18,
    crew: 2,
    dispatchStatus: "Assigned", // Assigned | Dispatched | In Progress | Completed | Unassigned
    invoiceStatus: "Unsent", // Unsent | Sent | Unpaid | Paid
    photos: 6,
    checklistDone: false,
    notes: "Future arrival 2pm. Focus bathrooms & linens.",
  },
  {
    id: 1002,
    day: "2026-03-02",
    employeeId: 1,
    customer: "Lisa Burns",
    property: "Private Home",
    service: "Deep Cleaning",
    address: "150 Mango St, Fort Myers",
    startISO: "2026-03-02T12:30:00",
    endISO: "2026-03-02T15:30:00",
    price: 340,
    priority: "Normal",
    travelMin: 22,
    crew: 2,
    dispatchStatus: "In Progress",
    invoiceStatus: "Unpaid",
    photos: 10,
    checklistDone: false,
    notes: "Customer requested fridge + oven.",
  },
  {
    id: 1003,
    day: "2026-03-02",
    employeeId: 1,
    customer: "Gulfside Realty",
    property: "Listing Prep",
    service: "Quick Refresh",
    address: "910 5th Ave S, Naples",
    startISO: "2026-03-02T16:00:00",
    endISO: "2026-03-02T17:30:00",
    price: 180,
    priority: "Normal",
    travelMin: 14,
    crew: 1,
    dispatchStatus: "Dispatched",
    invoiceStatus: "Sent",
    photos: 0,
    checklistDone: false,
    notes: "Focus floors + kitchen surfaces.",
  },

  // Danisley
  {
    id: 2001,
    day: "2026-03-02",
    employeeId: 2,
    customer: "LuxStays Vacations",
    property: "Marco Luxe Retreat",
    service: "Turnover Cleaning",
    address: "840 Rose Ct, Marco Island",
    startISO: "2026-03-02T10:00:00",
    endISO: "2026-03-02T13:00:00",
    price: 280,
    priority: "High",
    travelMin: 35,
    crew: 2,
    dispatchStatus: "Assigned",
    invoiceStatus: "Unsent",
    photos: 0,
    checklistDone: false,
    notes: "Owner inspection tomorrow.",
  },
  {
    id: 2002,
    day: "2026-03-02",
    employeeId: 2,
    customer: "Sea La Vie",
    property: "Beach House",
    service: "Laundry + Restock",
    address: "28124 Sunset Dr, Bonita Springs",
    startISO: "2026-03-02T14:00:00",
    endISO: "2026-03-02T16:00:00",
    price: 140,
    priority: "Normal",
    travelMin: 26,
    crew: 1,
    dispatchStatus: "Assigned",
    invoiceStatus: "Unsent",
    photos: 0,
    checklistDone: false,
    notes: "Restock coffee & toiletries.",
  },

  // Emilio
  {
    id: 3005,
    day: "2026-03-02",
    employeeId: 3,
    customer: "Collier Maintenance",
    property: "Condo 12B",
    service: "Minor Repairs",
    address: "4000 Gulf Shore Blvd N, Naples",
    startISO: "2026-03-02T09:30:00",
    endISO: "2026-03-02T11:00:00",
    price: 120,
    priority: "Normal",
    travelMin: 18,
    crew: 1,
    dispatchStatus: "Completed",
    invoiceStatus: "Paid",
    photos: 4,
    checklistDone: true,
    notes: "Door latch + faucet leak.",
  },
  {
    id: 3006,
    day: "2026-03-02",
    employeeId: 3,
    customer: "Sunrise Paradise",
    property: "Waterfront",
    service: "Inspection",
    address: "5015 Skyline Blvd, Cape Coral",
    startISO: "2026-03-02T12:00:00",
    endISO: "2026-03-02T13:30:00",
    price: 95,
    priority: "Normal",
    travelMin: 40,
    crew: 1,
    dispatchStatus: "Assigned",
    invoiceStatus: "Unsent",
    photos: 0,
    checklistDone: false,
    notes: "Photo report required.",
  },

  // Yadira
  {
    id: 4001,
    day: "2026-03-02",
    employeeId: 4,
    customer: "Maya Rivera",
    property: "Apartment",
    service: "Standard Cleaning",
    address: "1100 Pine Ridge Rd, Naples",
    startISO: "2026-03-02T10:30:00",
    endISO: "2026-03-02T12:30:00",
    price: 160,
    priority: "Normal",
    travelMin: 12,
    crew: 1,
    dispatchStatus: "Assigned",
    invoiceStatus: "Unsent",
    photos: 0,
    checklistDone: false,
    notes: "Pets in home (cat).",
  },
  {
    id: 4002,
    day: "2026-03-02",
    employeeId: 4,
    customer: "Rita's Transport",
    property: "Office",
    service: "Commercial Cleaning",
    address: "123 Main St, Bonita Springs",
    startISO: "2026-03-02T15:00:00",
    endISO: "2026-03-02T17:00:00",
    price: 210,
    priority: "High",
    travelMin: 28,
    crew: 2,
    dispatchStatus: "Assigned",
    invoiceStatus: "Unsent",
    photos: 0,
    checklistDone: false,
    notes: "High traffic areas + bathrooms.",
  },

  // Unassigned
  {
    id: 9001,
    day: "2026-03-02",
    employeeId: null,
    customer: "Blue Horizon PM",
    property: "Blue Wave",
    service: "Move-Out Cleaning",
    address: "600 100th Ave N, Naples",
    startISO: "2026-03-02T14:00:00",
    endISO: "2026-03-02T17:00:00",
    price: 420,
    priority: "High",
    travelMin: 0,
    crew: 3,
    dispatchStatus: "Unassigned",
    invoiceStatus: "Unsent",
    photos: 0,
    checklistDone: false,
    notes: "Same-day listing photos at 6pm.",
  },
  {
    id: 9002,
    day: "2026-03-02",
    employeeId: null,
    customer: "Sports Ranch",
    property: "Luxe Estate",
    service: "Emergency Touch-up",
    address: "1385 23rd St SW, Naples",
    startISO: "2026-03-02T11:30:00",
    endISO: "2026-03-02T12:30:00",
    price: 110,
    priority: "High",
    travelMin: 0,
    crew: 1,
    dispatchStatus: "Unassigned",
    invoiceStatus: "Unsent",
    photos: 0,
    checklistDone: false,
    notes: "Guest early check-in. Focus bathrooms.",
  },
];

/* ============================
   HELPERS
   ============================ */

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function parseISODateOnly(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

function addDaysISO(dateStr: string, delta: number) {
  const d = parseISODateOnly(dateStr);
  d.setDate(d.getDate() + delta);
  return isoDate(d);
}

function fmtDayTitle(dateStr: string) {
  const d = parseISODateOnly(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "2-digit" });
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function minutesFromStart(iso: string) {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes() - START_HOUR * 60;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function diffMinutes(aISO: string, bISO: string) {
  return (new Date(bISO).getTime() - new Date(aISO).getTime()) / 60000;
}

function dispatchTone(status: string) {
  const s = String(status || "").toLowerCase();
  if (s.includes("unassigned")) return "bg-rose-500/20 border-rose-400/30 text-rose-200";
  if (s.includes("progress")) return "bg-amber-500/20 border-amber-400/30 text-amber-200";
  if (s.includes("dispatched")) return "bg-sky-500/20 border-sky-400/30 text-sky-200";
  if (s.includes("assigned")) return "bg-white/10 border-white/15 text-white";
  if (s.includes("completed")) return "bg-emerald-500/20 border-emerald-400/30 text-emerald-200";
  return "bg-white/10 border-white/15 text-white";
}

function invoiceTone(status: string) {
  const s = String(status || "").toLowerCase();
  if (s.includes("paid")) return "bg-emerald-500/20 border-emerald-400/30 text-emerald-200";
  if (s.includes("unpaid")) return "bg-rose-500/20 border-rose-400/30 text-rose-200";
  if (s.includes("unsent")) return "bg-rose-500/20 border-rose-400/30 text-rose-200";
  if (s.includes("sent")) return "bg-sky-500/20 border-sky-400/30 text-sky-200";
  return "bg-white/10 border-white/15 text-white";
}

function priorityTone(p: string) {
  const s = String(p || "").toLowerCase();
  if (s.includes("high")) return "bg-orange-500/20 border-orange-400/30 text-orange-200";
  return "bg-white/10 border-white/15 text-white";
}

function hoursScheduled(jobs: any[]) {
  const mins = jobs.reduce((s, j) => s + Math.max(0, diffMinutes(j.startISO, j.endISO)), 0);
  return mins / 60;
}

function countGaps(jobs: any[]) {
  if (jobs.length <= 1) return 0;
  const sorted = jobs.slice().sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
  let gaps = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = diffMinutes(sorted[i - 1].endISO, sorted[i].startISO);
    if (gap >= 30) gaps++; // gap >= 30 min considered a gap
  }
  return gaps;
}

/* ============================
   MAIN
   ============================ */

export default function DOPOwnerDailyCalendarProV3() {
  const [day, setDay] = useState("2026-03-02");
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  // employee filter
  const [empSet, setEmpSet] = useState<Set<number>>(() => new Set(EMPLOYEES.map((e) => e.id)));
  const [filterOpen, setFilterOpen] = useState(false);

  // sheets
  const [unassignedOpen, setUnassignedOpen] = useState(false);
  const [jobSheet, setJobSheet] = useState<any>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const jobsForDay = useMemo(() => jobs.filter((j) => j.day === day), [jobs, day]);

  const employeesVisible = useMemo(() => EMPLOYEES.filter((e) => empSet.has(e.id)), [empSet]);

  const unassigned = useMemo(() => jobsForDay.filter((j) => j.employeeId == null), [jobsForDay]);

  const dayHeight = useMemo(() => (END_HOUR - START_HOUR) * 60 * PX_PER_MIN, []);

  // auto scroll to first visible job
  useEffect(() => {
    if (!scrollRef.current) return;

    const visibleEmpIds = empSet;
    const first = jobsForDay
      .filter((j) => j.employeeId != null && visibleEmpIds.has(j.employeeId))
      .slice()
      .sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime())[0];

    if (!first) {
      scrollRef.current.scrollTop = 0;
      return;
    }

    const top = minutesFromStart(first.startISO) * PX_PER_MIN;
    scrollRef.current.scrollTop = Math.max(top - 160, 0);
  }, [day, jobsForDay, empSet]);

  // Actions (wire to API)
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
    setEmpSet(new Set(EMPLOYEES.map((e) => e.id)));
  }

  function selectNone() {
    setEmpSet(new Set([EMPLOYEES[0].id]));
  }

  function openJob(job: any) {
    setJobSheet(job);
  }

  function setJobStatus(jobId: number, next: string) {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, dispatchStatus: next } : j)));
  }

  function assignJob(jobId: number, employeeId: number | null) {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, employeeId, dispatchStatus: employeeId == null ? "Unassigned" : "Assigned" } : j)));
  }

  function moveWithinEmployee(jobId: number, direction: "up" | "down") {
    // UI demo only: swap time windows with neighbor job in same employee.
    // Production: call your scheduler endpoint to re-run conflict logic.
    setJobs((prev) => {
      const copy = prev.map((x) => ({ ...x }));
      const job = copy.find((j) => j.id === jobId);
      if (!job || job.employeeId == null) return prev;

      const lane = copy
        .filter((j) => j.day === day && j.employeeId === job.employeeId)
        .sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());

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

  const todayISO = isoDate(new Date());

  return (
    <div className="h-screen bg-gradient-to-br from-[#041b4d] to-[#062874] text-white flex flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-[#062874]/85 backdrop-blur-2xl border-b border-white/10">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs opacity-70">Calendar · Daily Dispatch</p>
              <h1 className="text-xl font-semibold">{fmtDayTitle(day)}</h1>
            </div>

            <div className="flex items-center gap-2">
              <IconBtn title="Refresh" onClick={() => alert("Refresh (call API)")}>
                <RefreshCw size={18} />
              </IconBtn>
              <IconBtn title="Employees filter" onClick={() => setFilterOpen(true)}>
                <Users size={18} />
              </IconBtn>
              <IconBtn title="Unassigned" onClick={() => setUnassignedOpen(true)}>
                <ListTodo size={18} />
              </IconBtn>
              <IconBtn title="Settings" onClick={() => alert("Settings") }>
                <Settings size={18} />
              </IconBtn>
            </div>
          </div>

          {/* Date controls */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconBtn title="Prev" onClick={() => setDay((d) => addDaysISO(d, -1))}>
                <ChevronLeft size={18} />
              </IconBtn>
              <IconBtn title="Next" onClick={() => setDay((d) => addDaysISO(d, 1))}>
                <ChevronRight size={18} />
              </IconBtn>
              <button
                onClick={() => setDay(todayISO)}
                className="px-4 h-11 rounded-2xl bg-white/10 border border-white/15 text-sm inline-flex items-center gap-2"
              >
                <CalendarDays size={16} /> Today
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/15 inline-flex items-center gap-2">
                <Filter size={14} /> {employeesVisible.length} workers
              </span>
              <span className={`text-xs px-3 py-1 rounded-full border ${unassigned.length ? "bg-orange-500/25 border-orange-400/30" : "bg-white/10 border-white/15"}`}>
                Unassigned: {unassigned.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-8">
        {employeesVisible.map((emp) => {
          const laneJobs = jobsForDay
            .filter((j) => j.employeeId === emp.id)
            .slice()
            .sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());

          const laneHeight = clamp(dayHeight, 520, 860);
          const hrs = hoursScheduled(laneJobs);
          const gaps = countGaps(laneJobs);

          return (
            <section key={emp.id} className="space-y-3">
              {/* Employee header */}
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs opacity-70">{emp.role} · {emp.home}</p>
                  <h2 className="text-sm font-semibold uppercase tracking-wide truncate">{emp.name}</h2>
                </div>

                <div className="flex items-center gap-2 text-xs opacity-70">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">{laneJobs.length} jobs</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">{hrs.toFixed(1)}h</span>
                  <span className={`px-3 py-1 rounded-full border ${gaps ? "bg-amber-500/15 border-amber-400/25" : "bg-white/10 border-white/15"}`}>Gaps {gaps}</span>
                </div>
              </div>

              {/* Lane */}
              <div className="rounded-2xl bg-white/8 border border-white/15 overflow-hidden">
                <div className="relative flex">
                  {/* Time rail */}
                  <div className="w-14 shrink-0 border-r border-white/10 bg-white/5">
                    <div className="relative" style={{ height: laneHeight }}>
                      {Array.from({ length: Math.floor((END_HOUR - START_HOUR) / RAIL_STEP_HOURS) + 1 }).map((_, i) => {
                        const hour = START_HOUR + i * RAIL_STEP_HOURS;
                        if (hour > END_HOUR) return null;
                        const top = (hour - START_HOUR) * 60 * PX_PER_MIN;
                        const label = new Date(`${day}T${String(hour).padStart(2, "0")}:00:00`).toLocaleTimeString([], { hour: "numeric" });
                        return (
                          <div key={hour} className="absolute left-0 w-full" style={{ top }}>
                            <div className="px-2 py-2 text-[10px] opacity-60">{label}</div>
                            <div className="h-px bg-white/10" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 relative">
                    <div
                      className="relative"
                      style={{
                        height: laneHeight,
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 1px, transparent 1px, transparent 46px)",
                      }}
                    >
                      {/* Now line */}
                      {todayISO === day && (() => {
                        const now = new Date();
                        const mins = now.getHours() * 60 + now.getMinutes();
                        const top = (mins - START_HOUR * 60) * PX_PER_MIN;
                        if (top < 0 || top > laneHeight) return null;
                        return (
                          <div className="absolute left-0 right-0" style={{ top }}>
                            <div className="border-t-2 border-red-500" />
                          </div>
                        );
                      })()}

                      {laneJobs.map((job) => {
                        const startM = minutesFromStart(job.startISO);
                        const endM = minutesFromStart(job.endISO);
                        const top = clamp(startM * PX_PER_MIN, 0, laneHeight - 70);
                        const height = clamp((endM - startM) * PX_PER_MIN, 96, laneHeight);
                        const compact = height < 132;

                        return (
                          <div
                            key={job.id}
                            className="absolute left-3 right-3 rounded-xl bg-[#148dcd] border border-[#148dcd] shadow-xl p-3 cursor-pointer"
                            style={{ top, height }}
                            onClick={() => openJob(job)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex gap-2 flex-wrap">
                                  <span className={`text-[10px] px-2 py-1 rounded-full border ${dispatchTone(job.dispatchStatus)}`}>{job.dispatchStatus}</span>
                                  <span className={`text-[10px] px-2 py-1 rounded-full border ${invoiceTone(job.invoiceStatus)}`}>{job.invoiceStatus}</span>
                                  <span className={`text-[10px] px-2 py-1 rounded-full border ${priorityTone(job.priority)}`}>{job.priority}</span>
                                  <span className="text-[10px] px-2 py-1 rounded-full bg-black/20 border border-white/10">#{job.id}</span>
                                </div>

                                <p className="mt-2 text-sm font-semibold truncate">{job.customer}</p>
                                {!compact && <p className="text-[11px] opacity-85 truncate">{job.property} · {job.service}</p>}
                                <p className="text-[11px] mt-1 flex items-center gap-1 opacity-85">
                                  <Clock size={11} /> {fmtTime(job.startISO)} – {fmtTime(job.endISO)}
                                </p>
                                {!compact && <p className="text-[11px] mt-1 flex items-center gap-1 opacity-80 truncate"><MapPin size={11} /> {job.address}</p>}

                                <div className="mt-2 flex gap-2 flex-wrap">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 border border-white/10 inline-flex items-center gap-1"><DollarSign size={12} /> {job.price}</span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 border border-white/10">Travel {job.travelMin}m</span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 border border-white/10">Crew {job.crew}</span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 shrink-0">
                                <MiniBtn title="Open" onClick={(e) => { e.stopPropagation(); openJob(job); }}>
                                  <Eye size={14} />
                                </MiniBtn>
                                <MiniBtn title="Photos" onClick={(e) => { e.stopPropagation(); alert(`Photos for #${job.id}`); }}>
                                  <ImageIcon size={14} />
                                </MiniBtn>
                                {String(job.dispatchStatus).toLowerCase() === "completed" && (
                                  <MiniBtn title="Checklist" onClick={(e) => { e.stopPropagation(); alert(`Checklist for #${job.id}`); }}>
                                    <CheckSquare size={14} />
                                  </MiniBtn>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {laneJobs.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-xs opacity-60">No jobs</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {employeesVisible.length === 0 && (
          <div className="text-center text-sm opacity-70 mt-10">No employees selected</div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => alert("New job / event (open wizard)")}
          className="w-14 h-14 rounded-full bg-[#ff6d00] shadow-2xl flex items-center justify-center"
          aria-label="New"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* EMPLOYEE FILTER SHEET */}
      {filterOpen && (
        <Sheet title="Filter employees" subtitle="Select who appears on the calendar" onClose={() => setFilterOpen(false)}>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 rounded-2xl bg-white/10 border border-white/20" onClick={selectAll}>
              Select all
            </button>
            <button className="py-3 rounded-2xl bg-white/10 border border-white/20" onClick={selectNone}>
              Select none
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {EMPLOYEES.map((e) => {
              const checked = empSet.has(e.id);
              return (
                <button
                  key={e.id}
                  onClick={() => toggleEmp(e.id)}
                  className={`w-full px-4 py-3 rounded-2xl border flex items-center justify-between ${
                    checked ? "bg-[#148dcd]/20 border-[#148dcd]/35" : "bg-white/10 border-white/15"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{e.name}</p>
                    <p className="text-xs opacity-70">{e.role} · {e.home}</p>
                  </div>
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${checked ? "bg-[#148dcd] border-[#148dcd]" : "bg-transparent border-white/20"}`}>
                    {checked ? <BadgeCheck size={16} /> : <BadgeAlert size={16} />}
                  </span>
                </button>
              );
            })}
          </div>

          <button className="mt-4 w-full py-3 rounded-2xl bg-[#148dcd] shadow-lg font-semibold" onClick={() => setFilterOpen(false)}>
            Done
          </button>
        </Sheet>
      )}

      {/* UNASSIGNED SHEET */}
      {unassignedOpen && (
        <Sheet title="Unassigned" subtitle={`Jobs without a worker · ${fmtDayTitle(day)}`} onClose={() => setUnassignedOpen(false)}>
          {unassigned.length === 0 ? (
            <div className="text-sm opacity-80">No unassigned jobs for this day.</div>
          ) : (
            <div className="space-y-3">
              {unassigned
                .slice()
                .sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime())
                .map((job) => (
                  <div key={job.id} className="rounded-2xl bg-white/10 border border-white/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-[10px] px-2 py-1 rounded-full border ${priorityTone(job.priority)}`}>{job.priority}</span>
                          <span className={`text-[10px] px-2 py-1 rounded-full border ${invoiceTone(job.invoiceStatus)}`}>{job.invoiceStatus}</span>
                          <span className="text-[10px] px-2 py-1 rounded-full bg-black/20 border border-white/10">#{job.id}</span>
                        </div>
                        <p className="mt-2 font-semibold truncate">{job.customer}</p>
                        <p className="text-xs opacity-80 truncate">{job.property} · {job.service}</p>
                        <p className="text-xs mt-1 flex items-center gap-1 opacity-80"><Clock size={12} /> {fmtTime(job.startISO)} – {fmtTime(job.endISO)}</p>
                        <p className="text-xs mt-1 flex items-center gap-1 opacity-80 truncate"><MapPin size={12} /> {job.address}</p>
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
      )}

      {/* JOB SHEET */}
      {jobSheet && (
        <Sheet title={`Job #${jobSheet.id}`} subtitle="Dispatch & manage" onClose={() => setJobSheet(null)}>
          <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-3 py-1 rounded-full border ${dispatchTone(jobSheet.dispatchStatus)}`}>{jobSheet.dispatchStatus}</span>
              <span className={`text-xs px-3 py-1 rounded-full border ${invoiceTone(jobSheet.invoiceStatus)}`}>{jobSheet.invoiceStatus}</span>
              <span className={`text-xs px-3 py-1 rounded-full border ${priorityTone(jobSheet.priority)}`}>{jobSheet.priority}</span>
            </div>

            <p className="mt-3 text-lg font-semibold">{jobSheet.customer}</p>
            <p className="text-sm opacity-80">{jobSheet.property} · {jobSheet.service}</p>
            <p className="text-sm opacity-80 mt-2 flex items-start gap-2"><MapPin size={16} className="mt-[2px] opacity-80" />{jobSheet.address}</p>
            <p className="text-sm opacity-80 mt-2 flex items-center gap-2"><Clock size={16} className="opacity-80" />{fmtTime(jobSheet.startISO)} – {fmtTime(jobSheet.endISO)}</p>

            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="text-xs px-3 py-1 rounded-full bg-black/20 border border-white/10 inline-flex items-center gap-2"><DollarSign size={14} />{jobSheet.price}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-black/20 border border-white/10">Travel {jobSheet.travelMin}m</span>
              <span className="text-xs px-3 py-1 rounded-full bg-black/20 border border-white/10">Crew {jobSheet.crew}</span>
            </div>

            {jobSheet.notes && <p className="mt-3 text-xs opacity-75">{jobSheet.notes}</p>}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <ActionBtn icon={<CheckCircle size={16} />} label="Dispatch" onClick={() => setJobStatus(jobSheet.id, "Dispatched")} />
            <ActionBtn icon={<Send size={16} />} label="Send Invoice" onClick={() => alert("Send invoice") } />
            <ActionBtn icon={<ArrowUp size={16} />} label="Move Up" onClick={() => moveWithinEmployee(jobSheet.id, "up")} />
            <ActionBtn icon={<ArrowDown size={16} />} label="Move Down" onClick={() => moveWithinEmployee(jobSheet.id, "down")} />
          </div>

          <div className="mt-4 rounded-2xl bg-white/10 border border-white/20 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Reassign</p>
              <span className="text-xs opacity-60">Tap a worker</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {EMPLOYEES.map((e) => (
                <button
                  key={e.id}
                  className={`px-3 py-3 rounded-2xl border text-left ${jobSheet.employeeId === e.id ? "bg-[#148dcd]/25 border-[#148dcd]/35" : "bg-white/10 border-white/15"}`}
                  onClick={() => {
                    assignJob(jobSheet.id, e.id);
                    setJobSheet((p: any) => (p ? { ...p, employeeId: e.id } : p));
                  }}
                >
                  <p className="text-sm font-semibold">{e.name}</p>
                  <p className="text-xs opacity-70">{e.role}</p>
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
              <ArrowRightLeft size={16} /> Move to Unassigned
            </button>
          </div>

          <button className="mt-4 w-full py-3 rounded-2xl bg-white/10 border border-white/20" onClick={() => setJobSheet(null)}>
            Close
          </button>
        </Sheet>
      )}

      <DevSelfTests />
    </div>
  );
}

/* ============================
   UI PRIMITIVES
   ============================ */

function IconBtn({ children, onClick, title }: any) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
    >
      {children}
    </button>
  );
}

function MiniBtn({ children, onClick, title }: any) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-8 h-8 rounded-xl bg-black/25 border border-white/10 flex items-center justify-center"
    >
      {children}
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

function ActionBtn({ icon, label, onClick }: any) {
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

/* ============================
   DEV SELF TESTS
   ============================ */

function DevSelfTests() {
  useMemo(() => {
    if (typeof window === "undefined") return true;
    if ((window as any).__DOP_CAL_V3_TESTS__) return true;
    (window as any).__DOP_CAL_V3_TESTS__ = true;

    console.assert(EMPLOYEES.length > 0, "Employees should exist");
    console.assert(INITIAL_JOBS.length > 0, "Jobs should exist");
    console.assert(INITIAL_JOBS.some((j) => j.employeeId == null), "Should include unassigned jobs");

    // No negative durations
    for (const j of INITIAL_JOBS) {
      console.assert(diffMinutes(j.startISO, j.endISO) > 0, "Job duration should be > 0");
    }

    return true;
  }, []);

  return null;
}
