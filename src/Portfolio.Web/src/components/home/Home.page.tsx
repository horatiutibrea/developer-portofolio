import { Box, Button, Card, CardContent, Icon, Paper, Stack, Typography } from '@mui/material';
import { PathEnum } from '@types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PageContainer, PageTransition, Reveal, SectionTitle, TechChip, TiltFrame } from '../portfolio/PortfolioCommon';
import { usePageMetadata } from '../portfolio/usePageMetadata';
import { ProjectCard } from '../portfolio/ProjectCard';
import { projects, technologies } from '../portfolio/portfolio.data';

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePageMetadata(t('home.metaTitle'), t('home.metaDescription'));

  return (
    <PageTransition>
      <PageContainer>
        <Box
          component="section"
          sx={{
            minHeight: { md: 'calc(100vh - 150px)' },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.2fr .8fr' },
            alignItems: 'center',
            gap: { xs: 6, lg: 10 },
            py: { xs: 6, md: 10 },
            position: 'relative',
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              width: { xs: 220, md: 380 },
              height: { xs: 220, md: 380 },
              borderRadius: '50%',
              right: { xs: -40, lg: '6%' },
              top: { xs: 280, lg: 20 },
              background: 'radial-gradient(circle, rgba(79,70,229,.28), transparent 68%)',
              filter: 'blur(6px)',
              animation: 'float 7s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <Stack spacing={3.25}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 28, height: 2, bgcolor: 'primary.main' }} />
              <Typography variant="overline" color="primary" sx={{ fontWeight: 850, letterSpacing: { xs: '.08em', sm: '.16em' } }}>
                {t('home.eyebrow')}
              </Typography>
            </Stack>
            <Typography
              component="h1"
              sx={{ fontSize: { xs: '3rem', sm: '4.5rem', xl: '6rem' }, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-.07em', maxWidth: 850 }}
            >
              Horațiu Țibrea
            </Typography>
            <Typography component="p" sx={{ fontSize: { xs: '1.45rem', md: '2rem' }, fontWeight: 650, color: 'text.secondary', letterSpacing: '-.035em' }}>
              Software Engineer{' '}
              <Box component="span" color="primary.main">
                /
              </Box>{' '}
              Full-Stack Developer
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 690, fontSize: { xs: '1.05rem', md: '1.18rem' }, lineHeight: 1.8 }}>
              {t('home.intro')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1, alignItems: { xs: 'stretch', sm: 'center' } }}>
              <Button size="large" variant="contained" onClick={() => navigate(PathEnum.Projects)} endIcon={<Icon>arrow_forward</Icon>}>
                {t('home.viewProjects')}
              </Button>
              <Button size="large" variant="outlined" onClick={() => navigate(PathEnum.About)}>
                {t('home.aboutMe')}
              </Button>
              <Button size="large" color="inherit" onClick={() => navigate(PathEnum.Contact)}>
                {t('home.contactMe')}
              </Button>
            </Stack>
          </Stack>

          <TiltFrame sx={{ position: 'relative', zIndex: 1 }}>
            <Paper
              aria-label={t('home.stackWindow')}
              sx={{
                p: { xs: 2.5, sm: 3 },
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0c1222' : '#10182b'),
                color: '#e2e8f0',
                borderRadius: 3,
                border: '1px solid rgba(148,163,184,.28)',
                boxShadow: '0 30px 80px rgba(15,23,42,.28)',
              }}
            >
              <Stack direction="row" spacing={0.8} sx={{ mb: 3 }}>
                {['#fb7185', '#fbbf24', '#34d399'].map((color) => (
                  <Box key={color} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
                ))}
                <Typography variant="caption" sx={{ ml: 'auto !important', color: '#64748b', fontFamily: 'monospace' }}>
                profile.ts
                </Typography>
              </Stack>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  overflow: 'auto',
                  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
                  fontSize: { xs: '.8rem', sm: '.92rem' },
                  lineHeight: 1.9,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {[
                  { delay: '40ms', node: <><Box component="span" sx={{ color: '#818cf8' }}>const</Box> engineer = {'{'}</> },
                  { delay: '180ms', node: <>{'  '}<Box component="span" sx={{ color: '#67e8f9' }}>focus</Box>: ['.NET', 'React'],</> },
                  { delay: '320ms', node: <>{'  '}<Box component="span" sx={{ color: '#67e8f9' }}>builds</Box>: 'end-to-end',</> },
                  { delay: '460ms', node: <>{'  '}<Box component="span" sx={{ color: '#67e8f9' }}>ships</Box>: 'with care',</> },
                  {
                    delay: '600ms',
                    node: (
                      <>
                        {'}'};
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            width: 8,
                            height: '1em',
                            ml: 0.4,
                            bgcolor: '#67e8f9',
                            verticalAlign: 'text-bottom',
                            animation: 'caret 1s steps(1) infinite',
                          }}
                        />
                      </>
                    ),
                  },
                ].map((line) => (
                  <Box key={line.delay} component="span" sx={{ display: 'block', animation: 'line-in 480ms ease both', animationDelay: line.delay }}>
                    {line.node}
                  </Box>
                ))}
              </Box>
            </Paper>
          </TiltFrame>
        </Box>

        <Reveal>
          <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
            <SectionTitle eyebrow={t('home.aboutEyebrow')} title={t('home.aboutTitle')} description={t('home.aboutDescription')} />
            <Button onClick={() => navigate(PathEnum.About)} endIcon={<Icon>arrow_forward</Icon>}>
              {t('home.readMore')}
            </Button>
          </Box>
        </Reveal>

        <Reveal>
          <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
            <SectionTitle eyebrow={t('home.stackEyebrow')} title={t('home.stackTitle')} description={t('home.stackDescription')} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('home.stackHint')}
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.25 }}>
              {technologies.map((technology) => (
                <TechChip key={technology} label={technology} onClick={() => navigate(`${PathEnum.Projects}?tech=${encodeURIComponent(technology)}`)} />
              ))}
            </Stack>
          </Box>
        </Reveal>

        <Reveal>
          <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
            <SectionTitle eyebrow={t('home.projectsEyebrow')} title={t('home.projectsTitle')} description={t('home.projectsDescription')} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 3, maxWidth: 800 }}>
              {projects
                .filter((project) => project.isFeatured)
                .map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
            </Box>
          </Box>
        </Reveal>

        <Reveal>
          <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
            <SectionTitle eyebrow={t('home.experienceEyebrow')} title={t('home.experienceTitle')} description={t('home.experienceDescription')} />
            <Button onClick={() => navigate(PathEnum.Experience)} endIcon={<Icon>arrow_forward</Icon>}>
              {t('home.viewExperience')}
            </Button>
          </Box>
        </Reveal>

        <Card
          component="section"
          sx={{ my: { xs: 6, md: 10 }, overflow: 'hidden', border: 0, background: 'linear-gradient(125deg, #312e81, #4338ca 58%, #0e7490)', color: 'white' }}
        >
          <CardContent sx={{ p: { xs: 4, md: 7 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: { md: 'center' } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 850, letterSpacing: '-.05em', mb: 1.5 }}>
                  {t('home.ctaTitle')}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,.76)', maxWidth: 620 }}>{t('home.ctaDescription')}</Typography>
              </Box>
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate(PathEnum.Contact)}
                sx={{ bgcolor: 'white', color: '#312e81', '&:hover': { bgcolor: '#eef2ff' } }}
              >
                {t('navigation.contact')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </PageContainer>
    </PageTransition>
  );
};
