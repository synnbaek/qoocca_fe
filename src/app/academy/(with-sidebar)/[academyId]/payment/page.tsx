'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './PaymentPage.module.css';
import CustomModal from '@/components/common/CustomModal';
import PaymentDateController from './components/PaymentDateController';
import PaymentRow from './components/PaymentRow';
import StudentListModal from './components/StudentListModal';
import StudentListInline from './components/StudentListInline';
import CustomPaymentModal from './components/CustomPaymentModal';
import { SearchIcon } from '@/components/icons/BasicIcons';
import { usePayment } from '@/hooks/usePayment';

export default function PaymentPage() {
  const router = useRouter();
  const { academyId } = useParams();
  
  const {
    currentDate,
    expandedClassId,
    selectedIds,
    selectedStudentIds,
    isModalOpen,
    isCustomModalOpen,
    setIsCustomModalOpen,
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
    handleBulkPaymentRequest,
    executeCustomPaymentRequest,
    totalMonthlyFee,
    searchQuery,
    setSearchQuery,
    filteredClassList,
    classList,
  } = usePayment(academyId as string);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddClass = () => {
    router.push(`/academy/${academyId}/class/register`);
  };

  const detailClass = expandedClassId
    ? filteredClassList.find((c) => c && c.classId === expandedClassId)
    : null;

  const handleCloseDetail = () => {
    if (expandedClassId) {
      handleRowClick(expandedClassId);
    }
  };

  const isAllSelected =
    filteredClassList.length > 0 &&
    filteredClassList.every((cls) => cls && selectedIds.includes(cls.classId));

  return (
    <div className={styles.container}>
      <PaymentDateController
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <div className={styles.summarySection}>
        <div className={styles.topRow}>
          <div className={styles.totalAmountWrapper}>
            <span className={styles.totalLabel}>이번달 수납 금액</span>
            <span className={styles.totalAmount}>
              {totalMonthlyFee.toLocaleString()}원
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedIds.length > 0 && (
              <button onClick={handleBulkPaymentRequest} className={styles.bulkRequestBtn}>
                일괄 결제 요청 ({selectedIds.length})
              </button>
            )}
            <button onClick={() => setIsCustomModalOpen(true)} className={styles.addClassBtn}>
              직접 요청
            </button>
            <button onClick={handleAddClass} className={styles.addClassBtn}>
              + 클래스 추가
            </button>
          </div>
        </div>
        <div className={styles.searchBarWrapper}>
          <div className={styles.searchIcon}>
            <SearchIcon />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="클래스명 또는 학생이름을 입력해주세요"
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
              <th className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                />
              </th>
              <th className={styles.classNameColHeader}>클래스명</th>
              <th className={styles.statCol}>결제 요청 전</th>
              <th className={styles.statCol}>결제 대기</th>
              <th className={styles.statCol}>수납 완료</th>
            </tr>
          </thead>
          <tbody>
            {filteredClassList.length > 0 ? (
              filteredClassList.map((cls) => (
                <React.Fragment key={cls.classId}>
                  <PaymentRow
                    cls={cls}
                    isSelected={selectedIds.includes(cls.classId)}
                    isExpanded={expandedClassId === cls.classId}
                    onRowClick={handleRowClick}
                    onSelectClass={handleSelectOne}
                  />
                  {!isMobile && expandedClassId === cls.classId && (
                    <StudentListInline
                      cls={cls}
                      selectedStudentIds={selectedStudentIds}
                      onSelectAllStudents={handleSelectAllStudents}
                      onSelectStudent={handleSelectStudent}
                      onPaymentRequest={handlePaymentRequest}
                    />
                  )}
                </React.Fragment>
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

      {isMobile && detailClass && (
        <StudentListModal
          isOpen={!!detailClass}
          onClose={handleCloseDetail}
          cls={detailClass}
          selectedStudentIds={selectedStudentIds}
          onSelectAllStudents={handleSelectAllStudents}
          onSelectStudent={handleSelectStudent}
          onPaymentRequest={handlePaymentRequest}
        />
      )}

      <CustomPaymentModal 
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        classes={classList}
        onCustomRequest={executeCustomPaymentRequest}
      />

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