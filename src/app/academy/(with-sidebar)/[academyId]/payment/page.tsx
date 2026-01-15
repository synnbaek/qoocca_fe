'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from './PaymentPage.module.css';
import CustomModal from '@/components/common/CustomModal';
import PaymentDateController from './components/PaymentDateController';
import PaymentRow from './components/PaymentRow';
import { SearchIcon } from '@/components/icons/BasicIcons';
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
    totalMonthlyFee,
    searchQuery,
    setSearchQuery,
    filteredClassList,
  } = usePayment(academyId as string);

  const handleAddClass = () => {
    router.push(`/academy/${academyId}/class/register`);
  };

  const isAllSelected =
    filteredClassList.length > 0 &&
    filteredClassList.every((cls) => selectedIds.includes(cls.classId));

  return (
    <div className={styles.container}>
      <PaymentDateController
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onAddClass={handleAddClass}
      />

      <div className={styles.summarySection}>
        <div className={styles.totalAmountWrapper}>
          <span className={styles.totalLabel}>이번달 수납 금액</span>
          <span className={styles.totalAmount}>
            {totalMonthlyFee.toLocaleString()}원
          </span>
        </div>
        <div className={styles.searchBarWrapper}>
          <div className={styles.searchIcon}>
            <SearchIcon />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="클래스명을 입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.totalInfo}>
          전체 클래스 {filteredClassList.length}
        </div>

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
            {filteredClassList.length > 0 ? (
              filteredClassList.map((cls) => (
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
