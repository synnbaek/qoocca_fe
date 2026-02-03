import * as classApi from '@/api/classApi';
import { ClassGetResponse } from '@/api/classApi';

export const classService = {
    getClasses: async (academyId: number): Promise<ClassGetResponse[]> => {
        return await classApi.getClasses(academyId);
    }
};
