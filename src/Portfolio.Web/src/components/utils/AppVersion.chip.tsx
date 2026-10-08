import { Chip } from '@mui/material';
import packageJson from '../../../package.json';

export const AppVersionChip = () => {
  const appVersion = packageJson.version;

  return <Chip size="small" variant="outlined" label={`v${appVersion}`} />;
};
