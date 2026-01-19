'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { dashboardService } from '@/services/dashboardService';
import CustomModal from '@/components/common/CustomModal';

interface Props {
  academyId: string;
  children: React.ReactNode;
}

export default function AcademyGuard({ academyId, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState<
    'REJECTED' | 'PENDING' | 'APPROVED' | null
  >(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    const checkStatus = async () => {
      if (!academyId || academyId === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        const academyInfo = await dashboardService.getAcademyInfo(academyId);
        setApprovalStatus(academyInfo.approvalStatus);
      } catch (err) {
        console.error('Failed to fetch academy info:', err);
        // If API fails (e.g. 403 Forbidden), default to PENDING to ensure access control works
        setApprovalStatus('PENDING');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [academyId]);

  useEffect(() => {
    // Only run check if not loading and status is known
    if (isLoading || !approvalStatus) return;

    // Allow access to the dashboard main page even if not approved (Dashboard handles its own locking)
    // But block sub-routes
    const isDashboardMain = pathname === `/academy/${academyId}`;
    
    if (approvalStatus !== 'APPROVED' && !isDashboardMain) {
       // Force redirect to dashboard with alert query param
       router.replace(`/academy/${academyId}?alert=access_denied`);
    }
  }, [isLoading, approvalStatus, pathname, academyId, router]);

  // While loading, we render children? Or a loader? 
  // Rendering children is safer to avoid flicker, but might show content briefly.
  // Given Next.js SSR, initially we might want to just render children and let the effect redirect.
  // But for better security/UX, maybe return null if blocking?
  // Let's render children to avoid layout shift, redirect will happen fast.
  
  return <>{children}</>;
}
