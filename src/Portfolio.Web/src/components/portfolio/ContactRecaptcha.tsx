import { useEffect, useRef } from 'react';

type Grecaptcha = {
  ready: (callback: () => void) => void,
  render: (container: HTMLElement, parameters: Record<string, unknown>) => number,
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha,
  }
}

type Props = {
  siteKey: string,
  onChange: (token: string | null) => void,
};

export const ContactRecaptcha = ({ siteKey, onChange }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    const render = () => {
      if (cancelled || !container.current || container.current.childElementCount > 0 || !window.grecaptcha) return;
      window.grecaptcha.render(container.current, {
        sitekey: siteKey,
        callback: (token: string) => onChangeRef.current(token),
        'expired-callback': () => onChangeRef.current(null),
        'error-callback': () => onChangeRef.current(null),
      });
    };

    if (window.grecaptcha) {
      window.grecaptcha.ready(render);
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.onload = () => window.grecaptcha?.ready(render);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  return <div ref={container} />;
};
