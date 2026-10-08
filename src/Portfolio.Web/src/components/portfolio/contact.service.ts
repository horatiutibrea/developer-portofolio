import { axiosInstance } from '@modules';
import { AxiosResponse } from 'axios';
import { ContactMessageSubmission, GoogleContactProfile } from './portfolio.models';

export type ContactSubmissionResult = { status: 'sent' } | { status: 'unavailable' };

export const verifyGoogleContactProfile = async (googleToken: string): Promise<GoogleContactProfile> => {
  const response = await axiosInstance.post<{ googleToken: string }, AxiosResponse<GoogleContactProfile>>(
    '/api/contact/google-profile',
    { googleToken },
    { apiNotifications: false },
  );
  return response.data;
};

export const submitContactMessage = async (submission: ContactMessageSubmission): Promise<ContactSubmissionResult> => {
  void submission;
  // Integration boundary for a future public ContactMessages endpoint.
  // No network request is made until persistence can bind the message to a
  // server-validated Google identity without creating an application user.
  await Promise.resolve();
  return { status: 'unavailable' };
};
