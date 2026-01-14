import { useState, useRef, useEffect } from 'react';
import styles from '../form/form.module.css';
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

      {/* 선택 박스 (전역 Input 스타일 재사용) */}
      <div
        className={`${inputStyles.input} ${styles.multiSelectBox}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {selected.length > 0 ? selected.join(', ') : '선택'}
        <span className={styles.arrow}>{open ? '▲' : '▼'}</span>
      </div>

      {/* 옵션 리스트 */}
      {open && (
        <div className={styles.multiSelectOptionsDropdown}>
          {options.map((opt) => (
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
  );
}
