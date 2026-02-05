import { useState, useRef, useEffect } from "react";
import styles from "../form/form.module.css";
import inputStyles from '../../../../components/common/Input.module.css';

type Props = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
};

export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  // 바깥 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.multiSelectWrapper} ref={wrapperRef}>
      <label className={styles.multiSelectLabel}>{label}</label>

      <div className={styles.relativeWrapper}>
        <div
          className={`${inputStyles.input} ${styles.multiSelectBox}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={styles.placeholder}>
            {selected.length > 0 ? `${selected.length}개 선택됨` : '선택하세요'}
          </span>
          <span className={styles.arrow}>{open ? '▲' : '▼'}</span>
        </div>

        {open && (
          <div className={styles.multiSelectOptionsDropdown}>
            {options
              .filter((opt) => !selected.includes(opt))
              .map((opt) => (
              <div
                key={opt}
                className={`${styles.multiSelectOption} ${
                  selected.includes(opt) ? styles.selected : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(opt);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className={styles.selectedTagsContainer}>
          {selected.map((val) => (
            <div key={val} className={styles.tag}>
              <span className={styles.tagName}>{val}</span>
              <button
                type="button"
                className={styles.removeTagBtn}
                onClick={() => removeOption(val)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}