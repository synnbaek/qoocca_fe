import { getPaymentStats, getClassSummary } from '@/api/paymentApi';
import { createReceipt } from '@/api/receiptApi';
import {
    ClassSummary,
    ReceiptCreateRequest
} from '@/types/payment';

export const paymentService = {
    /**
     * 월 수납 금액을 포함한 통계 조회
     */
    getPaymentStats: async (academyId: string) => {
        return await getPaymentStats(academyId);
    },

    /**
     * 수납 현황판을 위한 클래스 요약 조회
     */
    getClassSummary: async (academyId: string, year: number, month: number): Promise<ClassSummary[]> => {
        return await getClassSummary(academyId, year, month);
    },

    /**
     * 학생 수납 요청 생성
     */
    createReceipt: async (studentId: number, payload: ReceiptCreateRequest) => {
        return await createReceipt(studentId, payload);
    }
};
