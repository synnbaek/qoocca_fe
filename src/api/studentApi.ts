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

export interface AcademyStudentModifyRequest {
    studentName: string;
    studentPhone: string;
}

export interface ParentUpdateRequest {
    parentName: string;
    cardNum: string;
    cardState: boolean;
    parentRelationship: string;
    parentPhone: string;
    isPay: boolean;
    alarm: boolean;
}

export interface ClassInfoStudentModifyRequest {
    status: 'ENROLLED' | 'PAUSED' | 'WITHDRAWN';
}

export interface ClassInfoStudentMoveRequest {
    targetClassId: number;
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

// 4. Update Student
export const updateStudent = async (academyId: number, studentId: number, data: AcademyStudentModifyRequest): Promise<AcademyStudentResponse> => {
    const response = await axiosInstance.put<AcademyStudentResponse>(`/api/academy/${academyId}/student/${studentId}`, data);
    return response.data;
};

// 5. Update Parent
export const updateParent = async (studentId: number, parentId: number, data: ParentUpdateRequest): Promise<ParentResponse> => {
    const response = await axiosInstance.put<ParentResponse>(`/api/student/${studentId}/parent/${parentId}`, data);
    return response.data;
};

// 6. Update Student status in class
export const updateStudentStatus = async (classId: number, studentId: number, data: ClassInfoStudentModifyRequest): Promise<void> => {
    await axiosInstance.put(`/api/class/${classId}/student/${studentId}`, data);
};

// 7. Move Student to another class
export const moveStudentToClass = async (
    academyId: number,
    classId: number,
    studentId: number,
    data: ClassInfoStudentMoveRequest
): Promise<void> => {
    await axiosInstance.put(`/api/academy/${academyId}/class/${classId}/student/${studentId}/move`, data);
};

// 8. Delete Student from Class
export const deleteStudentFromClass = async (classId: number, studentId: number): Promise<void> => {
    await axiosInstance.delete(`/api/class/${classId}/student/${studentId}`);
};

