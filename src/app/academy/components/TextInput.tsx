import styles from "../form/form.module.css";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function TextInput({ label, value, onChange }: Props) {
  return (
    <div className={styles.textInputWrapper}>
      <label className={styles.textInputLabel}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.textInputField}
      />
    </div>
  );
}
