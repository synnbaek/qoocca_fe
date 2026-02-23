import axiosInstance from '@/api/axiosInstance';
import {
    ClassAttendanceSummary,
    StudentMonthlyStat,
    StudentCalendarResponse,
    ClassAttendanceResponse
} from '@/types/attendance';

/**
 * 학원별 오늘의 전체 출격 현황 조회
 */
export const getTodayAttendance = async (academyId: number | string): Promise<ClassAttendanceResponse[]> => {
    const response = await axiosInstance.get<ClassAttendanceResponse[]>(
        `/api/attendance/academy/${academyId}/today`
    );
    return response.data;
};

/**
 * 특정 날짜의 학원 클래스별 출석 요약 정보 조회
 */
export const getAcademySummary = async (academyId: number, date: string): Promise<ClassAttendanceSummary[]> => {
    const response = await axiosInstance.get<ClassAttendanceSummary[]>(
        `/api/attendance/academy/${academyId}/summary`,
        {
            params: { date }
        }
    );
    return response.data;
};

/**
 * 특정 클래스의 월간 출석 통계 조회 (학생별 결석 횟수 등)
 */
export const getClassMonthlyStats = async (classId: string, year: number, month: number): Promise<StudentMonthlyStat[]> => {
    const response = await axiosInstance.get<StudentMonthlyStat[]>(
        `/api/attendance/class/${classId}/monthly-stats`,
        {
            params: { year, month }
        }
    );
    return response.data;
};

/**
 * 특정 학생의 월간 캘린더 뷰 출석 데이터 조회
 */
export const getStudentCalendarView = async (
    studentId: string,
    academyId: string | number,
    year: number,
    month: number
): Promise<StudentCalendarResponse> => {
    const response = await axiosInstance.get<StudentCalendarResponse>(
        `/api/attendance/${studentId}/calendar-view`,
        {
            params: { academyId, year, month }
        }
    );
    return response.data;
};
/**
 * 특정 날짜에 특정 학생의 출석(등원)을 등록합니다.
 * 백엔드에서 등원 시간을 기준으로 출석/지각을 자동 계산합니다.
 */
export const createAttendance = async (studentId: number, data: {
    attendanceDate: string; // yyyy-MM-dd
    checkIn: string;        // HH:mm:ss
}): Promise<{ id: number; status: string; [key: string]: any }> => {
    const response = await axiosInstance.post(`/api/student/${studentId}/attendance`, data);
    return response.data;
};

/**
 * 특정 학생의 하원(체크아웃)을 처리합니다.
 */
export const checkOut = async (studentId: number, data: {
    attendanceDate: string; // yyyy-MM-dd
    checkOut: string;       // HH:mm:ss
}): Promise<{ id: number; status: string; [key: string]: any }> => {
    const response = await axiosInstance.patch(`/api/student/${studentId}/attendance/check-out`, data);
    return response.data;
};
