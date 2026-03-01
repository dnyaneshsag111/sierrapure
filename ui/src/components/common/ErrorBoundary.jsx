import { Component } from 'react';
import { Box, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '60vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            px: 3, background: '#F8FBFF',
          }}
        >
          <Typography sx={{ fontSize: '3.5rem', mb: 2 }}>💧</Typography>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", color: '#0A2342', mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', mb: 3, maxWidth: 420 }}>
            An unexpected error occurred. Please refresh the page or go back to continue.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}
            >
              Refresh Page
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/'}
              sx={{ borderRadius: 9999, borderColor: '#1B6CA8', color: '#1B6CA8', px: 3 }}
            >
              Go Home
            </Button>
          </Box>
        </Box>
      );
    }
    return this.props.children;
  }
}
