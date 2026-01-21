import Sidebar from '@/components/layout/Sidebar';
import styles from './AcademyLayout.module.css';
import AcademyGuard from '@/components/auth/AcademyGuard';
import AttendanceRightSidebar from './[academyId]/components/AttendanceRightSidebar';

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

  return (
    <div className={styles.container}>
      <Sidebar academyId={safeAcademyId} />
      <main className={styles.mainContent}>
        <AcademyGuard academyId={safeAcademyId}>
          {children}
        </AcademyGuard>
      </main>
      <AttendanceRightSidebar />
    </div>
  );
}
