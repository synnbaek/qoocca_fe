import * as dashboardApi from '@/api/dashboardApi';
import {
    DashboardStatsData,
    ReceiptSummary,
    ClassSummary,
    AcademyInfo
} from '@/types/dashboard';

/**
 * 대시보드 관련 비즈니스 로직 서비스
 */
export const dashboardService = {
    /**
     * 특정 학원의 기본 정보 및 승인 상태를 조회합니다.
     */
    getAcademyInfo: async (academyId: string | number): Promise<AcademyInfo> => {
        return await dashboardApi.getAcademyInfo(academyId);
    },

    /**
     * 현재 사용자가 운영/소속된 모든 학원 목록을 조회합니다.
     */
    getMyAcademies: async (): Promise<AcademyInfo[]> => {
        return await dashboardApi.getMyAcademies();
    },

    /**
     * 대시보드 메인에 표시할 클래스별 요약 정보(원생 수 등)를 조회합니다.
     */
    getClassSummary: async (academyId: string | number): Promise<ClassSummary[]> => {
        return await dashboardApi.getClassSummary(academyId);
    },

    /**
     * 대시보드용 주요 통계 데이터(전체 원생, 미납 건수 등)를 조회합니다.
     */
    getStats: async (academyId: string | number): Promise<DashboardStatsData> => {
        return await dashboardApi.getStats(academyId);
    },

    /**
     * 특정 연월의 수납 대시보드 요약 정보(발행/수납 완료 건수 등)를 조회합니다.
     */
    getReceiptSummary: async (academyId: string | number, year: number, month: number): Promise<ReceiptSummary[]> => {
        return await dashboardApi.getReceiptSummary(academyId, year, month);
    },

    /**
     * 학원 승인 거절 시, 정보를 수정하여 재심사를 요청합니다.
     * multipart/form-data 형식을 사용합니다.
     */
    resubmitAcademy: async (academyId: string | number, data: FormData): Promise<void> => {
        await dashboardApi.resubmitAcademy(academyId, data);
    }
};
