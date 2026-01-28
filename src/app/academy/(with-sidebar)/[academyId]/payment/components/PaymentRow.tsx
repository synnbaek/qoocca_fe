import React from 'react';
import styles from '../PaymentPage.module.css';
import { ClassSummary, StudentDetail } from '@/types/payment';
import { getPaymentStatusLabel } from '@/utils/paymentUtils';

interface Props {
  cls: ClassSummary;
  isExpanded: boolean;
  isSelected: boolean;
  selectedStudentIds: number[];
  onRowClick: (classId: number) => void;
  onSelectClass: (classId: number) => void;
  onSelectAllStudents: (e: React.ChangeEvent<HTMLInputElement>, students: StudentDetail[]) => void;
  onSelectStudent: (id: number) => void;
  onPaymentRequest: (cls: ClassSummary) => void;
}

export default function PaymentRow({
  cls,
  isExpanded,
  isSelected,
  selectedStudentIds,
  onRowClick,
  onSelectClass,
  onSelectAllStudents,
  onSelectStudent,
  onPaymentRequest,
}: Props) {
  const isAllStudentsSelected =
    cls.students &&
    cls.students.some((s) => s.status === 'BEFORE_REQUEST' && s.isCardRegistered) &&
    selectedStudentIds.length ===
      cls.students.filter((s) => s.status === 'BEFORE_REQUEST' && s.isCardRegistered).length;

  const hasSelectableStudents =
    cls.students && cls.students.some((s) => s.status === 'BEFORE_REQUEST' && s.isCardRegistered);

  return (
    <React.Fragment>
      <tr
        className={`${styles.mainRow} ${isExpanded ? styles.expanded : ''}`}
        onClick={() => onRowClick(cls.classId)}
      >
        <td onClick={(e) => e.stopPropagation()}>
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
      {isExpanded && (
        <>
          <tr className={styles.detailActionRow}>
            <td className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id={`selectAll-${cls.classId}`}
                onChange={(e) => onSelectAllStudents(e, cls.students || [])}
                checked={!!isAllStudentsSelected}
                disabled={!hasSelectableStudents}
              />
            </td>
            <td colSpan={4}>
              <div className={styles.detailActionContainer}>
                <label
                  htmlFor={`selectAll-${cls.classId}`}
                  className={styles.selectAllLabel}
                >
                  전체 선택
                </label>
                <button
                  className={styles.requestBtn}
                  onClick={() => onPaymentRequest(cls)}
                >
                  + 결제 요청
                </button>
              </div>
            </td>
          </tr>

          {cls.students &&
            cls.students.map((student) => (
              <tr key={student.studentId} className={styles.studentRow}>
                <td className={styles.subIconCol}>
                  <span className={styles.subArrow}>↳</span>
                </td>
                <td colSpan={4}>
                  <div className={styles.studentInfoWrapper}>
                    <input
                      type="checkbox"
                      className={styles.studentCheck}
                      onChange={() => onSelectStudent(student.studentId)}
                      checked={selectedStudentIds.includes(student.studentId)}
                      disabled={student.status !== 'BEFORE_REQUEST' || !student.isCardRegistered}
                    />
                    <span className={styles.studentName}>
                      {student.studentName}
                      {!student.isCardRegistered && (
                        <span className={styles.noCardBadge}>카드미등록</span>
                      )}
                    </span>
                    <span className={styles.studentAmount}>
                      {student.amount.toLocaleString()}원
                    </span>
                    <div className={styles.statusBadgeWrapper}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[student.status]
                        }`}
                      >
                        {getPaymentStatusLabel(student.status)}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </>
      )}
    </React.Fragment>
  );
}
