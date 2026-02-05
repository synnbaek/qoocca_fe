'use client';

import { AcademyInfo } from '@/types/dashboard';
import styles from './AcademySelectionModal.module.css';
import Button from '../common/Button';

interface AcademySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    academies: AcademyInfo[];
    onSelect: (academyId: number) => void;
}

export default function AcademySelectionModal({
    isOpen,
    onClose,
    academies,
    onSelect,
}: AcademySelectionModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>학원을 선택해주세요</h3>
                <p className={styles.description}>
                    계정에 등록된 학원이 여러 개 있습니다. <br />
                    이동하실 학원을 선택해주세요.
                </p>

                <div className={styles.academyList}>
                    {academies.map((academy) => (
                        <button
                            key={academy.academyId ?? academy.id}
                            className={styles.academyItem}
                            onClick={() => onSelect((academy.academyId ?? academy.id)!)}
                        >
                            <div className={styles.academyName}>{academy.name}</div>
                            <div className={styles.academyStatus}>
                                {academy.approvalStatus === 'APPROVED' ? (
                                    <span className={styles.statusApproved}>승인됨</span>
                                ) : academy.approvalStatus === 'PENDING' ? (
                                    <span className={styles.statusPending}>대기중</span>
                                ) : (
                                    <span className={styles.statusRejected}>거절됨</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Button variant="gray" onClick={onClose} className={styles.closeButton}>
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    );
}