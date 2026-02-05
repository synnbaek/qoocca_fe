'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextInput from '@/app/academy/register/components/TextInput';
import Button from '@/components/common/Button';
import styles from '../form.module.css';
import SingleSelect from './SingleSelect';
import { useClasses } from '@/hooks/useClasses';
import CardRegistrationModal from './CardRegistrationModal';
import RegistrationCompleteModal from './RegistrationCompleteModal';
import { createStudent, addParent, assignStudentToClass, AcademyStudentCreateRequest, ParentCreateRequest } from '@/api/studentApi';
import MultiSelect from '@/app/academy/register/components/MultiSelect';

interface Props {
    academyId: number;
}

export default function IndividualRegistrationForm({ academyId }: Props) {
    const router = useRouter();
    const { classes, loading: classesLoading } = useClasses(academyId);

    // --- 기본 정보 ---
    const [studentName, setStudentName] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [selectedClassNames, setSelectedClassNames] = useState<string[]>([]);
    
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

    const relationshipOptions = [
        { label: '부', value: '부' },
        { label: '모', value: '모' },
        { label: '조부', value: '조부' },
        { label: '조모', value: '조모' },
    ];

    const handleRegister = async () => {
        if (!studentName || !studentPhone || selectedClassNames.length === 0 || !parentName || !parentPhone) {
            alert('모든 필수 정보를 입력해주세요.');
            return;
        }

        try {
            // 1. 학생 등록
            const studentData: AcademyStudentCreateRequest = {
                studentName,
                studentPhone,
            };
            const studentResponse = await createStudent(academyId, studentData);
            const studentId = studentResponse.studentId;

            // 2. 부모 및 카드 등록
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

            // 3. 클래스 배정
            const selectedClassIds = selectedClassNames
                .map(name => classes.find(c => c.className === name)?.classId)
                .filter((id): id is number => id !== undefined);

            await Promise.all(selectedClassIds.map(id => assignStudentToClass(academyId, id, studentId)));

            console.log('Registration successful');
            setIsCompleteModalOpen(true);

        } catch (error) {
            console.error('Registration failed:', error);
            alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleCardRegister = (info: { cardNumber: string; expiry: string; cvc: string }) => {
        setCardInfo(info);
    };

    const handleComplete = () => {
        setIsCompleteModalOpen(false);
        router.push(`/academy/${academyId}/student`);
    };

    if (classesLoading) return <div>로딩 중...</div>;

    return (
        <>
            {/* 소제목 1: 기본 정보 */}
            <div className={styles.sectionTitle}>기본 정보</div>
            <TextInput
                label="원생 이름"
                value={studentName}
                onChange={setStudentName}
            />
            <TextInput
                label="원생 전화번호"
                value={studentPhone}
                onChange={setStudentPhone}
            />
            <MultiSelect
                label="클래스 선택"
                options={classes.map(c => c.className)}
                selected={selectedClassNames}
                onChange={setSelectedClassNames}
            />
            <TextInput
                label="상태"
                value="재원"
                onChange={() => { }}
                readOnly={true}
                disabled={true}
            />

            {/* 소제목 2: 보호자 정보 */}
            <div className={`${styles.sectionTitle} ${styles.marginTop24}`}>
                보호자 정보
            </div>
            <TextInput
                label="보호자 이름"
                value={parentName}
                onChange={setParentName}
            />
            <TextInput
                label="보호자 연락처"
                value={parentPhone}
                onChange={setParentPhone}
            />
            <SingleSelect
                label="원생과의 관계"
                options={relationshipOptions}
                value={relationship}
                onChange={setRelationship}
            />

            {/* 소제목 3: 카드 정보 */}
            <div className={`${styles.sectionTitle} ${styles.marginTop24}`}>
                카드 정보
            </div>
            <p className={styles.cardNotice}>
                카드 등록후 출결 및 보상 기능을 이용할 수 있습니다.
            </p>

            {!cardInfo ? (
                <div className={styles.cardBox} onClick={() => setIsCardModalOpen(true)}>
                    <span className={styles.addCardText}>+ 카드 등록하기</span>
                </div>
            ) : (
                <div className={styles.registeredContainer}>
                    <div className={styles.registrationDate}>
                        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').slice(0, -1)}
                    </div>

                    <div className={styles.cardNumberBox}>
                        <span>{cardInfo.cardNumber.slice(0, 4)}-****-****-{cardInfo.cardNumber.slice(15)}</span>
                        <button
                            className={styles.changeButton}
                            onClick={() => {
                                if (confirm('카드를 변경하거나 해지하시겠습니까?')) {
                                    setCardInfo(null);
                                }
                            }}
                        >
                            변경/해지
                        </button>
                    </div>

                    <div className={styles.cardImageWrapper}>
                        <img
                            src="/images/card_placeholder.png"
                            alt="Registered Card"
                            className={styles.cardImage}
                        />
                    </div>
                </div>
            )}

            <div className={`${styles.sectionBox} ${styles.buttonGroup}`}>
                <Button
                    onClick={handleRegister}
                    disabled={!studentName || !studentPhone || selectedClassNames.length === 0 || !parentName || !parentPhone}
                    className={styles.flex1}
                >
                    등록하기
                </Button>
            </div>

            <CardRegistrationModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onRegister={handleCardRegister}
            />

            <RegistrationCompleteModal
                isOpen={isCompleteModalOpen}
                onConfirm={handleComplete}
            />
        </>
    );
}