import { DEFAULT_LANGUAGE, resources } from '@assets';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('portfolio-language') ?? DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    debug: false,
  });

i18n.on('languageChanged', (language) => {
  localStorage.setItem('portfolio-language', language);
});

export default i18n;
