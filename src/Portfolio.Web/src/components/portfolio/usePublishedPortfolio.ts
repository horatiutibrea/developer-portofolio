import { useEffect, useState } from 'react';
import { loadPublishedExperiences, loadPublishedProjects, loadVisibleTechnologies } from '../admin/content.api';
import { projects as staticProjects, technologies as staticTechnologies } from './portfolio.data';
import { Experience, Project } from './portfolio.models';

const toExperience = (item: Awaited<ReturnType<typeof loadPublishedExperiences>>[number]): Experience => ({
  company: item.company,
  position: item.position,
  location: item.location ?? undefined,
  startDate: item.startDate,
  endDate: item.endDate ?? undefined,
  isCurrent: item.isCurrent,
  description: item.description ?? undefined,
});

const toProject = (item: Awaited<ReturnType<typeof loadPublishedProjects>>[number]): Project => ({
  title: item.title,
  slug: item.slug,
  shortDescription: item.shortDescription,
  description: item.description ?? undefined,
  imageUrl: item.imageUrl ?? undefined,
  repositoryUrl: item.repositoryUrl ?? undefined,
  liveUrl: item.liveUrl ?? undefined,
  technologies: item.technologies,
  isFeatured: item.isFeatured,
});

export const usePublishedPortfolio = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [technologies, setTechnologies] = useState<string[]>(staticTechnologies);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([loadPublishedExperiences(), loadPublishedProjects(), loadVisibleTechnologies()])
      .then(([experienceItems, projectItems, technologyItems]) => {
        if (!active) return;
        setExperiences(experienceItems.map(toExperience));
        const published = projectItems.map(toProject);
        const publishedSlugs = new Set(published.map((project) => project.slug));
        setProjects([...published, ...staticProjects.filter((project) => !publishedSlugs.has(project.slug))]);
        setTechnologies(technologyItems.map((item) => item.name));
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return { experiences, projects, technologies, ready };
};
