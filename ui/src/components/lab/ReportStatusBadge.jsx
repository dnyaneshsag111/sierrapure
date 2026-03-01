import { Box, Typography } from '@mui/material';
import { REPORT_STATUS } from '../../utils/constants';

export default function ReportStatusBadge({ status, size = 'medium' }) {
  const s = REPORT_STATUS[status] ?? REPORT_STATUS.FAIL;
  const small = size === 'small';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: small ? 1.2 : 1.8,
        py: small ? 0.2 : 0.4,
        borderRadius: 9999,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
      <Typography sx={{ fontSize: small ? '0.7rem' : '0.78rem', fontWeight: 700, color: s.color, letterSpacing: '0.06em' }}>
        {s.label}
      </Typography>
    </Box>
  );
}
