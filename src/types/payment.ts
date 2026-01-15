export interface StudentDetail {
  studentId: number;
  studentName: string;
  amount: number;
  status: 'BEFORE_REQUEST' | 'ISSUED' | 'PAID';
}

export interface ClassSummary {
  classId: number;
  className: string;
  beforeRequest: number;
  paymentPending: number;
  paymentCompleted: number;
  students?: StudentDetail[];
}
