import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0B1F3A',
      light: '#1565C0',
      dark: '#050E1A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0B1F3A',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2ECC71',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E74C3C',
    },
    warning: {
      main: '#C9A84C',
    },
    background: {
      default: '#F5F9FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F1F35',
      secondary: '#5C6B85',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.6,
    },
    button: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(10, 35, 66, 0.08)',
    '0 4px 16px rgba(10, 35, 66, 0.10)',
    '0 8px 32px rgba(10, 35, 66, 0.12)',
    '0 12px 40px rgba(10, 35, 66, 0.14)',
    '0 16px 48px rgba(10, 35, 66, 0.16)',
    '0 20px 60px rgba(10, 35, 66, 0.18)',
    '0 24px 64px rgba(10, 35, 66, 0.20)',
    '0 28px 72px rgba(10, 35, 66, 0.22)',
    '0 32px 80px rgba(10, 35, 66, 0.24)',
    ...Array(15).fill('0 32px 80px rgba(10, 35, 66, 0.24)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          padding: '12px 32px',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0B1F3A 0%, #1565C0 100%)',
          boxShadow: '0 4px 20px rgba(21, 101, 192, 0.35)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(21, 101, 192, 0.5)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(11, 31, 58, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(11, 31, 58, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 600,
          fontSize: '0.78rem',
          letterSpacing: '0.04em',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F9FF',
        },
        '#root': {
          backgroundColor: '#F5F9FF',
          minHeight: '100vh',
        },
      },
    },
  },
});

export default theme;
