import React, { useMemo } from 'react';
import styles from '../PaymentPage.module.css';
import CustomModal from '@/components/common/CustomModal';
import { ClassSummary, StudentDetail } from '@/types/payment';
import { getPaymentStatusLabel } from '@/utils/paymentUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cls: ClassSummary | null;
  selectedStudentIds: number[];
  onSelectAllStudents: (e: React.ChangeEvent<HTMLInputElement>, students: StudentDetail[]) => void;
  onSelectStudent: (id: number) => void;
  onPaymentRequest: (cls: ClassSummary) => void;
}

export default function StudentListModal({
  isOpen,
  onClose,
  cls,
  selectedStudentIds,
  onSelectAllStudents,
  onSelectStudent,
  onPaymentRequest,
}: Props) {
  const isAllStudentsSelected = useMemo(() => {
    if (!cls || !cls.students) return false;
    const selectableStudents = cls.students.filter(
      (s) => s.status === 'BEFORE_REQUEST' && s.cardRegistered
    );
    if (selectableStudents.length === 0) return false;
    return selectedStudentIds.length === selectableStudents.length;
  }, [cls, selectedStudentIds]);

  const hasSelectableStudents = useMemo(() => {
    if (!cls || !cls.students) return false;
    return cls.students.some((s) => s.status === 'BEFORE_REQUEST' && s.cardRegistered);
  }, [cls]);

  if (!cls) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${cls.className} 학생 목록`} // Class Name Student List
      actionText="결제 요청"
      onAction={() => {
        onPaymentRequest(cls);
        onClose();
      }}
      cancelText="닫기"
    >
      <div className={styles.modalHeaderActions}>
        <div className={styles.modalCheckboxWrapper}>
          <input
            type="checkbox"
            id="selectAll-modal"
            onChange={(e) => onSelectAllStudents(e, cls.students || [])}
            checked={isAllStudentsSelected}
            disabled={!hasSelectableStudents}
            className={styles.modalCheckbox}
          />
          <label htmlFor="selectAll-modal" className={styles.selectAllLabel}>
            전체 선택
          </label>
        </div>
        <span className={styles.totalInfo}>
          총 {cls.students?.length || 0}명
        </span>
      </div>

      <div className={styles.studentModalContent}>
        {cls.students && cls.students.map((student) => (
          <div key={student.studentId} className={styles.studentModalRow}>
            <input
              type="checkbox"
              className={styles.studentCheck}
              onChange={() => onSelectStudent(student.studentId)}
              checked={selectedStudentIds.includes(student.studentId)}
              disabled={student.status !== 'BEFORE_REQUEST' || !student.cardRegistered}
            />
            <div className={styles.studentInfoWrapperModal}>
              <span className={styles.modalStudentName}>
                {student.studentName}
                {!student.cardRegistered && (
                  <span className={styles.noCardBadge}>카드미등록</span>
                )}
              </span>
              <span className={styles.modalStudentAmount}>
                {student.amount.toLocaleString()}원
              </span>
              <span className={`${styles.modalStatusBadge} ${styles[student.status]}`}>
                {getPaymentStatusLabel(student.status)}
              </span>
            </div>
          </div>
        ))}
        {(!cls.students || cls.students.length === 0) && (
          <div className={styles.emptyState}>학생이 없습니다.</div>
        )}
      </div>
    </CustomModal>
  );
}
