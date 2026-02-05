import axiosInstance from '@/api/axiosInstance';
import {
    DashboardStatsData,
    ReceiptSummary,
    ClassSummary,
    AcademyInfo
} from '@/types/dashboard';

/**
 * 대시보드 관련 학원 API 엔드포인트
 */
export const ACADEMY_ENDPOINTS = {
    /** 학원 프로필 정보 조회 */
    getAcademyInfo: (id: number | string) => `/api/academy/${id}/profile`,
    /** 학원 프로필 정보 수정 */
    updateAcademyProfile: (id: number | string) => `/api/academy/${id}/profile`,
    /** 내 학원 목록 조회 */
    getMyAcademyList: '/api/me/academies',
    /** 대시보드 클래스 요약 정보 조회 */
    getDashboardClassSummary: (id: number | string) => `/api/academy/${id}/dashboard/class-summary`,
    /** 대시보드 통계 데이터 조회 */
    getStats: (id: number | string) => `/api/academy/${id}/dashboard/stats`,
    /** 대시보드 메인 영수증 현황 조회 */
    getDashboardReceiptMain: (id: number | string) => `/api/academy/${id}/dashboard/receipt-main`,
    /** 학원 등록 재심사 요청 */
    resubmitAcademy: (id: number | string) => `/api/academy/${id}/approval/resubmissions`,
} as const;

/**
 * 학원 프로필 상세 정보 조회
 */
export const getAcademyInfo = async (academyId: string | number): Promise<AcademyInfo> => {
    const response = await axiosInstance.get<AcademyInfo>(ACADEMY_ENDPOINTS.getAcademyInfo(academyId));
    return response.data;
};

/**
 * 학원 프로필 정보 부분 수정 (PATCH)
 */
export const updateAcademyProfile = async (academyId: string | number, data: any): Promise<void> => {
    await axiosInstance.patch(ACADEMY_ENDPOINTS.updateAcademyProfile(academyId), data);
};

/**
 * 현재 로그인한 사용자의 모든 학원 목록 조회
 */
export const getMyAcademies = async (): Promise<AcademyInfo[]> => {
    const response = await axiosInstance.get<AcademyInfo[]>(ACADEMY_ENDPOINTS.getMyAcademyList);
    return response.data;
};

/**
 * 대시보드 상단 클래스 요약 현황 조회 (원생 수 등)
 */
export const getClassSummary = async (academyId: string | number): Promise<ClassSummary[]> => {
    const response = await axiosInstance.get<ClassSummary[]>(ACADEMY_ENDPOINTS.getDashboardClassSummary(academyId), {
        params: { _t: Date.now() } // 캐시 방지를 위한 타임스탬프
    });
    return response.data;
};

/**
 * 대시보드 전반적인 통계 데이터 조회
 */
export const getStats = async (academyId: string | number): Promise<DashboardStatsData> => {
    const response = await axiosInstance.get<DashboardStatsData>(ACADEMY_ENDPOINTS.getStats(academyId), {
        params: { _t: Date.now() }
    });
    return response.data;
};

/**
 * 대시보드 메인 화면의 월별 영수증/수납 요약 정보 조회
 */
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

/**
 * 학원 등록 거절 후 정보 수정하여 재심사 요청 (멀티파트 데이터)
 */
export const resubmitAcademy = async (academyId: string | number, data: FormData): Promise<void> => {
    const url = ACADEMY_ENDPOINTS.resubmitAcademy(academyId);
    console.log(`[DashboardApi] Resubmitting to ${url} (POST)`);
    await axiosInstance.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};



