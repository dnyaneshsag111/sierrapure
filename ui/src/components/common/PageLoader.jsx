import { Box, CircularProgress, Typography } from '@mui/material';

export default function PageLoader({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <CircularProgress
          size={60}
          thickness={2}
          sx={{
            color: '#4FC3F7',
            position: 'absolute',
          }}
        />
        <svg width="28" height="28" viewBox="0 0 26 26" fill="none">
          <path d="M13 2L4 14h18L13 2z" fill="white" opacity="0.9" />
          <ellipse cx="13" cy="19" rx="5" ry="4" fill="white" opacity="0.7" />
        </svg>
      </Box>
      <Typography
        sx={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
