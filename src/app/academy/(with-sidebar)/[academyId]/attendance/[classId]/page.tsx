'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import styles from './ClassAttendancePage.module.css';
import { SearchIcon } from '@/components/icons/BasicIcons';
import axiosInstance from '@/api/axiosInstance';
import StudentAttendanceRow from './components/StudentAttendanceRow';

interface StudentMonthlyStat {
    studentId: number;
    studentName: string;
    presentCount: number;
    lateCount: number;
    absentCount: number;
}

export default function ClassAttendancePage() {
    const { academyId, classId } = useParams();
    const searchParams = useSearchParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<StudentMonthlyStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const className = searchParams.get('className') || '클래스명';
    const classTime = searchParams.get('classTime') || '00:00~00:00';

    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            if (!classId) return;

            try {
                setIsLoading(true);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;

                const response = await axiosInstance.get<StudentMonthlyStat[]>(
                    `/api/attendance/class/${classId}/monthly-stats`,
                    {
                        params: {
                            year,
                            month
                        }
                    }
                );
                setStudents(response.data);
            } catch (error) {
                console.error('월별 출결 현황 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [classId, currentDate]);

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

    const filteredStudents = students.filter(student => 
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    &lt; 뒤로
                </button>
                <div className={styles.dateController}>
                    <button onClick={handlePrevMonth} className={styles.arrowBtn}>&lt;</button>
                    <span className={styles.currentDate}>{formatYearMonth(currentDate)}</span>
                    <button onClick={handleNextMonth} className={styles.arrowBtn}>&gt;</button>
                </div>
            </div>

            <div className={styles.summarySection}>
                <div className={styles.searchBarWrapper}>
                    <div className={styles.searchIcon}>
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="학생 이름을 입력해주세요"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.classInfoRow}>
                    <div className={styles.classTitle}>
                        {className} <span className={styles.classTime}>{classTime}</span>
                    </div>
                    <button className={styles.addStudentBtn} onClick={() => router.push(`/academy/${academyId}/student/form`)}>+ 학생 추가</button>
                </div>
            </div>

            <div className={styles.tableSection}>
                <div className={styles.totalCount}>전체 {filteredStudents.length}</div>
                <table className={styles.studentTable}>
                    <thead>
                        <tr>
                            <th className={styles.checkboxCol}><input type="checkbox" /></th>
                            <th className={styles.nameCol}>이름</th>
                            <th className={styles.statCol}>출석</th>
                            <th className={styles.statCol}>지각</th>
                            <th className={styles.statCol}>결석</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5}>로딩 중...</td></tr>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <StudentAttendanceRow
                                    key={student.studentId}
                                    student={student}
                                    isSelected={false}
                                    onSelectStudent={() => {}}
                                    onClick={() => router.push(`/academy/${academyId}/attendance/${classId}/${student.studentId}`)}
                                />
                            ))
                        ) : (
                            <tr><td colSpan={5}>데이터가 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}