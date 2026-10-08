import { Experience, Project } from './portfolio.models';

export const technologies = ['.NET', 'C#', 'React', 'TypeScript', 'REST APIs', 'PostgreSQL', 'Docker', 'Linux', 'CI/CD'];

export const projects: Project[] = [
  {
    title: 'Developer Portfolio',
    slug: 'developer-portfolio',
    shortDescription: 'A full-stack portfolio platform built to present projects, experience and technical work.',
    description:
      'This website is developed as an end-to-end application, with a React and TypeScript interface, ' +
      'a .NET API and PostgreSQL persistence, prepared for Linux deployment.',
    technologies: ['.NET', 'React', 'TypeScript', 'PostgreSQL', 'Linux'],
    isFeatured: true,
  },
];

// The API contains the Experience entity, but no public endpoint is exposed yet.
export const experiences: Experience[] = [];
