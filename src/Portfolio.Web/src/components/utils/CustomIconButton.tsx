import { IconButton, Icon, Tooltip, TooltipProps, IconButtonOwnProps } from '@mui/material';
import { TranslationKey } from '@types';
import { useTranslation } from 'react-i18next';

type CustomIconButtonProps = {
  icon: string;
  label: TranslationKey;
  color?: IconButtonOwnProps['color'];
  onClick: () => unknown;
  tooltipPlacement?: TooltipProps['placement'];
  disabled?: boolean;
};

export const CustomIconButton = ({ icon, label, color, onClick, tooltipPlacement, disabled }: CustomIconButtonProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={t(label)} placement={tooltipPlacement}>
        <IconButton size="medium" color={color} onClick={onClick} disabled={disabled}>
          {icon && <Icon>{icon}</Icon>}
        </IconButton>
      </Tooltip>
    </>
  );
};
