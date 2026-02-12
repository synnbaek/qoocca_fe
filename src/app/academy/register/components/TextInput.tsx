import Input from '../../../../components/common/Input';

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;   // 추가
  readOnly?: boolean;
  disabled?: boolean;
  type?: string;
  autoComplete?: string;
  id?: string;
};

export default function TextInput({
  label = '',
  value,
  onChange,
  placeholder,
  readOnly,
  disabled,
  type = 'text',
  autoComplete = 'off',
  id,
}: Props) {
  return (
    <Input
      id={id}
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      disabled={disabled}
      type={type}
      autoComplete={autoComplete}
    />
  );
}