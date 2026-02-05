export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';

export interface AttendanceRecord {
    attendanceDate: string;
    classId: number;
    className: string;
    status: AttendanceStatus;
    statusLabel: string;
    checkIn: string | null;
    checkOut: string | null;
}

export interface ClassAttendanceSummary {
    classId: number;
    className: string;
    classTime: string;
    currentCount: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    notPresentCount: number;
}

export interface StudentMonthlyStat {
    studentId: number;
    studentName: string;
    presentCount: number;
    lateCount: number;
    absentCount: number;
}

export interface StudentCalendarResponse {
    studentName: string;
    enrolledClasses: string[];
    attendanceRecords: AttendanceRecord[];
}

export interface ClassAttendanceResponse {
  studentId: number;
  studentName: string;
  className: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  statusLabel: string;
}