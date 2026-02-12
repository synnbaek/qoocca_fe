import styles from '../Dashboard.module.css';

interface Props {
  title: string;
  headers: string[];
  isRegistered: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function DashboardReport({
  title,
  headers,
  isRegistered,
  onClick,
  children,
}: Props) {
  const hasData = children && (Array.isArray(children) ? children.length > 0 : true);

  return (
    <div className={styles.reportRow}>
      <div className={styles.reportTitle} onClick={onClick}>
        <span>{title}</span>
        <button className={styles.reportArrow} aria-label={`${title} 상세보기`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      
      {isRegistered && (
        <div className={styles.reportHeader}>
          {headers.map((h) => (
            <div key={h} className={styles.reportItem}>
              {h}
            </div>
          ))}
        </div>
      )}

      <div className={styles.reportContent}>
        {hasData ? (
          children
        ) : (
          <div className={styles.emptyReportState}>
            <div className={styles.emptyIcon}>
              {title.includes('보상') ? '🎁' : '💰'}
            </div>
            <p>
              {isRegistered
                ? '아직 표시할 데이터가 없습니다.'
                : '학원 등록 후 이용 가능합니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}