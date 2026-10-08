import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useUser } from './useUser';

export const useRedirectAfterLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;
  const user = useUser();

  useEffect(() => {
    if (user && from) {
      navigate(from.pathname);
    }
  }, [user, from]);
};
