'use client';

import { useEffect, useState } from 'react';
import { ClassParentStats, fetchParentStats } from '@/api/parentstatsApi';

export function useParentStats(academyId: number) {
  const [data, setData] = useState<ClassParentStats[]>([]);
  const [loading, setLoading] = useState(true); // 👈 여기 true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!academyId) return;

    let mounted = true;

    fetchParentStats(academyId)
      .then(res => {
        if (mounted) setData(res);
      })
      .catch(() => {
        if (mounted) setError('학부모 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (mounted) setLoading(false); // 👈 false만 설정
      });

    return () => {
      mounted = false;
    };
  }, [academyId]);

  return { data, loading, error };
}
