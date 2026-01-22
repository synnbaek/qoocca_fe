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
  
  if (safeAcademyId) {
    try {
      const info = await dashboardService.getAcademyInfo(safeAcademyId);
      approvalStatus = info.approvalStatus;
    } catch (error) {
      console.error('Layout failed to fetch academy info:', error);
      approvalStatus = 'PENDING';
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar academyId={safeAcademyId} approvalStatus={approvalStatus} />
      <main className={styles.mainContent}>
        <AcademyGuard academyId={safeAcademyId} approvalStatus={approvalStatus}>
          {children}
        </AcademyGuard>
      </main>
      <AttendanceRightSidebar />
    </div>
  );
}
