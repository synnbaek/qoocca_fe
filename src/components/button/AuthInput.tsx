'use client';

import { useState } from 'react';

interface AuthInputProps {
  placeholder: string;
  type?: string;
  onBlur: (value: string) => void;
  required?: boolean;
}

export default function AuthInput({
  placeholder,
  type = 'text',
  onBlur,
  required = false,
}: AuthInputProps) {
  const [value, setValue] = useState('');

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onBlur(value)}
      required={required}
    />
  );
}
