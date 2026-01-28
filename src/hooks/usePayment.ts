import { useState, useEffect } from 'react';
import { paymentService } from '@/services/paymentService';
import { ClassSummary, StudentDetail } from '@/types/payment';

interface ModalConfig {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}

export const usePayment = (academyId: string) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [classList, setClassList] = useState<ClassSummary[]>([]);
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
  const [totalMonthlyFee, setTotalMonthlyFee] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: '',
    description: '',
    actionText: '확인',
    onAction: () => {},
  });

  // 확장된 클래스가 변경되면 학생 선택 초기화
  useEffect(() => {
    setSelectedStudentIds([]);
  }, [expandedClassId]);

  // 데이터 조회
  const fetchSummary = async () => {
    if (!academyId) return;
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const data = await paymentService.getClassSummary(academyId, year, month);
      setClassList(data || []);
    } catch (err) {
      console.error('수납 요약 로딩 실패:', err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [academyId, currentDate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!academyId) return;
      try {
        const data = await paymentService.getPaymentStats(academyId);
        setTotalMonthlyFee(data.totalMonthlyFee);
      } catch (err) {
        console.error('스탯 로딩 실패:', err);
      }
    };
    fetchStats();
  }, [academyId]);

  const filteredClassList = classList.filter((cls) =>
    cls.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 날짜 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleRowClick = (classId: number) => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const visibleIds = filteredClassList.map((cls) => cls.classId);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    } else {
      const visibleIds = filteredClassList.map((cls) => cls.classId);
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllStudents = (
    e: React.ChangeEvent<HTMLInputElement>,
    students: StudentDetail[]
  ) => {
    if (e.target.checked) {
      const selectableStudents = students.filter(
        (s) => s.status === 'BEFORE_REQUEST' && s.isCardRegistered
      );
      setSelectedStudentIds(selectableStudents.map((s) => s.studentId));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 수납 요청 로직
  const executePaymentRequest = async (cls: ClassSummary) => {
    setIsModalOpen(false);

    try {
      const promises = selectedStudentIds.map(async (studentId) => {
        const student = cls.students?.find((s) => s.studentId === studentId);
        if (!student) return;
        if (student.status === 'PAID') return;

        await paymentService.createReceipt(studentId, {
          classId: cls.classId,
          amount: student.amount,
        });
      });

      await Promise.all(promises);

      setModalConfig({
        title: '요청 완료',
        description: '결제 요청이 완료되었습니다.',
        actionText: '확인',
        onAction: () => {
          setIsModalOpen(false);
          setSelectedStudentIds([]);
          fetchSummary();
        },
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setModalConfig({
        title: '오류 발생',
        description: '결제 요청 중 오류가 발생했습니다.',
        actionText: '확인',
        onAction: () => setIsModalOpen(false),
      });
      setIsModalOpen(true);
    }
  };

  const handlePaymentRequest = (cls: ClassSummary) => {
    if (selectedStudentIds.length === 0) {
      setModalConfig({
        title: '알림',
        description: '선택된 학생이 없습니다.',
        actionText: '확인',
        onAction: () => setIsModalOpen(false),
      });
      setIsModalOpen(true);
      return;
    }

    setModalConfig({
      title: '결제 요청',
      description: `${selectedStudentIds.length}명에게 결제 요청을 보내시겠습니까?`,
      actionText: '보내기',
      onAction: () => executePaymentRequest(cls),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return {
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
  };
};
