import * as adminApi from '@/api/adminApi';
import {
    PageResponse,
    AcademyListResponse,
    AcademyResponse
} from '@/types/admin';

/**
 * 관리자 전용 비즈니스 로직 서비스
 */
export const adminService = {
    /**
     * 승인 대기 중인 학원 목록을 조회합니다.
     * @param page 페이지 번호 (0부터 시작)
     * @param size 한 페이지당 항목 수
     * @param sort 정렬 기준
     */
    getPendingAcademies: async (page = 0, size = 10, sort = 'createdAt,asc'): Promise<PageResponse<AcademyListResponse>> => {
        return await adminApi.getPendingAcademies(page, size, sort);
    },

    /**
     * 등록이 거절(반려)된 학원 목록을 조회합니다.
     */
    async getRejectedAcademies(page = 0, size = 10, sort = 'createdAt,asc'): Promise<PageResponse<AcademyListResponse>> {
        return await adminApi.getRejectedAcademies(page, size, sort);
    },

    /**
     * 전체 학원 목록을 조회합니다.
     */
    getAllAcademies: async (page = 0, size = 10, sort = 'createdAt,desc'): Promise<PageResponse<AcademyListResponse>> => {
        return await adminApi.getAllAcademies(page, size, sort);
    },

    /**
     * 관리자 권한으로 특정 학원의 상세 정보를 조회합니다.
     * @param academyId 학원 ID
     */
    getAcademyDetail: async (academyId: string | number): Promise<AcademyResponse> => {
        return await adminApi.getAcademyDetail(academyId);
    },

    /**
     * 학원 등록 신청을 승인 처리합니다.
     */
    approveAcademy: async (academyId: string | number): Promise<void> => {
        await adminApi.approveAcademy(academyId);
    },

    /**
     * 학원 등록 신청을 반려(거절) 처리합니다.
     * @param academyId 학원 ID
     * @param reason 반려 사유
     */
    rejectAcademy: async (academyId: string | number, reason: string): Promise<void> => {
        await adminApi.rejectAcademy(academyId, reason);
    },
};
