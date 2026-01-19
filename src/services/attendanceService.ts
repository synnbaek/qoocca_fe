import axiosInstance from '@/api/axiosInstance';
import { 
    ClassAttendanceSummary, 
    StudentMonthlyStat, 
    StudentCalendarResponse 
} from '@/types/attendance';

export const attendanceService = {
    getAcademySummary: async (academyId: number, date: string): Promise<ClassAttendanceSummary[]> => {
        const response = await axiosInstance.get<ClassAttendanceSummary[]>(
            `/api/attendance/academy/${academyId}/summary`,
            {
                params: { date }
            }
        );
        return response.data;
    },

    getClassMonthlyStats: async (classId: string, year: number, month: number): Promise<StudentMonthlyStat[]> => {
        const response = await axiosInstance.get<StudentMonthlyStat[]>(
            `/api/attendance/class/${classId}/monthly-stats`,
            {
                params: { year, month }
            }
        );
        return response.data;
    },

    getStudentCalendarView: async (
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
    }
};
