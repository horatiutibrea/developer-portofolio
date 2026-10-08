import './modules/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './components/App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { EnvVarEnum } from '@types';
import { getEnvVarOrThrow } from '@utils';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={getEnvVarOrThrow(EnvVarEnum.VITE_GOOGLE_AUTH_CLIENT_ID)}>
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>,
);
