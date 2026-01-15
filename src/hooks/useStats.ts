'use client';

import { useEffect, useState } from 'react';
import { fetchClassStats, ClassStatsApiResponse } from '@/api/statsApi';
import { StudentClassRow } from '@/app/academy/(with-sidebar)/[academyId]/student/components/StudentCell';

export const useStats = (academyId: number) => {
  const [data, setData] = useState<StudentClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!academyId) return;

    const load = async () => {
      try {
        setLoading(true);

        const res: ClassStatsApiResponse[] =
          await fetchClassStats(academyId);

        const mapped: StudentClassRow[] = res.map((item) => ({
          id: item.classId,
          className: item.className,
          totalStudents: item.totalStudents,
          inactiveStudents: item.withdrawnStudents,
          isActive: true, // 현재 API에 없어서 기본값
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
        setError('통계 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [academyId]);

  return { data, loading, error };
};
