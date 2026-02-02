import axiosInstance from '@/api/axiosInstance';
import { ClassSummary } from '@/types/payment';

export const getPaymentStats = async (academyId: string) => {
    const response = await axiosInstance.get(`/api/academy/${academyId}/stats`, {
        params: { _t: Date.now() }
    });
    return response.data;
};

export const getClassSummary = async (academyId: string, year: number, month: number): Promise<ClassSummary[]> => {
    const response = await axiosInstance.get<ClassSummary[]>(
        `/api/academy/${academyId}/receipt/class-summary`,
        {
            params: { year, month, _t: Date.now() }
        }
    );
    return response.data;
};
