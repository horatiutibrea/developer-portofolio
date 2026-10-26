import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { AppBar } from './Appbar';
import { Footer } from './Footer';
import { useCustomTheme } from '@hooks';
import { SnackbarProvider } from 'notistack';
import { SessionExpirationMonitor } from '../auth';
import { LoadingBar } from './LoadingBar';

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const theme = useCustomTheme();

  return (
    <SnackbarProvider maxSnack={4}>
      <SessionExpirationMonitor />
      <LoadingBar />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            minWidth: 0,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AppBar />
          <Box
            component="main"
            sx={{
              flex: 1,
              pt: { xs: '96px', md: '116px' },
              px: { xs: 2.5, sm: 4, lg: 6 },
              pb: { xs: 8, md: 12 },
              width: '100%',
              minWidth: 0,
              maxWidth: 1480,
              mx: 'auto',
              overflowX: 'clip',
            }}
          >
            {children}
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </SnackbarProvider>
  );
};
