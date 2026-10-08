import { Box, Button, Icon, Stack, Typography } from '@mui/material';
import { PathEnum } from '@types';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PageContainer, PageTransition, TechChip } from './PortfolioCommon';
import { usePageMetadata } from './usePageMetadata';
import { usePublishedPortfolio } from './usePublishedPortfolio';

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projects, ready } = usePublishedPortfolio();
  const project = projects.find((item) => item.slug === slug);
  usePageMetadata(project?.title ?? t('status.404.title'), project?.shortDescription ?? t('status.404.description'));

  if (!project && !ready) return null;
  if (!project)
    return (
      <PageContainer>
        <Stack sx={{ py: 10, alignItems: 'flex-start' }} spacing={2}>
          <Typography variant="h2">404</Typography>
          <Typography variant="h5">{t('status.404.title')}</Typography>
          <Button onClick={() => navigate(PathEnum.Projects)}>{t('projects.back')}</Button>
        </Stack>
      </PageContainer>
    );

  return (
    <PageTransition>
      <PageContainer>
        <Box component="article" sx={{ py: { xs: 6, md: 10 }, maxWidth: 900 }}>
          <Button color="inherit" startIcon={<Icon>arrow_back</Icon>} onClick={() => navigate(PathEnum.Projects)} sx={{ mb: 5 }}>
            {t('projects.back')}
          </Button>
          {project.isFeatured && (
            <Typography variant="overline" color="primary" sx={{ fontWeight: 850, letterSpacing: '.16em' }}>
              {t('projects.featured')}
            </Typography>
          )}
          <Typography component="h1" sx={{ fontSize: { xs: '2.8rem', md: '4.5rem' }, fontWeight: 900, letterSpacing: '-.06em', lineHeight: 1.05, my: 2 }}>
            {project.title}
          </Typography>
          <Typography sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8, mb: 4 }}>
            {project.description ?? project.shortDescription}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {project.technologies.map((technology) => (
              <TechChip
                key={technology}
                label={technology}
                onClick={() => navigate(`${PathEnum.Projects}?tech=${encodeURIComponent(technology)}`)}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ mt: 5 }}>
            {project.repositoryUrl && (
              <Button component="a" href={project.repositoryUrl} target="_blank" rel="noreferrer" variant="outlined" startIcon={<Icon>code</Icon>}>
                {t('projects.repository')}
              </Button>
            )}
            {project.liveUrl && (
              <Button component="a" href={project.liveUrl} target="_blank" rel="noreferrer" variant="contained" endIcon={<Icon>open_in_new</Icon>}>
                {t('projects.live')}
              </Button>
            )}
          </Stack>
        </Box>
      </PageContainer>
    </PageTransition>
  );
};
