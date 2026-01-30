export interface StudentDetail {
  studentId: number;
  studentName: string;
  amount: number;
  status: 'BEFORE_REQUEST' | 'ISSUED' | 'PAID';
  cardRegistered: boolean;
}

export interface ClassSummary {
  classId: number;
  className: string;
  beforeRequest: number;
  paymentPending: number;
  paymentCompleted: number;
  students?: StudentDetail[];
}

export interface ReceiptCreateRequest {
  classId: number;
  amount: number;
  receiptDate?: string;
  receiptStatus?: 'BEFORE_REQUEST' | 'ISSUED' | 'PAID';
}
