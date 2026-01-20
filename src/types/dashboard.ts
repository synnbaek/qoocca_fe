export interface DashboardStatsData {
    studentCount: number;
    presentCount: number;
    totalTodayCount: number;
    noCardCount: number;
    totalMonthlyFee: number;
}

export interface ReceiptSummary {
    className: string;
    classTime: string;
    status: 'BEFORE_REQUEST' | 'ISSUED' | 'PAID';
    statusLabel: string;
    totalAmount: number;
}

export interface ClassSummary {
    classId: number;
    className: string;
    currentCount: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
}

export interface AcademyInfo {
    id: number;
    name: string;
    approvalStatus: 'REJECTED' | 'PENDING' | 'APPROVED';
}
