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
  return (
    <div className={styles.reportRow}>
      <div className={styles.reportTitle}>
        {title}
        <span className={styles.reportArrow} onClick={onClick}>
          &gt;
        </span>
      </div>
      <div className={styles.reportHeader}>
        {headers.map((h) => (
          <div key={h} className={styles.reportItem}>
            {h}
          </div>
        ))}
      </div>
      <hr className={styles.divider} />
      {children ? (
        children
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>
          {isRegistered
            ? '데이터를 불러오는 중입니다.'
            : '학원 등록 후 이용 가능합니다.'}
        </div>
      )}
    </div>
  );
}
