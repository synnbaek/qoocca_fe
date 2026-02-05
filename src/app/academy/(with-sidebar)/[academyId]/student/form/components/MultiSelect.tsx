import { useState, useRef, useEffect } from "react";
import styles from "../form.module.css";
import inputStyles from '@/components/common/Input.module.css';

type Option = {
    label: string;
    value: string | number;
};

type Props = {
    label: string;
    options: Option[];
    values: (string | number)[];
    onChange: (values: any[]) => void;
    placeholder?: string;
};

export default function MultiSelect({ label, options, values, onChange, placeholder = "선택" }: Props) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOptions = options.filter(opt => 
        values.some(v => String(v) === String(opt.value))
    );

    // 바깥 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value: string | number) => {
        const isSelected = values.some(v => String(v) === String(value));
        if (isSelected) {
            onChange(values.filter(v => String(v) !== String(value)));
        } else {
            onChange([...values, value]);
        }
    };

    return (
        <div className={styles.multiSelectWrapper} ref={wrapperRef}>
            <label className={styles.multiSelectLabel}>{label}</label>

            <div
                className={`${inputStyles.input} ${styles.multiSelectBox}`}
                onClick={() => setOpen(prev => !prev)}
                style={{ height: 'auto', minHeight: 'var(--input-height)', flexWrap: 'wrap', gap: '8px', padding: '10px 16px' }}
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map(opt => (
                            <div 
                                key={opt.value} 
                                className={styles.tag}
                            >
                                <span>{opt.label}</span>
                                <span 
                                    className={styles.removeTagIcon}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleOption(opt.value);
                                    }}
                                >
                                    ×
                                </span>
                            </div>
                        ))
                    ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>{placeholder}</span>
                    )}
                </div>
                <span className={styles.arrow}>
                    {selectedOptions.length > 1 && !open && (
                        <span style={{ fontSize: '12px', marginRight: '8px', color: 'var(--primary-color)' }}>
                            +{selectedOptions.length - 1}
                        </span>
                    )}
                    {open ? "▲" : "▼"}
                </span>
            </div>

            {open && (
                <div className={styles.multiSelectOptionsDropdown}>
                    {options.map(opt => {
                        const isSelected = values.some(v => String(v) === String(opt.value));
                        return (
                            <div
                                key={opt.value}
                                className={`${styles.multiSelectOption} ${isSelected ? styles.selected : ""}`}
                                onClick={e => {
                                    e.stopPropagation();
                                    toggleOption(opt.value);
                                }}
                            >
                                {opt.label}
                                {isSelected && <span>✓</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}