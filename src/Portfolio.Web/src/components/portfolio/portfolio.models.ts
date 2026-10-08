export interface Project {
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  imageUrl?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  technologies: string[];
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
  subject: string;
  message: string;
}

export interface GoogleContactProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  profilePictureUrl?: string;
}

export interface VerifiedContactIdentity {
  profile: GoogleContactProfile;
  googleToken: string;
}

export interface ContactMessageSubmission {
  googleToken: string;
  subject: string;
  message: string;
}
