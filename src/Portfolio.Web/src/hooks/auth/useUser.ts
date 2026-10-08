import { useRootSelector, AppUser } from '@store';

export const useUser = (): AppUser | null => {
  const user = useRootSelector(state => state.app.auth.user);
  return user;
};
