'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AcademyDashboard.module.css';
import ClassCard from '@/components/common/ClassCard';
import axiosInstance from '@/api/axiosInstance';

interface Props {
  academyId?: string;
}

export default function AcademyDashboard({ academyId }: Props) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [approvalStatus, setApprovalStatus] = useState<
    'NONE' | 'PENDING' | 'APPROVED'
  >('NONE');
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const res = await axiosInstance.get(`/api/academy/${academyId}`);
        const { approvalStatus: status } = res.data;

        setApprovalStatus(status);

        if (status === 'APPROVED') {
          const classRes = await axiosInstance.get(
            `/api/academy/${academyId}/class`
          );
          setClasses(classRes.data || []);
        } else if (status === 'PENDING') {
        } else if (status === 'REJECTED') {
        }
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (academyId) fetchData();
  }, [academyId]);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  console.log(academyId);
  const isRegistered = !!academyId;
  console.log(isRegistered);

  return (
    <div className={styles.container}>
      {!isRegistered && (
        <section className={styles.promoBanner}>
          <div className={styles.bannerLeft}>
            <span className={styles.icon}>🎓</span>
            <p>
              {approvalStatus === 'PENDING'
                ? '심사 중입니다. 승인 후 모든 기능을 이용할 수 있습니다.'
                : '학원 등록 후 서비스를 시작해보세요!'}
            </p>
          </div>
          <button
            className={styles.registBtn}
            onClick={() =>
              approvalStatus === 'PENDING'
                ? console.log('Pending')
                : router.push('/academy')
            }
          >
            {approvalStatus === 'PENDING' ? '승인 대기 중' : '학원 등록'}
          </button>
        </section>
      )}

      <section className={styles.dashboardSummary}>
        <p className={styles.todayDate}>{today}</p>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span>전체 원생</span>
            <br />
            <strong>{isRegistered ? `${classes.length}명` : '-'}</strong>
          </div>
          <div className={styles.statCard}>
            오늘 등원
            <br />
            <strong>{isRegistered ? '' : '-'}</strong>
          </div>
          <div className={styles.statCard}>
            카드 상태
            <br />
            <strong>{isRegistered ? '' : '-'}</strong>
          </div>
          <div className={styles.statCard}>
            이번 달 수납
            <br />
            <strong>{isRegistered ? '' : '-'}</strong>
          </div>
        </div>
      </section>

      <div
        className={styles.scrollSection}
        ref={scrollRef}
        onWheel={handleWheel}
      >
        <section className={styles.classSection}>
          {isRegistered &&
            classes.map((cls: any, index: number) => (
              <ClassCard
                key={cls.id}
                name={cls.name}
                count={`${cls.currentCount}/${cls.maxCount}`}
                late={cls.lateCount}
                absent={cls.absentCount}
                bgColor={
                  index % 2 === 0 ? 'var(--tertiary-color)' : 'var(--perple)'
                }
              />
            ))}
          <ClassCard isEmpty />
        </section>
      </div>

      <section className={styles.reportContainer}>
        <div className={styles.reportRow}>
          <div className={styles.reportTitle}>오늘의 보상 &gt;</div>
          <div className={styles.reportHeader}>
            <div className={styles.reportItem}>클래스</div>
            <div className={styles.reportItem}>수업 시간</div>
            <div className={styles.reportItem}>상태</div>
          </div>
          <hr className={styles.divider} />
          <div style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>
            {isRegistered
              ? '데이터를 불러오는 중입니다.'
              : '학원 등록 후 이용 가능합니다.'}
          </div>
        </div>
        <div className={styles.reportRow}>
          <div className={styles.reportTitle}>이번 달 수납 &gt;</div>
          <div className={styles.reportHeader}>
            <div className={styles.reportItem}>클래스</div>
            <div className={styles.reportItem}>미납</div>
            <div className={styles.reportItem}>금액</div>
          </div>
          <hr className={styles.divider} />
          <div style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>
            {isRegistered
              ? '데이터를 불러오는 중입니다.'
              : '학원 등록 후 이용 가능합니다.'}
          </div>
        </div>
      </section>
    </div>
  );
}
