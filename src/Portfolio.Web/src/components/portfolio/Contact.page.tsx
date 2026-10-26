import { Alert, Box, Button, CircularProgress, Icon, LinearProgress, Paper, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactRecaptcha } from './ContactRecaptcha';
import { executeRecaptcha } from './contact-recaptcha';
import { PageContainer, PageTransition, SectionTitle } from './PortfolioCommon';
import { usePageMetadata } from './usePageMetadata';
import { ContactFormValues } from './portfolio.models';
import { submitContactMessage } from './contact.service';

type FormErrors = Partial<Record<keyof ContactFormValues, string>>;
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const initialValues: ContactFormValues = { senderName: '', senderEmail: '', subject: '', message: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '';

export const ContactPage = () => {
  const { t } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  usePageMetadata(t('contact.metaTitle'), t('contact.metaDescription'));

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (values.senderName.trim().length < 2) nextErrors.senderName = t('contact.validation.name');
    if (!emailPattern.test(values.senderEmail.trim())) nextErrors.senderEmail = t('contact.validation.email');
    if (values.subject.trim().length < 3) nextErrors.subject = t('contact.validation.subject');
    if (values.message.trim().length < 20) nextErrors.message = t('contact.validation.message');
    if (values.subject.length > 250) nextErrors.subject = t('contact.validation.subjectMax');
    if (values.message.length > 4000) nextErrors.message = t('contact.validation.messageMax');
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field: keyof ContactFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (submitState !== 'idle') setSubmitState('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitState('loading');
    setSubmitError('');
    try {
      const recaptchaToken = await executeRecaptcha(siteKey);
      await submitContactMessage({
        senderName: values.senderName.trim(),
        senderEmail: values.senderEmail.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        recaptchaToken,
      });
      setValues(initialValues);
      setSubmitState('success');
    } catch (error) {
      const messageKey = axios.isAxiosError(error) ? error.response?.data?.messageKey : undefined;
      setSubmitError(messageKey === 'api.recaptchaFailed' || !axios.isAxiosError(error)
        ? t('contact.captchaFailed')
        : t('contact.unavailable'));
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
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, .65fr) minmax(0, 1.35fr)' },
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
              {submitState === 'error' && <Alert severity="info">{submitError}</Alert>}
              {!siteKey && <Alert severity="warning">{t('contact.captchaMissing')}</Alert>}

              <TextField
                label={t('contact.name')}
                value={values.senderName}
                onChange={handleChange('senderName')}
                error={Boolean(errors.senderName)}
                helperText={errors.senderName}
                slotProps={{ htmlInput: { maxLength: 120 } }}
                required
                fullWidth
              />
              <TextField
                label={t('contact.email')}
                type="email"
                value={values.senderEmail}
                onChange={handleChange('senderEmail')}
                error={Boolean(errors.senderEmail)}
                helperText={errors.senderEmail}
                slotProps={{ htmlInput: { maxLength: 200 } }}
                required
                fullWidth
              />
              <TextField
                label={t('contact.subject')}
                value={values.subject}
                onChange={handleChange('subject')}
                error={Boolean(errors.subject)}
                helperText={errors.subject ?? t('contact.characters', { count: values.subject.length, max: 250 })}
                slotProps={{ htmlInput: { maxLength: 250 } }}
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
                  sx={{ mt: 1, borderRadius: 99 }}
                />
              </Box>
              {siteKey && <ContactRecaptcha siteKey={siteKey} />}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!siteKey || submitState === 'loading'}
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
