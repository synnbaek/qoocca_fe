'use client';

import { memo } from 'react';

interface AuthInputProps {
  placeholder: string;
  type?: string;
  value: string; // 부모로부터 값을 직접 받음
  onChange: (value: string) => void; // 실시간 변경 함수
  required?: boolean;
  disabled?: boolean;
}

const AuthInput = memo(function AuthInput({
  placeholder,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
}: AuthInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className="auth-input-style"
    />
  );
});

export default AuthInput;
