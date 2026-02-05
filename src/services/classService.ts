import * as classApi from '@/api/classApi';
import { ClassGetResponse } from '@/api/classApi';

/**
 * 클래스(반) 관련 비즈니스 로직 서비스
 */
export const classService = {
    /**
     * 특정 학원의 모든 클래스 목록을 조회합니다.
     * @param academyId 학원 ID
     */
    getClasses: async (academyId: number): Promise<ClassGetResponse[]> => {
        return await classApi.getClasses(academyId);
    }
};
