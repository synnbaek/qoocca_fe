'use client';

import Button from './Button';
import styles from './CustomModal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  actionText: string;
  onAction: () => void;
  cancelText?: string;
  children?: React.ReactNode;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  actionText,
  onAction,
  cancelText = '다음에',
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.mainText} style={{marginBottom: description ? '8px' : '24px'}}>{title}</h3>

        <div className={styles.body} style={{marginTop: '20px', marginBottom: '32px', marginLeft: '20px', marginRight: '20px'}}>
          {description && <p className={styles.subText}>{description}</p>}
          {children}
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
