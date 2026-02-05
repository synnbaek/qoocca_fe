'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import AcademyTitle from '@/app/academy/register/components/AcademyTitle';
import TextInput from '@/app/academy/register/components/TextInput';
import MultiFileInput from '@/app/academy/register/components/MultiFileInput';
import Button from '@/components/common/Button';
import { getAcademyInfo, updateAcademyProfile } from '@/api/dashboardApi';
import { toast } from 'sonner';
import MultiSelect from '@/app/academy/register/components/MultiSelect';
import { useSubjects } from '@/hooks/useSubjects';
import { useAges } from '@/hooks/useAges';
import styles from './AcademyEditPage.module.css';

export default function AcademyEditPage({
  params,
}: {
  params: Promise<{ academyId: string }>;
}) {
  const unwrappedParams = use(params);
  const academyId = unwrappedParams.academyId;
  const router = useRouter();

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

  // 이미지 관련 상태
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchAcademyData = async () => {
      try {
        const data = await getAcademyInfo(academyId);

        setBaseAddress(data.baseAddress || '');
        setDetailAddress(data.detailAddress || '');
        setPhone(data.phoneNumber || '');
        setIntro(data.briefInfo || '');
        setOperatingHours(data.operatingHours || '');
        setWebsite(data.websiteUrl || '');
        setInstagram(data.instagramUrl || '');
        setBlog(data.blogUrl || '');

        // 기존 이미지 URL 설정
        if (data.imageUrls && data.imageUrls.length > 0) {
          setExistingImageUrls(data.imageUrls);
        }

        if (data.ages && data.ages.length > 0) {
          const ageLabels = data.ages.map((a: any) => a.ageCode);
          setAges(ageLabels);
        }

        if (data.subjects && data.subjects.length > 0) {
          const subjectLabels = data.subjects.map((s: any) => s.detailSubject);
          setSubjects(subjectLabels);
        }
      } catch (err) {
        console.error('정보를 불러오는데 실패했습니다.', err);
      }
    };

    if (academyId && ageOptions.length > 0 && subjectOptions.length > 0) {
      fetchAcademyData();
    }
  }, [academyId, ageOptions, subjectOptions]);

  const handleRemoveExistingImage = (url: string) => {
    setExistingImageUrls(prev => prev.filter(u => u !== url));
    setDeletedImageUrls(prev => [...prev, url]);
  };

  const handleUpdate = async () => {
    const selectedAgeIds = ages
      .map((label: string) => ageOptions.find((a) => a.label === label)?.value)
      .filter((v): v is number => v !== undefined);

    const selectedSubjectIds = subjects
      .map(
        (label: string) => subjectOptions.find((s) => s.label === label)?.value
      )
      .filter((v): v is number => v !== undefined);

    try {
      // FormData 사용 여부 결정
      const hasImageChanges = newImageFiles.length > 0 || deletedImageUrls.length > 0;

      if (hasImageChanges) {
        // 이미지 변경이 있는 경우 FormData 사용
        const formData = new FormData();
        formData.append('baseAddress', baseAddress);
        if (detailAddress) formData.append('detailAddress', detailAddress);
        if (phone) formData.append('phoneNumber', phone);
        if (intro) formData.append('briefInfo', intro);
        if (operatingHours) formData.append('operatingHours', operatingHours);
        if (website) formData.append('websiteUrl', website);
        if (instagram) formData.append('instagramUrl', instagram);
        if (blog) formData.append('blogUrl', blog);

        selectedAgeIds.forEach(id => formData.append('ageIds', String(id)));
        selectedSubjectIds.forEach(id => formData.append('subjects', String(id)));

        // 새 이미지 파일 추가
        newImageFiles.forEach(file => formData.append('imageFiles', file));

        // 삭제할 이미지 URL 추가
        deletedImageUrls.forEach(url => formData.append('deletedImageUrls', url));

        await updateAcademyProfile(academyId, formData);
      } else {
        // 이미지 변경이 없는 경우 JSON 사용
        await updateAcademyProfile(academyId, {
          baseAddress,
          detailAddress,
          phoneNumber: phone,
          briefInfo: intro,
          operatingHours,
          websiteUrl: website,
          instagramUrl: instagram,
          blogUrl: blog,
          ageIds: selectedAgeIds,
          subjects: selectedSubjectIds,
        });
      }

      toast.info('수정이 완료되었습니다. 다시 승인 절차가 진행됩니다.');
      router.push(`/${academyId}/dashboard`);
    } catch (err) {
      toast.error('수정 중 오류가 발생했습니다.');
    }
  };


  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <header className={styles.header}>
          <button type="button" onClick={() => router.back()} className={styles.backBtn}>
            &lt; 이전
          </button>
          <h1>학원 정보 수정</h1>
        </header>

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

        <TextInput
          label="학원 소개글(선택)"
          value={intro}
          onChange={setIntro}
        />
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
        <TextInput
          label="인스타그램"
          value={instagram}
          onChange={setInstagram}
        />
        <TextInput label="네이버 블로그" value={blog} onChange={setBlog} />

        {/* 기존 이미지 표시 */}
        {existingImageUrls.length > 0 && (
          <div className={styles.imageSection}>
            <label className={styles.imageLabel}>현재 학원 이미지</label>
            <div className={styles.existingImageGrid}>
              {existingImageUrls.map((url, index) => (
                <div key={index} className={styles.existingImageItem}>
                  <img src={url} alt={`학원 이미지 ${index + 1}`} className={styles.existingImage} />
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleRemoveExistingImage(url)}
                    aria-label="이미지 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 새 이미지 업로드 */}
        <div className={styles.uploadSection}>
          <MultiFileInput
            label="새 학원 이미지 추가"
            description="사진 또는 캡처화면 제출 (png, jpg, pdf)"
            files={newImageFiles}
            onChange={setNewImageFiles}
            multiple={true}
          />
        </div>

        <Button onClick={handleUpdate}>수정하기</Button>
      </form>
    </div>
  );
}