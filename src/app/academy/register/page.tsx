'use client';

import { useRouter } from 'next/navigation';
import { useAcademy } from '../../../context/AcademyContext';
import AcademyTitle from './components/AcademyTitle';
import TextInput from './components/TextInput';
import MultiFileInput from './components/MultiFileInput';
import styles from './academy.module.css';
import Button from '@/components/common/Button';

export default function AcademyRegisterPage() {
  const router = useRouter();
  const { academyName, setAcademyName, businessFiles, setBusinessFiles } =
    useAcademy();

  return (
    <div className={styles.academyContainer}>
      <AcademyTitle title="학원 등록하기" />

      <div className={styles.sectionBox}>
        <TextInput
          label="학원명"
          value={academyName}
          onChange={setAcademyName}
        />
      </div>

      <div className={styles.sectionBox}>
        <MultiFileInput
          label="사업자 등록증 제출"
          description="사진 또는 캡처화면 제출 (png, jpg, pdf)"
          files={businessFiles}
          onChange={setBusinessFiles}
        />
        <div className={styles.guidanceWrapper}>
          <p className={styles.guidanceTitle}>
            학원 관계자 확인을 위해
            <br />
            사업자등록증을 업로드해 주세요
          </p>
          <ul className={styles.guidanceList}>
            <li>
              제출된 사업자등록증은 학원 인증 용도로만 사용됩니다.
            </li>
            <li>
              인증 완료 전까지 일부 기능 이용이 제한될 수 있습니다.
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.sectionBox}>
        <Button
          disabled={!academyName || businessFiles.length === 0}
          onClick={() => router.push('/academy/register/form')}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
