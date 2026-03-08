export type Role = "Owner" | "User";
export type Step = "LOGIN" | "COMPANY";

export interface VerificationPanelProps {
  email: string;
  company: Company;
  code: string;
  onCodeChange: (code: string) => void;
  onSubmitCode: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onResendCode: () => Promise<void>;
  loading: boolean;
}

export type Company = {
  id: string;
  name: string;
  subtitle?: string;
};
