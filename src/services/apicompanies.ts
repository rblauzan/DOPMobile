import { useEffect, useState } from "react";
import { Company } from "../models/Login";
import companiesData from "../db/companies.json";

interface UseCompaniesReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

export const useCompanies = (): UseCompaniesReturn => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Obtener datos del JSON importado
        setCompanies(companiesData.companies);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Error loading companies");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading, error };
};