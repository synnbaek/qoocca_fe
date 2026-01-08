// MultiSelect.tsx
import { useState } from "react";
import styles from "../form/form.module.css";

type Props = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
};

export default function MultiSelect({ label, options, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={styles.multiSelectWrapper}>
      <label className={styles.multiSelectLabel}>{label}</label>

      {/* 선택 박스 */}
      <div
        className={styles.multiSelectBox}
        onClick={() => setOpen(!open)}
      >
        {selected.length > 0 ? selected.join(", ") : "선택"}
        <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
      </div>

      {/* 옵션 리스트 */}
      {open && (
        <div className={styles.multiSelectOptionsDropdown}>
          {options.map((opt) => (
            <div
              key={opt}
              className={`${styles.multiSelectOption} ${
                selected.includes(opt) ? styles.selected : ""
              }`}
              onClick={() => toggleOption(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
