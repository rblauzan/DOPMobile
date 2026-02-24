import Card from "./Card";
import { invoiceTone } from "./Tone";
import { fmtMoney, fmtDateShort } from "../../helpers/helpersCustomers";
import Pill from "./Pill";

export default function InvoiceRow({ inv, compactProperty = false }) {

  return (
    <Card  onClick={function (): void {
      throw new Error("Function not implemented.");
    } }>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full border ${invoiceTone(inv.status)}`}>{inv.status}</span>
            <span className="text-xs px-3 py-1 rounded-full border bg-white/10 border-white/15">#{inv.id}</span>
            <span className="text-xs px-3 py-1 rounded-full border bg-white/10 border-white/15">{fmtMoney(inv.amount)}</span>
          </div>

          {!compactProperty && (
            <div className="mt-3">
              <p className="font-semibold">{inv.propertyName}</p>
              <p className="text-xs opacity-70 mt-1">Service: {inv.service}</p>
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
              <p className="text-xs opacity-70">Date</p>
              <p className="mt-1 font-semibold">{fmtDateShort(inv.date)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
              <p className="text-xs opacity-70">Payment</p>
              <p className="mt-1 font-semibold">To pay: {fmtMoney(inv.toPaid)} · Paid: {fmtMoney(inv.paid)}</p>
            </div>
          </div>

          <div className="mt-3 flex gap-2 flex-wrap">
            <Pill label={`Discount: ${fmtMoney(inv.discount)}`} icon={undefined} accent={false} />
          </div>
        </div>

        <button
          className="px-3 py-2 rounded-2xl bg-[#148dcd] shadow-lg text-sm"
          onClick={() => alert(`View invoice #${inv.id} (UI placeholder)`)}
        >
          View
        </button>
      </div>
    </Card>
  );
}
