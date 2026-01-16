'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './AttendancePage.module.css';
import { SearchIcon } from '@/components/icons/BasicIcons';
import AttendanceClassCard from './components/AttendanceClassCard';
import axiosInstance from '@/api/axiosInstance';

interface ClassAttendanceSummary {
    classId: number;
    className: string;
    classTime: string;
    currentCount: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    notPresentCount: number;
}

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

                const response = await axiosInstance.get<ClassAttendanceSummary[]>(
                    `/api/attendance/academy/${academyId}/summary`,
                    {
                        params: {
                            date: formattedDate
                        }
                    }
                );
                setClasses(response.data);
            } catch (error) {
                console.error('클래스 출결 현황 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, [academyId, currentDate]);

    const formatDate = (date: Date) => {
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekDays[date.getDay()]})`;
    };

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
                <div className={styles.dateController}>
                    <button onClick={handlePrevDay} className={styles.arrowBtn}>&lt;</button>
                    <span className={styles.currentDate}>{formatDate(currentDate)}</span>
                    <button onClick={handleNextDay} className={styles.arrowBtn}>&gt;</button>
                </div>
            </div>

            <div className={styles.searchBarWrapper}>
                <div className={styles.searchIcon}>
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="클래스명을 입력해주세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className={styles.infoRow}>
                <span className={styles.classCount}>오늘 수업 클래스 수 {classes.length}</span>
                <button className={styles.addClassBtn} onClick={() => router.push(`/academy/${academyId}/class/register`)}>+ 클래스 추가</button>
            </div>

            <div className={styles.classGrid}>
                {isLoading ? (
                    <div>로딩 중...</div>
                ) : filteredClasses.length > 0 ? (
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
                ) : (
                    <div>수업이 없습니다.</div>
                )}
            </div>
        </div>
    );
}