import * as adminApi from '@/api/adminApi';
import {
    PageResponse,
    AcademyListResponse,
    AcademyResponse
} from '@/types/admin';

export const adminService = {
    /**
     * 승인 대기 중인 학원 리스트 조회
     * GET /api/admin/academy/pending
     */
    getPendingAcademies: async (page = 0, size = 10, sort = 'createdAt,asc'): Promise<PageResponse<AcademyListResponse>> => {
        return await adminApi.getPendingAcademies(page, size, sort);
    },

    /**
     * 반려된 학원 리스트 조회
     * GET /api/admin/academy/rejected
     */
    async getRejectedAcademies(page = 0, size = 10, sort = 'createdAt,asc'): Promise<PageResponse<AcademyListResponse>> {
        return await adminApi.getRejectedAcademies(page, size, sort);
    },

    /**
     * 전체 학원 리스트 조회
     * GET /api/admin/academy
     */
    getAllAcademies: async (page = 0, size = 10, sort = 'createdAt,desc'): Promise<PageResponse<AcademyListResponse>> => {
        return await adminApi.getAllAcademies(page, size, sort);
    },

    /**
     * 학원 상세 조회 (관리자용)
     * GET /api/admin/academy/{id}
     */
    getAcademyDetail: async (academyId: string | number): Promise<AcademyResponse> => {
        return await adminApi.getAcademyDetail(academyId);
    },

    /**
     * 학원 승인 (APPROVE)
     * POST /api/admin/academy/{id}/approve
     */
    approveAcademy: async (academyId: string | number): Promise<void> => {
        await adminApi.approveAcademy(academyId);
    },

    /**
     * 학원 반려 (REJECT)
     * POST /api/admin/academy/{id}/reject
     */
    rejectAcademy: async (academyId: string | number, reason: string): Promise<void> => {
        await adminApi.rejectAcademy(academyId, reason);
    },
};
