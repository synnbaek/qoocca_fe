import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";

export type SelectOption = {
    label: string;
    value: string | number;
};

type Props = {
    label?: string;
    options: SelectOption[];
    value: string | number | undefined | null;
    onChange: (value: any) => void;
    placeholder?: string;
    className?: string;
};

export default function Select({ label, options, value, onChange, placeholder = "선택", className }: Props) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

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
        <div className={`${styles.wrapper} ${className || ''}`} ref={wrapperRef}>
            {label && <label className={styles.label}>{label}</label>}

            <div
                className={styles.selectBox}
                onClick={() => setOpen(prev => !prev)}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
            </div>

            {open && (
                <div className={styles.dropdown}>
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            className={`${styles.option} ${opt.value === value ? styles.selected : ""}`}
                            onClick={(e) => {
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