import axiosInstance from '@/api/axiosInstance';
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
        const response = await axiosInstance.get<AcademyInfo>(`/api/academy/${academyId}`);
        return response.data;
    },

    /**
     * 사용자의 모든 학원 목록 조회
     */
    getMyAcademies: async (): Promise<AcademyInfo[]> => {
        const response = await axiosInstance.get<AcademyInfo[]>('/api/academy');
        return response.data;
    },

    /**
     * 대시보드용 클래스 요약 조회
     */
    getClassSummary: async (academyId: string | number): Promise<ClassSummary[]> => {
        const response = await axiosInstance.get<ClassSummary[]>(`/api/academy/${academyId}/class/summary`, {
            params: { _t: Date.now() }
        });
        return response.data;
    },

    /**
     * 대시보드 통계 조회
     */
    getStats: async (academyId: string | number): Promise<DashboardStatsData> => {
        const response = await axiosInstance.get<DashboardStatsData>(`/api/academy/${academyId}/stats`, {
            params: { _t: Date.now() }
        });
        return response.data;
    },

    /**
     * 수납 대시보드 요약 조회
     */
    getReceiptSummary: async (academyId: string | number, year: number, month: number): Promise<ReceiptSummary[]> => {
        const response = await axiosInstance.get<ReceiptSummary[]>(
            `/api/academy/${academyId}/receipt/dashboard-main`,
            {
                params: {
                    year,
                    month,
                    _t: Date.now()
                }
            }
        );
        return response.data;
    }
};
