import { PathEnum, UserRoleEnum } from '@types';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute } from './auth';
import { FallbackLoader } from './layout';
import { StatusPage } from './layout/StatusPage';

const HomePage = lazy(() => import('./home').then((module) => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('./portfolio').then((module) => ({ default: module.AboutPage })));
const ExperiencePage = lazy(() => import('./portfolio').then((module) => ({ default: module.ExperiencePage })));
const ProjectsPage = lazy(() => import('./portfolio').then((module) => ({ default: module.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./portfolio').then((module) => ({ default: module.ProjectDetailPage })));
const ContactPage = lazy(() => import('./portfolio').then((module) => ({ default: module.ContactPage })));
const AdminPage = lazy(() => import('./portfolio').then((module) => ({ default: module.AdminPage })));
const UsersPage = lazy(() => import('./users').then((module) => ({ default: module.UsersPage })));

const superadminRoles = [UserRoleEnum.Superadmin];

export const AppRoutes = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <Routes>
        <Route path={PathEnum.Home} element={<HomePage />} />
        <Route path={PathEnum.About} element={<AboutPage />} />
        <Route path={PathEnum.Experience} element={<ExperiencePage />} />
        <Route path={PathEnum.Projects} element={<ProjectsPage />} />
        <Route path={`${PathEnum.Projects}/:slug`} element={<ProjectDetailPage />} />
        <Route path={PathEnum.Contact} element={<ContactPage />} />
        <Route path={PathEnum.Admin} element={<AdminPage />} />
        <Route
          path={PathEnum.Users}
          element={(
            <ProtectedRoute necessaryRoles={superadminRoles}>
              <UsersPage />
            </ProtectedRoute>
          )}
        />
        <Route path={PathEnum.Forbidden} element={<StatusPage status={403} />} />
        <Route path={PathEnum.NotFound} element={<StatusPage status={404} />} />
        <Route path="*" element={<Navigate to={PathEnum.NotFound} replace />} />
      </Routes>
    </Suspense>
  );
};
