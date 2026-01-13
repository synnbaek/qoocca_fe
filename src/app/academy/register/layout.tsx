'use client';

import styles from './academyLayout.module.css';
import { AcademyProvider } from '@/context/AcademyContext';

export default function AcademyRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AcademyProvider>
      <div className={styles.academyWrapper}>
        <div className={styles.academyContainer}>{children}</div>
      </div>
    </AcademyProvider>
  );
}
