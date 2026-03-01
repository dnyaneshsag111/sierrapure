import { Box, Container, Typography, Grid, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

// Mineral data with mg/L values and health benefit descriptions
export const MINERAL_DATA = [
  { symbol: 'Ca²⁺', name: 'Calcium',      value: 32,  unit: 'mg/L', dri: 26,  color: '#4FC3F7', benefit: 'Supports strong bones & teeth' },
  { symbol: 'Mg²⁺', name: 'Magnesium',    value: 12,  unit: 'mg/L', dri: 29,  color: '#2ECC71', benefit: 'Aids muscle & nerve function' },
  { symbol: 'Na⁺',  name: 'Sodium',       value: 8,   unit: 'mg/L', dri: 3,   color: '#C9A84C', benefit: 'Low sodium — heart healthy' },
  { symbol: 'K⁺',   name: 'Potassium',    value: 4,   unit: 'mg/L', dri: 1,   color: '#9B59B6', benefit: 'Helps regulate blood pressure' },
  { symbol: 'HCO₃⁻',name: 'Bicarbonates', value: 95,  unit: 'mg/L', dri: null, color: '#1B6CA8', benefit: 'Natural alkalinity buffer' },
  { symbol: 'SO₄²⁻',name: 'Sulphates',    value: 6,   unit: 'mg/L', dri: null, color: '#E74C3C', benefit: 'Below WHO safe limit' },
  { symbol: 'TDS',   name: 'Total Dissolved Solids', value: 142, unit: 'mg/L', dri: null, color: '#0A2342', benefit: 'Optimal 100–200 mg/L range' },
  { symbol: 'pH',    name: 'pH Level',     value: 7.4, unit: '',     dri: null, color: '#F39C12', benefit: 'Perfectly neutral — body pH friendly' },
];

function MineralBar({ mineral, delay = 0 }) {
  const barWidth = mineral.dri ? Math.min(mineral.dri, 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Tooltip title={mineral.benefit} placement="top" arrow>
        <Box sx={{
          p: 2,
          background: 'white',
          borderRadius: 2.5,
          border: `1px solid ${mineral.color}25`,
          cursor: 'default',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: `0 8px 24px ${mineral.color}20`,
            borderColor: `${mineral.color}60`,
            transform: 'translateY(-2px)',
          },
        }}>
          {/* Symbol + value row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, color: mineral.color, fontSize: '0.85rem', fontFamily: 'monospace', lineHeight: 1 }}>
                {mineral.symbol}
              </Typography>
              <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.7rem', mt: 0.2 }}>
                {mineral.name}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1rem', lineHeight: 1 }}>
                {mineral.value}
              </Typography>
              <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                {mineral.unit}
              </Typography>
            </Box>
          </Box>

          {/* DRI progress bar (only for minerals with DRI data) */}
          {barWidth !== null && (
            <Box>
              <Box sx={{ height: 4, background: '#F0F7FF', borderRadius: 9999, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barWidth}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: delay + 0.2 }}
                  style={{ height: '100%', background: mineral.color, borderRadius: 9999 }}
                />
              </Box>
              <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.62rem', mt: 0.5 }}>
                {mineral.dri}% of daily intake
              </Typography>
            </Box>
          )}

          {/* For items without DRI, show the benefit note */}
          {barWidth === null && (
            <Typography sx={{ color: mineral.color, fontSize: '0.68rem', fontWeight: 600 }}>
              {mineral.benefit}
            </Typography>
          )}
        </Box>
      </Tooltip>
    </motion.div>
  );
}

// Compact inline version for ProductCard
export function MineralProfileCompact({ size }) {
  const highlights = MINERAL_DATA.slice(0, 4); // Ca, Mg, Na, K
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
      {highlights.map((m) => (
        <Tooltip key={m.symbol} title={`${m.name}: ${m.value} ${m.unit} — ${m.benefit}`} arrow>
          <Box sx={{
            px: 1, py: 0.3,
            background: `${m.color}12`,
            border: `1px solid ${m.color}30`,
            borderRadius: 9999,
            fontSize: '0.65rem',
            fontWeight: 700,
            color: m.color,
            fontFamily: 'monospace',
            cursor: 'default',
            whiteSpace: 'nowrap',
          }}>
            {m.symbol} {m.value}
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}

// Full panel used on ProductDetail / standalone sections
export default function MineralProfile({ compact = false, title = 'Mineral Composition' }) {
  return (
    <Box sx={{ py: compact ? 3 : { xs: 6, md: 8 }, background: compact ? 'transparent' : '#F8FBFF' }}>
      {!compact && (
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Typography variant="overline" sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
                Transparency
              </Typography>
              <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.8rem' }, color: '#0B1F3A' }}>
                {title}
              </Typography>
              <Typography sx={{ color: 'var(--text-muted)', maxWidth: 520, mx: 'auto', fontSize: '0.97rem', lineHeight: 1.8 }}>
                Exact mineral content per litre — verified by NABL-certified laboratory.
                Hover each card to see the health benefit.
              </Typography>
            </motion.div>
          </Box>
        </Container>
      )}

      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {MINERAL_DATA.map((mineral, i) => (
            <Grid item xs={6} sm={4} md={3} key={mineral.symbol}>
              <MineralBar mineral={mineral} delay={i * 0.06} />
            </Grid>
          ))}
        </Grid>

        {!compact && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <Box sx={{
              mt: 4, p: 2.5,
              background: 'white',
              borderRadius: 3,
              border: '1px solid #E2EAF4',
              display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
            }}>
              <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                📋 <strong>Source:</strong> NABL Accredited Laboratory Report · Values represent average across batches ·
                DRI based on ICMR recommended daily intake · All values comply with BIS IS 13428 standards.
              </Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
