'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StudentCell from './components/StudentCell';
import styles from './student.module.css';
import { useStats } from '@/hooks/useStats';
import { useParentStats } from '@/hooks/useParentStats';
import SearchBar from '@/components/common/SearchBar';
import Loading from '@/components/common/Loading';

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

    return mergedData
      .map(cls => {
        // 클래스명 자체가 검색어에 걸리는지 확인
        const isClassMatch = cls.className.toLowerCase().includes(lowerKeyword);
        // 학생들 중 검색어에 걸리는 학생(이름 또는 학부모 이름)만 필터링
        const matchedStudents = cls.students.filter(s => 
          s.name.toLowerCase().includes(lowerKeyword) ||
          s.parentName.toLowerCase().includes(lowerKeyword)
        );

        // 클래스명이 일치하거나, 검색된 학생/학부모가 하나라도 있다면 유지
        if (isClassMatch || matchedStudents.length > 0) {
          return {
            ...cls,
            students: isClassMatch ? cls.students : matchedStudents, // 클래스명 일치 시 전체 학생 노출, 아니면 매칭된 인원만 노출
            isSearching: true // 검색 중임을 표시
          };
        }
        return null;
      })
      .filter((cls): cls is any => cls !== null);
  }, [mergedData, keyword]);


  const { totalStudents, totalClasses } = useMemo(() => {
    const totalClasses = mergedData.length;
    const uniqueStudentIds = new Set();
    
    mergedData.forEach(cls => {
      cls.students?.forEach(s => {
        if (s.studentId) uniqueStudentIds.add(s.studentId);
      });
    });
    
    return { totalStudents: uniqueStudentIds.size, totalClasses };
  }, [mergedData]);

  return (
    <div className={styles.studentContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statsBadge}>
              전체 클래스 <span className={styles.statsValue}>{totalClasses}</span>
            </div>
            <div className={styles.statsBadge}>
              전체 원생 <span className={styles.statsValue}>{totalStudents}</span>
            </div>
          </div>
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
      </header>

      <div className={styles.sectionBox}>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          placeholder="클래스명, 원생이름 또는 학부모이름을 입력하세요"
          className={styles.searchBar}
        />
      </div>

      <div className={styles.sectionBox}>
        {loading && <Loading />}
        {error && <p>{error}</p>}
        {!loading && !error && <StudentCell data={filteredData} />}
      </div>
    </div>
  );
}