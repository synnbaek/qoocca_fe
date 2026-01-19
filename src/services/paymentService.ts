import axiosInstance from '@/api/axiosInstance';
import { 
    ClassSummary, 
    StudentDetail,
    ReceiptCreateRequest 
} from '@/types/payment';

export const paymentService = {
    /**
     * 월 수납 금액을 포함한 통계 조회
     */
    getPaymentStats: async (academyId: string) => {
        const response = await axiosInstance.get(`/api/academy/${academyId}/stats`, {
            params: { _t: Date.now() }
        });
        return response.data;
    },

    /**
     * 수납 현황판을 위한 클래스 요약 조회
     */
    getClassSummary: async (academyId: string, year: number, month: number): Promise<ClassSummary[]> => {
        const response = await axiosInstance.get<ClassSummary[]>(
            `/api/academy/${academyId}/receipt/class-summary`,
            { 
                params: { year, month, _t: Date.now() }
            }
        );
        return response.data;
    },

    /**
     * 학생 수납 요청 생성
     */
    createReceipt: async (studentId: number, payload: ReceiptCreateRequest) => {
        const response = await axiosInstance.post(
            `/api/student/${studentId}/receipt`,
            payload
        );
        return response.data;
    }
};
