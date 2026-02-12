import styles from '../Dashboard.module.css';

interface Props {
  isRegistered: boolean;
  studentCount: number;
  presentCount: number;
  totalTodayCount: number;
  noCardCount: number;
  totalMonthlyFee: number;
  onStatClick?: (type: 'student' | 'attendance' | 'payment') => void;
}

export default function DashboardStats({
  isRegistered,
  studentCount,
  presentCount,
  totalTodayCount,
  noCardCount,
  totalMonthlyFee,
  onStatClick,
}: Props) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  const stats = [
    {
      type: 'student' as const,
      label: '전체 원생',
      value: isRegistered ? studentCount : 0,
      unit: '명',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: '#E0F2FE',
      textColor: '#0369A1',
    },
    {
      type: 'attendance' as const,
      label: '오늘 등원',
      value: isRegistered ? presentCount : 0,
      total: isRegistered ? totalTodayCount : 0,
      unit: '명',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: '#DCFCE7',
      textColor: '#15803D',
    },
    {
      type: 'student' as const,
      label: '카드 상태',
      value: isRegistered ? noCardCount : 0,
      unit: '명',
      subtext: '미등록',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      color: '#FEF9C3',
      textColor: '#A16207',
    },
    {
      type: 'payment' as const,
      label: '이번 달 수납',
      value: isRegistered ? totalMonthlyFee : 0,
      unit: '원',
      isPrice: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      color: '#EDE9FE',
      textColor: '#6D28D9',
    },
  ];

  return (
    <section className={styles.dashboardSummary}>
      <p className={styles.todayDate}>{today}</p>
      
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={styles.statCard}
            onClick={() => onStatClick?.(stat.type)}
          >
            <div className={styles.statHeader}>
              <div 
                className={styles.statIcon} 
                style={{ backgroundColor: stat.color, color: stat.textColor }}
              >
                {stat.icon}
              </div>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            <div className={styles.statContent}>
              {stat.subtext && (
                <span className={styles.statLabelText}>{stat.subtext}</span>
              )}
              <span className={styles.statNum}>
                {stat.isPrice ? stat.value.toLocaleString() : stat.value}
              </span>
              {stat.total !== undefined && (
                <>
                  <span className={styles.statDivider}>/</span>
                  <span className={styles.statNum}>{stat.total}</span>
                </>
              )}
              <span className={styles.statUnit}>{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
