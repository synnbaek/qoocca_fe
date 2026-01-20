'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';
import ClassCard from '@/components/common/ClassCard';

import DashboardBanner from './components/DashboardBanner';
import DashboardStats from './components/DashboardStats';
import DashboardReport from './components/DashboardReport';
import CustomModal from '@/components/common/CustomModal';
import AttendanceRightSidebar from './components/AttendanceRightSidebar';

import { dashboardService } from '@/services/dashboardService';
import {
  DashboardStatsData,
  ReceiptSummary,
  ClassSummary,
  AcademyInfo
} from '@/types/dashboard';
import AcademySelectionModal from '@/components/auth/AcademySelectionModal';

interface Props {
  academyId?: string;
}

export default function Dashboard({ academyId }: Props) {
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    'REJECTED' | 'PENDING' | 'APPROVED' | null
  >(null);

  const isRegistered = !!academyId && academyId !== 'undefined';

  const [classes, setClasses] = useState<ClassSummary[]>([]);
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
  const selectedClassName = classes.find((c: ClassSummary) => c.classId === selectedClassId)?.className;

  // 학원 선택 모달 관련 상태
  const [userAcademies, setUserAcademies] = useState<AcademyInfo[]>([]);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      if (!isRegistered) {
        // 등록된 학원이 없는 경우 (또는 /academy 경로로 온 경우) 사용자의 학원 목록을 확인
        try {
          const academies = await dashboardService.getMyAcademies();
          setUserAcademies(academies);

          if (academies.length === 1) {
            // 학원이 1개만 있으면 바로 해당 학원으로 이동
            router.replace(`/academy/${academies[0].id}`);
          } else if (academies.length > 1) {
            // 학원이 여러 개면 모달 오픈
            setIsSelectionModalOpen(true);
          }
        } catch (error) {
          console.error('학원 목록 조회 실패:', error);
        }
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const academyInfo = await dashboardService.getAcademyInfo(academyId);
        const status = academyInfo.approvalStatus;
        setApprovalStatus(status);

        if (status === 'APPROVED') {
          const [classData, statsData] = await Promise.all([
            dashboardService.getClassSummary(academyId),
            dashboardService.getStats(academyId),
          ]);

          setClasses(classData || []);
          if (classData && classData.length > 0) {
            setSelectedClassId(classData[0].classId);
          }
          setStats(statsData);

          try {
            const receiptData = await dashboardService.getReceiptSummary(
              academyId,
              new Date().getFullYear(),
              new Date().getMonth() + 1
            );
            setReceipts(receiptData || []);
          } catch (e) {
            setReceipts([]);
          }
        }
      } catch (err: any) {
        console.error('데이터 로딩 실패:', err.response?.data || err.message);
        // If API fails (e.g. 403 Forbidden), default to PENDING to show appropriate modal
        setApprovalStatus('PENDING');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [academyId, isRegistered]);

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  useEffect(() => {
    if (searchParams?.get('alert') === 'access_denied') {
      // Handle null/error status by defaulting to 'PENDING' or generic message
      const status = approvalStatus || 'PENDING';
      const title = status === 'PENDING' ? '승인 대기 중이에요' : '승인이 거절되었어요';
      const desc = status === 'PENDING' ? '학원 승인이 완료된 후에 사용할 수 있는 기능입니다.\n조금만 기다려 주세요!' : '등록 정보를 다시 확인해 주세요.';

      setModalConfig({
        title: title,
        description: desc
      });
      setIsModalOpen(true);

      router.replace(`/academy/${academyId}`)
    }
  }, [searchParams, approvalStatus, router, academyId]);

  const handleFeatureClick = (path?: string) => {
    // console.log('handleFeatureClick called. status:', approvalStatus);
    if (!isRegistered) {
      setModalConfig({
        title: '학원 등록이 필요해요',
        description: '모든 기능을 이용하시려면 먼저 학원 정보를 등록해 주세요.',
      });
      setIsModalOpen(true);
      return;
    }

    if (approvalStatus !== 'APPROVED') {
      // Catch all non-approved states (including null/error)
      const status = approvalStatus || 'PENDING';
      const title = status === 'PENDING' ? '승인 대기 중이에요' : '승인이 거절되었어요';
      const desc = status === 'PENDING'
        ? '학원 승인이 완료된 후에 사용할 수 있는 기능입니다.\n조금만 기다려 주세요!'
        : '등록 정보를 다시 확인해 주세요.';

      setModalConfig({
        title,
        description: desc,
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

        {/* Wrap main interactive area to catch clicks on non-button elements if needed, 
          but handleFeatureClick on specific elements is better UX. 
          However, user asked to "show modal when clicking ANYTHING". 
          Let's wrap the interactive parts with a capture handler if not approved. */}
        <div onClickCapture={(e) => {
          if (approvalStatus !== 'APPROVED') {
            // Prevent default action and stop propagation to prevent navigation
            e.preventDefault();
            e.stopPropagation();
            handleFeatureClick();
          }
        }}>
          <DashboardStats
            isRegistered={isRegistered}
            studentCount={isRegistered ? stats.studentCount : 0}
            presentCount={stats.presentCount}
            totalTodayCount={stats.totalTodayCount}
            noCardCount={stats.noCardCount}
            totalMonthlyFee={stats.totalMonthlyFee}
          />

          <h3 className={styles.sectionTitle}>수업 목록</h3>
          <div className={styles.scrollSection} ref={scrollRef}>
            <section className={styles.classSection}>
              {isRegistered &&
                classes.map((cls: any, index: number) => (
                  <ClassCard
                    key={cls.classId}
                    name={cls.className}
                    count={`${cls.presentCount + cls.lateCount}/${cls.currentCount
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
                      className={`${styles.reportItem} ${styles[`status${item.status}`]
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

        </div>

        <AcademySelectionModal
          isOpen={isSelectionModalOpen}
          onClose={() => setIsSelectionModalOpen(false)}
          academies={userAcademies}
          onSelect={(id) => {
            setIsSelectionModalOpen(false);
            router.push(`/academy/${id}`);
          }}
        />

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
      {isRegistered && approvalStatus === 'APPROVED' && (
        <AttendanceRightSidebar
          academyId={Number(academyId)}
          classTitle={selectedClassName}
        />
      )}
    </div>
  );
}
