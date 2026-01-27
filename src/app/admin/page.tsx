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
  
  // 상세 모달 상태
  const [selectedAcademyId, setSelectedAcademyId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<AcademyResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 반려 모달 상태
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getPendingAcademies(0, 50); // 일단 첫 페이지만 50개
      setAcademies(response.content);
    } catch (error) {
      console.error('목록 로딩 실패:', error);
      toast.error('대기 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

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

  // 승인 처리
  const handleApprove = async () => {
    if (!selectedAcademyId) return;
    if (!confirm('정말 승인하시겠습니까?')) return;

    setIsProcessing(true);
    try {
      await adminService.approveAcademy(selectedAcademyId);
      toast.success('승인되었습니다.');
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
        <button className={styles.btnCancel} onClick={fetchList}>새로고침</button>
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
                    <td colSpan={4} style={{textAlign: 'center', padding: '40px'}}>
                        대기 중인 학원이 없습니다.
                    </td>
                </tr>
            )}
            {academies.map((academy) => (
              <tr key={academy.academyId} onClick={() => openDetail(academy.academyId)}>
                <td>{academy.academyId}</td>
                <td style={{fontWeight: 600}}>{academy.name}</td>
                <td>
                  <span className={`${styles.badge} ${statusBadgeClass(academy.approvalStatus)}`}>
                    {statusLabel(academy.approvalStatus)}
                  </span>
                </td>
                <td style={{color: '#6b7280'}}>
                    {academy.approvalStatus === 'REJECTED' ? academy.rejectionReason : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 상세 정보 모달 (Custom Implementation for richer content) */}
      {isDetailOpen && (
          <div className="overlay" style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }} onClick={() => setIsDetailOpen(false)}>
              <div 
                  className={styles.tableCard} 
                  style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
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
                              {detailData.approvalStatus === 'REJECTED' && (
                                  <div style={{marginTop: '12px', color: '#dc2626', fontWeight: 500}}>
                                      거절 사유: {detailData.rejectionReason}
                                  </div>
                              )}
                          </div>

                          <div className={styles.section}>
                              <div className={styles.sectionTitle}>기본 정보</div>
                              <div className={styles.infoGrid}>
                                  <span className={styles.infoLabel}>ID</span>
                                  <span className={styles.infoValue}>{detailData.academyId}</span>
                                  <span className={styles.infoLabel}>연락처</span>
                                  <span className={styles.infoValue}>{detailData.phoneNumber || '-'}</span>
                                  <span className={styles.infoLabel}>주소</span>
                                  <span className={styles.infoValue}>
                                      {detailData.baseAddress || detailData.address || '-'} 
                                      {detailData.detailAddress ? ` ${detailData.detailAddress}` : ''}
                                  </span>
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
                              <button className={styles.btnCancel} onClick={() => setIsDetailOpen(false)}>닫기</button>
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
                                        onClick={handleApprove}
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

    </div>
  );
}
