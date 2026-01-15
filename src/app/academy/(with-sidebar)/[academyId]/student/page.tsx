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
        parent?.students.flatMap(s =>
          s.parents.length === 0
            ? [
              {
                id: s.studentId,
                name: s.studentName,
                parentName: '-',
                cardNumber: '-',
              },
            ]
            : s.parents.map(p => ({
              id: s.studentId * 1000 + p.parentId,
              name: s.studentName,
              parentName: p.parentRelationship,
              cardNumber: p.cardNum,
            }))
        ) ?? [];

      return {
        id: cls.id,
        className: cls.className,
        totalStudents: cls.totalStudents,
        inactiveStudents: cls.withdrawnStudents,
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
