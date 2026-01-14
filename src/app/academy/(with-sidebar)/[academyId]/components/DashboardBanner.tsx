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

  if (isRegistered && approvalStatus === 'APPROVED') return null;

  if (!isRegistered) {
    return (
      <section className={styles.promoBanner}>
        <div className={styles.bannerLeft}>
          <span className={styles.icon}>🎓</span>
          <p>학원 등록 후 서비스를 시작해보세요!</p>
        </div>
        <button
          className={styles.registBtn}
          onClick={() => router.push('/academy/register')}
        >
          학원 등록
        </button>
      </section>
    );
  }

  return (
    <section className={styles.promoBanner}>
      <div className={styles.bannerLeft}>
        <span className={styles.icon}>🎓</span>
        <p>심사 중입니다. 승인 후 모든 기능을 이용할 수 있습니다.</p>
      </div>
      <button className={styles.registBtn} disabled>
        승인 대기 중
      </button>
    </section>
  );
}
