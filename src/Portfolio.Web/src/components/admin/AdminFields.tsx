import { Checkbox, FormControlLabel, TextField } from '@mui/material';

type TextProps = {
  label: string,
  value: string | number,
  onChange: (value: string) => void,
  type?: string,
  required?: boolean,
  multiline?: boolean,
  shrink?: boolean,
};

export const AdminTextField = ({
  label, value, onChange, type, required, multiline, shrink,
}: TextProps) => (
  <TextField
    label={label}
    value={value}
    type={type}
    required={required}
    multiline={multiline}
    minRows={multiline ? 3 : undefined}
    onChange={(event) => onChange(event.target.value)}
    slotProps={shrink ? { inputLabel: { shrink: true } } : undefined}
  />
);

type CheckProps = {
  label: string,
  checked: boolean,
  onChange: (checked: boolean) => void,
};

export const AdminCheck = ({ label, checked, onChange }: CheckProps) => (
  <FormControlLabel
    label={label}
    control={<Checkbox checked={checked} onChange={(event) => onChange(event.target.checked)} />}
  />
);
