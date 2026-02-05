import axiosInstance from '@/api/axiosInstance';
import {
    AcademyRejectRequest,
    PageResponse,
    AcademyListResponse,
    AcademyResponse
} from '@/types/admin';

/**
 * 승인 대기 중인 학원 목록 조회
 */
export const getPendingAcademies = async (page = 0, size = 10, sort = 'createdAt,asc'): Promise<PageResponse<AcademyListResponse>> => {
    const response = await axiosInstance.get<PageResponse<AcademyListResponse>>('/api/admin/academy/pending', {
        params: { page, size, sort }
    });
    return response.data;
};

/**
 * 승인 거절된 학원 목록 조회
 */
export const getRejectedAcademies = async (page = 0, size = 10, sort = 'createdAt,asc'): Promise<PageResponse<AcademyListResponse>> => {
    const response = await axiosInstance.get<PageResponse<AcademyListResponse>>('/api/admin/academy/rejected', {
        params: { page, size, sort }
    });
    return response.data;
};

/**
 * 전체 학원 목록 조회
 */
export const getAllAcademies = async (page = 0, size = 10, sort = 'createdAt,desc'): Promise<PageResponse<AcademyListResponse>> => {
    const response = await axiosInstance.get<PageResponse<AcademyListResponse>>('/api/admin/academy', {
        params: { page, size, sort }
    });
    return response.data;
};

/**
 * 특정 학원 상세 정보 조회
 */
export const getAcademyDetail = async (academyId: string | number): Promise<AcademyResponse> => {
    const response = await axiosInstance.get<AcademyResponse>(`/api/admin/academy/${academyId}`);
    return response.data;
};

/**
 * 학원 등록 승인
 */
export const approveAcademy = async (academyId: string | number): Promise<void> => {
    await axiosInstance.post(`/api/admin/academy/${academyId}/approve`);
};

/**
 * 학원 등록 거절
 */
export const rejectAcademy = async (academyId: string | number, reason: string): Promise<void> => {
    const body: AcademyRejectRequest = { rejectionReason: reason };
    console.log(`[AdminApi] Rejecting academy: ID=${academyId}, URL=/api/admin/academy/${academyId}/reject`, body);
    await axiosInstance.post(`/api/admin/academy/${academyId}/reject`, body);
};
