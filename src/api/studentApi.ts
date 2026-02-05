import axiosInstance from './axiosInstance';

/**
 * 학원 원생 생성 요청 인터페이스
 */
export interface AcademyStudentCreateRequest {
    studentName: string;
    studentPhone: string;
}

/**
 * 학원 원생 응답 인터페이스
 */
export interface AcademyStudentResponse {
    studentId: number;
    studentName: string;
}

/**
 * 보호자 생성 요청 인터페이스
 */
export interface ParentCreateRequest {
    parentName: string;
    parentPhone: string;
    parentRelationship: string;
    cardNum: string;
    cardState: boolean;
    isPay: boolean;
    alarm: boolean;
}

/**
 * 보호자 응답 인터페이스
 */
export interface ParentResponse {
    parentId: number;
}

/**
 * 클래스 내 원생 요청 DTO
 */
export interface ClassInfoStudentRequestDTO {
    studentId: number;
}

/**
 * 학원 원생 수정 요청 인터페이스
 */
export interface AcademyStudentModifyRequest {
    studentName: string;
    studentPhone: string;
}

/**
 * 보호자 정보 수정 요청 인터페이스
 */
export interface ParentUpdateRequest {
    parentName: string;
    cardNum: string;
    cardState: boolean;
    parentRelationship: string;
    parentPhone: string;
    isPay: boolean;
    alarm: boolean;
}

/**
 * 클래스 내 원생 상태 수정 요청 인터페이스
 */
export interface ClassInfoStudentModifyRequest {
    status: 'ENROLLED' | 'PAUSED' | 'WITHDRAWN';
}

/**
 * 원생 클래스 이동 요청 인터페이스
 */
export interface ClassInfoStudentMoveRequest {
    targetClassId: number;
}

// --- API 함수 ---

/**
 * 1. 신규 원생 등록
 */
export const createStudent = async (academyId: number, data: AcademyStudentCreateRequest): Promise<AcademyStudentResponse> => {
    const response = await axiosInstance.post<AcademyStudentResponse>(`/api/academy/${academyId}/student`, data);
    return response.data;
};

/**
 * 2. 원생에게 보호자 정보 추가
 */
export const addParent = async (studentId: number, data: ParentCreateRequest): Promise<ParentResponse> => {
    const response = await axiosInstance.post<ParentResponse>(`/api/student/${studentId}/parent`, data);
    return response.data;
};

/**
 * 3. 원생을 특정 클래스에 배정
 */
export const assignStudentToClass = async (academyId: number, classId: number, studentId: number): Promise<void> => {
    const data: ClassInfoStudentRequestDTO = { studentId };
    await axiosInstance.post(`/api/academy/${academyId}/class/${classId}/student`, data);
};

/**
 * 4. 원생 기본 정보 수정
 */
export const updateStudent = async (academyId: number, studentId: number, data: AcademyStudentModifyRequest): Promise<AcademyStudentResponse> => {
    const response = await axiosInstance.put<AcademyStudentResponse>(`/api/academy/${academyId}/student/${studentId}`, data);
    return response.data;
};

/**
 * 5. 보호자 정보 수정
 */
export const updateParent = async (studentId: number, parentId: number, data: ParentUpdateRequest): Promise<ParentResponse> => {
    const response = await axiosInstance.put<ParentResponse>(`/api/student/${studentId}/parent/${parentId}`, data);
    return response.data;
};

/**
 * 6. 클래스 내 원생 상태(재원/휴원/퇴원) 업데이트
 */
export const updateStudentStatus = async (academyId: number, classId: number, studentId: number, data: ClassInfoStudentModifyRequest): Promise<void> => {
    await axiosInstance.put(`/api/academy/${academyId}/class/${classId}/student/${studentId}`, data);
};

/**
 * 7. 원생을 다른 클래스로 이동
 */
export const moveStudentToClass = async (
    academyId: number,
    classId: number,
    studentId: number,
    data: ClassInfoStudentMoveRequest
): Promise<void> => {
    await axiosInstance.put(`/api/academy/${academyId}/class/${classId}/student/${studentId}/move`, data);
};

/**
 * 8. 클래스에서 원생 제외
 */
export const deleteStudentFromClass = async (academyId: number, classId: number, studentId: number): Promise<void> => {
    await axiosInstance.delete(`/api/academy/${academyId}/class/${classId}/student/${studentId}`);
};

/**
 * 학원 원생 엑셀 업로드 응답 인터페이스
 */
export interface AcademyStudentUploadResponse {
    success: boolean;
    message: string;
    totalCount?: number;
    successCount?: number;
    failureCount?: number;
}

/**
 * 9. 원생 정보 엑셀 업로드
 */
export const uploadStudentExcel = async (
    academyId: number,
    file: File,
    classId?: number,
    useAi: boolean = true,
    dryRun: boolean = false
): Promise<AcademyStudentUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    if (classId) formData.append("classId", classId.toString());
    formData.append("useAi", useAi.toString());
    formData.append("dryRun", dryRun.toString());

    const response = await axiosInstance.post<AcademyStudentUploadResponse>(
        `/api/academy/${academyId}/student/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

