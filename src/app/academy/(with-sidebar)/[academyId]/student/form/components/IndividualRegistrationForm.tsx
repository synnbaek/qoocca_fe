'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TextInput from '@/app/academy/register/components/TextInput';
import Button from '@/components/common/Button';
import styles from '../form.module.css';
import SingleSelect from './SingleSelect';
import { useClasses } from '@/hooks/useClasses';
import { useParentStats } from '@/hooks/useParentStats';
import CardRegistrationModal from './CardRegistrationModal';
import RegistrationCompleteModal from './RegistrationCompleteModal';
import { createStudent, addParent, assignStudentToClass, AcademyStudentCreateRequest, ParentCreateRequest } from '@/api/studentApi';
import MultiSelect from './MultiSelect';

interface Props {
    academyId: number;
}

/**
 * 원생 통합 등록 폼 컴포넌트 (검색 우선 방식)
 */
export default function IndividualRegistrationForm({ academyId }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultClassId = searchParams.get('classId');

    const { classes, loading: classesLoading } = useClasses(academyId);
    const { data: parentStats, loading: statsLoading } = useParentStats(academyId);

    // --- 등록 모드 및 상태 ---
    const [registrationMode, setRegistrationMode] = useState<'new' | 'existing'>('new');
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

    // --- 원생 정보 ---
    const [studentName, setStudentName] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [selectedClassIds, setSelectedClassIds] = useState<(number | string)[]>([]);
    
    // --- 보호자 정보 ---
    const [parentName, setParentName] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [relationship, setRelationship] = useState<string>('부');

    // --- 카드 정보 ---
    const [cardInfo, setCardInfo] = useState<{
        cardNumber: string;
        expiry: string;
        cvc: string;
    } | null>(null);
    
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    // --- 검색 UI 제어 ---
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // 쿼리 파라미터로 넘어온 classId가 있으면 자동 선택
    useEffect(() => {
        if (defaultClassId && classes.length > 0) {
            const classIdNum = Number(defaultClassId);
            if (classes.some(c => c.classId === classIdNum)) {
                setSelectedClassIds([classIdNum]);
            }
        }
    }, [defaultClassId, classes]);

    // 학원 전체 원생 목록 추출 및 수강 중인 클래스 정보 포함
    const allStudents = useMemo(() => {
        const studentMap = new Map();
        parentStats.forEach(cls => {
            cls.students.forEach(std => {
                if (!studentMap.has(std.studentId)) {
                    studentMap.set(std.studentId, {
                        ...std,
                        enrolledClassIds: [cls.classId],
                        enrolledClassNames: [cls.className]
                    });
                } else {
                    const existing = studentMap.get(std.studentId);
                    if (!existing.enrolledClassIds.includes(cls.classId)) {
                        existing.enrolledClassIds.push(cls.classId);
                        existing.enrolledClassNames.push(cls.className);
                    }
                }
            });
        });
        return Array.from(studentMap.values());
    }, [parentStats]);

    // 입력값에 따른 기존 원생 검색
    const filteredStudents = useMemo(() => {
        if (!studentName || registrationMode === 'existing') return [];
        const term = studentName.toLowerCase();
        return allStudents.filter(std => 
            std.studentName.toLowerCase().includes(term) || 
            std.studentPhone.includes(term)
        ).slice(0, 5); 
    }, [allStudents, studentName, registrationMode]);

    // 검색창 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const relationshipOptions = [
        { label: '부', value: '부' },
        { label: '모', value: '모' },
        { label: '조부', value: '조부' },
        { label: '조모', value: '조모' },
    ];

    /**
     * 기존 원생 선택 처리
     */
    const handleSelectExistingStudent = (student: any) => {
        // 중복 체크: 선택된 모든 클래스에 이미 포함되어 있는지 확인
        const currentSelectedIds = selectedClassIds.map(id => Number(id));
        const alreadyInAll = currentSelectedIds.every(id => student.enrolledClassIds.includes(id));

        if (alreadyInAll && currentSelectedIds.length > 0) {
            alert(`${student.studentName} 원생은 이미 선택하신 모든 클래스에 등록되어 있습니다.`);
            return;
        }

        // 일부만 포함된 경우 안내
        const overlap = currentSelectedIds.filter(id => student.enrolledClassIds.includes(id));
        if (overlap.length > 0) {
            const overlapNames = overlap.map(id => classes.find(c => c.classId === id)?.className).join(', ');
            if(!confirm(`${student.studentName} 원생은 이미 [${overlapNames}] 수강 중입니다. 나머지 클래스만 추가할까요?`)) {
                return;
            }
        }

        setRegistrationMode('existing');
        setSelectedStudentId(student.studentId);
        setStudentName(student.studentName);
        setStudentPhone(student.studentPhone);
        
        if (student.parents && student.parents.length > 0) {
            const firstParent = student.parents[0];
            setParentName(firstParent.parentName);
            setParentPhone(firstParent.parentPhone);
            setRelationship(firstParent.parentRelationship);
            if (firstParent.cardNum) {
                setCardInfo({ cardNumber: firstParent.cardNum, expiry: '', cvc: '' });
            }
        }
        setIsSearchOpen(false);
    };

    /**
     * 선택 취소 및 다시 작성
     */
    const handleResetToNew = () => {
        setRegistrationMode('new');
        setSelectedStudentId(null);
        setStudentName('');
        setStudentPhone('');
        setParentName('');
        setParentPhone('');
        setCardInfo(null);
        setRelationship('부');
    };

    /**
     * 학생 등록 실행
     */
    const handleRegister = async () => {
        if (registrationMode === 'new') {
            if (!studentName || !studentPhone || selectedClassIds.length === 0 || !parentName || !parentPhone) {
                alert('모든 필수 정보를 입력해주세요.');
                return;
            }
        } else {
            if (!selectedStudentId || selectedClassIds.length === 0) {
                alert('학생과 클래스를 선택해주세요.');
                return;
            }
        }

        try {
            let studentId = selectedStudentId;

            if (registrationMode === 'new') {
                const studentData: AcademyStudentCreateRequest = {
                    studentName,
                    studentPhone,
                };
                const studentResponse = await createStudent(academyId, studentData);
                studentId = studentResponse.studentId;

                const parentData: ParentCreateRequest = {
                    parentName,
                    parentPhone,
                    parentRelationship: relationship,
                    cardNum: cardInfo ? cardInfo.cardNumber.replace(/-/g, '') : '',
                    cardState: !!cardInfo,
                    isPay: true,
                    alarm: true,
                };
                await addParent(studentId, parentData);
            }

            if (studentId) {
                // 이미 수강 중인 클래스는 제외하고 배정 요청
                const studentInfo = allStudents.find(s => s.studentId === studentId);
                const enrolledIds = studentInfo?.enrolledClassIds || [];
                
                const classesToAssign = selectedClassIds
                    .map(id => Number(id))
                    .filter(id => !enrolledIds.includes(id));

                if (classesToAssign.length > 0) {
                    await Promise.all(classesToAssign.map(id => assignStudentToClass(academyId, id, studentId!)));
                } else if (registrationMode === 'existing') {
                     alert('이미 모든 선택된 클래스에 등록되어 있습니다.');
                     return;
                }
            }

            setIsCompleteModalOpen(true);

        } catch (error) {
            console.error('Registration failed:', error);
            alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    if (classesLoading || statsLoading) return <div>로딩 중...</div>;

    const classOptions = classes.map(c => ({
        label: c.className,
        value: c.classId
    }));

    return (
        <>
            {/* 원생 정보 섹션 */}
            <div className={styles.sectionTitle}>
                원생 정보 
                {registrationMode === 'existing' && (
                    <span style={{ fontSize: '13px', color: 'var(--primary-color)', marginLeft: '8px', cursor: 'pointer' }} onClick={handleResetToNew}>
                        [선택 취소]
                    </span>
                )}
            </div>
            
            <div style={{ position: 'relative', width: '100%' }} ref={searchRef}>
                <TextInput
                    label="원생 이름"
                    value={studentName}
                    onChange={(val) => {
                        setStudentName(val);
                        if (registrationMode === 'new') setIsSearchOpen(true);
                    }}
                    placeholder="원생 이름을 입력하세요"
                    readOnly={registrationMode === 'existing'}
                    disabled={registrationMode === 'existing'}
                />
                
                {/* 검색 드롭다운 (신규 입력 중에만 노출) */}
                {isSearchOpen && filteredStudents.length > 0 && (
                    <div className={styles.multiSelectOptionsDropdown} style={{ top: '100%', marginTop: '-8px' }}>
                        <div style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-primary)' }}>
                            이미 등록된 원생인가요? 선택하면 정보를 불러옵니다.
                        </div>
                        {filteredStudents.map(std => {
                            // 현재 선택된 클래스들 중 이미 수강 중인 클래스가 있는지 확인
                            const studentEnrolledIds = std.enrolledClassIds || [];
                            const isAlreadyInSome = selectedClassIds.some(id => studentEnrolledIds.includes(Number(id)));

                            return (
                                <div 
                                    key={std.studentId} 
                                    className={styles.multiSelectOption}
                                    onClick={() => handleSelectExistingStudent(std)}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: 600 }}>{std.studentName}</span>
                                            {isAlreadyInSome && (
                                                <span style={{ fontSize: '10px', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '0 4px', borderRadius: '2px' }}>수강 중</span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {std.studentPhone} | {std.enrolledClassNames?.join(', ')}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', whiteSpace: 'nowrap' }}>선택</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <TextInput
                label="원생 전화번호"
                value={studentPhone}
                onChange={setStudentPhone}
                placeholder="전화번호 입력 (예: 01012345678)"
                readOnly={registrationMode === 'existing'}
                disabled={registrationMode === 'existing'}
            />

            <MultiSelect
                label="추가할 클래스 선택"
                options={classOptions}
                values={selectedClassIds}
                onChange={setSelectedClassIds}
                placeholder="클래스를 선택하세요"
            />

            {/* 보호자 정보 섹션 */}
            <div className={`${styles.sectionTitle} ${styles.marginTop24}`}>
                보호자 정보 {registrationMode === 'existing' && '(기존 정보)'}
            </div>
            <TextInput
                label="보호자 이름"
                value={parentName}
                onChange={setParentName}
                readOnly={registrationMode === 'existing'}
                disabled={registrationMode === 'existing'}
            />
            <TextInput
                label="보호자 연락처"
                value={parentPhone}
                onChange={setParentPhone}
                readOnly={registrationMode === 'existing'}
                disabled={registrationMode === 'existing'}
            />
            <SingleSelect
                label="원생과의 관계"
                options={relationshipOptions}
                value={relationship}
                onChange={setRelationship}
            />

            {/* 카드 정보 섹션 */}
            <div className={`${styles.sectionTitle} ${styles.marginTop24}`}>
                카드 정보 {registrationMode === 'existing' && '(기존 정보)'}
            </div>
            
            {registrationMode === 'new' ? (
                <>
                    {!cardInfo ? (
                        <div className={styles.cardBox} onClick={() => setIsCardModalOpen(true)}>
                            <span className={styles.addCardText}>+ 카드 등록하기</span>
                        </div>
                    ) : (
                        <div className={styles.registeredContainer}>
                            <div className={styles.cardNumberBox}>
                                <span>{cardInfo.cardNumber.slice(0, 4)}-****-****-{cardInfo.cardNumber.slice(15)}</span>
                                <button className={styles.changeButton} onClick={() => setCardInfo(null)}>취소</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.cardNumberBox} style={{ opacity: 0.8 }}>
                    <span>{cardInfo ? (cardInfo.cardNumber.length > 4 ? `****-****-****-${cardInfo.cardNumber.slice(-4)}` : cardInfo.cardNumber) : '등록된 카드 없음'}</span>
                </div>
            )}

            <div className={`${styles.sectionBox} ${styles.buttonGroup}`} style={{ marginTop: '32px' }}>
                <Button
                    onClick={handleRegister}
                    disabled={
                        registrationMode === 'new' 
                            ? (!studentName || !studentPhone || selectedClassIds.length === 0 || !parentName || !parentPhone)
                            : (!selectedStudentId || selectedClassIds.length === 0)
                    }
                    className={styles.flex1}
                >
                    {registrationMode === 'new' ? '신규 원생으로 등록' : '기존 원생 클래스 추가'}
                </Button>
            </div>

            <CardRegistrationModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onRegister={(info) => setCardInfo(info)}
            />

            <RegistrationCompleteModal
                isOpen={isCompleteModalOpen}
                onConfirm={() => {
                    setIsCompleteModalOpen(false);
                    router.push(`/academy/${academyId}/student`);
                }}
            />
        </>
    );
}


