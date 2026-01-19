'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import StudentCell from './components/StudentCell';
import styles from './student.module.css';
import TextInput from '../../../register/components/TextInput';
import { useStats } from '@/hooks/useStats';
import { useParentStats } from '@/hooks/useParentStats';

export default function StudentPage() {
  const [keyword, setKeyword] = useState('');
  const params = useParams();
  const academyId = Number(params.academyId);

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
              name: s.studentName,
              parentName: '-',
              cardNumber: '-',
            };
          }

          // 1. 카드가 있는 부모 우선 검색
          const cardParent = s.parents.find(p => p.cardNum && p.cardNum.length > 0);

          // 2. 카드가 없다면 첫 번째 부모 선택
          const selectedParent = cardParent || s.parents[0];

          let displayCardNumber = '';
          if (selectedParent.cardNum && selectedParent.cardNum.length > 0) {
            // 카드 번호 4자리만 표시
            displayCardNumber = `카드번호 뒷자리 ${selectedParent.cardNum.slice(-4)}`;
          } else {
            // 카드 미등록 시 메시지
            displayCardNumber = '+ 카드를 등록해주세요';
          }

          return {
            id: s.studentId * 1000 + selectedParent.parentId, // 고유키 유지를 위해 조합
            name: s.studentName,
            parentName: selectedParent.parentRelationship,
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

      <div className={styles.sectionBox}>
        {loading && <p>로딩중...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <StudentCell data={filteredData} />}
      </div>
    </div>
  );
}
