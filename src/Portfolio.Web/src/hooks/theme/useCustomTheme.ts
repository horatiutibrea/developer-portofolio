import { alpha, createTheme } from '@mui/material/styles';
import { useRootSelector } from '@store';

export const useCustomTheme = () => {
  const themeMode = useRootSelector((state) => state.app.theme.themeMode);
  const isDark = themeMode === 'dark';
  const primary = isDark ? '#8b9cff' : '#4f46e5';

  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: primary,
        light: isDark ? '#a5b4fc' : '#818cf8',
        dark: isDark ? '#6366f1' : '#3730a3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#fb923c' : '#ea580c',
        light: '#fdba74',
        dark: '#c2410c',
      },
      background: {
        default: isDark ? '#080d19' : '#f8fafc',
        paper: isDark ? '#101827' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#111827',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      divider: isDark ? alpha('#94a3b8', 0.18) : alpha('#64748b', 0.16),
      success: { main: '#16a34a' },
      warning: { main: '#d97706' },
      error: { main: '#dc2626' },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h1: { fontWeight: 900 },
      h2: { fontWeight: 850 },
      h3: { fontWeight: 850 },
      h4: { fontWeight: 800 },
      h5: { fontWeight: 750 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 650, letterSpacing: '-0.01em' },
    },
    shadows: [
      'none',
      '0 1px 2px rgba(15, 23, 42, 0.05)',
      '0 2px 8px rgba(15, 23, 42, 0.07)',
      '0 6px 18px rgba(15, 23, 42, 0.08)',
      '0 10px 28px rgba(15, 23, 42, 0.10)',
      '0 14px 36px rgba(15, 23, 42, 0.11)',
      ...Array(19).fill('0 18px 48px rgba(15, 23, 42, 0.12)'),
    ] as ReturnType<typeof createTheme>['shadows'],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#080d19' : '#f8fafc',
            backgroundImage: [
              isDark
                ? 'radial-gradient(ellipse 70% 45% at 8% -8%, rgba(139,156,255,.22), transparent 60%)'
                : 'radial-gradient(ellipse 70% 45% at 8% -8%, rgba(79,70,229,.16), transparent 60%)',
              isDark
                ? 'radial-gradient(ellipse 50% 35% at 100% 0%, rgba(8,145,178,.16), transparent 55%)'
                : 'radial-gradient(ellipse 50% 35% at 100% 0%, rgba(14,116,144,.12), transparent 55%)',
              `linear-gradient(${isDark ? 'rgba(139,156,255,.03)' : 'rgba(79,70,229,.035)'} 1px, transparent 1px)`,
              `linear-gradient(90deg, ${isDark ? 'rgba(139,156,255,.03)' : 'rgba(79,70,229,.035)'} 1px, transparent 1px)`,
            ].join(', '),
            backgroundSize: 'auto, auto, 48px 48px, 48px 48px',
            backgroundAttachment: 'fixed',
          },
          '*::selection': { backgroundColor: alpha(primary, 0.22) },
          '.MuiDataGrid-root': { borderRadius: '16px !important', borderColor: `${isDark ? alpha('#94a3b8', 0.18) : alpha('#64748b', 0.14)} !important` },
          '.MuiDataGrid-columnHeaders': { backgroundColor: isDark ? alpha('#ffffff', 0.035) : '#f8fafc' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { minHeight: 38, borderRadius: 10, paddingInline: 16, textTransform: 'none' },
          contained: { boxShadow: `0 6px 16px ${alpha(primary, 0.22)}` },
        },
      },
      MuiIconButton: { styleOverrides: { root: { borderRadius: 10 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: '1px solid',
            borderColor: isDark ? alpha('#94a3b8', 0.18) : alpha('#64748b', 0.14),
            borderRadius: 20,
          },
        },
      },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
      MuiTextField: { defaultProps: { variant: 'outlined' } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: isDark ? alpha('#ffffff', 0.025) : alpha('#f8fafc', 0.72),
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(primary, 0.65) },
          },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 9, fontWeight: 600 } } },
      MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 8, fontSize: '0.75rem', padding: '7px 10px' } } },
      MuiTableCell: { styleOverrides: { head: { fontWeight: 700, backgroundColor: isDark ? alpha('#ffffff', 0.035) : '#f8fafc' } } },
    },
  });
};
