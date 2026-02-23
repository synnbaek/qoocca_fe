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
    getImageUploadStatus,
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
    const [uploadStatus, setUploadStatus] = useState<'IDLE' | 'UPLOADING' | 'COMPLETED' | 'FAILED'>('IDLE');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    const pollUploadStatus = async (jobId: string) => {
        try {
            const statusData = await getImageUploadStatus(academyId, jobId);
            
            if (statusData.status === 'COMPLETED') {
                setUploadStatus('COMPLETED');
                toast.success('이미지 업로드 완료');
                // 이미지 목록 갱신
                const data = await getAcademyInfo(academyId);
                setExistingImages(data.images ?? []);
                setNewImageFiles([]); // 업로드 완료 후 파일 목록 비우기
            } else if (statusData.status === 'FAILED') {
                setUploadStatus('FAILED');
                setErrorMessage(statusData.errorMessage || '이미지 처리 중 오류가 발생했습니다.');
                toast.error('이미지 업로드 실패');
            } else {
                // QUEUED or PROCESSING: 1.5초 후 다시 확인
                setTimeout(() => pollUploadStatus(jobId), 1500);
            }
        } catch (e) {
            console.error('Polling failed', e);
            // 통신 에러 시 잠시 후 재시도
            setTimeout(() => pollUploadStatus(jobId), 3000);
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
                setUploadStatus('UPLOADING');
                setErrorMessage(null);
                try {
                    const jobResponse = await uploadAcademyImages(academyId, newImageFiles);
                    pollUploadStatus(jobResponse.jobId);
                    toast.info('이미지 업로드를 시작합니다.');
                } catch (e: any) {
                    setUploadStatus('FAILED');
                    if (e?.response?.status === 503 && e?.response?.data?.code === 'AC010') {
                        setErrorMessage('업로드 요청이 많습니다. 잠시 후 다시 시도해주세요.');
                        toast.error('업로드 요청이 많습니다. 잠시 후 다시 시도해주세요.');
                    } else {
                        toast.error(e?.response?.data?.message ?? '이미지 업로드 요청 실패');
                    }
                    return; // 이미지 업로드 실패 시 중단하거나 알림
                }
            } else {
                toast.success('수정 완료');
                router.push(`/${academyId}/dashboard`);
            }
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

                {uploadStatus !== 'IDLE' && (
                    <div className={styles.uploadStatusInfo}>
                        {uploadStatus === 'UPLOADING' && (
                            <p className={styles.uploadLoading}>이미지 업로드 처리 중...</p>
                        )}
                        {uploadStatus === 'COMPLETED' && (
                            <p className={styles.uploadSuccess}>이미지 업로드 완료!</p>
                        )}
                        {uploadStatus === 'FAILED' && (
                            <div className={styles.uploadFailedContainer}>
                                <p className={styles.uploadFailed}>{errorMessage || '이미지 업로드 실패'}</p>
                                <button 
                                    type="button" 
                                    className={styles.retryBtn}
                                    onClick={() => handleUpdate()}
                                >
                                    다시 시도
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.buttonWrapper}>
                    <Button 
                        onClick={handleUpdate} 
                        type="button"
                        disabled={uploadStatus === 'UPLOADING'}
                    >
                        {uploadStatus === 'UPLOADING' ? '업로드 중...' : '수정하기'}
                    </Button>
                </div>
                <div className="sr-only" aria-live="polite">
                    {/* 스크린 리더용 상태 알림 */}
                </div>
            </form>
        </div>
    );
}
