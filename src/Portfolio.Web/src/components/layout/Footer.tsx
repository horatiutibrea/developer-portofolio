import { Box, Button, Divider, Icon, IconButton, Stack, Typography } from '@mui/material';
import { PathEnum } from '@types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const footerLinks = [
  { path: PathEnum.About, key: 'navigation.about', icon: 'person' },
  { path: PathEnum.Experience, key: 'navigation.experience', icon: 'work' },
  { path: PathEnum.Projects, key: 'navigation.projects', icon: 'terminal' },
  { path: PathEnum.Contact, key: 'navigation.contact', icon: 'mail' },
] as const;

export const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box component="footer" sx={{ px: { xs: 2.5, sm: 4, lg: 6 }, pb: 4, maxWidth: 1480, width: '100%', minWidth: 0, mx: 'auto', overflowX: 'clip' }}>
      <Divider />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ py: 3, alignItems: { xs: 'flex-start', md: 'center' } }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800 }}>Horațiu Țibrea</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('footer.role')}
          </Typography>
        </Box>
        <Stack component="nav" direction="row" useFlexGap aria-label={t('footer.navigation')} sx={{ flexWrap: 'wrap' }}>
          {footerLinks.map((link) => (
            <Button
              key={link.path}
              color="inherit"
              size="small"
              startIcon={<Icon sx={{ fontSize: '1rem !important' }}>{link.icon}</Icon>}
              onClick={() => navigate(link.path)}
            >
              {t(link.key)}
            </Button>
          ))}
        </Stack>
        <IconButton aria-label={t('footer.admin')} onClick={() => navigate(PathEnum.Admin)} size="small">
          <Icon fontSize="small">lock</Icon>
        </IconButton>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} Horațiu Țibrea. {t('footer.rights')}
      </Typography>
    </Box>
  );
};
