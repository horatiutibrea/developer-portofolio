import { useUser } from '@hooks';
import { PathEnum, UserRoleEnum } from '@types';
import { checkRole } from '@utils';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

type ProtectedRouteProps = {
  children: ReactNode;
  necessaryRoles: UserRoleEnum[];
  allowedEmails?: string[];
};

export const ProtectedRoute = ({ children, necessaryRoles, allowedEmails }: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useUser();

  const hasAllowedEmail = !allowedEmails?.length
    || allowedEmails.some((email) => email.toLowerCase() === user?.email?.toLowerCase());
  const isAuthorized = checkRole(user, necessaryRoles) && hasAllowedEmail;

  if (isAuthorized) {
    return children;
  }

  return <Navigate to={{ pathname: PathEnum.Forbidden }} state={{ from: location }} replace />;
};
