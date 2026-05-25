import { alpha, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6F8A78',
      dark: '#3F5F4A',
      light: '#A8B9A7',
    },
    secondary: {
      main: '#C98A9A',
      light: '#E7C9CF',
      dark: '#9E6670',
    },
    background: {
      default: '#E9ECE4',
      paper: '#FAF8F2',
    },
    text: {
      primary: '#27342E',
      secondary: '#68766C',
    },
    divider: alpha('#6F8A78', 0.18),
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha('#6F8A78', 0.14)}`,
          boxShadow: '0 22px 60px rgba(63, 95, 74, 0.10)',
        },
      },
    },
  },
});

export default theme;
