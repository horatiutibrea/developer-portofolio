import { axiosInstance } from '@modules';
import { ContactMessageSubmission } from './portfolio.models';

export const submitContactMessage = (submission: ContactMessageSubmission) =>
  axiosInstance.post('/api/contact/messages', submission, { apiNotifications: false });
