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

export const studentService = {
    createStudent: async (academyId: number, data: AcademyStudentCreateRequest): Promise<AcademyStudentResponse> => {
        return await studentApi.createStudent(academyId, data);
    },

    addParent: async (studentId: number, data: ParentCreateRequest): Promise<ParentResponse> => {
        return await studentApi.addParent(studentId, data);
    },

    assignStudentToClass: async (classId: number, studentId: number): Promise<void> => {
        await studentApi.assignStudentToClass(classId, studentId);
    },

    updateStudent: async (academyId: number, studentId: number, data: AcademyStudentModifyRequest): Promise<AcademyStudentResponse> => {
        return await studentApi.updateStudent(academyId, studentId, data);
    },

    updateParent: async (studentId: number, parentId: number, data: ParentUpdateRequest): Promise<ParentResponse> => {
        return await studentApi.updateParent(studentId, parentId, data);
    },

    updateStudentStatus: async (classId: number, studentId: number, data: ClassInfoStudentModifyRequest): Promise<void> => {
        await studentApi.updateStudentStatus(classId, studentId, data);
    },

    moveStudentToClass: async (
        academyId: number,
        classId: number,
        studentId: number,
        data: ClassInfoStudentMoveRequest
    ): Promise<void> => {
        await studentApi.moveStudentToClass(academyId, classId, studentId, data);
    },

    deleteStudentFromClass: async (classId: number, studentId: number): Promise<void> => {
        await studentApi.deleteStudentFromClass(classId, studentId);
    },

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
