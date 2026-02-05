'use client';

import { useEffect, useState } from 'react';
import { ClassParentStats, fetchParentStats } from '@/api/parentstatsApi';

/**
 * 학원 원생 및 학부모 통계 데이터를 조회하는 커스텀 훅
 * @param academyId 학원 ID
 * @returns { data, loading, error } - 조회된 데이터, 로딩 상태, 에러 메시지
 */
export function useParentStats(academyId: number) {
  const [data, setData] = useState<ClassParentStats[]>([]);
  const [loading, setLoading] = useState(true); // 초기 상태 로딩 중(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 학원 ID가 없으면 실행하지 않음
    if (!academyId) return;

    let mounted = true;

    // API 호출을 통해 학부모 통계 데이터 수신
    fetchParentStats(academyId)
      .then(res => {
        if (mounted) setData(res);
      })
      .catch(() => {
        if (mounted) setError('학부모 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (mounted) setLoading(false); // 데이터 수신 완료 또는 실패 후 로딩 종료
      });

    // 컴포넌트 언마운트 시 상태 업데이트 방지 (Memory Leak 방지)
    return () => {
      mounted = false;
    };
  }, [academyId]);

  return { data, loading, error };
}
