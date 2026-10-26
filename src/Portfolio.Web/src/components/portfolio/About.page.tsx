import { Box, Card, CardContent, Icon, Stack, Typography } from '@mui/material';
import { PathEnum } from '@types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PageContainer, PageTransition, Reveal, SectionTitle, TechChip } from './PortfolioCommon';
import { liftCardSx } from './portfolio.styles';
import { usePageMetadata } from './usePageMetadata';
import { usePublishedPortfolio } from './usePublishedPortfolio';

const focusAreas = [
  { icon: 'dns', key: 'backend' },
  { icon: 'devices', key: 'fullStack' },
  { icon: 'database', key: 'databases' },
  { icon: 'rocket_launch', key: 'devops' },
  { icon: 'terminal', key: 'linux' },
  { icon: 'sync', key: 'cicd' },
  { icon: 'cloud', key: 'cloud' },
] as const;

export const AboutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { technologies } = usePublishedPortfolio();
  usePageMetadata(t('about.metaTitle'), t('about.metaDescription'));

  return (
    <PageTransition>
      <PageContainer>
        <Box component="header" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionTitle eyebrow={t('about.eyebrow')} title={t('about.title')} description={t('about.intro')} />
        </Box>
        <Reveal>
          <Box
            component="section"
            sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' }, gap: 3, mb: { xs: 9, md: 13 } }}
          >
            <Card sx={liftCardSx}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Icon color="primary" sx={{ fontSize: 32, mb: 2 }}>
                deployed_code
                </Icon>
                <Typography variant="h5" sx={{ mb: 1.5 }}>
                  {t('about.buildTitle')}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {t('about.buildDescription')}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={liftCardSx}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Icon color="primary" sx={{ fontSize: 32, mb: 2 }}>
                architecture
                </Icon>
                <Typography variant="h5" sx={{ mb: 1.5 }}>
                  {t('about.workTitle')}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {t('about.workDescription')}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Reveal>
        <Reveal>
          <Box component="section" sx={{ mb: { xs: 9, md: 13 } }}>
            <SectionTitle eyebrow={t('about.stackEyebrow')} title={t('about.stackTitle')} />
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.25 }}>
              {technologies.map((technology) => (
                <TechChip
                  key={technology}
                  label={technology}
                  onClick={() => navigate(`${PathEnum.Projects}?tech=${encodeURIComponent(technology)}`)}
                />
              ))}
            </Stack>
          </Box>
        </Reveal>
        <Reveal>
          <Box component="section">
            <SectionTitle eyebrow={t('about.interestsEyebrow')} title={t('about.interestsTitle')} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              {focusAreas.map((area) => (
                <Card key={area.key} sx={liftCardSx}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                        transition: 'background-color 180ms ease, color 180ms ease',
                        '.MuiCard-root:hover &': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                      }}
                    >
                      <Icon>{area.icon}</Icon>
                    </Box>
                    <Typography sx={{ fontWeight: 750 }}>{t(`about.interests.${area.key}`)}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Reveal>
      </PageContainer>
    </PageTransition>
  );
};
