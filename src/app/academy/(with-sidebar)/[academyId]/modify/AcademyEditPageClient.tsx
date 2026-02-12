// src/app/academy/[academyId]/modify/AcademyEditPageClient.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TextInput from '@/app/academy/register/components/TextInput';
import MultiFileInput from '@/app/academy/register/components/MultiFileInput';
import Button from '@/components/common/Button';
import MultiSelect from '@/app/academy/register/components/MultiSelect';
import { toast } from 'sonner';
import {
    getAcademyInfo,
    updateAcademyProfile,
    uploadAcademyImages,
    deleteAcademyImage,
} from '@/api/dashboardApi';
import { useSubjects } from '@/hooks/useSubjects';
import { useAges } from '@/hooks/useAges';
import styles from './AcademyEditPage.module.css';
import { AcademyImage } from '@/types/dashboard';

interface Props {
    academyId: string;
}

export default function AcademyEditPageClient({ academyId }: Props) {
    const router = useRouter();
    const { subjectOptions } = useSubjects();
    const { ageOptions } = useAges();

    const [baseAddress, setBaseAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [ages, setAges] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [intro, setIntro] = useState('');
    const [operatingHours, setOperatingHours] = useState('');
    const [website, setWebsite] = useState('');
    const [instagram, setInstagram] = useState('');
    const [blog, setBlog] = useState('');

    // 이미지 상태
    const [existingImages, setExistingImages] = useState<AcademyImage[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAcademyInfo(academyId);
                setBaseAddress(data.baseAddress ?? '');
                setDetailAddress(data.detailAddress ?? '');
                setPhone(data.phoneNumber ?? '');
                setIntro(data.briefInfo ?? '');
                setOperatingHours(data.operatingHours ?? '');
                setWebsite(data.websiteUrl ?? '');
                setInstagram(data.instagramUrl ?? '');
                setBlog(data.blogUrl ?? '');
                setExistingImages(data.images ?? []);
                setAges(data.ages?.map(a => a.ageCode) ?? []);
                setSubjects(data.subjects?.map(s => s.detailSubject) ?? []);
            } catch (e) {
                console.error(e);
                toast.error('학원 정보 불러오기 실패');
            }
        };
        fetchData();
    }, [academyId, ageOptions, subjectOptions]);

    const handleRemoveExistingImage = async (imageId: number) => {
        try {
            await deleteAcademyImage(academyId, imageId);
            setExistingImages(prev => prev.filter(img => img.imageId !== imageId));
            toast.success('이미지 삭제 완료');
        } catch (e) {
            toast.error('이미지 삭제 실패');
        }
    };

    const handleUpdate = async () => {
        try {
            // 기본 정보 업데이트
            await updateAcademyProfile(academyId, {
                baseAddress,
                detailAddress,
                phoneNumber: phone,
                briefInfo: intro,
                operatingHours,
                websiteUrl: website,
                instagramUrl: instagram,
                blogUrl: blog,
                ageIds: ages.map(label => ageOptions.find(a => a.label === label)?.value).filter(Boolean),
                subjects: subjects.map(label => subjectOptions.find(s => s.label === label)?.value).filter(Boolean),
            });

            // 새 이미지 업로드
            if (newImageFiles.length > 0) {
                await uploadAcademyImages(academyId, newImageFiles);
                setNewImageFiles([]);
            }

            toast.success('수정 완료');
            router.push(`/${academyId}/dashboard`);
        } catch (e: any) {
            toast.error(e?.response?.data?.message ?? '수정 실패');
        }
    };

    const ageSelectLabels = useMemo(() => ageOptions.map(a => a.label), [ageOptions]);
    const subjectSelectLabels = useMemo(() => subjectOptions.map(s => s.label), [subjectOptions]);

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <h1 id="edit-title">학원 정보 수정</h1>

                <TextInput label="기본 주소" value={baseAddress} onChange={setBaseAddress} />
                <TextInput label="상세 주소" value={detailAddress} onChange={setDetailAddress} />
                <TextInput label="전화번호" value={phone} onChange={setPhone} />

                <MultiSelect label="학원생 나이" options={ageSelectLabels} selected={ages} onChange={setAges} />
                <MultiSelect label="과목" options={subjectSelectLabels} selected={subjects} onChange={setSubjects} />

                {existingImages.length > 0 && (
                    <div className={styles.existingImageGrid} role="group" aria-label="현재 등록된 이미지">
                        {existingImages.map((img, index) => (
                            <div key={img.imageId} className={styles.existingImageItem}>
                                <img 
                                    src={img.imageUrl} 
                                    alt={`학원 사진 ${index + 1}`} 
                                    className={styles.existingImage} 
                                />
                                <button
                                    type="button"
                                    className={styles.deleteBtn}
                                    onClick={() => handleRemoveExistingImage(img.imageId)}
                                    aria-label={`사진 ${index + 1} 삭제`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}


                <MultiFileInput label="이미지 추가" files={newImageFiles} onChange={setNewImageFiles} multiple />

                <div className={styles.buttonWrapper}>
                    <Button onClick={handleUpdate} type="button">수정하기</Button>
                </div>
                <div className="sr-only" aria-live="polite">
                    {/* 스크린 리더용 상태 알림 */}
                </div>
            </form>
        </div>
    );
}
