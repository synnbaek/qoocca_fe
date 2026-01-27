'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './admin.module.css';
import { adminService } from '@/services/adminService';
import { AcademyListResponse, AcademyResponse } from '@/types/admin';
import { toast } from 'sonner';
import CustomModal from '@/components/common/CustomModal';

const REJECTION_REASONS = [
  '제출된 사업자등록증이 식별되지 않습니다.',
  '학원명과 사업자등록증의 상호가 일치하지 않습니다.',
  '학원 주소와 사업자등록증의 주소가 일치하지 않습니다.',
];

export default function AdminPage() {
  const [academies, setAcademies] = useState<AcademyListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 탭 상태 (PENDING/REJECTED)
  const [activeTab, setActiveTab] = useState<'PENDING' | 'REJECTED'>('PENDING');

  // 상세 모달 상태
  const [selectedAcademyId, setSelectedAcademyId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<AcademyResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 승인 모달 상태
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  
  // 반려 모달 상태
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 이미지 미리보기(라이트박스) 상태
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = 
        activeTab === 'PENDING' 
          ? await adminService.getPendingAcademies(0, 50)
          : await adminService.getRejectedAcademies(0, 50);
      setAcademies(response.content);
    } catch (error) {
      console.error('목록 로딩 실패:', error);
      toast.error('목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchList();
  }, [fetchList, activeTab]);

  // 상세 모달 열기
  const openDetail = async (id: number) => {
    setSelectedAcademyId(id);
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    try {
      const data = await adminService.getAcademyDetail(id);
      setDetailData(data);
    } catch (error) {
      toast.error('상세 정보를 불러오지 못했습니다.');
      setIsDetailOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 승인 모달 열기
  const openApproveModal = () => {
    setIsApproveOpen(true);
  };

  // 승인 처리
  const handleApprove = async () => {
    if (!selectedAcademyId) return;

    setIsProcessing(true);
    try {
      await adminService.approveAcademy(selectedAcademyId);
      toast.success('승인되었습니다.');
      setIsApproveOpen(false);
      setIsDetailOpen(false);
      fetchList(); // 목록 갱신
    } catch (error: any) {
        const msg = error.response?.data?.message || '승인 처리 실패';
        toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 반려 모달 열기
  const openRejectModal = () => {
    setRejectReason('');
    setIsRejectOpen(true);
  };

  const handlePresetClick = (reason: string) => {
    setRejectReason(reason);
  };

  // 반려 처리
  const handleReject = async () => {
    if (!selectedAcademyId || !rejectReason.trim()) {
        toast.error('거절 사유를 입력해주세요.');
        return;
    }

    setIsProcessing(true);
    try {
      await adminService.rejectAcademy(selectedAcademyId, rejectReason);
      toast.success('반려되었습니다.');
      setIsRejectOpen(false);
      setIsDetailOpen(false); // 상세 모달도 닫기
      fetchList(); // 목록 갱신
    } catch (error: any) {
        const msg = error.response?.data?.message || '반려 처리 실패';
        toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const statusBadgeClass = (status: string) => {
      switch(status) {
          case 'APPROVED': return styles.badgeApproved;
          case 'REJECTED': return styles.badgeRejected;
          default: return styles.badgePending;
      }
  };

  const statusLabel = (status: string) => {
      switch(status) {
          case 'APPROVED': return '승인됨';
          case 'REJECTED': return '반려됨';
          default: return '대기중'; 
      }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>학원 승인 관리</h1>
        <button className={styles.refreshBtn} onClick={fetchList}>새로고침</button>
      </div>

      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'PENDING' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          승인 대기 중
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'REJECTED' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('REJECTED')}
        >
          반려됨
        </button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>학원명</th>
              <th>상태</th>
              <th>거절 사유</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && academies.length === 0 && (
                <tr>
                    <td colSpan={4} className={styles.emptyState}>
                        {activeTab === 'PENDING' ? '승인 대기 중인 학원이 없습니다.' : '반려된 학원이 없습니다.'}
                    </td>
                </tr>
            )}
            {!isLoading && academies.map((academy) => (
              <tr key={academy.academyId} onClick={() => openDetail(academy.academyId)}>
                <td>{academy.academyId}</td>
                <td>{academy.name}</td>
                <td>
                  <span className={`${styles.badge} ${statusBadgeClass(academy.approvalStatus)}`}>
                    {statusLabel(academy.approvalStatus)}
                  </span>
                </td>
                <td className={styles.reasonText}>
                    {academy.approvalStatus === 'REJECTED' ? academy.rejectionReason : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDetailOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsDetailOpen(false)}>
              <div 
                  className={styles.modalContent} 
                  onClick={e => e.stopPropagation()}
              >
                  {isDetailLoading || !detailData ? (
                      <div>로딩 중...</div>
                  ) : (
                      <div className={styles.detailContent}>
                          <div className={styles.detailHeader}>
                              <div className={styles.detailTitle}>{detailData.name}</div>
                              <div className={styles.detailStatus}>
                                  <span className={`${styles.badge} ${statusBadgeClass(detailData.approvalStatus)}`}>
                                    {statusLabel(detailData.approvalStatus)}
                                  </span>
                              </div>
                          </div>
                          {detailData.approvalStatus === 'REJECTED' && (
                              <div className={styles.rejectionText} style={{ marginTop: '-8px', marginBottom: '12px' }}>
                                  거절 사유: {detailData.rejectionReason}
                              </div>
                          )}

                          <div className={styles.section}>
                              <div className={styles.sectionTitle}>기본 정보</div>
                              <div className={styles.infoGrid}>
                                  <span className={styles.infoLabel}>연락처</span>
                                  <span className={styles.infoValue}>{detailData.phoneNumber || '-'}</span>
                                  <span className={styles.infoLabel}>주소</span>
                                  <span className={styles.infoValue}>
                                      {detailData.baseAddress || detailData.address || '-'} 
                                      {detailData.detailAddress ? ` ${detailData.detailAddress}` : ''}
                                  </span>
                              </div>
                          </div>

                          {/* 사업자등록증 섹션 추가 */}
                          <div className={styles.section}>
                              <div className={styles.sectionTitle}>사업자등록증</div>
                              <div className={styles.certificateWrapper}>
                                  {detailData.certificate ? (
                                      <img 
                                          src={detailData.certificate} 
                                          alt="사업자등록증" 
                                          className={styles.certificateImage}
                                          onClick={() => {
                                              setPreviewUrl(detailData.certificate!);
                                              setIsPreviewOpen(true);
                                          }}
                                      />
                                  ) : (
                                      <div style={{ color: '#9ca3af', padding: '20px' }}>등록된 서류가 없습니다.</div>
                                  )}
                              </div>
                          </div>

                          <div className={styles.section}>
                              <div className={styles.sectionTitle}>학원 소개</div>
                              <div className={styles.infoGrid}>
                                  <span className={styles.infoLabel}>한줄 소개</span>
                                  <span className={styles.infoValue}>{detailData.briefInfo || '-'}</span>
                                  <span className={styles.infoLabel}>상세 소개</span>
                                  <span className={styles.infoValue} style={{whiteSpace: 'pre-wrap'}}>
                                      {detailData.detailInfo || '-'}
                                  </span>
                              </div>
                          </div>
                          
                          {(detailData.imageUrls && detailData.imageUrls.length > 0) && (
                            <div className={styles.section}>
                                <div className={styles.sectionTitle}>이미지</div>
                                <div className={styles.imageGrid}>
                                    {detailData.imageUrls.map((url, idx) => (
                                        <img key={idx} src={url} alt="Academy" className={styles.academyImage} />
                                    ))}
                                </div>
                            </div>
                          )}

                          <div className={styles.actions}>
                              <button className={`${styles.btn} ${styles.btnCancel}`} onClick={() => setIsDetailOpen(false)}>닫기</button>
                              {detailData.approvalStatus === 'PENDING' && (
                                  <>
                                    <button 
                                        className={`${styles.btn} ${styles.btnReject}`} 
                                        onClick={openRejectModal}
                                        disabled={isProcessing}
                                    >
                                        반려
                                    </button>
                                    <button 
                                        className={`${styles.btn} ${styles.btnApprove}`} 
                                        onClick={openApproveModal}
                                        disabled={isProcessing}
                                    >
                                        승인
                                    </button>
                                  </>
                              )}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      <CustomModal
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
          title="승인 반려"
          description="반려 사유를 입력해주세요."
          actionText={isProcessing ? "처리 중..." : "반려"}
          onAction={handleReject}
      >
          <div className={styles.presetContainer}>
            {REJECTION_REASONS.map((reason, idx) => (
              <button
                key={idx}
                className={`${styles.presetBtn} ${rejectReason === reason ? styles.presetBtnActive : ''}`}
                onClick={() => handlePresetClick(reason)}
              >
                {reason}
              </button>
            ))}
          </div>

          <textarea 
              className={styles.rejectionInput}
              placeholder="반려 사유를 입력하세요."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
          />
      </CustomModal>

      <CustomModal
          isOpen={isApproveOpen}
          onClose={() => setIsApproveOpen(false)}
          title="승인 확인"
          description={`'${detailData?.name}' 학원의 등록 신청을 승인하시겠습니까?`}
          actionText={isProcessing ? "처리 중..." : "승인"}
          onAction={handleApprove}
          cancelText="취소"
      />
      
      {/* 이미지 라이트박스 모달 */}
      {isPreviewOpen && (
          <div className={styles.lightboxOverlay} onClick={() => setIsPreviewOpen(false)}>
              <span className={styles.lightboxClose}>&times;</span>
              <img 
                  src={previewUrl} 
                  alt="사업자등록증 원본" 
                  className={styles.lightboxImage} 
                  onClick={(e) => e.stopPropagation()} 
              />
          </div>
      )}

    </div>
  );
}
