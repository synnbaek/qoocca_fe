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
  return (
    <tr
      className={`${styles.mainRow} ${isExpanded ? styles.expanded : ''}`}
      onClick={() => onRowClick(cls.classId)}
    >
      <td className={styles.checkboxCol} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          onChange={() => onSelectClass(cls.classId)}
          checked={isSelected}
        />
      </td>
      <td className={styles.classNameCol}>{cls.className}</td>
      <td>{cls.beforeRequest}</td>
      <td>{cls.paymentPending}</td>
      <td className={styles.completedCount}>{cls.paymentCompleted}</td>
    </tr>
  );
}