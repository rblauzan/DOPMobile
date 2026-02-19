import i18n from "../i18n";

  export function jobsForDate(worker, date) {
        return (worker?.jobs || []).filter((j) => j.date === date);
    }

   export function filterEmployees(query, workers) {
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
    export const setAppLanguage = async (lng: "es" | "en") => {
        localStorage.setItem("app_lang", lng);
        await i18n.changeLanguage(lng);
      };


