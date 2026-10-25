import { useEffect } from 'react';
import { loadRecaptcha } from './contact-recaptcha';

export const ContactRecaptcha = ({ siteKey }: { siteKey: string }) => {
  useEffect(() => {
    void loadRecaptcha(siteKey).catch(() => undefined);
  }, [siteKey]);
  return null;
};
