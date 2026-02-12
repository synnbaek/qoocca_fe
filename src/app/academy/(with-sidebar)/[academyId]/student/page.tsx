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
    <main className={styles.studentContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <div className={styles.statsContainer} role="region" aria-label="원생 요약 정보">
            <div className={styles.statsBadge}>
              전체 클래스 <span className={styles.statsValue}>{totalClasses}</span>
            </div>
            <div className={styles.statsBadge}>
              전체 원생 <span className={styles.statsValue}>{totalStudents}</span>
            </div>
          </div>
        </div>
        
        <nav className={styles.buttonGroup} aria-label="원생 및 클래스 관리">
          <button
            className={styles.addStudentBtn}
            onClick={() => router.push(`/academy/${academyId}/student/form`)}
            aria-label="신규 원생 등록 페이지로 이동"
          >
            + 원생 등록
          </button>

          <button
            className={styles.addStudentBtn}
            onClick={() => router.push(`/academy/${academyId}/class/register`)}
            aria-label="신규 클래스 추가 페이지로 이동"
          >
            + 신규 클래스 추가
          </button>
        </nav>
      </header>

      <section className={styles.sectionBox} aria-label="원생 검색">
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          placeholder="클래스명, 원생이름 또는 학부모이름을 입력하세요"
          className={styles.searchBar}
        />
      </section>

      <section className={styles.sectionBox} aria-label="원생 목록 리스트">
        {loading ? (
          <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loading />
          </div>
        ) : error ? (
          <p role="alert" className={styles.errorMessage}>{error}</p>
        ) : (
          <StudentCell data={filteredData} />
        )}
      </section>
    </main>
  );
}