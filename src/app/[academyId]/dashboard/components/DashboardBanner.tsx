'use client';

import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';

interface Props {
  isRegistered: boolean;
  approvalStatus: string;
}

export default function DashboardBanner({
  isRegistered,
  approvalStatus,
}: Props) {
  const router = useRouter();
  if (isRegistered) return null;

  return (
    <section className={styles.promoBanner}>
      <div className={styles.bannerLeft}>
        <span className={styles.icon}>🎓</span>
        <p>
          {approvalStatus === 'PENDING'
            ? '심사 중입니다. 승인 후 모든 기능을 이용할 수 있습니다.'
            : '학원 등록 후 서비스를 시작해보세요!'}
        </p>
      </div>
      <button
        className={styles.registBtn}
        onClick={() =>
          approvalStatus === 'PENDING'
            ? console.log('Pending')
            : router.push('/academy')
        }
      >
        {approvalStatus === 'PENDING' ? '승인 대기 중' : '학원 등록'}
      </button>
    </section>
  );
}
