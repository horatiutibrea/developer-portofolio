import { Box, Button, Icon, Paper, Stack, Typography } from '@mui/material';
import { useUser } from '@hooks';
import { AppDispatch, clearUser, logoutUser } from '@store';
import { PathEnum, UserRoleEnum } from '@types';
import { checkRole } from '@utils';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AdminPage } from '../portfolio/Admin.page';

const links = [
  { path: PathEnum.AdminExperience, icon: 'work', label: 'contentAdmin.experience' },
  { path: PathEnum.AdminProjects, icon: 'terminal', label: 'contentAdmin.projects' },
  { path: PathEnum.AdminTechnologies, icon: 'memory', label: 'contentAdmin.technologies' },
  { path: PathEnum.AdminUsers, icon: 'manage_accounts', label: 'contentAdmin.users' },
] as const;

export const AdminLayout = () => {
  const { t } = useTranslation();
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const canAccess = checkRole(user, [UserRoleEnum.Superadmin]);

  if (!user || !canAccess) return <AdminPage />;

  const logout = () => {
    dispatch(logoutUser());
    dispatch(clearUser());
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px minmax(0, 1fr)' }, gap: 3, alignItems: 'start' }}>
      <Paper component="nav" aria-label={t('contentAdmin.menu')} sx={{ p: 1.5, position: { md: 'sticky' }, top: { md: 132 } }}>
        <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, fontWeight: 800 }}>
          {t('contentAdmin.menu')}
        </Typography>
        <Stack spacing={0.5} sx={{ mt: 1 }}>
          {links.map((link) => {
            const selected = location.pathname === link.path;
            return (
              <Button
                key={link.path}
                color={selected ? 'primary' : 'inherit'}
                variant={selected ? 'contained' : 'text'}
                startIcon={<Icon>{link.icon}</Icon>}
                onClick={() => navigate(link.path)}
                sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
              >
                {t(link.label)}
              </Button>
            );
          })}
        </Stack>
        <Stack spacing={0.5} sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button color="inherit" startIcon={<Icon>public</Icon>} onClick={() => navigate(PathEnum.Home)} sx={{ justifyContent: 'flex-start' }}>
            {t('contentAdmin.viewSite')}
          </Button>
          <Button color="inherit" startIcon={<Icon>logout</Icon>} onClick={logout} sx={{ justifyContent: 'flex-start' }}>
            {t('general.logout')}
          </Button>
        </Stack>
      </Paper>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};
