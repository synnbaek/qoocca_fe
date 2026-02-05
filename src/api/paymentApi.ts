import axiosInstance from '@/api/axiosInstance';
import { ClassSummary } from '@/types/payment';

/**
 * 결합/수납 관련 API 엔드포인트
 */
export const ACADEMY_ENDPOINTS = {
    /** 대시보드 통계 정보 조회 */
    getStats: (academyId: string | number) => `/api/academy/${academyId}/dashboard/stats`,
    /** 클래스별 영수증 발행/수납 요약 현황 조회 */
    getClassReceiptSummary: (academyId: string | number) => `/api/academy/${academyId}/dashboard/receipt-class-summary`,
} as const;

/**
 * 결제 관련 통계 데이터 조회
 */
export const getPaymentStats = async (academyId: string) => {
    const response = await axiosInstance.get(ACADEMY_ENDPOINTS.getStats(academyId), {
        params: { _t: Date.now() } // 실시간 데이터 조회를 위해 캐시 방지
    });
    return response.data;
};

/**
 * 특정 연월의 클래스별 수납 요약 정보 조회
 */
export const getClassSummary = async (academyId: string, year: number, month: number): Promise<ClassSummary[]> => {
    const response = await axiosInstance.get<ClassSummary[]>(
        ACADEMY_ENDPOINTS.getClassReceiptSummary(academyId),
        {
            params: { year, month, _t: Date.now() }
        }
    );
    return response.data;
};


