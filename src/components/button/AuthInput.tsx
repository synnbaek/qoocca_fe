'use client';

interface AuthInputProps {
  placeholder: string;
  type?: string;
  value: string; // 부모로부터 값을 직접 받음
  onChange: (value: string) => void; // 실시간 변경 함수
  required?: boolean;
  disabled?: boolean;
}

export default function AuthInput({
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
      value={value} // 부모의 state를 그대로 보여줌
      onChange={(e) => onChange(e.target.value)} // 입력할 때마다 부모 state 업데이트
      required={required}
      disabled={disabled}
      className="auth-input-style" // 필요시 클래스 추가
    />
  );
}
