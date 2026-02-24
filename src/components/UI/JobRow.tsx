import { Clock, Eye, ImageIcon, CheckSquare } from "lucide-react";
import Card from "./Card";
import IconSquare from "./IconSquare";
import { statusTone } from "./Tone";
import { fmtMoney, fmtDateTimeShort, fmtDateShort } from "../../helpers/helpersCustomers";
import Pill from "./Pill";


export default function JobRow({ job, compactProperty = false }) {
const isCompleted = String(job.status).toLowerCase() === "completed";

  return (
    <Card  onClick={function (): void {
      throw new Error("Function not implemented.");
    } }>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full border ${statusTone(job.status)}`}>{job.status}</span>
            <span className="text-xs px-3 py-1 rounded-full border bg-white/10 border-white/15">#{job.id}</span>
            <span className="text-xs px-3 py-1 rounded-full border bg-white/10 border-white/15">{fmtMoney(job.price || 0)}</span>
          </div>

          {!compactProperty && (
            <div className="mt-3">
              <p className="font-semibold">{job.propertyName}</p>
              <p className="text-xs opacity-70 mt-1">{job.propertyAddress}</p>
            </div>
          )}

          <div className="mt-3">
            <p className="font-semibold">{job.service}</p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
              <p className="text-xs opacity-70">Start</p>
              <p className="mt-1 font-semibold flex items-center gap-2"><Clock size={14} /> {fmtDateTimeShort(job.start)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
              <p className="text-xs opacity-70">Hours</p>
              <p className="mt-1 font-semibold">Est: {job.estimatedH} · Worked: {job.workedH}</p>
            </div>
          </div>

          <div className="mt-3 flex gap-2 flex-wrap">
            <Pill label={`Team: ${job.team}`} icon={undefined} accent={false} />
            <Pill label={`Completed: ${fmtDateShort(job.dateCompleted)}`} icon={undefined} accent={false} />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end shrink-0">
          <IconSquare
            title="View"
            icon={<Eye size={16} />}
            onClick={() => alert(`View job #${job.id} (UI placeholder)`) }
          />
          <IconSquare
            title={`Photos (${job.photosCount ?? 0})`}
            icon={<ImageIcon size={16} />}
            onClick={() => alert(`Open photos for job #${job.id} (UI placeholder)`) }
          />
          {isCompleted && (
            <IconSquare
              title={job.checklistDone ? "Checklist complete" : "Checklist"}
              icon={<CheckSquare size={16} />}
              onClick={() => alert(`Open checklist for job #${job.id} (UI placeholder)`) }
            />
          )}
        </div>
      </div>
    </Card>
  );
}