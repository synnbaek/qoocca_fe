'use client';

import styles from './studentFormLayout.module.css';

export default function StudentFormLayout({
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