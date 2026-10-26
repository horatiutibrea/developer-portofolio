import { Box, Chip, CircularProgress, Icon, Paper, Stack, SxProps, Theme, Typography, useMediaQuery } from '@mui/material';
import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const PageContainer = ({ children }: { children: ReactNode }) => <Box sx={{ width: '100%', maxWidth: 1220, mx: 'auto' }}>{children}</Box>;

export const PageTransition = ({ children }: { children: ReactNode }) => (
  <Box sx={{ animation: 'page-in 420ms ease both', '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>{children}</Box>
);

export const SectionTitle = ({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) => (
  <Stack spacing={1.25} sx={{ maxWidth: 720, mx: align === 'center' ? 'auto' : 0, textAlign: align, mb: { xs: 4, md: 5 } }}>
    {eyebrow && (
      <Typography variant="overline" color="primary" sx={{ fontWeight: 850, letterSpacing: '.16em' }}>
        {eyebrow}
      </Typography>
    )}
    <Typography component="h2" variant="h3" sx={{ fontWeight: 850, letterSpacing: '-.05em', fontSize: { xs: '2rem', md: '2.8rem' } }}>
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.75 }}>
        {description}
      </Typography>
    )}
  </Stack>
);

export const Reveal = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(18px)',
        transition: `opacity 620ms ease ${delay}ms, transform 620ms ease ${delay}ms`,
        '@media (prefers-reduced-motion: reduce)': { opacity: 1, transform: 'none', transition: 'none' },
      }}
    >
      {children}
    </Box>
  );
};

export const TiltFrame = ({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  const coarsePointer = useMediaQuery('(pointer: coarse)');

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || coarsePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
  };

  return (
    <Box ref={ref} onMouseMove={onMove} onMouseLeave={reset} sx={{ transition: 'transform 180ms ease', transformStyle: 'preserve-3d' }}>
      <Box sx={sx}>{children}</Box>
    </Box>
  );
};

export const TechChip = ({ label, onClick, selected }: { label: string; onClick?: () => void; selected?: boolean }) => (
  <Chip
    label={label}
    size="small"
    clickable={Boolean(onClick)}
    color={selected ? 'primary' : 'default'}
    variant={selected ? 'filled' : 'outlined'}
    onClick={onClick}
    sx={{
      transition: 'transform 160ms ease, box-shadow 160ms ease',
      ...(onClick && { '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 18px rgba(79,70,229,.18)' } }),
    }}
  />
);

export const EmptyState = ({ title, description, action }: { title: string; description: string; action?: ReactNode }) => (
  <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderStyle: 'dashed' }}>
    <Icon color="primary" sx={{ fontSize: 38, mb: 1.5 }}>
      hourglass_empty
    </Icon>
    <Typography variant="h6" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Typography color="text.secondary">{description}</Typography>
    {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
  </Paper>
);

export const LoadingState = () => {
  const { t } = useTranslation();
  return (
    <Stack role="status" spacing={2} sx={{ alignItems: 'center', py: 8 }}>
      <CircularProgress />
      <Typography color="text.secondary">{t('states.loading')}</Typography>
    </Stack>
  );
};

export const ErrorState = ({ message }: { message: string }) => (
  <Paper role="alert" sx={{ p: 3, borderColor: 'error.main' }}>
    <Typography color="error.main">{message}</Typography>
  </Paper>
);
