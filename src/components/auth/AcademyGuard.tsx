'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { dashboardService } from '@/services/dashboardService';
import CustomModal from '@/components/common/CustomModal';

interface Props {
  academyId: string;
  approvalStatus: 'REJECTED' | 'PENDING' | 'APPROVED' | null;
  children: React.ReactNode;
}

export default function AcademyGuard({ academyId, approvalStatus, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  // We can assume loading is done if status is passed, or handle null status
  const isLoading = approvalStatus === null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: '',
  });

  // Removed internal fetching


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
