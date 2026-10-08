import { jwtDecode } from 'jwt-decode';
import { GoogleAuthUserInfo } from './google-auth-user-info';
import { RootState, AppUser } from '@store';
import { HeaderEnum, UserRoleEnum } from '@types';

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const getUserGoogleFromToken = (token: string): GoogleAuthUserInfo | undefined => {
  if (!isNonEmptyString(token)) {
    return;
  }

  try {
    const decodedToken = jwtDecode<GoogleAuthUserInfo>(token);
    return {
      email: decodedToken.email,
      family_name: decodedToken.family_name,
      given_name: decodedToken.given_name,
      credential: token,
    };
  } catch (error) {
    console.error('error :>> ', error);
    return;
  }
};

export const isTokenValid = (token: unknown): boolean => {
  if (!isNonEmptyString(token)) {
    return false;
  }

  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    return typeof decodedToken.exp === 'number' && Date.now() < decodedToken.exp * 1000;
  } catch {
    return false;
  }
};

export const checkRole = (user: AppUser | null, necessaryRole: UserRoleEnum[]): boolean => {
  if (user == null) {
    return false;
  }

  const userRole = user.rol.trim().toUpperCase();

  for (const role of necessaryRole) {
    if (userRole === role) {
      return true;
    }
  }

  return false;
};

export const getBearerToken = (token: string): string => `Bearer ${token}`;

export const getAuthorizationHeaderFromGetState = (
  getState: () => RootState,
): { [HeaderEnum.Authorization]: string; } | undefined => {
  void getState;
  return undefined;
};
