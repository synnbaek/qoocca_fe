'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TextInput from '@/app/academy/register/components/TextInput';
import Button from '@/components/common/Button';
import styles from '../form.module.css';
import SingleSelect from './SingleSelect';
import { useClasses } from '@/hooks/useClasses';
import { useParentStats } from '@/hooks/useParentStats';
import { useAcademyStudents } from '@/hooks/useAcademyStudents';
import CardRegistrationModal from './CardRegistrationModal';
import RegistrationCompleteModal from './RegistrationCompleteModal';
import { createStudent, createStudentWithParent, addParent, assignStudentToClass, AcademyStudentCreateRequest, ParentCreateRequest, AcademyStudentWithParentCreateRequest } from '@/api/studentApi';
import MultiSelect from './MultiSelect';

// 전화번호 포맷팅 함수 (01012345678 -> 010-1234-5678)
const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
};

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
    const { students: academyStudents, loading: studentsLoading } = useAcademyStudents(academyId);

    // --- 등록 모드 및 상태 ---
    const [registrationMode, setRegistrationMode] = useState<'new' | 'existing'>('new');
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    // 학원 전체 원생 목록 및 상세 정보(보호자/클래스) 통합
    const allStudents = useMemo(() => {
        // 1. 먼저 전체 학생 목록을 기본 맵으로 구성
        const studentMap = new Map();
        
        academyStudents.forEach(std => {
            const phone = std.studentPhone || (std as any).phone || (std as any).student_phone || '';
            studentMap.set(std.studentId, {
                studentId: std.studentId,
                studentName: std.studentName,
                studentPhone: phone,
                enrolledClassIds: [],
                enrolledClassNames: [],
                parents: []
            });
        });

        // 2. 클래스 기반 통계 데이터에서 상세 정보(수강 반, 보호자) 매핑
        parentStats.forEach(cls => {
            cls.students.forEach(std => {
                const existing = studentMap.get(std.studentId);
                if (existing) {
                    // 수강 반 정보 추가
                    if (!existing.enrolledClassIds.includes(cls.classId)) {
                        existing.enrolledClassIds.push(cls.classId);
                        existing.enrolledClassNames.push(cls.className);
                    }
                    // 보호자 정보가 아직 없으면 추가
                    if (existing.parents.length === 0 && std.parents && std.parents.length > 0) {
                        existing.parents = std.parents;
                    }
                } else {
                    // 전체 목록에서 혹시라도 누락된 경우(드문 상황) 추가
                    studentMap.set(std.studentId, {
                        ...std,
                        enrolledClassIds: [cls.classId],
                        enrolledClassNames: [cls.className]
                    });
                }
            });
        });
        
        
        const result = Array.from(studentMap.values());
        return result;
    }, [academyStudents, parentStats]);

    // 입력값에 따른 기존 원생 검색
    const filteredStudents = useMemo(() => {
        if (!studentName || registrationMode === 'existing') return [];
        const term = studentName.toLowerCase().trim().replace(/-/g, '');
        if (!term) return [];

        const results = allStudents.filter(std => {
            const nameMatch = (std.studentName || '').toLowerCase().includes(term);
            const rawPhone = (std.studentPhone || '').replace(/-/g, '');
            const phoneMatch = rawPhone.includes(term);
            return nameMatch || phoneMatch;
        }).slice(0, 5); 

        return results;
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
        // 필수값 검증
        if (registrationMode === 'new') {
            if (!studentName.trim() || !studentPhone || !parentName.trim() || !parentPhone || !relationship) {
                alert('학생 정보와 보호자 필수 정보를 모두 입력해주세요.');
                return;
            }
        } else {
            if (!selectedStudentId) {
                alert('등록할 학생을 선택해주세요.');
                return;
            }
        }

        if (selectedClassIds.length === 0) {
            alert('배정할 클래스를 하나 이상 선택해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);
            let studentId = selectedStudentId;

            if (registrationMode === 'new') {
                const combinedData: AcademyStudentWithParentCreateRequest = {
                    student: {
                        studentName: studentName.trim(),
                        studentPhone: studentPhone.replace(/\D/g, ''),
                    },
                    parent: {
                        parentName: parentName.trim(),
                        parentPhone: parentPhone.replace(/\D/g, ''),
                        parentRelationship: relationship,
                        cardNum: cardInfo ? cardInfo.cardNumber.replace(/\D/g, '') : '',
                        cardState: !!cardInfo,
                        isPay: true,
                        alarm: true,
                    }
                };
                
                const studentResponse = await createStudentWithParent(academyId, combinedData);
                studentId = studentResponse.studentId;
            }

            if (studentId) {
                // 수강 신청 처리
                const studentInfo = allStudents.find(s => s.studentId === studentId);
                const enrolledIds = studentInfo?.enrolledClassIds || [];
                
                const classesToAssign = selectedClassIds
                    .map(id => Number(id))
                    .filter(id => !enrolledIds.includes(id));

                if (classesToAssign.length > 0) {
                    await Promise.all(classesToAssign.map(id => assignStudentToClass(academyId, id, studentId!)));
                } else if (registrationMode === 'existing') {
                      alert('이미 선택한 모든 클래스에 등록된 원생입니다.');
                      setIsSubmitting(false);
                      return;
                }
            }

            setIsCompleteModalOpen(true);

        } catch (error: any) {
            console.error('Registration failed:', error);
            // 가이드라인 5번: 서버 에러 메시지 우선 표시
            const serverMessage = error.response?.data?.message || error.message;
            alert(serverMessage || '등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (classesLoading || statsLoading || studentsLoading) return <div>로딩 중...</div>;

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
                    <span 
                        style={{ fontSize: '13px', color: 'var(--primary-color)', marginLeft: '8px', cursor: 'pointer', fontWeight: 500 }} 
                        onClick={handleResetToNew}
                    >
                        [다른 원생 선택/새로 입력]
                    </span>
                )}
            </div>
            
            <div style={{ position: 'relative', width: '100%' }} ref={searchRef}>
                <TextInput
                    label="원생 이름"
                    value={studentName}
                    onChange={(val) => {
                        setStudentName(val);
                        setIsSearchOpen(true);
                        if (registrationMode === 'existing') {
                            setRegistrationMode('new');
                            setSelectedStudentId(null);
                        }
                    }}
                    placeholder="원생 이름을 입력하세요"
                    readOnly={registrationMode === 'existing'}
                />
                
                {/* 검색 드롭다운 (신규 입력 중에만 노출) */}
                {isSearchOpen && filteredStudents.length > 0 && registrationMode === 'new' && (
                    <div className={styles.multiSelectOptionsDropdown} style={{ top: '100%', marginTop: '-8px' }}>
                        <div style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-primary)' }}>
                            이미 등록된 원생인가요? 선택하면 정보를 불러옵니다.
                        </div>
                        {filteredStudents.map(std => {
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
                                            <span style={{ fontWeight: 600, fontSize: '15px' }}>{std.studentName}</span>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                                ({std.studentPhone ? formatPhoneNumber(std.studentPhone) : '연락처 없음'})
                                            </span>
                                            {isAlreadyInSome && (
                                                <span style={{ fontSize: '10px', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '0 4px', borderRadius: '2px' }}>수강 중</span>
                                            )}
                                        </div>
                                        {std.enrolledClassNames && std.enrolledClassNames.length > 0 && (
                                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                                현재 수강: {std.enrolledClassNames.join(', ')}
                                            </div>
                                        )}
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
                value={formatPhoneNumber(studentPhone)}
                onChange={(val) => {
                    const onlyNums = val.replace(/\D/g, '');
                    setStudentPhone(onlyNums);
                    if (registrationMode === 'existing') {
                        setRegistrationMode('new');
                        setSelectedStudentId(null);
                    }
                }}
                placeholder="전화번호 입력 (예: 01012345678)"
                readOnly={registrationMode === 'existing'}
            />

            <MultiSelect
                label="추가할 클래스 선택"
                options={classOptions}
                values={selectedClassIds}
                onChange={setSelectedClassIds}
                placeholder="클래스를 선택하세요"
            />

            {/* 보호자 정보 섹션 */}
            <>
                <div className={`${styles.sectionTitle} ${styles.marginTop24}`}>
                    보호자 정보 {registrationMode === 'existing' && '(확인/수정)'}
                </div>
                <TextInput
                    label="보호자 이름"
                    value={parentName}
                    onChange={setParentName}
                />
                <TextInput
                    label="보호자 연락처"
                    value={formatPhoneNumber(parentPhone)}
                    onChange={(val) => setParentPhone(val.replace(/\D/g, ''))}
                    placeholder="보호자 연락처 입력"
                />
                <SingleSelect
                    label="원생과의 관계"
                    options={relationshipOptions}
                    value={relationship}
                    onChange={setRelationship}
                />
            </>

            {/* 카드 정보 섹션 */}
            <>
                <div className={`${styles.sectionTitle} ${styles.marginTop24}`}>
                    카드 정보 {registrationMode === 'existing' && '(확인/수정)'}
                </div>
                {!cardInfo ? (
                    <div className={styles.cardBox} onClick={() => setIsCardModalOpen(true)}>
                        <span className={styles.addCardText}>+ 카드 등록하기</span>
                    </div>
                ) : (
                    <div className={styles.registeredContainer}>
                        <div className={styles.cardNumberBox}>
                            <span>
                                {cardInfo.cardNumber.length >= 16 
                                    ? `${cardInfo.cardNumber.slice(0, 4)}-****-****-${cardInfo.cardNumber.slice(-4)}`
                                    : cardInfo.cardNumber
                                }
                            </span>
                            <button className={styles.changeButton} onClick={() => setCardInfo(null)}>취소</button>
                        </div>
                    </div>
                )}
            </>

            <div className={`${styles.sectionBox} ${styles.buttonGroup}`} style={{ marginTop: '32px' }}>
                <Button
                    onClick={handleRegister}
                    disabled={isSubmitting}
                    className={styles.flex1}
                >
                    {isSubmitting ? '등록 중...' : (registrationMode === 'new' ? '신규 원생으로 등록' : '기존 원생 클래스 추가')}
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


