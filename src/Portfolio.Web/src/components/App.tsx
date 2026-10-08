import { BrowserRouter } from 'react-router';
import { AppLayout } from './layout';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@store';
import { AppRoutes } from './App.routes';
import { ErrorBoundary } from './ErrorBoundary';

export const App = () => {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </BrowserRouter>
      </ReduxProvider>
    </ErrorBoundary>
  );
};
