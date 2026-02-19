

/* =========================
   SELF TESTS (NO DEPENDENCIES)
   ========================= */

import { useMemo } from "react";
import { jobsForDate, filterEmployees } from "./helpers";

export function DevSelfTests() {
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
