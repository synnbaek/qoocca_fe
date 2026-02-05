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
  const isLoading = approvalStatus === null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: '',
  });



  useEffect(() => {
    if (isLoading || !approvalStatus) return;

    const isDashboardMain = pathname === `/academy/${academyId}`;
    
    if (approvalStatus !== 'APPROVED' && !isDashboardMain) {
       router.replace(`/academy/${academyId}?alert=access_denied`);
    }
  }, [isLoading, approvalStatus, pathname, academyId, router]);


  
  return <>{children}</>;
}