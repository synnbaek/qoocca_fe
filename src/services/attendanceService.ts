import * as attendanceApi from '@/api/attendanceApi';
import {
    ClassAttendanceSummary,
    StudentMonthlyStat,
    StudentCalendarResponse,
    ClassAttendanceResponse
} from '@/types/attendance';

export const attendanceService = {
    getTodayAttendance: async (academyId: number | string): Promise<ClassAttendanceResponse[]> => {
        return await attendanceApi.getTodayAttendance(academyId);
    },

    getAcademySummary: async (academyId: number, date: string): Promise<ClassAttendanceSummary[]> => {
        return await attendanceApi.getAcademySummary(academyId, date);
    },

    getClassMonthlyStats: async (classId: string, year: number, month: number): Promise<StudentMonthlyStat[]> => {
        return await attendanceApi.getClassMonthlyStats(classId, year, month);
    },

    getStudentCalendarView: async (
        studentId: string,
        academyId: string | number,
        year: number,
        month: number
    ): Promise<StudentCalendarResponse> => {
        return await attendanceApi.getStudentCalendarView(studentId, academyId, year, month);
    }
};
