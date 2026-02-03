import * as academyApi from '@/api/academyApi';
import { AcademyCreatePayload, AcademyListResponse } from '@/api/academyApi';

export const academyService = {
    createAcademy: async (payload: AcademyCreatePayload) => {
        return await academyApi.createAcademy(payload);
    },

    getMyAcademyList: async (): Promise<AcademyListResponse[]> => {
        return await academyApi.getMyAcademyList();
    }
};
