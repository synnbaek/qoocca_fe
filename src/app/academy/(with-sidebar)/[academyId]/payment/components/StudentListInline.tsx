import React, { useMemo } from 'react';
import styles from '../PaymentPage.module.css';
import { ClassSummary, StudentDetail } from '@/types/payment';
import { getPaymentStatusLabel } from '@/utils/paymentUtils';

interface Props {
  cls: ClassSummary;
  selectedStudentIds: number[];
  onSelectAllStudents: (e: React.ChangeEvent<HTMLInputElement>, students: StudentDetail[]) => void;
  onSelectStudent: (id: number) => void;
  onPaymentRequest: (cls: ClassSummary) => void;
}

export default function StudentListInline({
  cls,
  selectedStudentIds,
  onSelectAllStudents,
  onSelectStudent,
  onPaymentRequest,
}: Props) {
  const isAllStudentsSelected = useMemo(() => {
    if (!cls.students) return false;
    const selectableStudents = cls.students.filter(
      (s) => s.status === 'BEFORE_REQUEST' && s.cardRegistered
    );
    if (selectableStudents.length === 0) return false;
    const selectedSelectableInThisClass = selectableStudents.filter(s => 
      selectedStudentIds.includes(s.studentId)
    );
    return selectedSelectableInThisClass.length === selectableStudents.length;
  }, [cls, selectedStudentIds]);

  const hasSelectableStudents = useMemo(() => {
    if (!cls.students) return false;
    return cls.students.some((s) => s.status === 'BEFORE_REQUEST' && s.cardRegistered);
  }, [cls]);

  return (
    <>
      {/* 전체 선택 행 */}
      <tr className={styles.detailActionRow}>
        <td className={styles.checkboxCol}>
          <input
            type="checkbox"
            id={`selectAll-${cls.classId}`}
            onChange={(e) => onSelectAllStudents(e, cls.students || [])}
            checked={isAllStudentsSelected}
            disabled={!hasSelectableStudents}
            className={styles.modalCheckbox}
          />
        </td>
        <td colSpan={3} className={styles.classNameCol} style={{ textAlign: 'left' }}>
          <label htmlFor={`selectAll-${cls.classId}`} className={styles.selectAllLabel}>
            전체 선택
          </label>
          <span className={styles.totalInfo} style={{ marginLeft: '15px', marginBottom: 0 }}>
            총 {cls.students?.length || 0}명
          </span>
        </td>
        <td style={{ textAlign: 'right', paddingRight: '20px' }}>
          <button 
            className={styles.requestBtn}
            onClick={() => onPaymentRequest(cls)}
            style={{ margin: 0 }}
          >
            결제 요청
          </button>
        </td>
      </tr>

      {/* 학생 목록 행 */}
      {cls.students && cls.students.map((student) => (
        <tr key={student.studentId} className={styles.studentRow}>
          <td className={styles.checkboxCol}>
            <input
              type="checkbox"
              className={styles.studentCheck}
              onChange={() => onSelectStudent(student.studentId)}
              checked={selectedStudentIds.includes(student.studentId)}
              disabled={student.status !== 'BEFORE_REQUEST' || !student.cardRegistered}
              aria-label={`${student.studentName} 학생 선택`}
            />
          </td>
          <td className={styles.classNameCol} style={{ textAlign: 'left' }} role="gridcell">
            <span className={styles.studentName}>
              {student.studentName}
              {!student.cardRegistered && (
                <span className={styles.noCardBadge}>카드미등록</span>
              )}
            </span>
          </td>
          <td style={{ textAlign: 'center' }}>
            <span className={styles.studentAmount}>
              {student.amount.toLocaleString()}원
            </span>
          </td>
          <td colSpan={2} style={{ textAlign: 'right', paddingRight: '20px' }}>
            <div className={styles.statusBadgeWrapper} style={{ display: 'inline-block' }}>
              <span className={`${styles.statusBadge} ${styles[student.status]}`}>
                {getPaymentStatusLabel(student.status)}
              </span>
            </div>
          </td>
        </tr>
      ))}

      {(!cls.students || cls.students.length === 0) && (
        <tr>
          <td colSpan={5} className={styles.emptyState}>학생이 없습니다.</td>
        </tr>
      )}
    </>
  );
}