'use client';

import { useState, useEffect } from 'react';
import styles from './AcademyRejectionModal.module.css';
import TextInput from '../../../register/components/TextInput';
import MultiFileInput from '../../../register/components/MultiFileInput';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rejectionInfo: {
    reason: string;
    academyName: string;
    files: File[];
    baseAddress?: string;
    detailAddress?: string;
    submittedFileUrl?: string;
  };
  onSubmit: (data: { 
    academyName: string; 
    files: File[];
    baseAddress: string;
    detailAddress: string;
  }) => void;
}

export default function AcademyRejectionModal({
  isOpen,
  onClose,
  rejectionInfo,
  onSubmit,
}: Props) {
  const [academyName, setAcademyName] = useState(rejectionInfo.academyName);
  const [baseAddress, setBaseAddress] = useState(rejectionInfo.baseAddress || '');
  const [detailAddress, setDetailAddress] = useState(rejectionInfo.detailAddress || '');
  const [businessFiles, setBusinessFiles] = useState<File[]>(rejectionInfo.files);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('>>> Modal received submittedFileUrl:', rejectionInfo.submittedFileUrl);
      setAcademyName(rejectionInfo.academyName);
      setBaseAddress(rejectionInfo.baseAddress || '');
      setDetailAddress(rejectionInfo.detailAddress || '');
      setBusinessFiles(rejectionInfo.files);
    }
  }, [isOpen, rejectionInfo]);

  const handleSubmit = () => {
    onSubmit({ 
      academyName, 
      baseAddress,
      detailAddress,
      files: businessFiles 
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>학원 승인이 거절되었어요</h2>
            <p className={styles.subtitle}>
              정보를 수정하여 다시 승인 요청을 진행해 주세요.
            </p>
          </div>

          <div className={styles.rejectionAlert}>
            <div className={styles.alertTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              거절 사유
            </div>
            <p className={styles.alertContent}>{rejectionInfo.reason}</p>
          </div>

          <div className={styles.formSection}>
            <div className={styles.inputGroup}>
              <TextInput
                label="학원명"
                value={academyName}
                onChange={setAcademyName}
                placeholder="학원명을 입력하세요"
              />
            </div>

            <div className={styles.inputGroup}>
              <TextInput
                label="주소"
                value={baseAddress}
                onChange={setBaseAddress}
                placeholder="도로명 주소 (예: 서울시 강남구...)"
              />
            </div>

            <div className={styles.inputGroup}>
              <TextInput
                label="상세 주소"
                value={detailAddress}
                onChange={setDetailAddress}
                placeholder="상세 주소 (예: 2층)"
              />
            </div>

            {/* 기존 제출 서류 확인 섹션 */}
            {rejectionInfo.submittedFileUrl && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>기존 제출 서류</label>
                <div className={styles.previewContainer}>
                  <div 
                    className={styles.imageWrapper} 
                    onClick={() => setIsPreviewOpen(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={rejectionInfo.submittedFileUrl}
                      alt="기존 사업자등록증"
                      className={styles.previewImage}
                      onError={(e) => {
                        console.error('이미지 로딩 실패:', rejectionInfo.submittedFileUrl);
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=이미지+불러오기+실패';
                      }}
                    />
                    <div className={styles.imageHoverOverlay}>
                      <span>크게 보기</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <MultiFileInput
                label="사업자 등록증 제출"
                files={businessFiles}
                onChange={setBusinessFiles}
                description="이미지 또는 PDF 파일"
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!academyName || !baseAddress || !detailAddress}
            >
              승인 재요청
            </button>
          </div>
        </div>
      </div>

      {/* 이미지 크게 보기 오버레이 */}
      {isPreviewOpen && rejectionInfo.submittedFileUrl && (
        <div className={styles.lightboxOverlay} onClick={() => setIsPreviewOpen(false)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeLightbox} 
              onClick={() => setIsPreviewOpen(false)}
            >
              &times;
            </button>
            <img 
              src={rejectionInfo.submittedFileUrl} 
              alt="사업자등록증 원본" 
              className={styles.fullImage}
            />
          </div>
        </div>
      )}
    </>
  );
}
