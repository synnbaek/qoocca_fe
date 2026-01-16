'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './StudentDetailPage.module.css';
import axiosInstance from '@/api/axiosInstance';

type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';

interface AttendanceRecord {
    date: string;
    classId: number;
    className: string;
    status: AttendanceStatus;
    statusLabel: string;
    checkIn: string | null;
    checkOut: string | null;
}

interface StudentCalendarResponse {
    studentName: string;
    enrolledClasses: string[];
    attendanceRecords: AttendanceRecord[];
}

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
                
                const response = await axiosInstance.get<StudentCalendarResponse>(
                    `/api/attendance/${studentId}/calendar-view`,
                    {
                        params: {
                            academyId,
                            year,
                            month
                        }
                    }
                );
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch attendance:', error);
            }
        };

        fetchAttendance();
    }, [academyId, studentId, currentDate]);

    const formatYearMonth = (date: Date) => {
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    };

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

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const days = [];
        
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        
        for (let i = 0; i < firstDay; i++) {
            const dayNum = prevMonthLastDate - firstDay + i + 1;
            days.push({ day: dayNum, dateStr: '', isCurrentMonth: false });
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({ day: i, dateStr, isCurrentMonth: true });
        }
        
        const totalCells = Math.ceil(days.length / 7) * 7;
        const remaining = totalCells - days.length;
        
        for (let i = 1; i <= remaining; i++) {
           days.push({ day: i, dateStr: '', isCurrentMonth: false });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    const getStatusForDate = (dateStr: string) => {
        if (!data) return null;
        const records = data.attendanceRecords.filter(r => r.date === dateStr);
        if (records.length === 0) return null;
        
        return records[0].status; 
    };

    const getStatusLabel = (status: AttendanceStatus) => {
        switch (status) {
            case 'PRESENT': return '출석';
            case 'LATE': return '지각';
            case 'ABSENT': return '결석';
            default: return '';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <button onClick={handleBack} className={styles.backBtn}>
                    &lt; 뒤로
                </button>
                <div className={styles.dateController}>
                    <button onClick={handlePrevMonth} className={styles.arrowBtn}>&lt;</button>
                    <span className={styles.currentDate}>{formatYearMonth(currentDate)}</span>
                    <button onClick={handleNextMonth} className={styles.arrowBtn}>&gt;</button>
                </div>
            </div>

            <div className={styles.contentCard}>
                
                <div className={styles.studentInfoHeader}>
                    <div className={styles.studentInfoLeft}>
                        <span className={styles.studentName}>{data?.studentName}</span>
                        <div className={styles.classTags}>
                            {data?.enrolledClasses.map((tag, index) => (
                                <span key={index} className={styles.classTag}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <button className={styles.editBtn}>정보 수정</button>
                </div>

                <div className={styles.calendarSection}>
                    <div className={styles.calendarGrid}>
                        {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map(day => (
                            <div key={day} className={styles.dayHeader}>{day}</div>
                        ))}

                        {calendarDays.map((dateObj, index) => {
                            const status = dateObj.isCurrentMonth ? getStatusForDate(dateObj.dateStr) : null;
                            
                            return (
                                <div 
                                    key={index} 
                                    className={`${styles.dayCell} ${!dateObj.isCurrentMonth ? styles.otherMonth : ''}`}
                                >
                                    {dateObj.day && (
                                        <>
                                            <span className={styles.dateNumber}>{dateObj.day}</span>
                                            {status && (
                                                <div className={`${styles.statusBadge} ${status === 'PRESENT' ? styles.present : status === 'LATE' ? styles.late : styles.absent}`}>
                                                    {getStatusLabel(status)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.legendArea}>
                        <div className={`${styles.statusBadge} ${styles.present}`}>출석</div>
                        <div className={`${styles.statusBadge} ${styles.late}`}>지각</div>
                        <div className={`${styles.statusBadge} ${styles.absent}`}>결석</div>
                    </div>
                </div>

            </div>
        </div>
    );
}