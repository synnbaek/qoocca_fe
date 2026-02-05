'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import styles from '../form.module.css';
import { uploadStudentExcel } from '@/api/studentApi';
import CustomModal from '@/components/common/CustomModal';
import RegistrationCompleteModal from './RegistrationCompleteModal';

interface Props {
    academyId: number;
}

export default function ExcelRegistrationForm({ academyId }: Props) {
    const router = useRouter();
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false); // 드래그 상태 추가

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setExcelFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension === 'xlsx' || extension === 'xls') {
                setExcelFile(file);
            } else {
                alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            }
        }
    };

    const handlePreCheck = () => {
        if (!excelFile) return;
        setIsConfirmModalOpen(true);
    };

    const handleExcelRegister = async () => {
        setIsConfirmModalOpen(false);
        if (!excelFile) return;

        setIsLoading(true);
        try {
            const response = await uploadStudentExcel(academyId, excelFile);
            console.log('Upload result:', response);
            
            // 성공 모달 열기
            setIsCompleteModalOpen(true);
        } catch (error) {
            console.error('Excel upload failed:', error);
            alert('일괄 등록 중 오류가 발생했습니다. 파일을 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = () => {
        setIsCompleteModalOpen(false);
        router.push(`/academy/${academyId}/student`);
    };

    return (
        <div className={styles.excelContainer}>
            {!excelFile ? (
                <label 
                    className={`${styles.uploadBox} ${isDragging ? styles.dragging : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className={styles.hiddenInput}
                    />
                    <div className={styles.uploadIcon}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                    </div>
                    <span className={styles.uploadText}>클릭하여 엑셀 파일 업로드</span>
                    <span className={styles.uploadSubText}>또는 파일을 여기로 드래그하세요</span>
                </label>
            ) : (
                <div className={styles.fileInfo}>
                    <div className={styles.fileIcon}>📊</div>
                    <div className={styles.fileName}>{excelFile.name}</div>
                    <div className={styles.removeFile} onClick={() => setExcelFile(null)}>삭제</div>
                </div>
            )}

            <div className={`${styles.sectionBox} ${styles.buttonGroupFull}`}>
                <Button
                    onClick={handlePreCheck}
                    disabled={!excelFile || isLoading}
                    className={styles.flex1}
                >
                    {isLoading ? '등록 중...' : '일괄 등록하기'}
                </Button>
            </div>

            <CustomModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="일괄 등록 확인"
                description={`${excelFile?.name || ''} 파일을 업로드하시겠습니까?`}
                actionText="등록하기"
                onAction={handleExcelRegister}
                cancelText="취소"
            />

            <RegistrationCompleteModal
                isOpen={isCompleteModalOpen}
                onConfirm={handleComplete}
            />
        </div>
    );
}