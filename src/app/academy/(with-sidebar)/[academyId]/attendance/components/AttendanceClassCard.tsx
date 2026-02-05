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

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <span className={styles.className}>{className}</span>
        <span className={styles.time}>{time}</span>
      </div>

      <div className={styles.sectionTitle}>출결</div>

      <div className={styles.statsList}>
        <div className={styles.statRow}>
          미등원 <span className={styles.statValue}>{notArrived}명</span> / 
          등원 완료 <span className={styles.statValue}>{arrived}명</span>
        </div>
        <div className={styles.statRow}>
          지각 <span className={styles.statValue}>{late}명</span>
        </div>
        <div className={styles.statRow}>
          결석 <span className={styles.statValue}>{absent}명</span>
        </div>
      </div>
    </div>
  );
}