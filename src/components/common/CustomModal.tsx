'use client';

import Button from './Button';
import styles from './CustomModal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  cancelText?: string;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  actionText,
  onAction,
  cancelText = '다음에',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>안내</h3>

        <div className={styles.body}>
          <p className={styles.mainText}>{title}</p>
          <p className={styles.subText}>{description}</p>
        </div>

        <div className={styles.footer}>
          <Button variant="gray" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="secondary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      </div>
    </div>
  );
}
