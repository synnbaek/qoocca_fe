'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';
import ClassCard from '@/components/common/ClassCard';
import axiosInstance from '@/api/axiosInstance';

import DashboardBanner from './components/DashboardBanner';
import DashboardStats from './components/DashboardStats';
import DashboardReport from './components/DashboardReport';
import CustomModal from '@/components/common/CustomModal';

interface Props {
  academyId?: string;
}

export default function Dashboard({ academyId }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    'REJECTED' | 'PENDING' | 'APPROVED'
  >('PENDING');
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: '',
  });

  const [studentCount, setStudentCount] = useState(0);

  const router = useRouter();

  const isRegistered = !!academyId && academyId !== 'undefined';

  useEffect(() => {
    const fetchData = async () => {
      if (!academyId) return;

      try {
        setIsLoading(true);

        const [academyRes, countRes] = await Promise.all([
          axiosInstance.get(`/api/academy/${academyId}`),
          axiosInstance.get(`/api/academy/${academyId}/student/cnt`),
        ]);

        const status = academyRes.data.approvalStatus;
        setApprovalStatus(status);

        setStudentCount(countRes.data);

        if (status === 'APPROVED') {
          const classRes = await axiosInstance.get(
            `/api/academy/${academyId}/class`
          );
          setClasses(classRes.data || []);
        }
      } catch (err: any) {
        console.error('데이터 로딩 실패:', err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [academyId]);

  const handleFeatureClick = (path?: string) => {
    if (!isRegistered) {
      setModalConfig({
        title: '학원 등록이 필요해요',
        description: '모든 기능을 이용하시려면 먼저 학원 정보를 등록해 주세요.',
      });
      setIsModalOpen(true);
      return;
    }

    if (approvalStatus === 'PENDING') {
      setModalConfig({
        title: '승인 대기 중이에요',
        description:
          '학원 승인이 완료된 후에 사용할 수 있는 기능입니다.\n조금만 기다려 주세요!',
      });
      setIsModalOpen(true);
      return;
    }

    if (approvalStatus === 'REJECTED') {
      setModalConfig({
        title: '승인이 거절되었어요',
        description: '등록 정보를 다시 확인해 주세요.',
      });
      setIsModalOpen(true);
      return;
    }

    if (path) router.push(path);
  };

  return (
    <div className={styles.container}>
      {!isRegistered && (
        <DashboardBanner
          isRegistered={isRegistered}
          approvalStatus={approvalStatus}
        />
      )}

      <div onClick={() => handleFeatureClick()}>
        <DashboardStats
          isRegistered={isRegistered}
          studentCount={isRegistered ? studentCount : 0}
        />
      </div>

      <h3 className={styles.sectionTitle}>수업 목록</h3>
      <div className={styles.scrollSection} ref={scrollRef}>
        <section className={styles.classSection}>
          {isRegistered &&
            classes.map((cls: any, index: number) => (
              <ClassCard
                key={cls.classId}
                name={cls.className}
                count={cls.maxCount ? `0/${cls.maxCount}` : '0/0'}
                late={0}
                absent={0}
                bgColor={
                  index % 2 === 0 ? 'var(--tertiary-color)' : 'var(--perple)'
                }
                onClick={() =>
                  handleFeatureClick(`/${academyId}/class/${cls.classId}`)
                }
              />
            ))}
          <ClassCard
            isEmpty
            onClick={() => handleFeatureClick(`/${academyId}/class/register`)}
          />
        </section>
      </div>

      <section
        className={styles.reportContainer}
        onClick={() => handleFeatureClick()}
      >
        <DashboardReport
          title="오늘의 보상"
          headers={['클래스', '수업 시간', '미지급', '지급완료']}
          isRegistered={isRegistered}
        />
        <DashboardReport
          title="이번 달 수납"
          headers={['클래스', '수업 시간', '수납 상태', '월 수납 금액']}
          isRegistered={isRegistered}
        />
      </section>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalConfig.title}
        description={modalConfig.description}
        actionText={isRegistered ? '확인' : '학원등록'}
        onAction={() => {
          setIsModalOpen(false);
          if (!isRegistered) {
            router.push('/academy/register');
          }
        }}
      />
    </div>
  );
}
