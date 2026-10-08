import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EmptyState, PageContainer, PageTransition, Reveal, SectionTitle, TechChip } from './PortfolioCommon';
import { liftCardSx } from './portfolio.styles';
import { usePageMetadata } from './usePageMetadata';
import { experiences } from './portfolio.data';

export const ExperiencePage = () => {
  const { t } = useTranslation();
  usePageMetadata(t('experience.metaTitle'), t('experience.metaDescription'));

  return (
    <PageTransition>
      <PageContainer>
        <Box component="header" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionTitle eyebrow={t('experience.eyebrow')} title={t('experience.title')} description={t('experience.description')} />
        </Box>
        {experiences.length === 0 ? (
          <Reveal>
            <EmptyState title={t('experience.emptyTitle')} description={t('experience.emptyDescription')} />
          </Reveal>
        ) : (
          <Stack
            component="ol"
            spacing={3}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
              position: 'relative',
              '&::before': { content: '""', position: 'absolute', top: 12, bottom: 12, left: { xs: 13, md: 159 }, width: 2, bgcolor: 'divider' },
            }}
          >
            {experiences.map((experience) => (
              <Box
                component="li"
                key={`${experience.company}-${experience.startDate}`}
                sx={{ display: 'grid', gridTemplateColumns: { xs: '28px 1fr', md: '130px 28px 1fr' }, gap: { xs: 2, md: 2.5 }, alignItems: 'start' }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, pt: 2.5 }}>
                  {experience.startDate} — {experience.isCurrent ? t('experience.present') : experience.endDate}
                </Typography>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    mt: 3,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    boxShadow: '0 0 0 6px rgba(79,70,229,.14)',
                    ...(experience.isCurrent && { animation: 'pulse-dot 2.2s ease infinite' }),
                  }}
                />
                <Card sx={liftCardSx}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h5">{experience.position}</Typography>
                        <Typography color="primary" sx={{ fontWeight: 750 }}>
                          {experience.company}
                        </Typography>
                      </Box>
                      {experience.location && <Chip label={experience.location} size="small" />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ display: { md: 'none' }, my: 1.5 }}>
                      {experience.startDate} — {experience.isCurrent ? t('experience.present') : experience.endDate}
                    </Typography>
                    {experience.description && (
                      <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.75 }}>
                        {experience.description}
                      </Typography>
                    )}
                    {experience.technologies && (
                      <Stack direction="row" sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}>
                        {experience.technologies.map((technology) => (
                          <TechChip key={technology} label={technology} />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Stack>
        )}
      </PageContainer>
    </PageTransition>
  );
};
