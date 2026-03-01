import { Box, Typography } from '@mui/material';

export default function ParameterRow({ param }) {
  const isPass = param.status === 'PASS';
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.2,
        px: 2,
        borderBottom: '1px solid rgba(10,35,66,0.06)',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box>
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0A2342' }}>
          {param.name}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Limit: {param.permissibleLimit}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#1B6CA8' }}>
          {param.value} {param.unit}
        </Typography>
        <Box
          sx={{
            px: 1.4, py: 0.3, borderRadius: 9999,
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
            background: isPass ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
            color: isPass ? '#1a8a4a' : '#c0392b',
            border: `1px solid ${isPass ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
          }}
        >
          {param.status}
        </Box>
      </Box>
    </Box>
  );
}
