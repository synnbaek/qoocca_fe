'use client';

import { useState, useEffect } from 'react';
import styles from './cardModal.module.css';

interface CardRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (cardInfo: {
        cardNumber: string;
        expiry: string;
        cvc: string;
    }) => void;
    initialCardData?: {
        cardNumber?: string;
        expiry?: string;
        cvc?: string;
    };
}

export default function CardRegistrationModal({
    isOpen,
    onClose,
    onRegister,
    initialCardData,
}: CardRegistrationModalProps) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvc, setCvc] = useState('');

    // Update state when initialCardData changes
    useEffect(() => {
        if (isOpen && initialCardData) {
            setCardNumber(initialCardData.cardNumber || '');

            if (initialCardData.expiry) {
                const [month, year] = initialCardData.expiry.split('/');
                setExpiryMonth(month || '');
                setExpiryYear(year || '');
            } else {
                setExpiryMonth('');
                setExpiryYear('');
            }

            setCvc(initialCardData.cvc || '');
        } else if (isOpen && !initialCardData) {
            // Reset to empty when opening without initial data
            setCardNumber('');
            setExpiryMonth('');
            setExpiryYear('');
            setCvc('');
        }
    }, [isOpen, initialCardData]);

    if (!isOpen) return null;

    const handleRegister = () => {
        if (
            cardNumber.length !== 16 ||
            expiryMonth.length !== 2 ||
            expiryYear.length !== 2 ||
            cvc.length !== 3
        ) {
            alert('카드 정보를 올바르게 입력해주세요.');
            return;
        }

        const expiry = `${expiryMonth}/${expiryYear}`;

        onRegister({ cardNumber, expiry, cvc });
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>카드 등록</h3>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>카드번호</label>
                    <input
                        className={styles.cardInput}
                        value={cardNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length <= 16) setCardNumber(val);
                        }}
                        placeholder="카드번호 16자리를 입력해주세요"
                        maxLength={16}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>유효기간</label>
                    <div className={styles.cardNumberInputs}>
                        <input
                            className={styles.cardInput}
                            value={expiryMonth}
                            onChange={(e) => {
                                if (e.target.value.length <= 2 && /^\d*$/.test(e.target.value))
                                    setExpiryMonth(e.target.value);
                            }}
                            placeholder="MM"
                            maxLength={2}
                        />
                        <input
                            className={styles.cardInput}
                            value={expiryYear}
                            onChange={(e) => {
                                if (e.target.value.length <= 2 && /^\d*$/.test(e.target.value))
                                    setExpiryYear(e.target.value);
                            }}
                            placeholder="YY"
                            maxLength={2}
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>CVC</label>
                    <input
                        className={styles.cardInput}
                        value={cvc}
                        onChange={(e) => {
                            if (e.target.value.length <= 3 && /^\d*$/.test(e.target.value))
                                setCvc(e.target.value);
                        }}
                        placeholder="000"
                        maxLength={3}
                        type="password"
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
                        취소
                    </button>
                    <button className={`${styles.button} ${styles.submitButton}`} onClick={handleRegister}>
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
}
