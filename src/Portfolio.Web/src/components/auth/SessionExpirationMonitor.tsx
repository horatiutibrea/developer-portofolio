import { axiosInstance } from '@modules';
import { clearUser, useRootSelector } from '@store';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { PathEnum } from '@types';
import { useTranslation } from 'react-i18next';

const sessionCheckIntervalMs = 30_000;

export const SessionExpirationMonitor = () => {
  const user = useRootSelector((state) => state.app.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const handledRef = useRef(false);

  const expireSession = useCallback(() => {
    if (handledRef.current || !user) return;
    handledRef.current = true;
    dispatch(clearUser());
    navigate(PathEnum.Home, { replace: true });
    enqueueSnackbar(t('auth.sessionExpired'), { variant: 'warning', autoHideDuration: 8000 });
  }, [dispatch, enqueueSnackbar, navigate, t, user]);

  const checkSession = useCallback(async () => {
    if (!user || handledRef.current) return;
    try {
      await axiosInstance.get('/api/auth/session', {
        timeout: 15_000,
        apiNotifications: false,
      });
    } catch (error: any) {
      if (error?.response?.status === 401) expireSession();
    }
  }, [expireSession, user]);

  useEffect(() => {
    if (!user) {
      handledRef.current = false;
      return;
    }

    const onExpired = () => expireSession();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void checkSession();
    };
    window.addEventListener('portfolio:session-expired', onExpired);
    document.addEventListener('visibilitychange', onVisibilityChange);
    void checkSession();
    const interval = window.setInterval(() => void checkSession(), sessionCheckIntervalMs);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('portfolio:session-expired', onExpired);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [checkSession, expireSession, user]);

  return null;
};
