import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { EmptyState, PageContainer, PageTransition, SectionTitle, TechChip } from './PortfolioCommon';
import { usePageMetadata } from './usePageMetadata';
import { ProjectCard } from './ProjectCard';
import { usePublishedPortfolio } from './usePublishedPortfolio';

export const ProjectsPage = () => {
  const { t } = useTranslation();
  const { projects, technologies } = usePublishedPortfolio();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('tech');
  const activeTechnology = technologies.includes(requested ?? '') ? requested : null;
  const visibleProjects = activeTechnology ? projects.filter((project) => project.technologies.includes(activeTechnology)) : projects;
  usePageMetadata(t('projects.metaTitle'), t('projects.metaDescription'));

  const selectTechnology = (technology: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (technology) next.set('tech', technology);
    else next.delete('tech');
    setSearchParams(next, { replace: true });
  };

  return (
    <PageTransition>
      <PageContainer>
        <Box component="header" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionTitle eyebrow={t('projects.eyebrow')} title={t('projects.title')} description={t('projects.description')} />
          <Stack direction="row" role="group" aria-label={t('projects.filterLabel')} sx={{ flexWrap: 'wrap', gap: 1.25 }}>
            <TechChip label={t('projects.filterAll')} selected={!activeTechnology} onClick={() => selectTechnology(null)} />
            {technologies.map((technology) => (
              <TechChip key={technology} label={technology} selected={activeTechnology === technology} onClick={() => selectTechnology(technology)} />
            ))}
          </Stack>
          <Typography aria-live="polite" variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {t('projects.showing', { count: visibleProjects.length })}
          </Typography>
        </Box>
        {visibleProjects.length === 0 ? (
          <EmptyState
            title={t('projects.filterEmpty')}
            description={t('projects.filterEmptyDescription')}
            action={
              <Button variant="outlined" onClick={() => selectTechnology(null)}>
                {t('projects.clearFilter')}
              </Button>
            }
          />
        ) : (
          <Box
            component="section"
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' }, gap: 3 }}
          >
            {visibleProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Box>
        )}
      </PageContainer>
    </PageTransition>
  );
};
