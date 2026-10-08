import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export const LoadingBar = () => {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const start = () => setPending((value) => value + 1);
    const end = () => setPending((value) => Math.max(0, value - 1));
    window.addEventListener('portfolio:api-start', start);
    window.addEventListener('portfolio:api-end', end);
    return () => {
      window.removeEventListener('portfolio:api-start', start);
      window.removeEventListener('portfolio:api-end', end);
    };
  }, []);

  if (pending === 0) return null;

  return (
    <LinearProgress sx={{ position: 'fixed', inset: '0 0 auto', zIndex: 2000 }} />
  );
};
