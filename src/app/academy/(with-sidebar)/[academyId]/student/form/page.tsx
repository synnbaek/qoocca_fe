'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './form.module.css';
import IndividualRegistrationForm from './components/IndividualRegistrationForm';
import ExcelRegistrationForm from './components/ExcelRegistrationForm';
import AcademyTitle from '@/app/academy/register/components/AcademyTitle';

export default function StudentFormPage() {
    const params = useParams();
    const academyId = Number(params.academyId);
    const [activeTab, setActiveTab] = useState<'individual' | 'excel'>('individual');

    return (
        <div className={styles.formContainer}>
            <AcademyTitle title="신규 원생 등록" />

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
        </div>
    );
}
