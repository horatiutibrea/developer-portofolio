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
  {
    title: 'CampaignFlow Platform',
    slug: 'campaignflow-platform',
    shortDescription: 'A secure platform for bulk communication campaigns, background jobs and operational monitoring.',
    description:
      'CampaignFlow separates a React client from an ASP.NET Core API. Campaigns, templates and recipients are stored in SQL Server, while Hangfire runs scheduled delivery and retention work.\n\nMail, document storage and telemetry stay behind configuration switches. The published edition ships with demo settings and fictitious recipient data.',
    highlights: [
      'Campaign preview, scheduling, retry and delivery status.',
      'Role-based access, antiforgery, rate limiting, audit records and health checks.',
      'Optional background jobs for delivery and retention.',
    ],
    technologies: ['.NET', 'C#', 'React', 'TypeScript', 'SQL Server', 'Hangfire'],
    repositoryUrl: 'https://github.com/horatiutibrea/campaignflow-platform',
    isFeatured: true,
  },
  {
    title: 'Global Admissions Portal',
    slug: 'global-admissions-portal',
    shortDescription: 'An admissions portal for candidate applications, document review, committees and payment validation.',
    description:
      'The portal follows a candidate from registration through document upload, committee review, a ministry decision and payment confirmation. The API uses Entity Framework Core and MediatR, and the client is available in English, Romanian and French.\n\nUploaded files stay in a local demo folder. Payment and mail providers remain disabled until a local secret is supplied.',
    highlights: [
      'Candidate accounts, catalogues and study options.',
      'Document validation, committee corrections and ministry batches.',
      'Payment-proof review and role-based administration.',
    ],
    technologies: ['.NET', 'C#', 'React', 'TypeScript', 'SQL Server', 'MediatR'],
    repositoryUrl: 'https://github.com/horatiutibrea/global-admissions-portal',
    isFeatured: true,
  },
  {
    title: 'Travel & Delegation Workflow',
    slug: 'travel-delegation-workflow',
    shortDescription: 'A multi-stage travel request system with document generation and schedule checks.',
    description:
      'Employees submit a travel request, approvers move it through configurable stages, and the API generates the PDF and Excel paperwork. Schedule checks are isolated behind an integration service so the demo does not call an external system.\n\nDestinations, expense types and approval flows are maintained as reference data.',
    highlights: [
      'Configurable approval stages and delegation requests.',
      'PDF and Excel document generation.',
      'Background e-mail processing and an audit trail.',
    ],
    technologies: ['.NET', 'C#', 'React', 'TypeScript', 'SQL Server', 'MediatR'],
    repositoryUrl: 'https://github.com/horatiutibrea/travel-delegation-workflow',
    isFeatured: true,
  },
  {
    title: 'Leave Management Platform',
    slug: 'leave-management-platform',
    shortDescription: 'Leave planning and administration with document generation, reporting and organizational workflows.',
    description:
      'The platform records available, planned and completed leave against an organizational structure. Public-holiday rules feed the calculation, and administrators export leave forms and spreadsheets.\n\nThe demo seed uses fictitious employees. No production leave records are included.',
    highlights: [
      'Available, planned and completed leave days.',
      'Organizational structures and public-holiday rules.',
      'PDF requests, Excel reports and role-based access.',
    ],
    technologies: ['.NET', 'C#', 'React', 'TypeScript', 'SQL Server'],
    repositoryUrl: 'https://github.com/horatiutibrea/leave-management-platform',
    isFeatured: true,
  },
  {
    title: 'Resource & Room Scheduling Portal',
    slug: 'resource-room-scheduling',
    shortDescription: 'A scheduling portal for rooms, employees, time slots and organizational reporting.',
    description:
      'Schedulers assign rooms and employees to configurable days and intervals. The API stores the organizational structure and exports booking reports to Excel.\n\nReminder e-mails are sent through a replaceable notification service. The published sample contains fictitious rooms and bookings.',
    highlights: [
      'Room and employee scheduling across days and intervals.',
      'Organizational structures and administrative imports.',
      'Excel reports and role-based access.',
    ],
    technologies: ['.NET', 'C#', 'React', 'TypeScript', 'SQL Server', 'MUI'],
    repositoryUrl: 'https://github.com/horatiutibrea/resource-room-scheduling',
    isFeatured: true,
  },
];

// The API contains the Experience entity, but no public endpoint is exposed yet.
export const experiences: Experience[] = [];
