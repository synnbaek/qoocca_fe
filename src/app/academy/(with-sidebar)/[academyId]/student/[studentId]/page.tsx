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

    const studentData = useMemo(() => {
        if (!parentStats) return null;

        let baseStudentInfo = null;
        const studentClasses: { classId: number; className: string }[] = [];

        for (const cls of parentStats) {
            const foundStudent = cls.students.find((s) => s.studentId === studentId);
            if (foundStudent) {
                if (!baseStudentInfo) {
                    baseStudentInfo = foundStudent;
                }
                studentClasses.push({
                    classId: cls.classId,
                    className: cls.className,
                });
            }
        }

        if (!baseStudentInfo) return null;

        return {
            ...baseStudentInfo,
            classes: studentClasses,
        };
    }, [parentStats, studentId]);

    const statusLabelMap = {
        'ENROLLED': '재원',
        'PAUSED': '휴원',
        'WITHDRAWN': '퇴원'
    };

    if (loading) return <div>로딩 중...</div>;
    if (!studentData) return <div>원생 정보가 없습니다.</div>;

    const parents = studentData.parents || [];

    return (
        <div className={styles.formContainer}>
            <button
                className={styles.backButton}
                onClick={() => router.push(`/academy/${academyId}/student`)}
            >
                &lt; 뒤로
            </button>
            {/* 상단 타이틀 + 수정 버튼 */}
            <div className={styles.titleRow}>
                <div className={styles.sectionTitle}>{studentData.studentName}</div>
                <button onClick={handleEdit} className={styles.addStudentBtn}>
                    정보수정
                </button>
            </div>

            {/* 기본 정보 */}
            <div className={styles.sectionTitle}>기본 정보</div>

            <TextInput label="원생 이름" value={studentData.studentName} onChange={() => { }} readOnly />
            <TextInput
                label="원생 전화번호"
                value={studentData.studentPhone}
                placeholder="전화번호 정보 없음"
                onChange={() => { }}
                readOnly
            />
            <div className={styles.multiSelectWrapper}>
                <label className={styles.multiSelectLabel}>클래스</label>
                <div 
                    className={styles.multiSelectBox} 
                    style={{ height: 'auto', minHeight: 'var(--input-height)', cursor: 'default', flexWrap: 'wrap', gap: '8px', padding: '10px 16px' }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {studentData.classes.map((c: any) => (
                            <div key={c.classId} className={styles.tag}>
                                {c.className}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <TextInput
                label="상태"
                value={statusLabelMap[studentData.status] || '재원'}
                onChange={() => { }}
                readOnly
                disabled
            />

            {/* 보호자 정보 */}
            {parents.length === 0 ? (
                <>
                    <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                        보호자 정보
                    </div>
                    <div style={{ padding: '16px', color: '#999' }}>등록된 보호자가 없습니다.</div>
                </>
            ) : (
                <>
                    <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                        보호자 정보 (최대 2명)
                    </div>

                    {parents.map((parent, index) => {
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
                                {/* 보호자 서브 타이틀 */}
                                <div className={styles.parentSubTitle}>
                                    보호자 {parents.length > 1 ? index + 1 : ''}
                                </div>

                                {/* 입력 그룹 */}
                                <div className={styles.inputGroup}>
                                    <TextInput label="보호자 성함" value={parentName} onChange={() => { }} readOnly />
                                    <TextInput label="보호자 연락처" value={parentPhone} onChange={() => { }} readOnly />
                                    <TextInput label="원생과의 관계" value={relationship} onChange={() => { }} readOnly />
                                </div>

                                {/* 카드 정보 */}
                                <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                                    카드 정보 {parents.length > 1 ? index + 1 : ''}
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
                                        <span className={styles.addCardText} style={{ color: '#999' }}>
                                            + 카드가 등록되지 않았습니다
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
