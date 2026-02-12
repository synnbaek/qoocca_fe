import styles from './AttendanceClassCard.module.css';

interface Props {
  className: string;
  time: string;
  totalStudents: number;
  present: number;
  late: number;
  absent: number;
  onClick?: () => void;
}

export default function AttendanceClassCard({
  className,
  time,
  totalStudents,
  present,
  late,
  absent,
  onClick,
}: Props) {
  const arrived = present + late; 
  const notArrived = totalStudents - arrived - absent;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={styles.card} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${className} 수업, 시간: ${time}, 총원 ${totalStudents}명 중 ${arrived}명 등원 완료`}
    >
      <div className={styles.header}>
        <span className={styles.className}>{className}</span>
        <span className={styles.time}>{time}</span>
      </div>

      <div className={styles.sectionTitle}>출결 요약</div>

      <div className={styles.statsList}>
        <div className={styles.statRow}>
          미등원 <span className={styles.statValue} aria-label={`${notArrived}명 미등원`}>{notArrived}명</span> / 
          등원 완료 <span className={styles.statValue} aria-label={`${arrived}명 등원 완료`}>{arrived}명</span>
        </div>
        <div className={styles.statRow}>
          지각 <span className={styles.statValue} aria-label={`${late}명 지각`}>{late}명</span>
        </div>
        <div className={styles.statRow}>
          결석 <span className={styles.statValue} aria-label={`${absent}명 결석`}>{absent}명</span>
        </div>
      </div>
    </div>
  );
}