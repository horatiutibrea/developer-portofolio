import { Box, CircularProgress } from '@mui/material';

export const FallbackLoader = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 'calc(50% - 20px)',
        left: 'calc(50% - 20px)',
      }}>
      <CircularProgress disableShrink />
    </Box>
  );
};
