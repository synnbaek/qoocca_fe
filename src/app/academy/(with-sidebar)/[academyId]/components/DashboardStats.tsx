import styles from '../Dashboard.module.css';

interface Props {
  isRegistered: boolean;
  studentCount: number;
}

export default function DashboardStats({ isRegistered, studentCount }: Props) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  return (
    <section className={styles.dashboardSummary}>
      <p className={styles.todayDate}>{today}</p>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>전체 원생</span>
          <br />
          <p>
            <span className={styles.statNum}>
              {isRegistered ? `${studentCount} ` : '0'}
            </span>
            명
          </p>
        </div>
        <div className={styles.statCard}>
          오늘 등원
          <br />
          <p>
            <span className={styles.statNum}>
              {isRegistered ? `${studentCount} ` : '0'}
            </span>
            /
            <span className={styles.statNum}>
              {isRegistered ? ` ${studentCount}` : '0'}
            </span>
          </p>
        </div>
        <div className={styles.statCard}>
          카드 상태
          <br />
          <p>
            <span className={styles.statLabelText}>미등록</span>
            <span className={styles.statNum}>
              {isRegistered ? ` ${studentCount} ` : '0'}
            </span>
            명
          </p>
        </div>
        <div className={styles.statCard}>
          이번 달 수납
          <br />
          <p>
            <span className={styles.statNum}>
              {isRegistered ? `${studentCount} ` : '0'}
            </span>
            원
          </p>
        </div>
      </div>
    </section>
  );
}
