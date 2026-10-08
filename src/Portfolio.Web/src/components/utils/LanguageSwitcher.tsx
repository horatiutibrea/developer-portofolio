import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'ro' ? 'en' : 'ro';
    i18n.changeLanguage(newLang);
  };

  return (
    <IconButton onClick={toggleLanguage}>
      {currentLang === 'ro' ? (
        <ReactCountryFlag countryCode="US" svg style={{ width: '1em', height: '1em' }} title="EN" />
      ) : (
        <ReactCountryFlag countryCode="RO" svg style={{ width: '1em', height: '1em' }} title="RO" />
      )}
    </IconButton>
  );
};
