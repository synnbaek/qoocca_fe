import axiosInstance from "@/api/axiosInstance";

export const ACADEMY_ENDPOINTS = {
    getClassList: (academyId: number | string) => `/api/academy/${academyId}/class`,
    createClass: (academyId: number | string) => `/api/academy/${academyId}/class`,
} as const;

export interface ClassGetResponse {
    classId: number;
    className: string;
    startTime: string; // LocalTime string "HH:mm:ss"
    endTime: string;   // LocalTime string "HH:mm:ss"
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    price: string;
    ageCode: string;
    subjectName: string;
}

export const getClasses = async (academyId: number): Promise<ClassGetResponse[]> => {
    const response = await axiosInstance.get<ClassGetResponse[]>(ACADEMY_ENDPOINTS.getClassList(academyId));
    return response.data;
};

export const createClass = async (academyId: string | number, data: any): Promise<void> => {
    await axiosInstance.post(ACADEMY_ENDPOINTS.createClass(academyId), data);
};


