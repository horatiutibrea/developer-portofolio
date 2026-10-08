import { Avatar, Box, Button, Chip, CircularProgress, Icon, Paper, Stack, Typography } from '@mui/material';
import { CredentialResponse, GoogleLogin, googleLogout } from '@react-oauth/google';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerifiedContactIdentity } from './portfolio.models';
import { verifyGoogleContactProfile } from './contact.service';

type ContactGoogleIdentityProps = {
  identity: VerifiedContactIdentity | null;
  onChange: (identity: VerifiedContactIdentity | null) => void;
};

export const ContactGoogleIdentity = ({ identity, onChange }: ContactGoogleIdentityProps) => {
  const { t } = useTranslation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError(t('contact.googleUnavailable'));
      return;
    }

    setIsVerifying(true);
    setError(null);
    try {
      const profile = await verifyGoogleContactProfile(response.credential);
      onChange({ profile, googleToken: response.credential });
    } catch {
      onChange(null);
      setError(t('contact.googleVerificationFailed'));
    } finally {
      setIsVerifying(false);
    }
  };

  const clearIdentity = () => {
    googleLogout();
    onChange(null);
    setError(null);
  };

  if (identity) {
    return (
      <Paper variant="outlined" sx={{ p: 2.5, borderColor: 'success.main' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
          <Avatar
            src={identity.profile.profilePictureUrl}
            alt={identity.profile.displayName}
            slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
            sx={{ width: 52, height: 52 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 0.25 }}>
              <Typography sx={{ fontWeight: 800 }}>{identity.profile.displayName}</Typography>
              <Chip icon={<Icon sx={{ fontSize: '1rem !important' }}>verified</Icon>} label={t('contact.verifiedWithGoogle')} color="success" size="small" />
            </Stack>
            <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
              {identity.profile.email}
            </Typography>
          </Box>
          <Button color="inherit" onClick={clearIdentity} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
            {t('contact.useAnotherAccount')}
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontWeight: 800 }}>{t('contact.identifyTitle')}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('contact.identifyDescription')}
          </Typography>
        </Box>
        {isVerifying ? (
          <Stack direction="row" spacing={1.5} role="status" sx={{ alignItems: 'center' }}>
            <CircularProgress size={22} />
            <Typography variant="body2">{t('contact.verifyingGoogle')}</Typography>
          </Stack>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError(t('contact.googleUnavailable'))}
            text="continue_with"
            shape="pill"
            theme="filled_black"
          />
        )}
        {error && (
          <Typography role="alert" color="error.main" variant="body2">
            {error}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};
