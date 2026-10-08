import { Alert, Box, Button, CircularProgress, Icon, LinearProgress, Paper, Stack, TextField } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactGoogleIdentity } from './ContactGoogleIdentity';
import { PageContainer, PageTransition, SectionTitle } from './PortfolioCommon';
import { usePageMetadata } from './usePageMetadata';
import { ContactFormValues, VerifiedContactIdentity } from './portfolio.models';
import { submitContactMessage } from './contact.service';

type FormErrors = Partial<Record<keyof ContactFormValues | 'identity', string>>;
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const initialValues: ContactFormValues = { subject: '', message: '' };

export const ContactPage = () => {
  const { t } = useTranslation();
  const [identity, setIdentity] = useState<VerifiedContactIdentity | null>(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  usePageMetadata(t('contact.metaTitle'), t('contact.metaDescription'));

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!identity) nextErrors.identity = t('contact.validation.identity');
    if (values.subject.trim().length < 3) nextErrors.subject = t('contact.validation.subject');
    if (values.message.trim().length < 20) nextErrors.message = t('contact.validation.message');
    if (values.subject.length > 250) nextErrors.subject = t('contact.validation.subjectMax');
    if (values.message.length > 4000) nextErrors.message = t('contact.validation.messageMax');
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleIdentityChange = (nextIdentity: VerifiedContactIdentity | null) => {
    setIdentity(nextIdentity);
    setErrors((current) => ({ ...current, identity: undefined }));
    setSubmitState('idle');
  };

  const handleChange = (field: keyof ContactFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (submitState !== 'idle') setSubmitState('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || !identity) return;

    setSubmitState('loading');
    try {
      const result = await submitContactMessage({
        googleToken: identity.googleToken,
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setSubmitState(result.status === 'sent' ? 'success' : 'error');
      if (result.status === 'sent') setValues(initialValues);
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <PageTransition>
      <PageContainer>
        <Box component="header" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionTitle eyebrow={t('contact.eyebrow')} title={t('contact.title')} description={t('contact.description')} />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '.65fr 1.35fr' },
            gap: { xs: 4, lg: 7 },
            alignItems: 'start',
          }}
        >
          <Stack spacing={2.5} sx={{ pt: { lg: 2 } }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <Icon>alternate_email</Icon>
            </Box>
            <Box>
              <SectionTitle title={t('contact.sideTitle')} description={t('contact.sideDescription')} />
            </Box>
          </Stack>
          <Paper component="form" noValidate onSubmit={handleSubmit} sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Stack spacing={2.5}>
              {submitState === 'success' && <Alert severity="success">{t('contact.success')}</Alert>}
              {submitState === 'error' && <Alert severity="info">{t('contact.unavailable')}</Alert>}

              <ContactGoogleIdentity identity={identity} onChange={handleIdentityChange} />
              {errors.identity && <Alert severity="warning">{errors.identity}</Alert>}

              <TextField
                label={t('contact.subject')}
                value={values.subject}
                onChange={handleChange('subject')}
                error={Boolean(errors.subject)}
                helperText={errors.subject ?? t('contact.characters', { count: values.subject.length, max: 250 })}
                slotProps={{ htmlInput: { maxLength: 250 } }}
                disabled={!identity}
                required
                fullWidth
              />
              <Box>
                <TextField
                  label={t('contact.message')}
                  value={values.message}
                  onChange={handleChange('message')}
                  error={Boolean(errors.message)}
                  helperText={errors.message ?? `${t('contact.messageHint')} · ${t('contact.characters', { count: values.message.length, max: 4000 })}`}
                  slotProps={{ htmlInput: { maxLength: 4000 } }}
                  disabled={!identity}
                  required
                  fullWidth
                  multiline
                  minRows={6}
                />
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (values.message.trim().length / 20) * 100)}
                  color={values.message.trim().length >= 20 ? 'success' : 'primary'}
                  aria-hidden
                  sx={{ mt: 1, borderRadius: 99, opacity: identity ? 1 : 0.4 }}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!identity || submitState === 'loading'}
                startIcon={submitState === 'loading' ? <CircularProgress size={18} color="inherit" /> : <Icon>send</Icon>}
                sx={{ alignSelf: { sm: 'flex-start' } }}
              >
                {submitState === 'loading' ? t('contact.sending') : t('contact.send')}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </PageContainer>
    </PageTransition>
  );
};
