import { useState, useRef, useEffect, memo } from "react";
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

function Select({ label, options, value, onChange, placeholder = "선택", className }: Props) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const labelId = useRef(`select-label-${Math.random().toString(36).substr(2, 9)}`).current;

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    return (
        <div className={`${styles.wrapper} ${className || ''}`} ref={wrapperRef}>
            {label && <label id={labelId} className={styles.label}>{label}</label>}

            <div
                className={styles.selectBox}
                onClick={() => setOpen(prev => !prev)}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls="select-dropdown"
                aria-labelledby={label ? labelId : undefined}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen(prev => !prev);
                    }
                }}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span className={styles.arrow} aria-hidden="true">{open ? "▲" : "▼"}</span>
            </div>

            {open && (
                <div 
                    id="select-dropdown" 
                    className={styles.dropdown} 
                    role="listbox" 
                    aria-label={label || placeholder}
                >
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            className={`${styles.option} ${opt.value === value ? styles.selected : ""}`}
                            role="option"
                            aria-selected={opt.value === value}
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

export default memo(Select);
