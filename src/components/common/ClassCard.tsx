import { AcademicCap } from '../icons/BasicIcons';
import styles from './ClassCard.module.css';

interface ClassCardProps {
  name?: string;
  count?: string;
  late?: number;
  absent?: number;
  isEmpty?: boolean;
  onClick?: () => void;
  bgColor?: string;
}

export default function ClassCard({
  name,
  count,
  late,
  absent,
  isEmpty,
  onClick,
  bgColor,
}: ClassCardProps) {
  if (isEmpty) {
    return (
      <button
        className={`${styles.card} ${styles.emptyCard}`}
        onClick={onClick}
      >
        <div className={styles.plusContent}>
          <span className={styles.plusIcon}>+</span>
          <span className={styles.addText}>클래스 추가하기</span>
        </div>
      </button>
    );
  }

  return (
    <div
      className={styles.card}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <div className={styles.cardHeader}>
        <div className={styles.titleGroup}>
          <AcademicCap />
          <span className={styles.className}>{name}</span>
          <span className={styles.studentCount}>등원 {count}</span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.statItem}>
          <span className={styles.label}>지각</span>
          <span className={styles.value}>{late}</span>
        </div>
        <div className={styles.vLine}></div>
        <div className={styles.statItem}>
          <span className={styles.label}>결석</span>
          <span className={styles.value}>{absent}</span>
        </div>
      </div>
    </div>
  );
}
