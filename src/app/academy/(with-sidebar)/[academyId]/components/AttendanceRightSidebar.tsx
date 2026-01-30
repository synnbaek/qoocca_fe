'use client';

import { useEffect, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import styles from './AttendanceRightSidebar.module.css';
import axiosInstance from '@/api/axiosInstance';

interface ClassAttendanceResponse {
  studentId: number;
  studentName: string;
  className: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  statusLabel: string;
}

interface AttendanceRightSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AttendanceRightSidebar({ isOpen, onClose }: AttendanceRightSidebarProps) {
  const [attendances, setAttendances] = useState<ClassAttendanceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const params = useParams();
  const academyId = Number(params?.academyId);

  // 대시보드 메인 페이지(/academy/[id])에서만 노출
  const isDashboardMain = pathname === `/academy/${academyId}`;

  useEffect(() => {
    if (!academyId || !isDashboardMain) {
      setIsLoading(false);
      return;
    }

    const fetchAllAttendance = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<ClassAttendanceResponse[]>(
          `/api/attendance/academy/${academyId}/today`
        );
        
        setAttendances(response.data);
      } catch (error) {
        console.error('전체 출석 현황 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAttendance();
  }, [academyId, isDashboardMain]);

  if (!academyId || !isDashboardMain) return null;

  const groupedAttendances = attendances.reduce((acc, student) => {
    const { className } = student;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(student);
    return acc;
  }, {} as Record<string, ClassAttendanceResponse[]>);

  return (
    <div className={`${styles.sidebarContainer} ${isOpen ? styles.isOpen : ''}`}>
      {isLoading ? (
          <div className={styles.loading}>데이터를 불러오는 중...</div>
        ) : attendances.length === 0 ? (
          <div className={styles.empty}>오늘 수업이 있는 학생이 없습니다.</div>
        ) : (
          Object.entries(groupedAttendances).map(([className, students]) => (
            <div key={className} className={styles.classGroup}>
              <h4 className={styles.classGroupTitle}>{className}</h4>
              <div className={styles.studentList}>
                {students.map((student) => (
                  <div key={`${student.studentId}-${student.className}`} className={styles.studentItem}>
                    <div className={styles.avatar}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#EFF6FF"/>
                        <path d="M16 8C18.21 8 20 9.79 20 12C20 14.21 18.21 16 16 16C13.79 16 12 14.21 12 12C12 9.79 13.79 8 16 8ZM16 18C20.42 18 24 19.79 24 22V24H8V22C8 19.79 11.58 18 16 18Z" fill="#3B82F6"/>
                      </svg>
                    </div>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentName}>{student.studentName}</div>
                      <div className={styles.statusLabel}>{student.statusLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
    </div>
  );
}