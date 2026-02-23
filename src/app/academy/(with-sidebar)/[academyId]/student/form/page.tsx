'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './form.module.css';
import IndividualRegistrationForm from './components/IndividualRegistrationForm';
import ExcelRegistrationForm from './components/ExcelRegistrationForm';
import AcademyTitle from '@/app/academy/register/components/AcademyTitle';

import { useRouter } from 'next/navigation';

export default function StudentFormPage() {
    const params = useParams();
    const router = useRouter();
    const academyId = Number(params.academyId);
    const [activeTab, setActiveTab] = useState<'individual' | 'excel'>('individual');

    return (
        <div className={styles.formContainer}>
            <header className={styles.header}>
                <button 
                    onClick={() => router.back()} 
                    className={styles.backButton}
                    aria-label="이전 페이지로 돌아가기"
                >
                    &lt; 이전
                </button>
                <h1>신규 원생 등록</h1>
            </header>

            <div className={styles.tabContainer} role="tablist">
                <button
                    className={`${styles.tabButton} ${activeTab === 'individual' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('individual')}
                    role="tab"
                    aria-selected={activeTab === 'individual'}
                >
                    개별 등록
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'excel' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('excel')}
                    role="tab"
                    aria-selected={activeTab === 'excel'}
                >
                    일괄 등록 (엑셀)
                </button>
            </div>

            {activeTab === 'individual' ? (
                <IndividualRegistrationForm academyId={academyId} />
            ) : (
                <ExcelRegistrationForm academyId={academyId} />
            )}
        </div>
    );
}