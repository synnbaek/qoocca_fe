'use client';

import styles from './deleteModal.module.css';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>학생삭제</h3>
                <p className={styles.description}>
                    삭제하면 모든 데이터가 사라지며 복구할 수 없습니다.
                    <br />
                    비활성화되면 목록에서 숨겨지고, 나중에 다시 활성화할 수 있습니다.
                </p>
                <div className={styles.buttonGroup}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        취소
                    </button>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
