'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import styles from './ClassAttendancePage.module.css';
import StudentAttendanceRow from './components/StudentAttendanceRow';
import { formatYearMonth } from '@/utils/dateUtils';
import { attendanceService } from '@/services/attendanceService';
import { DateController } from '@/components/common/DateController';
import { StudentMonthlyStat } from '@/types/attendance';
import { dashboardService } from '@/services/dashboardService';
import { ClassSummary } from '@/types/dashboard';
import Loading from '@/components/common/Loading';
import SearchBar from '@/components/common/SearchBar';
import { toast } from 'sonner';

export default function ClassAttendancePage() {
    const { academyId, classId } = useParams();
    const searchParams = useSearchParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<StudentMonthlyStat[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [classInfo, setClassInfo] = useState<{ name: string; time: string | null }>({
        name: searchParams.get('className') || '',
        time: searchParams.get('classTime') || null,
    });

    const router = useRouter();

    const fetchStats = async () => {
        if (!classId) return;

        try {
            setIsLoading(true);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            
            const data = await attendanceService.getClassMonthlyStats(
                classId as string,
                year,
                month
            );
            setStudents(data);
        } catch (error) {
            console.error('월별 출결 현황 로딩 실패:', error);
            toast.error('출결 현황을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadClassInfo = async () => {
            if (!academyId || typeof academyId !== 'string') return;
            try {
                const classes = await dashboardService.getClassSummary(academyId);
                const currentClass = classes.find((c: ClassSummary) => c.classId === Number(classId));
                if (currentClass) {
                    const startTime = currentClass.startTime ? currentClass.startTime.substring(0, 5) : '';
                    const endTime = currentClass.endTime ? currentClass.endTime.substring(0, 5) : '';
                    setClassInfo({
                        name: currentClass.className,
                        time: startTime && endTime ? `${startTime}~${endTime}` : '',
                    });
                }
            } catch (err) {
                console.error('Failed to fetch class info:', err);
            }
        };
        loadClassInfo();
    }, [academyId, classId]);

    useEffect(() => {
        fetchStats();
    }, [classId, currentDate]);

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

    const handleSelectStudent = (id: number) => {
        setSelectedStudentIds(prev => 
            prev.includes(id) ? prev.filter(studentId => studentId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedStudentIds(filteredStudents.map(s => s.studentId));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleBulkAttendance = async (type: 'IN' | 'OUT') => {
        if (selectedStudentIds.length === 0) return;

        try {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0];

            if (type === 'IN') {
                await attendanceService.updateBatchAttendance({
                    studentIds: selectedStudentIds,
                    attendanceDate: todayStr,
                    checkIn: timeStr
                });
                toast.success(`${selectedStudentIds.length}명의 학생을 등원 처리했습니다.`);
            } else {
                await attendanceService.updateBatchCheckOut({
                    studentIds: selectedStudentIds,
                    attendanceDate: todayStr,
                    checkOut: timeStr
                });
                toast.success(`${selectedStudentIds.length}명의 학생을 하원 처리했습니다.`);
            }
            
            setSelectedStudentIds([]);
            fetchStats();
        } catch (error) {
            toast.error('일괄 처리에 실패했습니다.');
            console.error(error);
        }
    };

    const filteredStudents = students.filter(student => 
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAllSelected = filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length;

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <button onClick={() => router.back()} className={styles.backBtn}>
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

            <div className={styles.summarySection}>
                <SearchBar 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="학생 이름을 입력해주세요"
                    className={styles.searchBar}
                />

                <div className={styles.classInfoRow}>
                    <div className={styles.classTitle}>
                        {classInfo.name || '클래스명'} <span className={styles.classTime}>{classInfo.time || ''}</span>
                    </div>
                    <button className={styles.addStudentBtn} onClick={() => router.push(`/academy/${academyId}/student/form?classId=${classId}`)}>+ 학생 추가</button>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableSection}>
                    <div className={styles.totalCount}>전체 {filteredStudents.length}</div>
                    <table className={styles.studentTable}>
                        <thead>
                            <tr>
                                <th className={styles.checkboxCol}>
                                    <input 
                                        type="checkbox" 
                                        onChange={handleSelectAll}
                                        checked={isAllSelected}
                                    />
                                </th>
                                <th className={styles.nameCol}>이름</th>
                                <th className={styles.statCol}>출석</th>
                                <th className={styles.statCol}>지각</th>
                                <th className={styles.statCol}>결석</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5}><Loading /></td></tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <StudentAttendanceRow
                                        key={student.studentId}
                                        student={student}
                                        isSelected={selectedStudentIds.includes(student.studentId)}
                                        onSelectStudent={handleSelectStudent}
                                        onClick={() => router.push(`/academy/${academyId}/attendance/${classId}/${student.studentId}`)}
                                    />
                                ))
                            ) : (
                                <tr><td colSpan={5} style={{ padding: '40px', color: '#999' }}>데이터가 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedStudentIds.length > 0 && (
                <div className={styles.bulkActionBar}>
                    <div className={styles.selectedInfo}>
                        <span className={styles.selectedCount}>{selectedStudentIds.length}</span>명 선택됨
                    </div>
                    <div className={styles.bulkActions}>
                        <button className={`${styles.bulkBtn} ${styles.presentBtn}`} onClick={() => handleBulkAttendance('IN')}>일괄 등원</button>
                        <button className={`${styles.bulkBtn} ${styles.absentBtn}`} onClick={() => handleBulkAttendance('OUT')}>일괄 하원</button>
                        <button className={`${styles.bulkBtn} ${styles.cancelBtn}`} onClick={() => setSelectedStudentIds([])}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
}
