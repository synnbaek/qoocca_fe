import axiosInstance from '@/api/axiosInstance';
import { DashboardStatsData, ReceiptSummary, ClassSummary, AcademyInfo, AcademyImage } from '@/types/dashboard';

/**
 * 대시보드 관련 학원 API 엔드포인트
 */
export const ACADEMY_ENDPOINTS = {
    getAcademyInfo: (id: number | string) => `/api/academy/${id}/profile`,
    updateAcademyProfile: (id: number | string) => `/api/academy/${id}/profile`,
    getMyAcademyList: '/api/me/academies',
    getDashboardClassSummary: (id: number | string) => `/api/academy/${id}/dashboard/class-summary`,
    getStats: (id: number | string) => `/api/academy/${id}/dashboard/stats`,
    getDashboardReceiptMain: (id: number | string) => `/api/academy/${id}/dashboard/receipt-main`,
    resubmitAcademy: (id: number | string) => `/api/academy/${id}/approval/resubmissions`,
};

/** 학원 상세 정보 조회 */
export const getAcademyInfo = async (academyId: string | number): Promise<AcademyInfo> => {
    const response = await axiosInstance.get<AcademyInfo>(ACADEMY_ENDPOINTS.getAcademyInfo(academyId));
    return response.data;
};

/** 학원 정보 수정 (PATCH, multipart/form-data) */
export const updateAcademyProfile = async (academyId: string | number, data: Record<string, any>): Promise<void> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach(item => formData.append(key, String(item)));
            } else {
                formData.append(key, String(value));
            }
        }
    });

    await axiosInstance.patch(ACADEMY_ENDPOINTS.updateAcademyProfile(academyId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

/** 학원 이미지 업로드 */
export const uploadAcademyImages = async (academyId: string | number, imageFiles: File[]): Promise<AcademyImage[]> => {
    const formData = new FormData();
    imageFiles.forEach(file => formData.append('images', file));

    const response = await axiosInstance.post<AcademyImage[]>(`/api/academy/${academyId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/** 학원 이미지 삭제 */
export const deleteAcademyImage = async (academyId: string | number, imageId: number): Promise<void> => {
    const url = `/api/academy/${academyId}/images/${imageId}`;
    try {
        await axiosInstance.delete(url);
    } catch (error) {
        console.error('이미지 삭제 실패:', error);
        throw error;
    }
};

/** 내 학원 목록 조회 */
export const getMyAcademies = async (): Promise<AcademyInfo[]> => {
    const response = await axiosInstance.get<AcademyInfo[]>(ACADEMY_ENDPOINTS.getMyAcademyList);
    return response.data;
};

/** 클래스 요약 조회 */
export const getClassSummary = async (academyId: string | number): Promise<ClassSummary[]> => {
    const response = await axiosInstance.get<ClassSummary[]>(ACADEMY_ENDPOINTS.getDashboardClassSummary(academyId), {
        params: { _t: Date.now() },
    });
    return response.data;
};

/** 통계 조회 */
export const getStats = async (academyId: string | number): Promise<DashboardStatsData> => {
    const response = await axiosInstance.get<DashboardStatsData>(ACADEMY_ENDPOINTS.getStats(academyId), {
        params: { _t: Date.now() },
    });
    return response.data;
};

/** 월별 영수증/수납 요약 */
export const getReceiptSummary = async (academyId: string | number, year: number, month: number): Promise<ReceiptSummary[]> => {
    const response = await axiosInstance.get<ReceiptSummary[]>(ACADEMY_ENDPOINTS.getDashboardReceiptMain(academyId), {
        params: { year, month, _t: Date.now() },
    });
    return response.data;
};

/** 학원 재심사 요청 */
export const resubmitAcademy = async (academyId: string | number, data: FormData): Promise<void> => {
    const url = ACADEMY_ENDPOINTS.resubmitAcademy(academyId);
    await axiosInstance.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
};
