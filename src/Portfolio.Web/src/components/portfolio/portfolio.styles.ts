import { SxProps, Theme } from '@mui/material';

export const liftCardSx: SxProps<Theme> = {
  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
  '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main', boxShadow: '0 18px 40px rgba(15,23,42,.1)' },
};
