'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AcademyTitle from '@/app/academy/register/components/AcademyTitle';
import TextInput from '@/app/academy/register/components/TextInput';
import styles from '../form/form.module.css';
import { useParentStats } from '@/hooks/useParentStats';

export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const academyId = Number(params.academyId);
    const studentId = Number(params.studentId);

    const { data: parentStats, loading } = useParentStats(academyId);

    const handleEdit = () => {
        router.push(`/academy/${academyId}/student/${studentId}/modify`);
    };

    // Find student from the nested structure
    const studentData = useMemo(() => {
        if (!parentStats) return null;

        for (const cls of parentStats) {
            const foundStudent = cls.students.find(s => s.studentId === studentId);
            if (foundStudent) {
                return {
                    ...foundStudent,
                    className: cls.className,
                    classId: cls.classId
                };
            }
        }
        return null;
    }, [parentStats, studentId]);

    if (loading) return <div>로딩 중...</div>;
    if (!studentData) return <div>원생 정보가 없습니다.</div>;

    // Get all parents for this student
    const parents = studentData.parents || [];

    return (
        <div className={styles.formContainer}>
            <div style={{ position: 'relative' }}>
                <AcademyTitle title="원생 정보 상세" />
                <button
                    onClick={handleEdit}
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#666',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                        e.currentTarget.style.color = '#333';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#666';
                    }}
                >
                    정보수정
                </button>
            </div>

            {/* 소제목 1: 기본 정보 */}
            <div className={styles.sectionTitle}>기본 정보</div>
            <TextInput
                label="원생 이름"
                value={studentData.studentName}
                onChange={() => { }}
                readOnly={true}
            />
            <TextInput
                label="원생 전화번호"
                value={studentData.studentPhone}
                placeholder="전화번호 정보 없음"
                onChange={() => { }}
                readOnly={true}
            />
            <TextInput
                label="클래스"
                value={studentData.className}
                onChange={() => { }}
                readOnly={true}
            />
            <TextInput
                label="상태"
                value="재원"
                onChange={() => { }}
                readOnly={true}
                disabled={true}
            />

            {/* Display all parents */}
            {parents.length === 0 ? (
                <>
                    <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                        보호자 정보
                    </div>
                    <div style={{ padding: '16px', color: '#999' }}>
                        등록된 보호자가 없습니다.
                    </div>
                </>
            ) : (
                parents.map((parent, index) => {
                    // Prepare card display for this parent
                    let displayCardNumber = '미등록';
                    let hasCard = false;

                    if (parent.cardNum && parent.cardNum.length > 0) {
                        hasCard = true;
                        displayCardNumber = `카드번호 뒷자리 ${parent.cardNum.slice(-4)}`;
                    }

                    const parentName = parent.parentName || '-';
                    const parentPhone = parent.parentPhone || '-';
                    const relationship = parent.parentRelationship || '-';

                    return (
                        <div key={parent.parentId || index}>
                            <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                                보호자 {parents.length > 1 ? `${index + 1}` : ''}
                            </div>
                            <TextInput
                                label="보호자 성함"
                                value={parentName}
                                onChange={() => { }}
                                readOnly={true}
                            />
                            <TextInput
                                label="보호자 연락처"
                                value={parentPhone}
                                onChange={() => { }}
                                readOnly={true}
                            />
                            <TextInput
                                label="원생과의 관계"
                                value={relationship}
                                onChange={() => { }}
                                readOnly={true}
                            />

                            {/* 카드 정보 */}
                            <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                                카드 정보 {parents.length > 1 ? `${index + 1}` : ''}
                            </div>

                            {hasCard ? (
                                <div className={styles.registeredContainer}>
                                    <div className={styles.cardNumberBox}>
                                        <span>{displayCardNumber}</span>
                                    </div>

                                    <div className={styles.cardImageWrapper}>
                                        <img
                                            src="/images/card_placeholder.png"
                                            alt="Registered Card"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.cardBox} style={{ cursor: 'default' }}>
                                    <span className={styles.addCardText} style={{ color: '#999' }}>+ 카드가 등록되지 않았습니다</span>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}