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
    value: string | number | undefined;
    onChange: (value: any) => void;
    placeholder?: string;
};

export default function SingleSelect({ label, options, value, onChange, placeholder = "선택" }: Props) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

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

    return (
        <div className={styles.multiSelectWrapper} ref={wrapperRef}>
            <label className={styles.multiSelectLabel}>{label}</label>

            {/* 선택 박스 (전역 Input 스타일 재사용) */}
            <div
                className={`${inputStyles.input} ${styles.multiSelectBox}`}
                onClick={() => setOpen(prev => !prev)}
            >
                {selectedOption ? selectedOption.label : placeholder}
                <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
            </div>

            {/* 옵션 리스트 */}
            {open && (
                <div className={styles.multiSelectOptionsDropdown}>
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            className={`${styles.multiSelectOption} ${opt.value === value ? styles.selected : ""
                                }`}
                            onClick={e => {
                                e.stopPropagation();
                                onChange(opt.value);
                                setOpen(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}