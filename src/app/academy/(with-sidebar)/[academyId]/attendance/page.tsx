'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './AttendancePage.module.css';
import AttendanceClassCard from './components/AttendanceClassCard';
import { formatFullDate } from '@/utils/dateUtils';
import { attendanceService } from '@/services/attendanceService';
import { DateController } from '@/components/common/DateController';
import { ClassAttendanceSummary } from '@/types/attendance';
import Loading from '@/components/common/Loading';
import SearchBar from '@/components/common/SearchBar';

export default function AttendancePage() {
    const { academyId } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [classes, setClasses] = useState<ClassAttendanceSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchClasses = async () => {
            if (!academyId) return;
            
            try {
                setIsLoading(true);
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;

                const data = await attendanceService.getAcademySummary(Number(academyId), formattedDate);
                setClasses(data);
            } catch (error) {
                console.error('클래스 출결 현황 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, [academyId, currentDate]);

    const handlePrevDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const filteredClasses = classes.filter(cls => 
        cls.className.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <DateController 
                    currentDateText={formatFullDate(currentDate)}
                    onPrev={handlePrevDay}
                    onNext={handleNextDay}
                    className={styles.dateController}
                    buttonClassName={styles.arrowBtn}
                    textClassName={styles.currentDate}
                />
            </div>

            <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="클래스명을 입력해주세요"
                className={styles.searchBar}
            />

            <div className={styles.infoRow}>
                <span className={styles.classCount}>오늘 수업 클래스 수 {classes.length}</span>
                <button className={styles.addClassBtn} onClick={() => router.push(`/academy/${academyId}/class/register`)}>+ 클래스 추가</button>
            </div>

            <div className={styles.classGrid} role="list" aria-label="수업 목록">
                {isLoading ? (
                    <Loading />
                ) : classes.length === 0 ? (
                    /* 학원에 클래스가 하나도 없는 경우 */
                    <div className={styles.emptyState} role="status">
                        <div className={styles.emptyIcon} aria-hidden="true">📅</div>
                        <div className={styles.emptyTitle}>등록된 수업이 없습니다.</div>
                        <div className={styles.emptyDesc}>
                            아직 등록된 클래스가 없어요.<br />
                            우측 상단의 [+ 클래스 추가] 버튼을 눌러 첫 수업을 만들어 보세요!
                        </div>
                    </div>
                ) : filteredClasses.length === 0 ? (
                    /* 검색 결과가 없는 경우 */
                    <div className={styles.emptyState} role="status">
                        <div className={styles.emptyIcon} aria-hidden="true">🔍</div>
                        <div className={styles.emptyTitle}>검색 결과가 없습니다.</div>
                        <div className={styles.emptyDesc}>
                            '{searchQuery}'에 해당하는 클래스를 찾을 수 없어요.<br />
                            검색어를 다시 확인해 주세요.
                        </div>
                    </div>
                ) : (
                    filteredClasses.map(cls => (
                        <AttendanceClassCard 
                            key={cls.classId}
                            className={cls.className}
                            time={cls.classTime}
                            totalStudents={cls.currentCount}
                            present={cls.presentCount}
                            late={cls.lateCount}
                            absent={cls.absentCount}
                            onClick={() => router.push(`/academy/${academyId}/attendance/${cls.classId}?className=${encodeURIComponent(cls.className)}&classTime=${encodeURIComponent(cls.classTime)}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}