'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './complete.module.css';
import AcademyTitle from '../components/AcademyTitle';
import Button from '../../../../components/common/Button';

function AcademyCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const academyId = searchParams.get('academyId');

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
