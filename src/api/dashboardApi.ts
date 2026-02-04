import axiosInstance from '@/api/axiosInstance';
import {
    DashboardStatsData,
    ReceiptSummary,
    ClassSummary,
    AcademyInfo
} from '@/types/dashboard';

export const ACADEMY_ENDPOINTS = {
    getAcademyInfo: (id: number | string) => `/api/academy/${id}/profile`,
    updateAcademyProfile: (id: number | string) => `/api/academy/${id}/profile`,
    getMyAcademyList: '/api/me/academies',
    getDashboardClassSummary: (id: number | string) => `/api/academy/${id}/dashboard/class-summary`,
    getStats: (id: number | string) => `/api/academy/${id}/dashboard/stats`,
    getDashboardReceiptMain: (id: number | string) => `/api/academy/${id}/dashboard/receipt-main`,
    resubmitAcademy: (id: number | string) => `/api/academy/${id}/approval/resubmissions`,
} as const;

export const getAcademyInfo = async (academyId: string | number): Promise<AcademyInfo> => {
    const response = await axiosInstance.get<AcademyInfo>(ACADEMY_ENDPOINTS.getAcademyInfo(academyId));
    return response.data;
};

export const updateAcademyProfile = async (academyId: string | number, data: any): Promise<void> => {
    await axiosInstance.patch(ACADEMY_ENDPOINTS.updateAcademyProfile(academyId), data);
};

export const getMyAcademies = async (): Promise<AcademyInfo[]> => {
    const response = await axiosInstance.get<AcademyInfo[]>(ACADEMY_ENDPOINTS.getMyAcademyList);
    return response.data;
};

export const getClassSummary = async (academyId: string | number): Promise<ClassSummary[]> => {
    const response = await axiosInstance.get<ClassSummary[]>(ACADEMY_ENDPOINTS.getDashboardClassSummary(academyId), {
        params: { _t: Date.now() }
    });
    return response.data;
};

export const getStats = async (academyId: string | number): Promise<DashboardStatsData> => {
    const response = await axiosInstance.get<DashboardStatsData>(ACADEMY_ENDPOINTS.getStats(academyId), {
        params: { _t: Date.now() }
    });
    return response.data;
};

export const getReceiptSummary = async (academyId: string | number, year: number, month: number): Promise<ReceiptSummary[]> => {
    const response = await axiosInstance.get<ReceiptSummary[]>(
        ACADEMY_ENDPOINTS.getDashboardReceiptMain(academyId),
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
    const url = ACADEMY_ENDPOINTS.resubmitAcademy(academyId);
    console.log(`[DashboardApi] Resubmitting to ${url} (POST)`);
    await axiosInstance.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};



