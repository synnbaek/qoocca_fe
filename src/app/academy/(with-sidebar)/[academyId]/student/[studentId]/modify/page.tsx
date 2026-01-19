'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AcademyTitle from '@/app/academy/register/components/AcademyTitle';
import TextInput from '@/app/academy/register/components/TextInput';
import SingleSelect from '../../form/components/SingleSelect';
import CardRegistrationModal from '../../form/components/CardRegistrationModal';
import styles from '../../form/form.module.css';
import { useParentStats } from '@/hooks/useParentStats';
import { getClasses, ClassGetResponse } from '@/api/classApi';
import {
    updateStudent,
    updateParent,
    updateStudentStatus,
    moveStudentToClass,
    AcademyStudentModifyRequest,
    ParentUpdateRequest,
    ClassInfoStudentModifyRequest,
    ClassInfoStudentMoveRequest
} from '@/api/studentApi';
import { useEffect } from 'react';

export default function StudentModifyPage() {
    const params = useParams();
    const router = useRouter();
    const academyId = Number(params.academyId);
    const studentId = Number(params.studentId);

    const { data: parentStats, loading } = useParentStats(academyId);

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

    // Initialize state with student data
    const [studentName, setStudentName] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [className, setClassName] = useState('');
    const [classId, setClassId] = useState<number | null>(null);
    const [classes, setClasses] = useState<ClassGetResponse[]>([]);
    const [status, setStatus] = useState<'ENROLLED' | 'PAUSED' | 'WITHDRAWN'>('ENROLLED');

    // Card modal state
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [selectedParentIndex, setSelectedParentIndex] = useState<number | null>(null);

    // Initialize parent states
    const [parentsData, setParentsData] = useState<Array<{
        parentId: number;
        parentName: string;
        parentPhone: string;
        relationship: string;
        cardNum: string;
        cardState: boolean;
        isPay: boolean;
        alarm: boolean;
        expiry?: string;
        cvc?: string;
    }>>([]);

    // Fetch classes
    useEffect(() => {
        getClasses(academyId).then(setClasses).catch(console.error);
    }, [academyId]);

    // Update state when studentData is loaded
    useMemo(() => {
        if (studentData) {
            setStudentName(studentData.studentName);
            setStudentPhone(studentData.studentPhone || '');
            setClassName(studentData.className);
            setClassId(studentData.classId);

            // Map backend status to frontend display labels if needed
            // Based on backend: ENROLLED, PAUSED, WITHDRAWN
            setStatus(studentData.status || 'ENROLLED');

            const parents = studentData.parents || [];
            setParentsData(parents.map(p => ({
                parentId: p.parentId,
                parentName: p.parentName || '',
                parentPhone: p.parentPhone || '',
                relationship: p.parentRelationship || '',
                cardNum: p.cardNum || '',
                cardState: p.cardState || false,
                isPay: p.isPay || false,
                alarm: p.alarm || false
            })));
        }
    }, [studentData]);

    const handleCancel = () => {
        router.back();
    };

    const handleSave = async () => {
        try {
            // 1. Update Student Basic Info
            const studentUpdate: AcademyStudentModifyRequest = {
                studentName,
                studentPhone
            };
            await updateStudent(academyId, studentId, studentUpdate);

            // 2. Update Parents Info
            for (const parent of parentsData) {
                const parentUpdate: ParentUpdateRequest = {
                    parentName: parent.parentName,
                    parentPhone: parent.parentPhone,
                    parentRelationship: parent.relationship,
                    cardNum: parent.cardNum,
                    cardState: parent.cardState || false,
                    isPay: parent.isPay || false,
                    alarm: parent.alarm || false
                };
                await updateParent(studentId, parent.parentId, parentUpdate);
            }

            // 3. Update Status
            if (status !== studentData?.status) {
                const statusUpdate: ClassInfoStudentModifyRequest = { status };
                await updateStudentStatus(studentData!.classId, studentId, statusUpdate);
            }

            // 4. Move Class if changed
            if (studentData && classId !== studentData.classId && classId !== null) {
                const moveRequest: ClassInfoStudentMoveRequest = { targetClassId: classId };
                await moveStudentToClass(academyId, studentData.classId, studentId, moveRequest);
            }

            alert('정보가 성공적으로 수정되었습니다.');
            router.back();
        } catch (error) {
            console.error('Failed to save student data:', error);
            alert('정보 수정 중 오류가 발생했습니다.');
        }
    };

    const updateParentField = (index: number, field: string, value: any) => {
        setParentsData(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleOpenCardModal = (index: number) => {
        setSelectedParentIndex(index);
        setIsCardModalOpen(true);
    };

    const handleCardRegister = (cardInfo: { cardNumber: string; expiry: string; cvc: string }) => {
        if (selectedParentIndex !== null) {
            setParentsData(prev => {
                const updated = [...prev];
                updated[selectedParentIndex] = {
                    ...updated[selectedParentIndex],
                    cardNum: cardInfo.cardNumber,
                    expiry: cardInfo.expiry,
                    cvc: cardInfo.cvc,
                };
                return updated;
            });
        }
        setIsCardModalOpen(false);
        setSelectedParentIndex(null);
    };

    if (loading) return <div>로딩 중...</div>;
    if (!studentData) return <div>원생 정보가 없습니다.</div>;

    const parents = parentsData;

    return (
        <div className={styles.formContainer}>
            <AcademyTitle title="원생 정보 수정" />

            {/* 소제목 1: 기본 정보 */}
            <div className={styles.sectionTitle}>기본 정보</div>
            <TextInput
                label="원생 이름"
                value={studentName}
                onChange={setStudentName}
                readOnly={false}
            />
            <TextInput
                label="원생 전화번호"
                value={studentPhone}
                placeholder="전화번호를 입력하세요"
                onChange={setStudentPhone}
                readOnly={false}
            />
            <SingleSelect
                label="클래스"
                options={classes.map(c => ({ label: c.className, value: c.classId.toString() }))}
                value={classId?.toString() || ''}
                onChange={(value) => setClassId(Number(value))}
            />
            <SingleSelect
                label="상태"
                options={[
                    { label: '재원', value: 'ENROLLED' },
                    { label: '휴원', value: 'PAUSED' },
                    { label: '퇴원', value: 'WITHDRAWN' },
                ]}
                value={status}
                onChange={(value) => setStatus(value as 'ENROLLED' | 'PAUSED' | 'WITHDRAWN')}
            />

            {/* Display all parents */}
            {parents.length === 0 ? (
                <>
                    <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                        보호자
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

                    return (
                        <div key={parent.parentId || index}>
                            <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                                보호자 {parents.length > 1 ? `${index + 1}` : ''}
                            </div>
                            <TextInput
                                label="보호자 성함"
                                value={parent.parentName}
                                onChange={(value) => updateParentField(index, 'parentName', value)}
                                readOnly={false}
                            />
                            <TextInput
                                label="보호자 연락처"
                                value={parent.parentPhone}
                                onChange={(value) => updateParentField(index, 'parentPhone', value)}
                                readOnly={false}
                            />
                            <TextInput
                                label="원생과의 관계"
                                value={parent.relationship}
                                onChange={(value) => updateParentField(index, 'relationship', value)}
                                readOnly={false}
                            />

                            {/* 카드 정보 */}
                            <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                                카드 정보 {parents.length > 1 ? `${index + 1}` : ''}
                            </div>

                            {hasCard ? (
                                <div className={styles.registeredContainer}>
                                    <div className={styles.cardNumberBox}>
                                        <span>{displayCardNumber}</span>
                                        <button
                                            className={styles.changeButton}
                                            onClick={() => handleOpenCardModal(index)}
                                        >
                                            변경
                                        </button>
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
                                <div
                                    className={styles.cardBox}
                                    onClick={() => handleOpenCardModal(index)}
                                >
                                    <span className={styles.addCardText}>+ 카드를 등록해주세요</span>
                                </div>
                            )}
                        </div>
                    );
                })
            )}

            {/* Action buttons */}
            <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
            }}>
                <button
                    onClick={handleCancel}
                    style={{
                        padding: '10px 24px',
                        fontSize: '15px',
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
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                    }}
                >
                    취소
                </button>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '10px 24px',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                    }}
                >
                    저장
                </button>
            </div>

            {/* Card Registration Modal */}
            <CardRegistrationModal
                isOpen={isCardModalOpen}
                onClose={() => {
                    setIsCardModalOpen(false);
                    setSelectedParentIndex(null);
                }}
                onRegister={handleCardRegister}
                initialCardData={
                    selectedParentIndex !== null && parentsData[selectedParentIndex]
                        ? {
                            cardNumber: parentsData[selectedParentIndex].cardNum || '',
                            expiry: parentsData[selectedParentIndex].expiry || '',
                            cvc: parentsData[selectedParentIndex].cvc || '',
                        }
                        : undefined
                }
            />
        </div>
    );
}
