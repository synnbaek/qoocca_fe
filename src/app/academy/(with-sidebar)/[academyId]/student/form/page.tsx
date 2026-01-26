'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './form.module.css';
import IndividualRegistrationForm from './components/IndividualRegistrationForm';
import ExcelRegistrationForm from './components/ExcelRegistrationForm';

export default function StudentFormPage() {
    const router = useRouter();
    const params = useParams();
    const academyId = Number(params.academyId);

    // --- 탭 상태 ---
    const [activeTab, setActiveTab] = useState<'individual' | 'excel'>('individual');

    return (
        <div className={styles.formContainer}>
            <header className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => router.push(`/academy/${academyId}/student`)}
                >
                    &lt; 이전
                </button>
                <h1>신규 원생 등록</h1>
            </header>

            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'individual' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('individual')}
                >
                    개별 등록
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'excel' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('excel')}
                >
                    일괄 등록 (엑셀)
                </button>
            </div>

            {activeTab === 'individual' ? (
                <IndividualRegistrationForm academyId={academyId} />
            ) : (
                <ExcelRegistrationForm academyId={academyId} />
            )}
        </div >
    );
}
