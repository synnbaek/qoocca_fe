'use client';

import AcademyLayoutShell from './AcademyLayoutShell';
import { dashboardService } from '@/services/dashboardService';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { AcademyInfo } from '@/types/dashboard';

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const academyId = params?.academyId as string;
  const safeId = academyId && academyId !== 'undefined' ? academyId : '';

  const [approvalStatus, setApprovalStatus] = useState<'APPROVED' | 'PENDING' | 'REJECTED' | null>(null);
  const [academyList, setAcademyList] = useState<AcademyInfo[]>([]);

  useEffect(() => {
    const init = async () => {
      if (safeId) {
        try {
          // Promise.all to fetch both concurrently on client
          const [info, list] = await Promise.all([
            dashboardService.getAcademyInfo(safeId),
            dashboardService.getMyAcademies().catch(() => [])
          ]);

          // 상세 정보에서 가져온 최신 상태를 목록에도 반영 (백엔드 목록 API가 지연될 경우 대비)
          const mergedList = list.map((a: any) => 
            String(a.academyId) === String(safeId) 
              ? { ...a, approvalStatus: info.approvalStatus } 
              : a
          );

          setApprovalStatus(info.approvalStatus);
          setAcademyList(mergedList);
        } catch (error) {
          console.error('Layout failed to fetch academy info:', error);
          // 상태를 강제로 PENDING으로 바꾸지 않고, 리스트만이라도 가져오기 시도
          const list = await dashboardService.getMyAcademies().catch(() => []);
          setAcademyList(list);
        }
      } else {
        const list = await dashboardService.getMyAcademies().catch(() => []);
        setAcademyList(list);
      }
    };
    init();
  }, [safeId]);

  return (
    <Suspense fallback={null}>
      <AcademyLayoutShell
        academyId={safeId}
        approvalStatus={approvalStatus}
        academyList={academyList}
      >
        {children}
      </AcademyLayoutShell>
    </Suspense>
  );
}