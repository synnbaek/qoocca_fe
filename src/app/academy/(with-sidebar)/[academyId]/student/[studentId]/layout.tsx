'use client';

import styles from '../form/studentFormLayout.module.css';

export default function StudentDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.academyWrapper}>
            <div className={styles.academyContainer}>{children}</div>
        </div>
    );
}