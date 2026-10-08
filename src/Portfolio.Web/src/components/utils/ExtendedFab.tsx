import { Fab, Icon } from '@mui/material';
import { TranslationKey } from '@types';
import { useTranslation } from 'react-i18next';

type ExtendedFabProps = {
  icon: string;
  label: TranslationKey;
  onClick: () => unknown;
};

export const ExtendedFab = ({ icon, label, onClick }: ExtendedFabProps) => {
  const { t } = useTranslation();

  return (
    <Fab
      size="medium"
      color="primary"
      variant="extended"
      sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', textTransform: 'none' }}
      onClick={onClick}
    >
      {icon && <Icon sx={{ marginRight: '.5rem' }}>{icon}</Icon>}
      {t(label)}
    </Fab>
  );
};
