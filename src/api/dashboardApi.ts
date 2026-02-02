import axiosInstance from '@/api/axiosInstance';
import {
    DashboardStatsData,
    ReceiptSummary,
    ClassSummary,
    AcademyInfo
} from '@/types/dashboard';

export const getAcademyInfo = async (academyId: string | number): Promise<AcademyInfo> => {
    const response = await axiosInstance.get<AcademyInfo>(`/api/academy/${academyId}`);
    return response.data;
};

export const getMyAcademies = async (): Promise<AcademyInfo[]> => {
    const response = await axiosInstance.get<AcademyInfo[]>('/api/academy/academy-list');
    return response.data;
};

export const getClassSummary = async (academyId: string | number): Promise<ClassSummary[]> => {
    const response = await axiosInstance.get<ClassSummary[]>(`/api/academy/${academyId}/class/summary`, {
        params: { _t: Date.now() }
    });
    return response.data;
};

export const getStats = async (academyId: string | number): Promise<DashboardStatsData> => {
    const response = await axiosInstance.get<DashboardStatsData>(`/api/academy/${academyId}/stats`, {
        params: { _t: Date.now() }
    });
    return response.data;
};

export const getReceiptSummary = async (academyId: string | number, year: number, month: number): Promise<ReceiptSummary[]> => {
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
};

export const resubmitAcademy = async (academyId: string | number, data: FormData): Promise<void> => {
    const url = `/api/academy/${academyId}/resubmit`;
    console.log(`[DashboardApi] Resubmitting to ${url} (PUT)`);
    await axiosInstance.put(url, data);
};
