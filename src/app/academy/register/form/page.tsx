'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AcademyTitle from '../components/AcademyTitle';
import TextInput from '../components/TextInput';
import MultiSelect from '../components/MultiSelect';
import styles from './form.module.css';
import { useSubjects } from '@/hooks/useSubjects';
import { useAges } from '@/hooks/useAges';
import { createAcademy, uploadAcademyImages } from '@/api/academyApi';
import { useAcademy } from '@/context/AcademyContext';
import Button from '../../../../components/common/Button';
import { toast } from 'sonner';

export default function AcademyFormPage() {
  const router = useRouter();
  const { academyName, businessFiles, academyImageFiles } = useAcademy();

  const { subjectOptions, loading: subjectLoading } = useSubjects();
  const { ageOptions, loading: ageLoading } = useAges();

  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [ages, setAges] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [intro, setIntro] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [tuition, setTuition] = useState('');
  const [levelTest, setLevelTest] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [blog, setBlog] = useState('');

  // 선택한 문자열 → id 배열
  const selectedAgeIds = ages
    .map((label) => ageOptions.find((a) => a.label === label)?.value)
    .filter((v): v is number => v !== undefined);

  const selectedSubjectIds = subjects
    .map((label) => subjectOptions.find((s) => s.label === label)?.value)
    .filter((v): v is number => v !== undefined);

  const handleRegister = async () => {
    if (!academyName || businessFiles.length === 0) {
      toast.error('학원명과 사업자등록증을 먼저 입력해주세요.');
      return;
    }

    let academyId: number;

    try {
      // 1) 학원 정보 및 인증서 등록
      academyId = await createAcademy({
        name: academyName,
        baseAddress,
        detailAddress,
        phoneNumber: phone,
        briefInfo: intro,
        operatingHours, // 추가됨
        tuition,       // 추가됨
        levelTest,     // 추가됨
        websiteUrl: website,
        instagramUrl: instagram,
        blogUrl: blog,
        certificateFile: businessFiles[0],
        ageIds: selectedAgeIds,
        subjects: selectedSubjectIds,
      });

      // 2) 이미지 업로드 (별도 호출, 실패해도 등록은 유지)
      if (academyImageFiles.length > 0) {
        try {
          const jobResponse = await uploadAcademyImages(academyId, academyImageFiles);
          toast.info('이미지 업로드가 시작되었습니다.');
          router.push(`/academy/register/complete?academyId=${academyId}&jobId=${jobResponse.jobId}`);
          return;
        } catch (imageErr: any) {
          console.error('이미지 업로드 실패:', imageErr);
          if (imageErr?.response?.status === 503 && imageErr?.response?.data?.code === 'AC010') {
            toast.error('업로드 요청이 많습니다. 잠시 후 마이페이지에서 다시 시도해주세요.');
          } else {
            toast.error('학원 등록은 완료되었으나, 이미지 업로드에 실패했습니다. 마이페이지에서 다시 시도해주세요.');
          }
        }
      }

      toast.success('학원 등록이 완료되었습니다!');
      router.push(`/academy/register/complete?academyId=${academyId}`);
    } catch (err: any) {
      console.error('학원 등록 실패:', err);
      const errorMsg = err.response?.data?.message || '학원 등록 중 오류가 발생했습니다. 모든 필수 항목과 인증서를 확인해주세요.';
      toast.error(errorMsg);
    }
  };

  if (ageLoading || subjectLoading) return <div>로딩 중...</div>;

  return (
    <div className={styles.formContainer}>
      <AcademyTitle title="학원 정보 입력" />

      <TextInput
        label="기본 주소"
        value={baseAddress}
        onChange={setBaseAddress}
      />
      <TextInput
        label="상세 주소"
        value={detailAddress}
        onChange={setDetailAddress}
      />
      <TextInput label="전화번호" value={phone} onChange={setPhone} />

      <MultiSelect
        label="학원생 나이"
        options={ageOptions.map((a) => a.label)}
        selected={ages}
        onChange={setAges}
      />

      <MultiSelect
        label="과목"
        options={subjectOptions.map((s) => s.label)}
        selected={subjects}
        onChange={setSubjects}
      />

      <TextInput label="학원 소개글(선택)" value={intro} onChange={setIntro} />
      <TextInput
        label="운영 시간(선택)"
        value={operatingHours}
        onChange={setOperatingHours}
      />
      <TextInput
        label="수업 비용(선택)"
        value={tuition}
        onChange={setTuition}
      />
      <TextInput
        label="레벨 테스트(선택)"
        value={levelTest}
        onChange={setLevelTest}
      />
      <TextInput label="홈페이지" value={website} onChange={setWebsite} />
      <TextInput label="인스타그램" value={instagram} onChange={setInstagram} />
      <TextInput label="네이버 블로그" value={blog} onChange={setBlog} />

      <div className={styles.sectionBox}>
        <Button
          onClick={handleRegister}
          disabled={!academyName || businessFiles.length === 0}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
}