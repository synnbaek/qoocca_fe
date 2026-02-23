'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './Dashboard.module.css';
import ClassCard from '@/components/common/ClassCard';

import DashboardBanner from './components/DashboardBanner';
import DashboardStats from './components/DashboardStats';
import DashboardReport from './components/DashboardReport';
import CustomModal from '@/components/common/CustomModal';
import { toast } from 'sonner';

import { dashboardService } from '@/services/dashboardService';
import {
  DashboardStatsData,
  ReceiptSummary,
  ClassSummary,
  AcademyInfo
} from '@/types/dashboard';

const AcademyRejectionModal = dynamic(() => import('./components/AcademyRejectionModal'), { ssr: false });
const AcademySelectionModal = dynamic(() => import('@/components/auth/AcademySelectionModal'), { ssr: false });

interface Props {
  academyId?: string;
  initialData: {
    classes?: ClassSummary[];
    stats?: DashboardStatsData;
    receipts?: ReceiptSummary[];
    academyInfo?: AcademyInfo;
  };
}

export default function Dashboard({ academyId, initialData }: Props) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    'REJECTED' | 'PENDING' | 'APPROVED' | null
  >(initialData.academyInfo?.approvalStatus || null);

  const isRegistered = !!academyId && academyId !== 'undefined';

  const [classes, setClasses] = useState<ClassSummary[]>(initialData.classes || []);
  // Loading is false by default since we have initial data
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: '',
  });

  const [stats, setStats] = useState<DashboardStatsData>(
    initialData.stats || {
      studentCount: 0,
      presentCount: 0,
      totalTodayCount: 0,
      noCardCount: 0,
      totalMonthlyFee: 0,
    }
  );

  const [receipts, setReceipts] = useState<ReceiptSummary[]>(initialData.receipts || []);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(
    (initialData.classes && initialData.classes.length > 0) ? initialData.classes[0].classId : null
  );
  const selectedClassName = classes.find((c: ClassSummary) => c.classId === selectedClassId)?.className;

  // 학원 선택 모달 관련 상태
  const [userAcademies, setUserAcademies] = useState<AcademyInfo[]>([]);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);

  // 승인 거절 모달 관련 상태
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);  // 거절 정보 상태
  const [rejectionInfo, setRejectionInfo] = useState<{
    reason: string;
    academyName: string;
    files: File[];
    phoneNumber?: string;
    baseAddress?: string; // address -> baseAddress 변경
    detailAddress?: string;
    submittedFileUrl?: string;
  }>({
    reason: '',
    academyName: '',
    files: [],
  });

  // Rejection info initialization
  useEffect(() => {
    if (initialData.academyInfo?.approvalStatus === 'REJECTED') {
      setRejectionInfo({
        reason: initialData.academyInfo.rejectionReason || '등록 정보에 문제가 있어 승인이 거절되었습니다.\n사유를 확인하고 다시 제출해 주세요.',
        academyName: initialData.academyInfo.name || '',
        phoneNumber: initialData.academyInfo.phoneNumber,
        baseAddress: initialData.academyInfo.baseAddress || '',
        detailAddress: initialData.academyInfo.detailAddress,
        submittedFileUrl: initialData.academyInfo.certificate,
        files: [],
      });
      setIsRejectionModalOpen(true);
    }
  }, [initialData.academyInfo]);

  // 학원 미지정시 리다이렉션 로직 등은 유지 보수가 필요할 수 있으나,
  // Server Side에서 academyId가 없으면 이미 redirect 시키거나 처리했으므로
  // 여기서는 클라이언트 사이드 네비게이션으로 들어왔을 때 등을 대비한 방어 코드 정도만 남김.
  // 다만 SSR 전환으로 대부분의 데이터가 미리 있으므로, useEffect fetching은 제거함.

  // SSR 데이터를 받았을 경우 클라이언트 사이드 중복 요청 방지
  useEffect(() => {
    const checkRedirect = async () => {
      // SSR 데이터를 받았더라도 최신 상태 확인을 위해 client-side에서도 fetch 수행 (상태 업데이트 확인용)
      // if (isRegistered && initialData.academyInfo && initialData.classes && initialData.stats) { ... }

      if (!isRegistered) {
        try {
          const academies = await dashboardService.getMyAcademies();
          setUserAcademies(academies);
          if (academies.length === 1) {
            router.replace(`/academy/${academies[0].academyId}`);
          } else if (academies.length > 1) {
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

        if (status === 'REJECTED') {
          setRejectionInfo({
            reason: academyInfo.rejectionReason || '등록 정보에 문제가 있어 승인이 거절되었습니다.\n사유를 확인하고 다시 제출해 주세요.',
            academyName: academyInfo.name || '',
            phoneNumber: academyInfo.phoneNumber,
            baseAddress: academyInfo.baseAddress || '', 
            detailAddress: academyInfo.detailAddress,
            submittedFileUrl: academyInfo.certificate,
            files: [],
          });
          setIsRejectionModalOpen(true);
        } else if (status === 'APPROVED') {
          // statsData와 classData 요청은 실패하더라도 전체 상태가 PENDING으로 가지 않도록 개별 catch 처리
          try {
            const [classData, statsData] = await Promise.all([
              dashboardService.getClassSummary(academyId).catch(err => {
                console.warn('클래스 정보 로딩 실패:', err);
                return [];
              }),
              dashboardService.getStats(academyId).catch(err => {
                console.warn('통계 정보 로딩 실패:', err);
                return stats; // 기존 통계 유지
              }),
            ]);

            setClasses(classData || []);
            if (classData && classData.length > 0) {
              setSelectedClassId(classData[0].classId);
            }
            setStats(statsData);

            const receiptData = await dashboardService.getReceiptSummary(
              academyId,
              new Date().getFullYear(),
              new Date().getMonth() + 1
            ).catch(err => {
              console.warn('영수증 정보 로딩 실패:', err);
              return [];
            });
            setReceipts(receiptData || []);
          } catch (e) {
            console.error('Dashboard data partial fetch failed:', e);
          }
        }
      } catch (err: any) {
        console.error('학원 정보 로딩 실패:', err.response?.data || err.message);
        // 학원 정보 조회 자체가 실패한 경우에만 fallback 처리 고려
      } finally {
        setIsLoading(false);
      }
    };
    checkRedirect();
  }, [isRegistered, router, academyId, initialData]);


  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  useEffect(() => {
    if (searchParams?.get('alert') === 'access_denied') {
      // 이미 Rejection 모달이 뜨는 경우 중복 방지
      if (approvalStatus === 'REJECTED') {
        router.replace(`/academy/${academyId}`);
        return;
      }

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
    if (!isRegistered) {
      setModalConfig({
        title: '학원 등록이 필요해요',
        description: '모든 기능을 이용하시려면 먼저 학원 정보를 등록해 주세요.',
      });
      setIsModalOpen(true);
      return;
    }

    if (approvalStatus !== 'APPROVED') {
      if (approvalStatus === 'REJECTED') {
        setIsRejectionModalOpen(true);
        return;
      }

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

  const handleRejectionSubmit = async (data: {
    academyName: string;
    files: File[];
    baseAddress: string;
    detailAddress: string;
  }) => {
    if (!academyId) return;

    try {
      const formData = new FormData();
      formData.append('name', data.academyName);
      formData.append('baseAddress', data.baseAddress);
      formData.append('detailAddress', data.detailAddress);

      // 파일이 새로 업로드된 경우에만 추가
      if (data.files && data.files.length > 0) {
        formData.append('certificateFile', data.files[0]);
      }

      await dashboardService.resubmitAcademy(academyId, formData);

      toast.success('승인 재요청이 접수되었습니다.');
      setIsRejectionModalOpen(false);

      // 상태 갱신: 재요청 후 UI에서 상태를 PENDING으로 즉시 변경
      setApprovalStatus('PENDING');
    } catch (error: any) {
      console.error('승인 재요청 실패:', error);
      const msg = error.response?.data?.message || '승인 재요청에 실패했습니다.';
      toast.error(msg);
    }
  };

  return (
    <div className={styles.pageLayout}>
      <div className={styles.mainContent}>

        {!isRegistered && (
          <DashboardBanner isRegistered={isRegistered} approvalStatus={''} />
        )}

        <div 
          className={`${styles.lockedSection} ${approvalStatus !== 'APPROVED' ? styles.isLocked : ''}`}
          onClickCapture={(e) => {
            if (approvalStatus !== 'APPROVED') {
              e.preventDefault();
              e.stopPropagation();
              handleFeatureClick();
            }
          }}
        >
          {approvalStatus !== 'APPROVED' && <div className={styles.lockedOverlay} />}
          
          <DashboardStats
            isRegistered={isRegistered}
            studentCount={isRegistered ? stats.studentCount : 0}
            presentCount={stats.presentCount}
            totalTodayCount={stats.totalTodayCount}
            noCardCount={stats.noCardCount}
            totalMonthlyFee={stats.totalMonthlyFee}
            onStatClick={(type) => {
              const paths = {
                student: `/academy/${academyId}/student`,
                attendance: `/academy/${academyId}/attendance`,
                payment: `/academy/${academyId}/payment`,
              };
              handleFeatureClick(paths[type]);
            }}
          />

          <h3 className={styles.sectionTitle}>수업 목록</h3>
          <div className={styles.scrollSection} ref={scrollRef}>
            <section className={styles.classSection}>
              {isRegistered &&
                classes.map((cls: ClassSummary, index: number) => (
                  <ClassCard
                    key={cls.classId}
                    name={cls.className}
                    count={`${cls.presentCount + cls.lateCount}/${cls.currentCount
                      }`}
                    late={cls.lateCount}
                    absent={cls.absentCount}
                    bgColor={
                      index % 2 === 0 ? 'var(--tertiary-color)' : 'var(--purple)'
                    }
                    onClick={() =>
                      handleFeatureClick(
                        `/academy/${academyId}/attendance/${cls.classId}?className=${encodeURIComponent(cls.className)}`
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

        <AcademyRejectionModal
          isOpen={isRejectionModalOpen}
          onClose={() => setIsRejectionModalOpen(false)}
          rejectionInfo={rejectionInfo}
          onSubmit={handleRejectionSubmit}
        />
      </div>
    </div>
  );
}