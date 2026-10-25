type Grecaptcha = {
  ready: (callback: () => void) => void,
  execute: (siteKey: string, options: { action: string }) => Promise<string>,
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha,
  }
}

let loading: Promise<void> | undefined;

export const loadRecaptcha = (siteKey: string) => {
  if (window.grecaptcha?.execute) return Promise.resolve();
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = undefined;
      reject(new Error('recaptcha'));
    };
    document.head.appendChild(script);
  });
  return loading;
};

export const executeRecaptcha = async (siteKey: string) => {
  await loadRecaptcha(siteKey);
  const captcha = window.grecaptcha;
  if (!captcha) throw new Error('recaptcha');
  await new Promise<void>((resolve) => captcha.ready(resolve));
  return captcha.execute(siteKey, { action: 'contact' });
};
