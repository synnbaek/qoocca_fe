'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './complete.module.css';
import AcademyTitle from '../components/AcademyTitle';
import Button from '../../../../components/common/Button';
import { useState, useEffect } from 'react';
import { getImageUploadStatus } from '@/api/academyApi';

function AcademyCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const academyId = searchParams.get('academyId');
  const jobId = searchParams.get('jobId');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    if (academyId && jobId) {
      const poll = async () => {
        try {
          const statusData = await getImageUploadStatus(academyId, jobId);
          if (statusData.status === 'COMPLETED') {
            setUploadStatus('COMPLETED');
          } else if (statusData.status === 'FAILED') {
            setUploadStatus('FAILED');
          } else {
            setTimeout(poll, 2000);
          }
        } catch (e) {
          console.error('Polling failed', e);
        }
      };
      poll();
    }
  }, [academyId, jobId]);

  const handleConfirm = () => {
    if (academyId) {
      router.push(`/academy/${academyId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className={styles.completeContainer}>
      <div className={styles.titleWrapper}>
        <AcademyTitle title="학원 등록 완료" />
      </div>

      <div className={styles.sectionBox}>
        <p className={styles.completeTitle}>
          학원 등록이 완료되었습니다.
          <br />
          관리자 승인까지 1~3일 정도 소요될 수 있습니다.
        </p>

        <p className={styles.completeText}>
          승인 완료 후 출결, 수업 관리, 수납 관리 등 모든 기능을 이용하실 수
          있습니다.
        </p>

        {jobId && (
          <div className={styles.uploadStatus}>
            {uploadStatus === 'COMPLETED' ? (
              <p className={styles.successText}>✨ 학원 사진 업로드가 완료되었습니다.</p>
            ) : uploadStatus === 'FAILED' ? (
              <p className={styles.errorText}>❌ 학원 사진 업로드에 실패했습니다. 마이페이지에서 다시 시도해주세요.</p>
            ) : (
              <p className={styles.pollingText}>🕒 학원 사진을 처리하고 있습니다...</p>
            )}
          </div>
        )}
      </div>

      <div className={styles.sectionBox}>
        <Button onClick={handleConfirm}>확인</Button>
      </div>
    </div>
  );
}

export default function AcademyCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcademyCompleteContent />
    </Suspense>
  );
}