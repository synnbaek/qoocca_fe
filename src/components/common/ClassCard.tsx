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
  // 중간 생략 로직 (예: k6-class-1771901470488_1_0 -> k6-class..._1_0)
  const truncateMiddle = (str: string = '', start: number = 8, end: number = 6) => {
    if (str.length <= start + end + 3) return str;
    return `${str.substring(0, start)}...${str.substring(str.length - end)}`;
  };

  if (isEmpty) {
    return (
      <button
        className={`${styles.card} ${styles.emptyCard}`}
        onClick={onClick}
      >
        <div className={styles.plusContent}>
          <span className={styles.plusIcon}>+</span>
          <span className={styles.addText}>수업 추가</span>
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
      <div className={styles.titleGroup}>
        <div className={styles.titleRow}>
          <AcademicCap />
          <span className={styles.className} title={name}>
            {truncateMiddle(name)}
          </span>
        </div>
        <span className={styles.studentCount}>등원 {count}</span>
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