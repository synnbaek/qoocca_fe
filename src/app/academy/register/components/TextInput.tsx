import Input from '../../../../components/common/Input';

type Props = {
  label?: string;          // optional
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;   // 추가
};

export default function TextInput({
  label = '',
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <Input
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
