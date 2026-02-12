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
  
  // 탭 상태 (ALL/PENDING/REJECTED)
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'REJECTED'>('ALL');
  
  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

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

  // 일괄 선택 상태
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 15;

  const fetchList = useCallback(async (page = 0) => {
    setIsLoading(true);
    setSelectedIds([]); 
    try {
      const response = 
        activeTab === 'ALL'
          ? await adminService.getAllAcademies(page, PAGE_SIZE)
          : activeTab === 'PENDING' 
            ? await adminService.getPendingAcademies(page, PAGE_SIZE)
            : await adminService.getRejectedAcademies(page, PAGE_SIZE);
      
      setAcademies(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (error) {
      console.error('목록 로딩 실패:', error);
      toast.error('목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchList(0);
    setSearchTerm(''); // 탭 변경 시 검색어 초기화
  }, [fetchList, activeTab]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchList(newPage);
      window.scrollTo(0, 0);
    }
  };

  // 검색 필터링 로직
  const filteredAcademies = academies.filter(academy => 
    academy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // 일괄 선택 핸들러
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pendingIds = filteredAcademies
        .filter(a => a.approvalStatus === 'PENDING')
        .map(a => (a.id || a.academyId) as number);
      setSelectedIds(pendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 행 클릭 이벤트(상세보기) 방지
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 일괄 승인 처리
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      await adminService.approveBatchAcademies(selectedIds);
      toast.success(`${selectedIds.length}개의 학원이 일괄 승인되었습니다.`);
      setSelectedIds([]);
      fetchList();
    } catch (error: any) {
      toast.error('일괄 승인 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

    // 상태 라벨 헬퍼
  const statusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기 중';
      case 'REJECTED': return '반려됨';
      case 'APPROVED': return '승인됨';
      default: return status;
    }
  };

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return styles.badgePending;
      case 'REJECTED': return styles.badgeRejected;
      case 'APPROVED': return styles.badgeApproved;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>학원 승인 관리</h1>
        <button className={styles.refreshBtn} onClick={() => fetchList(currentPage)}>새로고침</button>
      </div>

      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
            <button 
            className={`${styles.tab} ${activeTab === 'ALL' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('ALL')}
            >
            전체
            </button>
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

        <div className={styles.searchContainer}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="학원명으로 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
            />
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  onChange={handleSelectAll}
                  checked={selectedIds.length > 0 && selectedIds.length === filteredAcademies.filter(a => a.approvalStatus === 'PENDING').length}
                />
              </th>
              <th>ID</th>
              <th>학원명</th>
              <th>상태</th>
              <th>거절 사유</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && filteredAcademies.length === 0 && (
                <tr>
                    <td colSpan={5} className={styles.emptyState}>
                        {searchTerm ? '검색 결과가 없습니다.' : (
                            activeTab === 'ALL' ? '등록된 학원이 없습니다.' :
                            activeTab === 'PENDING' ? '승인 대기 중인 학원이 없습니다.' : '반려된 학원이 없습니다.'
                        )}
                    </td>
                </tr>
            )}
            {!isLoading && filteredAcademies.map((academy) => {
              const displayId = (academy.id || academy.academyId) as number;
              return (
                <tr key={displayId} onClick={() => displayId && openDetail(displayId)}>
                  <td onClick={(e) => academy.approvalStatus === 'PENDING' && handleSelectOne(e, displayId)}>
                    {academy.approvalStatus === 'PENDING' && (
                      <input 
                        type="checkbox" 
                        className={styles.checkbox}
                        checked={selectedIds.includes(displayId)}
                        readOnly
                      />
                    )}
                  </td>
                  <td>{displayId || '-'}</td>
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
            ); })}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div className={styles.bulkActionBar}>
          <div className={styles.selectedInfo}>
            선택된 학원 <span className={styles.selectedCount}>{selectedIds.length}</span>개
          </div>
          <div className={styles.bulkActions}>
            <button 
              className={`${styles.bulkBtn} ${styles.bulkApproveBtn}`}
              onClick={handleBulkApprove}
              disabled={isProcessing}
            >
              {isProcessing ? '처리 중...' : '일괄 승인'}
            </button>
            <button 
              className={`${styles.bulkBtn} ${styles.bulkCancelBtn}`}
              onClick={() => setSelectedIds([])}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      {!isLoading && totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === 0}
            onClick={() => handlePageChange(0)}
            title="맨 처음"
          >
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          </button>
          
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i;
            } else if (currentPage <= 2) {
              pageNum = i;
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button 
                key={pageNum} 
                className={`${styles.pageBtn} ${currentPage === pageNum ? styles.activePage : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button 
            className={styles.pageBtn} 
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <button 
            className={styles.pageBtn} 
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
            title="맨 끝"
          >
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          </button>
        </div>
      )}

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
                              <div className={styles.sectionTitle}>등록자 정보</div>
                              <div className={styles.infoGrid}>
                                  <span className={styles.infoLabel}>이름</span>
                                  <span className={styles.infoValue}>{detailData.userName || '-'}</span>
                                  <span className={styles.infoLabel}>연락처</span>
                                  <span className={styles.infoValue}>{detailData.userPhoneNumber || '-'}</span>
                              </div>
                          </div>

                          <div className={styles.section}>
                              <div className={styles.sectionTitle}>기본 정보</div>
                              <div className={styles.infoGrid}>
                                  <span className={styles.infoLabel}>학원 연락처</span>
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

                          <div className={styles.section}>
                              <div className={styles.sectionTitle}>대상 연령 및 과목</div>
                              <div className={styles.infoGrid}>
                                  <span className={styles.infoLabel}>연령대</span>
                                  <span className={styles.infoValue}>
                                      {detailData.ages && detailData.ages.length > 0 
                                          ? detailData.ages.map(a => a.ageCode).join(', ') 
                                          : '-'}
                                  </span>
                                  <span className={styles.infoLabel}>수강 과목</span>
                                  <span className={styles.infoValue}>
                                      {detailData.subjects && detailData.subjects.length > 0 
                                          ? detailData.subjects.map(s => `${s.detailSubject}(${s.mainSubjectCode})`).join(', ') 
                                          : '-'}
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