import { getPaymentStats, getClassSummary } from '@/api/paymentApi';
import { createReceipt } from '@/api/receiptApi';
import {
    ClassSummary,
    ReceiptCreateRequest
} from '@/types/payment';

/**
 * 결제 및 수납 관련 비즈니스 로직 서비스
 */
export const paymentService = {
    /**
     * 월별 총 수납 금액 및 통계 데이터를 조회합니다.
     */
    getPaymentStats: async (academyId: string) => {
        return await getPaymentStats(academyId);
    },

    /**
     * 수납 관리 현황판에 표시할 클래스별 수납 요약(완료/미납 등)을 조회합니다.
     */
    getClassSummary: async (academyId: string, year: number, month: number): Promise<ClassSummary[]> => {
        return await getClassSummary(academyId, year, month);
    },

    /**
     * 특정 원생에게 수납(결제) 요청 영수증을 생성 및 발송합니다.
     * @param studentId 원생 ID
     * @param payload 영수증 정보 (금액, 항목 등)
     */
    createReceipt: async (studentId: number, payload: ReceiptCreateRequest) => {
        return await createReceipt(studentId, payload);
    }
};
