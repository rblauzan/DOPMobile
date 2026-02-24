export type JobStatus = "Scheduled" | "In Progress" | "Completed";
export type InvoiceStatus = "Paid" | "Unpaid";
export type BatchStatus = "To Approval" | "Approved" | "Rejected";
export type TransactionType = "Payment" | "Refund";

export interface Property {
    id: number;
    title: string;
    type: string;
    address: string;
    county: string;
    lastService: string;
    lastScheduledService: string;
}

export interface CustomerJob {
    id: number;
    status: JobStatus;
    propertyId: number;
    propertyName: string;
    propertyAddress: string;
    service: string;
    price: number;
    start: string; // ISO datetime
    dateCompleted: string | null;
    estimatedH: number;
    workedH: number;
    team: string;
    photosCount: number;
    checklistDone: boolean;
}

export interface Invoice {
    id: number;
    status: InvoiceStatus;
    propertyId: number;
    propertyName: string;
    service: string;
    date: string; // YYYY-MM-DD
    amount: number;
    discount: number;
    toPaid: number;
    paid: number;
}

export interface Batch {
    id: string;
    status: BatchStatus;
    count: number;
    total: number;
    date: string;
}

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: number;
    date: string;
    method: string;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    admissionDate: string;
    active: boolean;
    notes: string;
    properties: Property[];
    jobs: CustomerJob[];
    invoices: Invoice[];
    batches: Batch[];
    transactions: Transaction[];
}

export interface CustomersDB {
    customers: Customer[];
}
