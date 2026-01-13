import Input from '../../../../components/common/Input';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function TextInput({ label, value, onChange }: Props) {
  return (
    <Input
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
