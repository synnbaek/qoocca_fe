import Input from '../../../../components/common/Input';

type Props = {
  label?: string;          // optional
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;   // 추가
  readOnly?: boolean;
  disabled?: boolean;
};

export default function TextInput({
  label = '',
  value,
  onChange,
  placeholder,
  readOnly,
  disabled,
}: Props) {
  return (
    <Input
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      disabled={disabled}
    />
  );
}
