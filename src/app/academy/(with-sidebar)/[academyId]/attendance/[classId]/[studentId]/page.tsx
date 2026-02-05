'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './StudentDetailPage.module.css';
import { formatYearMonth, generateCalendarDays } from '@/utils/dateUtils';
import { attendanceService } from '@/services/attendanceService';
import { DateController } from '@/components/common/DateController';
import { StudentCalendarResponse } from '@/types/attendance';
import StudentInfoCard from './components/StudentInfoCard';
import AttendanceCalendar from './components/AttendanceCalendar';

export default function StudentAttendanceDetailPage() {
    const router = useRouter();
    const { academyId, studentId } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [data, setData] = useState<StudentCalendarResponse | null>(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!academyId || !studentId) return;

            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                
                const responseData = await attendanceService.getStudentCalendarView(
                    studentId as string, 
                    academyId as string, 
                    year, 
                    month
                );
                setData(responseData);
            } catch (error) {
                console.error('Failed to fetch attendance:', error);
            }
        };

        fetchAttendance();
    }, [academyId, studentId, currentDate]);

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const handleBack = () => {
        router.back();
    };

    const handleEdit = () => {
        router.push(`/academy/${academyId}/student/${studentId}/modify`);
    };

    const calendarDays = generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth());

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <button onClick={handleBack} className={styles.backBtn}>
                    &lt; 뒤로
                </button>
                <DateController 
                    currentDateText={formatYearMonth(currentDate)}
                    onPrev={handlePrevMonth}
                    onNext={handleNextMonth}
                    className={styles.dateController}
                    buttonClassName={styles.arrowBtn}
                    textClassName={styles.currentDate}
                />
            </div>

            <div className={styles.contentCard}>
                
                <StudentInfoCard 
                    studentName={data?.studentName}
                    enrolledClasses={data?.enrolledClasses}
                    onEdit={handleEdit}
                />

                <AttendanceCalendar 
                    calendarDays={calendarDays}
                    attendanceRecords={data?.attendanceRecords}
                />

            </div>
        </div>
    );
}