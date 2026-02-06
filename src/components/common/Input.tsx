import { useId } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, onClick, ...props }: InputProps) {
  const generatedId = useId();
  const id = props.id || generatedId;

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (onClick) {
      onClick(e);
    }

    // time, date 등 picker가 있는 타입의 경우 클릭 시 picker 표시
    // showPicker는 최신 브라우저 API이므로 타입 체크 필요
    const target = e.target as HTMLInputElement;
    if (
      target.type === 'time' ||
      target.type === 'date' ||
      target.type === 'datetime-local'
    ) {
      try {
        if ('showPicker' in target && typeof target.showPicker === 'function') {
          target.showPicker();
        }
      } catch (err) {
      }
    }
  };

  return (
    <div className={styles.inputWrapper}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input
        id={id}
        className={`${styles.input} ${error ? styles.errorInput : ''}`}
        onClick={handleClick}
        {...props}
        autoComplete="off"
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}