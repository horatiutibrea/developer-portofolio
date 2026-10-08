import { Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { usePageMetadata } from '../portfolio/usePageMetadata';

export const AdminHomePage = () => {
  const { t } = useTranslation();
  usePageMetadata(t('contentAdmin.menu'), t('contentAdmin.intro'));

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Stack spacing={1.5}>
        <Typography variant="h4">{t('contentAdmin.menu')}</Typography>
        <Typography color="text.secondary">{t('contentAdmin.intro')}</Typography>
      </Stack>
    </Paper>
  );
};
