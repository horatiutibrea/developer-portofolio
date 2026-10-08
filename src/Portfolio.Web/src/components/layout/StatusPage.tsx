import { Button, Paper, Stack, Typography } from '@mui/material';
import { PathEnum } from '@types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const StatusPage = ({ status }: { status: 403 | 404 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const titleKey = status === 403 ? 'status.403.title' : 'status.404.title';
  const descriptionKey = status === 403 ? 'status.403.description' : 'status.404.description';
  return (
    <Paper sx={{ maxWidth: 640, mx: 'auto', mt: 8, p: 5, textAlign: 'center' }}>
      <Stack spacing={2}>
        <Typography variant="h2">{status}</Typography>
        <Typography variant="h5">{t(titleKey)}</Typography>
        <Typography color="text.secondary">{t(descriptionKey)}</Typography>
        <Button onClick={() => navigate(PathEnum.Home)}>{t('status.backHome')}</Button>
      </Stack>
    </Paper>
  );
};
