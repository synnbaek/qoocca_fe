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
          setApprovalStatus(info.approvalStatus);
          setAcademyList(list);
        } catch (error) {
          console.error('Layout failed to fetch academy info:', error);
          setApprovalStatus('PENDING');
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
