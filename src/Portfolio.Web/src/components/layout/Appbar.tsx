import { useUser } from '@hooks';
import { Box, Button, Drawer, Icon, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { setThemeMode, useRootSelector } from '@store';
import { LanguageSwitcher } from '@components-utils';
import { PathEnum, UserRoleEnum } from '@types';
import { checkRole } from '@utils';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const publicLinks = [
  { path: PathEnum.Home, key: 'navigation.home', icon: 'home' },
  { path: PathEnum.About, key: 'navigation.about', icon: 'person' },
  { path: PathEnum.Experience, key: 'navigation.experience', icon: 'work' },
  { path: PathEnum.Projects, key: 'navigation.projects', icon: 'terminal' },
  { path: PathEnum.Contact, key: 'navigation.contact', icon: 'mail' },
] as const;

const adminRoles = [UserRoleEnum.Superadmin, UserRoleEnum.Admin];

export const AppBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useUser();
  const themeMode = useRootSelector((state) => state.app.theme.themeMode);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: PathEnum) => (path === PathEnum.Home ? location.pathname === path : location.pathname.startsWith(path));

  const goTo = (path: PathEnum) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        zIndex: 1200,
        top: { xs: 10, md: compact ? 12 : 18 },
        left: { xs: 8, md: 24 },
        width: { xs: 'calc(100% - 16px)', md: 'calc(100% - 48px)' },
        maxWidth: 1380,
        transition: 'top 180ms ease',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: { xs: 64, md: compact ? 64 : 72 },
          width: '100%',
          minWidth: 0,
          maxWidth: 1380,
          mx: 'auto',
          px: { xs: 1.25, sm: 2, md: 2.5 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(11,17,32,.82)' : 'rgba(255,255,255,.84)'),
          backdropFilter: 'blur(20px)',
          boxShadow: compact ? '0 14px 40px rgba(15,23,42,.12)' : '0 8px 30px rgba(15,23,42,.07)',
          transition: 'min-height 180ms ease, box-shadow 180ms ease',
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => goTo(PathEnum.Home)}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, border: 0, p: 0, bgcolor: 'transparent', color: 'text.primary', cursor: 'pointer' }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontFamily: 'monospace',
              fontWeight: 900,
            }}
          >
            &lt;/&gt;
          </Box>
          <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontWeight: 850, letterSpacing: '-.035em', lineHeight: 1 }}>Horațiu Țibrea</Typography>
            <Typography variant="caption" color="text.secondary">
              Software Engineer
            </Typography>
          </Box>
        </Box>

        <Stack component="nav" direction="row" spacing={0.25} aria-label={t('navigation.main')} sx={{ ml: 'auto', display: { xs: 'none', lg: 'flex' } }}>
          {publicLinks.map((link) => (
            <Button
              key={link.path}
              color="inherit"
              aria-current={isActive(link.path) ? 'page' : undefined}
              onClick={() => goTo(link.path)}
              startIcon={<Icon sx={{ fontSize: '1.1rem !important' }}>{link.icon}</Icon>}
              sx={{
                position: 'relative',
                color: isActive(link.path) ? 'primary.main' : 'text.secondary',
                fontWeight: isActive(link.path) ? 800 : 650,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 14,
                  right: 14,
                  bottom: 6,
                  height: 2,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  transform: isActive(link.path) ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 180ms ease',
                },
              }}
            >
              {t(link.key)}
            </Button>
          ))}
          {user && checkRole(user, adminRoles) && (
            <Button color="inherit" startIcon={<Icon>shield</Icon>} onClick={() => goTo(PathEnum.Users)}>
              {t('navigation.admin')}
            </Button>
          )}
        </Stack>

        <Stack direction="row" spacing={0.25} sx={{ ml: { xs: 'auto', lg: 1.5 }, alignItems: 'center' }}>
          <Tooltip title={themeMode === 'dark' ? t('general.lightTheme') : t('general.darkTheme')}>
            <IconButton
              aria-label={themeMode === 'dark' ? t('general.lightTheme') : t('general.darkTheme')}
              onClick={() => dispatch(setThemeMode(themeMode === 'dark' ? 'light' : 'dark'))}
            >
              <Icon sx={{ transition: 'transform 280ms ease', transform: themeMode === 'dark' ? 'rotate(-20deg)' : 'none' }}>
                {themeMode === 'dark' ? 'light_mode' : 'dark_mode'}
              </Icon>
            </IconButton>
          </Tooltip>
          <LanguageSwitcher />
          <IconButton aria-label={t('general.menu')} onClick={() => setDrawerOpen(true)} sx={{ display: { lg: 'none' } }}>
            <Icon>menu</Icon>
          </IconButton>
        </Stack>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 'min(88%, 360px)', p: 2.5, backgroundImage: 'none' } } }}
      >
        <Stack spacing={1}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">{t('general.menu')}</Typography>
            <IconButton aria-label={t('general.close')} onClick={() => setDrawerOpen(false)}>
              <Icon>close</Icon>
            </IconButton>
          </Stack>
          {publicLinks.map((link) => (
            <Button
              key={link.path}
              size="large"
              color={isActive(link.path) ? 'primary' : 'inherit'}
              startIcon={<Icon>{link.icon}</Icon>}
              onClick={() => goTo(link.path)}
              sx={{ justifyContent: 'flex-start', py: 1.25 }}
            >
              {t(link.key)}
            </Button>
          ))}
          {user && checkRole(user, adminRoles) && (
            <Button size="large" color="inherit" startIcon={<Icon>shield</Icon>} onClick={() => goTo(PathEnum.Users)} sx={{ justifyContent: 'flex-start' }}>
              {t('navigation.admin')}
            </Button>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
};
