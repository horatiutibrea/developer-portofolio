import { useUser } from '@hooks';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { AppDispatch, authenticateUser, AuthenticateUserInput } from '@store';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const GoogleLoginWrapper = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const user = useUser();

  const onGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential == null) {
      enqueueSnackbar(t('auth.googleUnavailable'), { variant: 'error' });
      return;
    }

    dispatch(authenticateUser(AuthenticateUserInput.buildFromGoogleUser(credentialResponse.credential)))
      .unwrap()
      .catch(() => undefined);
  };

  const onGoogleLoginError = () => {
    enqueueSnackbar(t('auth.googleCancelled'), {
      variant: 'warning',
    });
  };

  if (user) {
    return;
  }

  return (
    <>
      <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError} />
    </>
  );
};
