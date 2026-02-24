
export function fmtMoney(n) {
    const v = Number(n || 0);
    return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function fmtDateShort(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function fmtDateTimeShort(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function inDateRange(dateISO, range) {
    if (!range?.start && !range?.end) return true;
    const d = new Date(dateISO);
    if (Number.isNaN(d.getTime())) return true;
    const start = range.start ? new Date(range.start) : null;
    const end = range.end ? new Date(range.end) : null;
    if (start && d < start) return false;
    if (end) {
        const endPlus = new Date(end);
        endPlus.setHours(23, 59, 59, 999);
        if (d > endPlus) return false;
    }
    return true;
}

export function jobMatchesStatus(job, status) {
    if (!status || status === "All") return true;
    return String(job.status).toLowerCase() === status.toLowerCase();
}

export function invoiceMatchesStatus(inv, status) {
    if (!status || status === "All") return true;
    return String(inv.status).toLowerCase() === status.toLowerCase();
}

export function textIncludesAny(obj, q, fields) {
    const needle = (q || "").trim().toLowerCase();
    if (!needle) return true;
    return fields.some((f) => String(obj?.[f] ?? "").toLowerCase().includes(needle));
}