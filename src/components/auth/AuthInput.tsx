'use client';

import { memo } from 'react';
import styles from './AuthInput.module.css';

interface AuthInputProps {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const AuthInput = memo(function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  required,
}: AuthInputProps) {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
});

export default AuthInput;
