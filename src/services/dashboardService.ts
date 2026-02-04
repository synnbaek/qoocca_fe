import * as dashboardApi from '@/api/dashboardApi';
import {
    DashboardStatsData,
    ReceiptSummary,
    ClassSummary,
    AcademyInfo
} from '@/types/dashboard';

export const dashboardService = {
    /**
     * 승인 상태를 포함한 학원 정보 조회
     */
    getAcademyInfo: async (academyId: string | number): Promise<AcademyInfo> => {
        return await dashboardApi.getAcademyInfo(academyId);
    },

    /**
     * 사용자의 모든 학원 목록 조회
     */
    getMyAcademies: async (): Promise<AcademyInfo[]> => {
        return await dashboardApi.getMyAcademies();
    },

    /**
     * 대시보드용 클래스 요약 조회
     */
    getClassSummary: async (academyId: string | number): Promise<ClassSummary[]> => {
        return await dashboardApi.getClassSummary(academyId);
    },

    /**
     * 대시보드 통계 조회
     */
    getStats: async (academyId: string | number): Promise<DashboardStatsData> => {
        return await dashboardApi.getStats(academyId);
    },

    /**
     * 수납 대시보드 요약 조회
     */
    getReceiptSummary: async (academyId: string | number, year: number, month: number): Promise<ReceiptSummary[]> => {
        return await dashboardApi.getReceiptSummary(academyId, year, month);
    },

    /**
     * 학원 승인 재신청
     * POST /api/academy/{id}/approval/resubmissions
     */

    resubmitAcademy: async (academyId: string | number, data: FormData): Promise<void> => {
        await dashboardApi.resubmitAcademy(academyId, data);
    }
};
