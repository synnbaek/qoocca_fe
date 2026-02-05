import React from 'react';
import styles from '../PaymentPage.module.css';

interface Props {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function PaymentDateController({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const formatYearMonth = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  return (
    <div className={styles.headerBar}>
      <div className={styles.dateController}>
        <button onClick={onPrevMonth} className={styles.arrowBtn}>
          &lt;
        </button>
        <span className={styles.currentDate}>
          {formatYearMonth(currentDate)}
        </span>
        <button onClick={onNextMonth} className={styles.arrowBtn}>
          &gt;
        </button>
      </div>
    </div>
  );
}