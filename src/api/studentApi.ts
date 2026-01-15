import axiosInstance from './axiosInstance';

// --- Interfaces ---

export interface AcademyStudentCreateRequest {
    studentName: string;
    studentPhone: string;
}

export interface AcademyStudentResponse {
    studentId: number;
    studentName: string;
    // Add other fields if returned by backend
}

export interface ParentCreateRequest {
    parentName: string;
    parentPhone: string;
    parentRelationship: string;
    cardNum: string;
    cardState: boolean;
    isPay: boolean;
    alarm: boolean;
}

export interface ParentResponse {
    parentId: number;
    // Add other fields if returned by backend
}

export interface ClassInfoStudentRequestDTO {
    studentId: number;
}

// --- API Functions ---

// 1. Register Student
export const createStudent = async (academyId: number, data: AcademyStudentCreateRequest): Promise<AcademyStudentResponse> => {
    const response = await axiosInstance.post<AcademyStudentResponse>(`/api/academy/${academyId}/student`, data);
    return response.data;
};

// 2. Add Parent to Student
export const addParent = async (studentId: number, data: ParentCreateRequest): Promise<ParentResponse> => {
    const response = await axiosInstance.post<ParentResponse>(`/api/student/${studentId}/parent`, data);
    return response.data;
};

// 3. Assign Student to Class
export const assignStudentToClass = async (classId: number, studentId: number): Promise<void> => {
    const data: ClassInfoStudentRequestDTO = { studentId };
    await axiosInstance.post(`/api/class/${classId}/student`, data);
};
