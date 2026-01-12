import Sidebar from '@/components/layout/Sidebar';
import styles from './AcademyLayout.module.css';

export default async function AcademyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ academyId: string }>;
}) {
  const { academyId } = await params;

  return (
    <div className={styles.container}>
      <Sidebar academyId={academyId} />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
