'use client';

import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import styles from './home.module.css';
import axiosInstance from '@/api/axiosInstance';
import ClassCard from '@/components/common/ClassCard';

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const regRes = await axiosInstance.get(
          '/api/academy/check-registration'
        );
        const { isApproved, academyId } = regRes.data;

        if (isApproved) {
          setIsRegistered(true);

          const classRes = await axiosInstance.get(
            `/api/academy/${academyId}/class`
          );
          setClasses(classRes.data || []);
        }
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(today);

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className={styles.container}>
      {!isRegistered && (
        <section className={styles.promoBanner}>
          <div className={styles.bannerLeft}>
            <span className={styles.icon}>🎓</span>
            <p>학원 등록 한 번으로 수납·출결·학생 관리까지 한눈에 !</p>
          </div>
          <button className={styles.registBtn}>
            <span className={styles.plus}>+</span> 학원 등록
          </button>
        </section>
      )}

      <section className={styles.dashboardSummary}>
        <p className={styles.todayDate}>{formattedDate}</p>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span>전체 원생</span>
          </div>
          <div className={styles.statCard}>오늘 등원</div>
          <div className={styles.statCard}>카드 상태</div>
          <div className={styles.statCard}>이번 달 수납</div>
        </div>
      </section>

      <div
        className={styles.scrollSection}
        ref={scrollRef}
        onWheel={handleWheel}
      >
        {isRegistered && (
          <section className={styles.classSection}>
            {classes.length === 0 ? (
              <ClassCard key="empty-add" isEmpty />
            ) : (
              <>
                {classes.map((cls: any, index: number) => (
                  <ClassCard
                    key={cls.id || `class-${index}`}
                    name={cls.className || cls.name || '이름 없음'}
                    count={`${cls.currentCount || 0}/${cls.maxCount || 0}`}
                    late={cls.lateCount || 0}
                    absent={cls.absentCount || 0}
                    bgColor={
                      index % 2 === 0
                        ? 'var(--tertiary-color)'
                        : 'var(--perple)'
                    }
                  />
                ))}
                <ClassCard key="add-more" isEmpty />
              </>
            )}
          </section>
        )}
      </div>

      <section className={styles.reportContainer}>
        <div className={styles.reportRow}>
          <div className={styles.reportTitle}>
            <span>오늘의 보상</span>
            <span className={styles.arrowIcon}>&gt;</span>
          </div>
          <div className={styles.reportHeader}>
            <div className={styles.reportItem}>클래스</div>
            <div className={styles.reportItem}>수업 시간</div>
            <div className={styles.reportItem}>미지급</div>
            <div className={styles.reportItem}>지급완료</div>
          </div>
          <hr className={styles.divider} />
        </div>
        <div className={styles.reportRow}>
          <div className={styles.reportTitle}>
            <span>이번 달 수납</span>
            <span className={styles.arrowIcon}>&gt;</span>
          </div>
          <div className={styles.reportHeader}>
            <div className={styles.reportItem}>클래스</div>
            <div className={styles.reportItem}>수업 시간</div>
            <div className={styles.reportItem}>수납 상태</div>
            <div className={styles.reportItem}>월 수납 금액</div>
          </div>
          <hr className={styles.divider} />
        </div>
      </section>
    </div>
  );
}
