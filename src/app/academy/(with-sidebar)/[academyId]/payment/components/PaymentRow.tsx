import React from 'react';
import styles from '../PaymentPage.module.css';
import { ClassSummary } from '@/types/payment';

interface Props {
  cls: ClassSummary;
  isSelected: boolean;
  isExpanded: boolean;
  onRowClick: (classId: number) => void;
  onSelectClass: (classId: number) => void;
}

export default function PaymentRow({
  cls,
  isSelected,
  isExpanded,
  onRowClick,
  onSelectClass,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowClick(cls.classId);
    }
  };

  return (
    <tr
      className={`${styles.mainRow} ${isExpanded ? styles.expanded : ''}`}
      onClick={() => onRowClick(cls.classId)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${cls.className} 클래스 상세 정보`}
    >
      <td className={styles.checkboxCol} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          onChange={() => onSelectClass(cls.classId)}
          checked={isSelected}
          aria-label={`${cls.className} 클래스 선택`}
        />
      </td>
      <td className={styles.classNameCol}>{cls.className}</td>
      <td>{cls.beforeRequest}</td>
      <td>{cls.paymentPending}</td>
      <td className={styles.completedCount}>{cls.paymentCompleted}</td>
    </tr>
  );
}