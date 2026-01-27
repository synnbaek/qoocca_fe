import Sidebar from '@/components/layout/Sidebar';
import styles from './AcademyLayout.module.css';
import AcademyGuard from '@/components/auth/AcademyGuard';
import AttendanceRightSidebar from './[academyId]/components/AttendanceRightSidebar';
import { dashboardService } from '@/services/dashboardService';

export default async function AcademyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ academyId: string }>;
}) {
  const resolvedParams = await params;
  const academyId = resolvedParams?.academyId;

  const safeAcademyId = academyId && academyId !== 'undefined' ? academyId : '';

  let approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | null = null;
  let academyList: any[] = [];
  
  if (safeAcademyId) {
    try {
      // Execute fetches in parallel for performance
      const [info, list] = await Promise.all([
        dashboardService.getAcademyInfo(safeAcademyId),
        dashboardService.getMyAcademies().catch(() => [])
      ]);
      
      approvalStatus = info.approvalStatus;
      academyList = list;
    } catch (error) {
      console.error('Layout failed to fetch academy info:', error);
      approvalStatus = 'PENDING';
      try {
         // If main fetch failed, try to get list at least
         academyList = await dashboardService.getMyAcademies().catch(() => []);
      } catch (e) {}
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar 
        academyId={safeAcademyId} 
        approvalStatus={approvalStatus} 
        initialAcademies={academyList}
      />
      <main className={styles.mainContent}>
        <AcademyGuard academyId={safeAcademyId} approvalStatus={approvalStatus}>
          {children}
        </AcademyGuard>
      </main>
      <AttendanceRightSidebar />
    </div>
  );
}
