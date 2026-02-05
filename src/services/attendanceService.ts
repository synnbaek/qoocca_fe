import * as attendanceApi from '@/api/attendanceApi';
import {
    ClassAttendanceSummary,
    StudentMonthlyStat,
    StudentCalendarResponse,
    ClassAttendanceResponse
} from '@/types/attendance';

/**
 * 출석 관리 비즈니스 로직 서비스
 */
export const attendanceService = {
    /**
     * 오늘 학원 전체의 출석 현황을 조회합니다.
     */
    getTodayAttendance: async (academyId: number | string): Promise<ClassAttendanceResponse[]> => {
        return await attendanceApi.getTodayAttendance(academyId);
    },

    /**
     * 특정 날짜의 학원 전체 출석 요약 정보를 조회합니다.
     */
    getAcademySummary: async (academyId: number, date: string): Promise<ClassAttendanceSummary[]> => {
        return await attendanceApi.getAcademySummary(academyId, date);
    },

    /**
     * 특정 클래스의 월간 출석 통계(학생별)를 조회합니다.
     */
    getClassMonthlyStats: async (classId: string, year: number, month: number): Promise<StudentMonthlyStat[]> => {
        return await attendanceApi.getClassMonthlyStats(classId, year, month);
    },

    /**
     * 특정 학생의 월간 출석 캘린더 데이터를 조회합니다.
     */
    getStudentCalendarView: async (
        studentId: string,
        academyId: string | number,
        year: number,
        month: number
    ): Promise<StudentCalendarResponse> => {
        return await attendanceApi.getStudentCalendarView(studentId, academyId, year, month);
    }
};
