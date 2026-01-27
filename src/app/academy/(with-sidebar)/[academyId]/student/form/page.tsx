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

    const { classes, loading: classesLoading } = useClasses(academyId);

    // --- 기본 정보 ---
    const [studentName, setStudentName] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [selectedClassNames, setSelectedClassNames] = useState<string[]>([]);
    const [status, setStatus] = useState<string>('재원'); // 기본값 재원

    // --- 보호자 정보 ---
    const [parentName, setParentName] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [relationship, setRelationship] = useState<string>(''); // 기본값 없음

    // --- 카드 정보 ---
    const [cardInfo, setCardInfo] = useState<{
        cardNumber: string;
        expiry: string;
        cvc: string;
    } | null>(null);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    // const statusOptions = [
    //     { label: '재원', value: '재원' },
    //     { label: '휴원', value: '휴원' },
    //     { label: '퇴원', value: '퇴원' },
    // ];

    const relationshipOptions = [
        { label: '부', value: '부' },
        { label: '모', value: '모' },
        { label: '조부', value: '조부' },
        { label: '조모', value: '조모' },
    ];

    const classOptions = classes.map(cls => ({
        label: cls.className,
        value: cls.classId,
    }));

    const handleRegister = async () => {
        if (!studentName || !studentPhone) {
            alert('원생 이름과 전화번호를 입력해주세요.');
            return;
        }

        if ((parentName && !parentPhone) || (!parentName && parentPhone)) {
            alert('보호자 정보를 입력하려면 이름과 연락처를 모두 입력해주세요.');
            return;
        }

        if (parentName && parentPhone && !relationship) {
            alert('원생과의 관계를 선택해주세요.');
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
            // 보호자 정보가 온전하게 입력된 경우에만 등록 시도
            if (parentName && parentPhone) {
                const parentData: ParentCreateRequest = {
                    parentName,
                    parentPhone,
                    parentRelationship: relationship,
                    cardNum: cardInfo ? cardInfo.cardNumber.replace(/-/g, '') : '', // 하이픈 제거
                    cardState: !!cardInfo, // 카드 정보 유무에 따라 설정
                    isPay: true,     // 기본값 true
                    alarm: true,     // 기본값 true
                };
                await addParent(studentId, parentData);
            }

            // 3. 클래스 배정
            // 선택된 클래스가 있는 경우에만 배정
            if (selectedClassNames.length > 0) {
                const selectedClassIds = selectedClassNames
                    .map(name => classes.find(c => c.className === name)?.classId)
                    .filter((id): id is number => id !== undefined);

                // Promise.all로 병렬 처리 권장
                await Promise.all(selectedClassIds.map(id => assignStudentToClass(id, studentId)));
            }

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
        <div className={styles.formContainer}>
            <AcademyTitle title="신규 원생 등록" />

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
                label="클래스 (선택)"
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
            <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                보호자 정보
            </div>
            <TextInput
                label="보호자 이름 (선택)"
                value={parentName}
                onChange={setParentName}
            />
            <TextInput
                label="보호자 연락처 (선택)"
                value={parentPhone}
                onChange={setParentPhone}
            />
            <SingleSelect
                label="원생과의 관계 (선택)"
                options={relationshipOptions}
                value={relationship}
                onChange={setRelationship}
            />

            {/* 소제목 3: 카드 정보 */}
            <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                카드 정보 (선택)
            </div>

            {activeTab === 'individual' ? (
                <IndividualRegistrationForm academyId={academyId} />
            ) : (
                <ExcelRegistrationForm academyId={academyId} />
            )}

            <div className={styles.sectionBox}>
                <Button
                    onClick={handleRegister}
                    disabled={!studentName || !studentPhone}
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
        </div >
    );
}
