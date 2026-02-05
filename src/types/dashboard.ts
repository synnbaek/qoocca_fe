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
    status: 'BEFORE_REQUEST' | 'ISSUED' | 'PAID' | 'NO_STUDENTS';
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
    id: number; // API 실제 필드
    academyId?: number; // 기존 코드 호환용
    name: string;
    approvalStatus: 'REJECTED' | 'PENDING' | 'APPROVED';
    rejectionReason?: string;
    phoneNumber?: string;
    address?: string;
    baseAddress?: string;
    detailAddress?: string;
    certificate?: string; // 추가: Nginx 저장 경로
    businessRegistrationUrl?: string; // 기존 호환용
    briefInfo?: string;
    operatingHours?: string;
    websiteUrl?: string;
    instagramUrl?: string;
    blogUrl?: string;
    imageUrls?: string[]; // 학원 대표 이미지 URL 목록
    ages?: { ageCode: string }[];
    subjects?: { detailSubject: string }[];
}
