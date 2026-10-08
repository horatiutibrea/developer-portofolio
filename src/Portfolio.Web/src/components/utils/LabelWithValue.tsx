import { Box, Typography } from '@mui/material';

type LabelWithValueProps = {
  label: string;
  value: string | number | null | undefined;
};

export const LabelWithValue = ({ label, value }: LabelWithValueProps) => {
  return (
    <Box>
      <Typography variant="body2" color="grey" sx={{
        display: 'inline',
      }}>{`${label}: `}</Typography>
      <Typography variant="body2" sx={{
        display: 'inline',
      }}>
        {value ?? '-'}
      </Typography>
    </Box>
  );
};
