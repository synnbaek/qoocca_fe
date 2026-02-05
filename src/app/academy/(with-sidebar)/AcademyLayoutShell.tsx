'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import AcademyGuard from '@/components/auth/AcademyGuard';
import AttendanceRightSidebar from './[academyId]/components/AttendanceRightSidebar';
import styles from './AcademyLayout.module.css';
import { AcademyInfo } from '@/types/dashboard';

interface AcademyLayoutShellProps {
  children: React.ReactNode;
  academyId: string;
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | null;
  academyList: AcademyInfo[];
}

export default function AcademyLayoutShell({
  children,
  academyId,
  approvalStatus,
  academyList,
}: AcademyLayoutShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);

  return (
    <div className={styles.container}>
      {/* 모바일 왼쪽 메뉴 버튼 */}
      <button
        className={styles.mobileToggle}
        onClick={toggleSidebar}
        aria-label="메뉴 열기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* 모바일 오른쪽 출결 버튼 */}
      <button
        className={styles.mobileRightToggle}
        onClick={toggleRightSidebar}
        aria-label="출결 현황"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </button>

      {/* 모바일 오버레이 (하나의 오버레이로 두 사이드바 처리 가능) */}
      <div
        className={`${styles.sidebarOverlay} ${(isSidebarOpen || isRightSidebarOpen) ? styles.active : ''}`}
        onClick={() => {
          setIsSidebarOpen(false);
          setIsRightSidebarOpen(false);
        }}
      />

      <Sidebar
        academyId={academyId}
        approvalStatus={approvalStatus}
        initialAcademies={academyList as any[]}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className={`${styles.mainContent} ${pathname === `/academy/${academyId}` ? styles.hasRightSidebar : ''}`}>
        <AcademyGuard academyId={academyId} approvalStatus={approvalStatus}>
          {children}
        </AcademyGuard>
      </main>
      <AttendanceRightSidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
      />
    </div>
  );
}
