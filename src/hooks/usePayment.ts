import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { createReceipt } from '@/api/receiptApi';
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

  // Reset student selection when expanded class changes
  useEffect(() => {
    setSelectedStudentIds([]);
  }, [expandedClassId]);

  // Fetch Data
  const fetchSummary = async () => {
    if (!academyId) return;
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const res = await axiosInstance.get(
        `/api/academy/${academyId}/receipt/class-summary`,
        { params: { year, month } }
      );
      setClassList(res.data || []);
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
        const res = await axiosInstance.get(`/api/academy/${academyId}/stats`);
        setTotalMonthlyFee(res.data.totalMonthlyFee);
      } catch (err) {
        console.error('스탯 로딩 실패:', err);
      }
    };
    fetchStats();
  }, [academyId]);

  const filteredClassList = classList.filter((cls) =>
    cls.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Date Handlers
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
        (s) => s.status === 'BEFORE_REQUEST'
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

  // Payment Request Logic
  const executePaymentRequest = async (cls: ClassSummary) => {
    setIsModalOpen(false);

    try {
      const promises = selectedStudentIds.map(async (studentId) => {
        const student = cls.students?.find((s) => s.studentId === studentId);
        if (!student) return;
        if (student.status === 'PAID') return;

        await createReceipt(studentId, {
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
