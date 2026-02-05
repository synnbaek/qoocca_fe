import * as academyApi from '@/api/academyApi';
import { AcademyCreatePayload, AcademyListResponse } from '@/api/academyApi';

/**
 * 학원 관련 비즈니스 로직 서비스
 */
export const academyService = {
    /**
     * 신규 학원 등록 신청
     * @param payload 학원 등록 데이터 (이름, 주소, 이미지 등)
     */
    createAcademy: async (payload: AcademyCreatePayload) => {
        return await academyApi.createAcademy(payload);
    },

    /**
     * 현재 로그인한 사용자의 학원 목록 조회
     * @returns 학원 목록과 승인 상태
     */
    getMyAcademyList: async (): Promise<AcademyListResponse[]> => {
        return await academyApi.getMyAcademyList();
    }
};
