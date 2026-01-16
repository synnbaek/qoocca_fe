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
import AttendanceRightSidebar from './components/AttendanceRightSidebar';

interface Props {
  academyId?: string;
}

interface DashboardStatsData {
  studentCount: number;
  presentCount: number;
  totalTodayCount: number;
  noCardCount: number;
  totalMonthlyFee: number;
}

interface ReceiptSummary {
  className: string;
  classTime: string;
  status: 'BEFORE_REQUEST' | 'ISSUED' | 'PAID';
  statusLabel: string;
  totalAmount: number;
}

export default function Dashboard({ academyId }: Props) {
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    'REJECTED' | 'PENDING' | 'APPROVED' | null
  >(null);

  const isRegistered = !!academyId && academyId !== 'undefined';

  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: '',
  });

  const [stats, setStats] = useState<DashboardStatsData>({
    studentCount: 0,
    presentCount: 0,
    totalTodayCount: 0,
    noCardCount: 0,
    totalMonthlyFee: 0,
  });

  const [receipts, setReceipts] = useState<ReceiptSummary[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const selectedClassName = classes.find((c: any) => c.classId === selectedClassId)?.className;

  
  useEffect(() => {
    const fetchData = async () => {
      if (!isRegistered) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [academyRes] = await Promise.all([
          axiosInstance.get(`/api/academy/${academyId}`),
        ]);

        const status = academyRes.data.approvalStatus;
        setApprovalStatus(status);

        if (status === 'APPROVED') {

          const [classRes, statsRes] = await Promise.all([
            axiosInstance.get(`/api/academy/${academyId}/class/summary`),
            axiosInstance.get(`/api/academy/${academyId}/stats`),
          ]);

          setClasses(classRes.data || []);
          if (classRes.data && classRes.data.length > 0) {
            setSelectedClassId(classRes.data[0].classId);
          }
          setStats(statsRes.data);

          try {
            const receiptRes = await axiosInstance.get(
              `/api/academy/${academyId}/receipt/dashboard-main`,
              {
                params: {
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1,
                },
              }
            );
            setReceipts(receiptRes.data || []);
          } catch (e) {
            setReceipts([]);
          }
        }
      } catch (err: any) {
        console.error('데이터 로딩 실패:', err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [academyId, isRegistered]);

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
    <div className={styles.pageLayout}>
      <div className={styles.mainContent}>

      {!isRegistered && (
        <DashboardBanner isRegistered={isRegistered} approvalStatus={''} />
      )}

      <div onClick={() => handleFeatureClick()}>
        <DashboardStats
          isRegistered={isRegistered}
          studentCount={isRegistered ? stats.studentCount : 0}
          presentCount={stats.presentCount}
          totalTodayCount={stats.totalTodayCount}
          noCardCount={stats.noCardCount}
          totalMonthlyFee={stats.totalMonthlyFee}
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
                count={`${cls.presentCount + cls.lateCount}/${
                  cls.currentCount
                }`}
                late={cls.lateCount}
                absent={cls.absentCount}
                bgColor={
                  index % 2 === 0 ? 'var(--tertiary-color)' : 'var(--perple)'
                }
                onClick={() =>
                  handleFeatureClick(
                    `/academy/${academyId}/class/${cls.classId}`
                  )
                }
              />
            ))}
          <ClassCard
            isEmpty
            onClick={() =>
              handleFeatureClick(`/academy/${academyId}/class/register`)
            }
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
          onClick={() => handleFeatureClick(`/academy/${academyId}/reward`)}
        />
        <DashboardReport
          title="이번 달 수납"
          headers={['클래스', '수업 시간', '수납 상태', '월 수납 금액']}
          isRegistered={isRegistered}
          onClick={() => handleFeatureClick(`/academy/${academyId}/payment`)}
        >
          {receipts.length > 0 &&
            receipts.map((item, index) => (
              <div key={index} className={styles.reportRowContent}>
                <div className={styles.reportItem}>{item.className}</div>
                <div className={styles.reportItem}>{item.classTime}</div>
                <div
                  className={`${styles.reportItem} ${
                    styles[`status${item.status}`]
                  }`}
                >
                  ● {item.statusLabel}
                </div>
                <div className={`${styles.reportItem} ${styles.amountText}`}>
                  {item.totalAmount.toLocaleString()}원
                </div>
              </div>
            ))}
        </DashboardReport>
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
      {isRegistered && (
        <AttendanceRightSidebar 
          academyId={Number(academyId)} 
          classTitle={selectedClassName}
        />
      )}
    </div>
  );
}
