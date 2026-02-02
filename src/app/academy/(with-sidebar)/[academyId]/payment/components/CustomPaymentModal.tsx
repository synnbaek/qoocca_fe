import React, { useState } from 'react';
import styles from '../PaymentPage.module.css';
import CustomModal from '@/components/common/CustomModal';
import SingleSelect from '../../student/form/components/SingleSelect';
import TextInput from '@/app/academy/register/components/TextInput';
import { ClassSummary } from '@/types/payment';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassSummary[];
  onCustomRequest: (studentId: number, classId: number, amount: number) => Promise<void>;
}

export default function CustomPaymentModal({
  isOpen,
  onClose,
  classes,
  onCustomRequest,
}: Props) {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>('');

  const selectedClass = classes.find(c => c.classId === selectedClassId);
  const students = selectedClass?.students || [];

  const handleAction = async () => {
    if (!selectedClassId || !selectedStudentId || !amount) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    await onCustomRequest(selectedStudentId, selectedClassId, Number(amount));
    onClose();
    // Reset state
    setSelectedClassId(null);
    setSelectedStudentId(null);
    setAmount('');
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="커스텀 결제 요청"
      actionText="요청 보내기"
      onAction={handleAction}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SingleSelect
          label="클래스 선택"
          options={classes.map(c => ({ label: c.className, value: c.classId }))}
          value={selectedClassId || ''}
          onChange={(val) => {
            setSelectedClassId(Number(val));
            setSelectedStudentId(null);
          }}
          placeholder="클래스를 선택하세요"
        />

        <SingleSelect
          label="학생 선택"
          options={students.map(s => ({ label: s.studentName, value: s.studentId }))}
          value={selectedStudentId || ''}
          onChange={(val) => setSelectedStudentId(Number(val))}
          placeholder={selectedClassId ? "학생을 선택하세요" : "클래스를 먼저 선택하세요"}
        />

        <TextInput
          label="요청 금액"
          value={amount}
          onChange={setAmount}
          placeholder="금액을 입력하세요 (예: 50000)"
          type="number"
        />
      </div>
    </CustomModal>
  );
}
