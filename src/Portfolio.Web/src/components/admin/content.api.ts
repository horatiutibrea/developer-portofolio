import { axiosInstance } from '@modules';

const readOptions = { apiNotifications: { success: false } };

export type ExperienceRecord = {
  id: number,
  company: string,
  position: string,
  location?: string | null,
  startDate: string,
  endDate?: string | null,
  isCurrent: boolean,
  description?: string | null,
  displayOrder: number,
  isPublished: boolean,
};

export type TechnologyRecord = {
  id: number,
  name: string,
  category: string,
  icon?: string | null,
  displayOrder: number,
  isVisible: boolean,
};

export type ProjectRecord = {
  id: number,
  title: string,
  slug: string,
  shortDescription: string,
  description?: string | null,
  imageUrl?: string | null,
  repositoryUrl?: string | null,
  liveUrl?: string | null,
  displayOrder: number,
  isFeatured: boolean,
  isPublished: boolean,
  technologyIds: number[],
  technologies: string[],
};

export type ExperienceInput = Omit<ExperienceRecord, 'id'>;
export type TechnologyInput = Omit<TechnologyRecord, 'id'>;
export type ProjectInput = Omit<ProjectRecord, 'id' | 'technologies'>;

const read = <T>(url: string) => axiosInstance.get<T>(url, readOptions).then((response) => response.data);

export const loadPublishedExperiences = () => read<ExperienceRecord[]>('/api/portfolio/experiences');
export const loadManagedExperiences = () => read<ExperienceRecord[]>('/api/portfolio/experiences/manage');
export const saveExperience = (input: ExperienceInput, id?: number) => (id
  ? axiosInstance.put<ExperienceRecord>(`/api/portfolio/experiences/${id}`, input)
  : axiosInstance.post<ExperienceRecord>('/api/portfolio/experiences', input)).then((response) => response.data);
export const deleteExperience = (id: number) => axiosInstance.delete(`/api/portfolio/experiences/${id}`);

export const loadPublishedProjects = () => read<ProjectRecord[]>('/api/portfolio/projects');
export const loadManagedProjects = () => read<ProjectRecord[]>('/api/portfolio/projects/manage');
export const saveProject = (input: ProjectInput, id?: number) => (id
  ? axiosInstance.put<ProjectRecord>(`/api/portfolio/projects/${id}`, input)
  : axiosInstance.post<ProjectRecord>('/api/portfolio/projects', input)).then((response) => response.data);
export const deleteProject = (id: number) => axiosInstance.delete(`/api/portfolio/projects/${id}`);

export const loadVisibleTechnologies = () => read<TechnologyRecord[]>('/api/portfolio/technologies');
export const loadManagedTechnologies = () => read<TechnologyRecord[]>('/api/portfolio/technologies/manage');
export const saveTechnology = (input: TechnologyInput, id?: number) => (id
  ? axiosInstance.put<TechnologyRecord>(`/api/portfolio/technologies/${id}`, input)
  : axiosInstance.post<TechnologyRecord>('/api/portfolio/technologies', input)).then((response) => response.data);
export const deleteTechnology = (id: number) => axiosInstance.delete(`/api/portfolio/technologies/${id}`);
