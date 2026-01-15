import axiosInstance from "@/api/axiosInstance";

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
    const response = await axiosInstance.get<ClassGetResponse[]>(`/api/academy/${academyId}/class`);
    return response.data;
};
