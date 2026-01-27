import axiosInstance from '@/api/axiosInstance';
import { AcademyInfo } from '@/types/dashboard';
import { 
  AcademyRejectRequest, 
  PageResponse, 
  AcademyListResponse, 
  AcademyResponse 
} from '@/types/admin';

export const adminService = {
    /**
     * 승인 대기 중인 학원 리스트 조회
     * GET /api/admin/pending
     */
    getPendingAcademies: async (page = 0, size = 10, sort = 'createdAt,asc'): Promise<PageResponse<AcademyListResponse>> => {
        const response = await axiosInstance.get<PageResponse<AcademyListResponse>>('/api/admin/pending', {
            params: { page, size, sort }
        });
        return response.data;
    },

    /**
     * 학원 상세 조회 (관리자용)
     * GET /api/academy/{id}
     */
    getAcademyDetail: async (academyId: string | number): Promise<AcademyResponse> => {
        const response = await axiosInstance.get<AcademyResponse>(`/api/academy/${academyId}`);
        return response.data;
    },

    /**
     * 학원 승인 (APPROVE)
     * POST /api/admin/academy/{id}/approve
     */
    approveAcademy: async (academyId: string | number): Promise<void> => {
        await axiosInstance.post(`/api/admin/academy/${academyId}/approve`);
    },

    /**
     * 학원 반려 (REJECT)
     * POST /api/admin/academy/{id}/reject
     */
    rejectAcademy: async (academyId: string | number, reason: string): Promise<void> => {
        const body: AcademyRejectRequest = { rejectionReason: reason };
        // 디버깅용 로그
        console.log(`[AdminService] Rejecting academy: ID=${academyId}, URL=/api/admin/academy/${academyId}/reject`, body);
        await axiosInstance.post(`/api/admin/academy/${academyId}/reject`, body);
    },
};
