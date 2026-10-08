import { Box, Button, Icon, Paper, Stack, Typography } from '@mui/material';
import { GoogleLoginWrapper } from '../auth';
import { useUser } from '@hooks';
import { AppDispatch, clearUser, logoutUser } from '@store';
import { PathEnum, UserRoleEnum } from '@types';
import { checkRole } from '@utils';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PageContainer, PageTransition } from './PortfolioCommon';
import { usePageMetadata } from './usePageMetadata';

const adminRoles = [UserRoleEnum.Superadmin, UserRoleEnum.Admin];

export const AdminPage = () => {
  const { t } = useTranslation();
  const user = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  usePageMetadata(t('admin.title'), t('admin.description'));
  const canAccess = checkRole(user, adminRoles);

  const logout = () => {
    dispatch(logoutUser());
    dispatch(clearUser());
  };

  return (
    <PageTransition>
      <PageContainer>
        <Box sx={{ minHeight: '62vh', display: 'grid', placeItems: 'center', py: 8 }}>
          <Paper sx={{ width: '100%', maxWidth: 520, p: { xs: 3, md: 5 }, textAlign: 'center' }}>
            <Stack spacing={3} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 58, height: 58, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', color: 'primary.main' }}>
                <Icon sx={{ fontSize: 30 }}>admin_panel_settings</Icon>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {t('admin.title')}
                </Typography>
                <Typography color="text.secondary">{user ? t('admin.signedIn', { email: user.email }) : t('admin.description')}</Typography>
              </Box>
              {!user && <GoogleLoginWrapper />}
              {user && canAccess && (
                <Button variant="contained" onClick={() => navigate(PathEnum.Users)}>
                  {t('admin.open')}
                </Button>
              )}
              {user && !canAccess && <Typography color="error">{t('home.noAccess')}</Typography>}
              {user && (
                <Button color="inherit" startIcon={<Icon>logout</Icon>} onClick={logout}>
                  {t('general.logout')}
                </Button>
              )}
            </Stack>
          </Paper>
        </Box>
      </PageContainer>
    </PageTransition>
  );
};
