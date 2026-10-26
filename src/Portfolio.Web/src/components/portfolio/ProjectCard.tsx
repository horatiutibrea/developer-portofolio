import { Box, Button, Card, CardActionArea, CardActions, CardContent, Chip, Icon, Stack, Typography } from '@mui/material';
import { PathEnum } from '@types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Project } from './portfolio.models';
import { TechChip } from './PortfolioCommon';

export const ProjectCard = ({ project }: { project: Project }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'clip',
        position: 'relative',
        minWidth: 0,
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
        '&:hover': { transform: 'translateY(-6px)', borderColor: 'primary.main', boxShadow: '0 24px 50px rgba(79,70,229,.16)' },
        '&:hover .project-sheen': { transform: 'translateX(120%)' },
      }}
    >
      <Box
        className="project-sheen"
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,.16) 50%, transparent 65%)',
          transform: 'translateX(-120%)',
          transition: 'transform 700ms ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <CardActionArea onClick={() => navigate(`${PathEnum.Projects}/${project.slug}`)} sx={{ flex: 1, alignItems: 'stretch' }}>
        {project.imageUrl ? (
          <Box component="img" src={project.imageUrl} alt="" loading="lazy" sx={{ width: '100%', aspectRatio: '16/8', objectFit: 'cover' }} />
        ) : (
          <Box
            sx={{
              minHeight: 150,
              p: 3,
              display: 'flex',
              alignItems: 'flex-end',
              color: 'primary.contrastText',
              background: 'linear-gradient(135deg, #312e81, #4338ca 58%, #0891b2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Typography
              aria-hidden
              sx={{ position: 'absolute', top: -22, right: 12, fontFamily: 'monospace', fontWeight: 900, fontSize: '7rem', opacity: 0.12 }}
            >
              {'{ }'}
            </Typography>
            {project.isFeatured && (
              <Chip label={t('projects.featured')} size="small" sx={{ bgcolor: 'rgba(255,255,255,.15)', color: 'white', fontWeight: 800 }} />
            )}
          </Box>
        )}
        <CardContent sx={{ p: 3, flex: 1 }}>
          <Typography component="h3" variant="h5" sx={{ mb: 1.25 }}>
            {project.title}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5 }}>
            {project.shortDescription}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {project.technologies.map((technology) => (
              <TechChip key={technology} label={technology} />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ p: 3, pt: 0, gap: 1, flexWrap: 'wrap' }}>
        <Button onClick={() => navigate(`${PathEnum.Projects}/${project.slug}`)} endIcon={<Icon>arrow_forward</Icon>}>
          {t('projects.details')}
        </Button>
        {project.repositoryUrl && (
          <Button component="a" href={project.repositoryUrl} target="_blank" rel="noreferrer" color="inherit" startIcon={<Icon>code</Icon>}>
            {t('projects.repository')}
          </Button>
        )}
        {project.liveUrl && (
          <Button component="a" href={project.liveUrl} target="_blank" rel="noreferrer" color="inherit" startIcon={<Icon>open_in_new</Icon>}>
            {t('projects.live')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
