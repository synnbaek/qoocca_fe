import styles from '../StudentDetailPage.module.css';
import { CalendarDay } from '@/utils/dateUtils';
import { AttendanceRecord } from '@/types/attendance';
import { AttendanceBadge } from '@/components/common/AttendanceBadge';

interface AttendanceCalendarProps {
    calendarDays: CalendarDay[];
    attendanceRecords?: AttendanceRecord[];
}

export default function AttendanceCalendar({ calendarDays, attendanceRecords }: AttendanceCalendarProps) {
    const getRecordsForDate = (dateStr: string) => {
        if (!attendanceRecords) return [];
        return attendanceRecords.filter(r => r.attendanceDate === dateStr);
    };

    return (
        <div className={styles.calendarSection}>
            <div className={styles.calendarGrid}>
                {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map(day => (
                    <div key={day} className={styles.dayHeader}>{day}</div>
                ))}

                {calendarDays.map((dateObj, index) => {
                    const records = dateObj.isCurrentMonth ? getRecordsForDate(dateObj.dateStr) : [];
                    
                    return (
                        <div 
                            key={index} 
                            className={`${styles.dayCell} ${!dateObj.isCurrentMonth ? styles.otherMonth : ''}`}
                        >
                            {dateObj.day && (
                                <>
                                    <span className={styles.dateNumber}>{dateObj.day}</span>
                                    <div className={styles.badgeContainer}>
                                        {records.map((record, rIdx) => (
                                            <AttendanceBadge 
                                                key={rIdx}
                                                status={record.status} 
                                                label={`${record.statusLabel} (${record.className})`}
                                                className={`${styles.statusBadge} ${
                                                    record.status === 'PRESENT' ? styles.present : 
                                                    record.status === 'LATE' ? styles.late : 
                                                    styles.absent
                                                }`} 
                                            />
                                        ))}
                                    </div>
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