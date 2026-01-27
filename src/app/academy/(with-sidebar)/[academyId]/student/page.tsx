'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StudentCell from './components/StudentCell';
import styles from './student.module.css';
import TextInput from '../../../register/components/TextInput';
import { useStats } from '@/hooks/useStats';
import { useParentStats } from '@/hooks/useParentStats';

export default function StudentPage() {
  const [keyword, setKeyword] = useState('');
  const params = useParams();
  const academyId = Number(params.academyId);
  const router = useRouter();

  const { data: statsData, loading, error } = useStats(academyId);
  const { data: parentStats } = useParentStats(academyId);

  const mergedData = useMemo(() => {
    if (!statsData) return [];

    return statsData.map(cls => {
      const parent = parentStats.find(p => p.classId === cls.id);

      const students =
        parent?.students.map(s => {
          if (s.parents.length === 0) {
            return {
              id: s.studentId,
              studentId: s.studentId,
              name: s.studentName,
              parentName: '보호자 연결',
              cardNumber: '+ 카드를 등록해주세요',
            };
          }

          const cardParent = s.parents.find(p => p.cardNum && p.cardNum.length > 0);
          const selectedParent = cardParent || s.parents[0];

          let displayCardNumber = '';
          if (selectedParent.cardNum && selectedParent.cardNum.length > 0) {
            displayCardNumber = `카드번호 뒷자리 ${selectedParent.cardNum.slice(-4)}`;
          } else {
            displayCardNumber = '+ 카드를 등록해주세요';
          }

          return {
            id: s.studentId * 1000 + selectedParent.parentId,
            studentId: s.studentId,
            name: s.studentName,
            parentName: selectedParent.parentName,
            cardNumber: displayCardNumber,
          };
        }) ?? [];

      return {
        id: cls.id,
        className: cls.className,
        totalStudents: cls.totalStudents,
        inactiveStudents: cls.inactiveStudents,
        isActive: true,
        students,
      };
    });
  }, [statsData, parentStats]);

  const filteredData = useMemo(() => {
    if (!keyword.trim()) return mergedData;
    const lowerKeyword = keyword.toLowerCase();
    return mergedData.filter(
      cls =>
        cls.className.toLowerCase().includes(lowerKeyword) ||
        cls.students.some(s => s.name.toLowerCase().includes(lowerKeyword))
    );
  }, [mergedData, keyword]);

  return (
    <div className={styles.studentContainer}>

      <div className={styles.sectionBox}>
        <TextInput
          value={keyword}
          onChange={setKeyword}
          placeholder="클래스명 또는 원생이름을 입력하세요"
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={styles.addStudentBtn}
          onClick={() => router.push(`/academy/${academyId}/student/form`)}
        >
          + 원생 등록
        </button>

        <button
          className={styles.addStudentBtn}
          onClick={() => router.push(`/academy/${academyId}/class/register`)}
        >
          + 신규 클래스 추가
        </button>
      </div>

      <div className={styles.sectionBox}>
        {loading && <p>로딩중...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <StudentCell data={filteredData} />}
      </div>
    </div>
  );
}
