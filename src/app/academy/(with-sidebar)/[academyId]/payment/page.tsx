'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from './PaymentPage.module.css';
import CustomModal from '@/components/common/CustomModal';
import PaymentDateController from './components/PaymentDateController';
import PaymentRow from './components/PaymentRow';
import { usePayment } from '@/hooks/usePayment';

export default function PaymentPage() {
  const router = useRouter();
  const { academyId } = useParams();
  
  const {
    currentDate,
    classList,
    expandedClassId,
    selectedIds,
    selectedStudentIds,
    isModalOpen,
    modalConfig,
    closeModal,
    handlePrevMonth,
    handleNextMonth,
    handleRowClick,
    handleSelectAll,
    handleSelectOne,
    handleSelectAllStudents,
    handleSelectStudent,
    handlePaymentRequest,
  } = usePayment(academyId as string);

  const handleAddClass = () => {
    router.push(`/academy/${academyId}/class/register`);
  };

  const isAllSelected =
    classList.length > 0 && selectedIds.length === classList.length;

  return (
    <div className={styles.container}>
      <PaymentDateController
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onAddClass={handleAddClass}
      />

      <div className={styles.tableSection}>
        <div className={styles.totalInfo}>전체 클래스 {classList.length}</div>

        <table className={styles.paymentTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                />
              </th>
              <th>클래스명</th>
              <th>결제 요청 전</th>
              <th>결제 대기</th>
              <th>수납 완료</th>
            </tr>
          </thead>
          <tbody>
            {classList.length > 0 ? (
              classList.map((cls) => (
                <PaymentRow
                  key={cls.classId}
                  cls={cls}
                  isExpanded={expandedClassId === cls.classId}
                  isSelected={selectedIds.includes(cls.classId)}
                  selectedStudentIds={selectedStudentIds}
                  onRowClick={handleRowClick}
                  onSelectClass={handleSelectOne}
                  onSelectAllStudents={handleSelectAllStudents}
                  onSelectStudent={handleSelectStudent}
                  onPaymentRequest={handlePaymentRequest}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyRow}>
                  등록된 클래스가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalConfig.title}
        description={modalConfig.description}
        actionText={modalConfig.actionText}
        onAction={modalConfig.onAction}
      />
    </div>
  );
}
