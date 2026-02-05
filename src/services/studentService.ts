import * as studentApi from '@/api/studentApi';
import {
    AcademyStudentCreateRequest,
    AcademyStudentResponse,
    ParentCreateRequest,
    ParentResponse,
    AcademyStudentModifyRequest,
    ParentUpdateRequest,
    ClassInfoStudentModifyRequest,
    ClassInfoStudentMoveRequest,
    AcademyStudentUploadResponse
} from '@/api/studentApi';

/**
 * 원생 및 학부모 관리 비즈니스 로직 서비스
 */
export const studentService = {
    /**
     * 새로운 원생 기본 정보를 생성합니다.
     */
    createStudent: async (academyId: number, data: AcademyStudentCreateRequest): Promise<AcademyStudentResponse> => {
        return await studentApi.createStudent(academyId, data);
    },

    /**
     * 특정 원생에게 보호자 정보를 추가합니다.
     */
    addParent: async (studentId: number, data: ParentCreateRequest): Promise<ParentResponse> => {
        return await studentApi.addParent(studentId, data);
    },

    /**
     * 원생을 특정 클래스에 수강 등록 시킵니다.
     */
    assignStudentToClass: async (academyId: number, classId: number, studentId: number): Promise<void> => {
        await studentApi.assignStudentToClass(academyId, classId, studentId);
    },

    /**
     * 원생의 기본 정보(이름, 연락처 등)를 수정합니다.
     */
    updateStudent: async (academyId: number, studentId: number, data: AcademyStudentModifyRequest): Promise<AcademyStudentResponse> => {
        return await studentApi.updateStudent(academyId, studentId, data);
    },

    /**
     * 학부모의 정보(이름, 연락처, 카드 정보 등)를 수정합니다.
     */
    updateParent: async (studentId: number, parentId: number, data: ParentUpdateRequest): Promise<ParentResponse> => {
        return await studentApi.updateParent(studentId, parentId, data);
    },

    /**
     * 클래스 내 원생의 수강 상태(재원/휴원/퇴원)를 변경합니다.
     */
    updateStudentStatus: async (academyId: number, classId: number, studentId: number, data: ClassInfoStudentModifyRequest): Promise<void> => {
        await studentApi.updateStudentStatus(academyId, classId, studentId, data);
    },

    /**
     * 원생을 현재 클래스에서 다른 클래스로 이동시킵니다.
     */
    moveStudentToClass: async (
        academyId: number,
        classId: number,
        studentId: number,
        data: ClassInfoStudentMoveRequest
    ): Promise<void> => {
        await studentApi.moveStudentToClass(academyId, classId, studentId, data);
    },

    /**
     * 원생을 특정 클래스에서 수강 취소(삭제) 처리합니다.
     */
    deleteStudentFromClass: async (academyId: number, classId: number, studentId: number): Promise<void> => {
        await studentApi.deleteStudentFromClass(academyId, classId, studentId);
    },

    /**
     * 엑셀 파일을 업로드하여 원생 및 보호자 정보를 대량으로 등록합니다.
     * AI 분석 옵션을 사용할 수 있습니다.
     */
    uploadStudentExcel: async (
        academyId: number,
        file: File,
        classId?: number,
        useAi: boolean = true,
        dryRun: boolean = false
    ): Promise<AcademyStudentUploadResponse> => {
        return await studentApi.uploadStudentExcel(academyId, file, classId, useAi, dryRun);
    }
};
