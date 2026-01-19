import styles from '../StudentDetailPage.module.css';
import { CalendarDay } from '@/utils/dateUtils';
import { AttendanceRecord } from '@/types/attendance';
import { AttendanceBadge } from '@/components/common/AttendanceBadge';

interface AttendanceCalendarProps {
    calendarDays: CalendarDay[];
    attendanceRecords?: AttendanceRecord[];
}

export default function AttendanceCalendar({ calendarDays, attendanceRecords }: AttendanceCalendarProps) {
    const getStatusForDate = (dateStr: string) => {
        if (!attendanceRecords) return null;

        const records = attendanceRecords.filter(r => r.attendanceDate === dateStr);
        if (records.length === 0) return null;
        return records[0].status; 
    };

    return (
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
                                        <AttendanceBadge 
                                            status={status} 
                                            className={`${styles.statusBadge} ${
                                                status === 'PRESENT' ? styles.present : 
                                                status === 'LATE' ? styles.late : 
                                                styles.absent
                                            }`} 
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.legendArea}>
                <AttendanceBadge status="PRESENT" className={`${styles.statusBadge} ${styles.present}`} />
                <AttendanceBadge status="LATE" className={`${styles.statusBadge} ${styles.late}`} />
                <AttendanceBadge status="ABSENT" className={`${styles.statusBadge} ${styles.absent}`} />
            </div>
        </div>
    );
}
