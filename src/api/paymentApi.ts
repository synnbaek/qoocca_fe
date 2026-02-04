import axiosInstance from '@/api/axiosInstance';
import { ClassSummary } from '@/types/payment';

export const ACADEMY_ENDPOINTS = {
    getStats: (academyId: string | number) => `/api/academy/${academyId}/dashboard/stats`,
    getClassReceiptSummary: (academyId: string | number) => `/api/academy/${academyId}/dashboard/receipt-class-summary`,
} as const;

export const getPaymentStats = async (academyId: string) => {
    const response = await axiosInstance.get(ACADEMY_ENDPOINTS.getStats(academyId), {
        params: { _t: Date.now() }
    });
    return response.data;
};

export const getClassSummary = async (academyId: string, year: number, month: number): Promise<ClassSummary[]> => {
    const response = await axiosInstance.get<ClassSummary[]>(
        ACADEMY_ENDPOINTS.getClassReceiptSummary(academyId),
        {
            params: { year, month, _t: Date.now() }
        }
    );
    return response.data;
};


