export interface Project {
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  imageUrl?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  technologies: string[];
  highlights?: string[];
  isFeatured: boolean;
}

export interface Experience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies?: string[];
}

export interface ContactFormValues {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export interface ContactMessageSubmission extends ContactFormValues {
  recaptchaToken: string;
}
