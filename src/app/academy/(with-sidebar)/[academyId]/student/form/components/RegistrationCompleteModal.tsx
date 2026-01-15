'use client';

import styles from './completeModal.module.css';

interface RegistrationCompleteModalProps {
    isOpen: boolean;
    onConfirm: () => void;
}

export default function RegistrationCompleteModal({
    isOpen,
    onConfirm,
}: RegistrationCompleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>원생 등록 완료</h3>
                <p className={styles.description}>
                    카드 등록 및 보호자 정보는 원생 상세 화면에서
                    <br />
                    언제든지 수정할 수 있습니다.
                </p>
                <button className={styles.confirmButton} onClick={onConfirm}>
                    확인
                </button>
            </div>
        </div>
    );
}
