import { Box, Container, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveIcon from '@mui/icons-material/Remove';

const ROWS = [
  { label: 'TDS Range (mg/L)',      tap: '200–600+', generic: '50–250',  sierra: '130–155', highlight: true },
  { label: 'pH Level',              tap: '6.5–8.5',  generic: '6.5–7.5', sierra: '7.2–7.6', highlight: false },
  { label: 'BIS IS 13428 Certified',tap: false,       generic: 'partial', sierra: true,      highlight: true },
  { label: 'FSSAI Licensed',        tap: false,       generic: true,      sierra: true,      highlight: false },
  { label: 'Daily Lab Tested',      tap: false,       generic: false,     sierra: true,      highlight: true },
  { label: 'NABL Lab Verified',     tap: false,       generic: false,     sierra: true,      highlight: false },
  { label: 'Natural Mineral Balance',tap: false,      generic: false,     sierra: true,      highlight: true },
  { label: 'QR Batch Traceability', tap: false,       generic: false,     sierra: true,      highlight: false },
  { label: 'Custom Brand Label',    tap: false,       generic: false,     sierra: true,      highlight: true },
  { label: 'Microbial Safety',      tap: 'variable',  generic: true,      sierra: true,      highlight: false },
];

const COL_HEADERS = [
  { label: 'Tap Water',               bg: '#F5F5F5', color: '#666' },
  { label: 'Generic Packaged Water',  bg: '#FFF8E1', color: '#B8860B' },
  { label: 'Sierra Pure',             bg: 'linear-gradient(135deg, #0A2342, #1565C0)', color: 'white', highlight: true },
];

function CellValue({ val, isHighlight }) {
  if (val === true)  return <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: 20 }} />;
  if (val === false) return <CancelIcon sx={{ color: '#E74C3C', fontSize: 20 }} />;
  if (val === 'partial') return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <RemoveIcon sx={{ color: '#C9A84C', fontSize: 18 }} />
      <Typography sx={{ fontSize: '0.7rem', color: '#C9A84C', fontWeight: 600 }}>Partial</Typography>
    </Box>
  );
  if (val === 'variable') return (
    <Typography sx={{ fontSize: '0.78rem', color: '#E67E22', fontWeight: 600 }}>Variable</Typography>
  );
  return (
    <Typography sx={{ fontSize: '0.82rem', fontWeight: isHighlight ? 700 : 500, color: isHighlight ? '#4FC3F7' : 'inherit' }}>
      {val}
    </Typography>
  );
}

export default function ComparisonTable() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: '#F8FBFF' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline"
              sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
              Why Sierra Pure
            </Typography>
            <Typography variant="h2"
              sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.8rem' }, color: '#0B1F3A' }}>
              Sierra Pure vs The Alternatives
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', maxWidth: 520, mx: 'auto', fontSize: '1rem', lineHeight: 1.8 }}>
              An honest, fact-based comparison. No marketing copy — just numbers and certifications.
            </Typography>
          </motion.div>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Box sx={{
            borderRadius: 4, overflow: 'hidden',
            boxShadow: '0 16px 64px rgba(10,35,66,0.10)',
            border: '1px solid #E2EAF4',
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ background: '#0B1F3A', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.75rem', py: 2.5, width: '32%' }}>
                    FEATURE
                  </TableCell>
                  {COL_HEADERS.map((col) => (
                    <TableCell
                      key={col.label}
                      align="center"
                      sx={{
                        background: col.highlight ? col.bg : col.bg,
                        color: col.color,
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        py: 2.5,
                        borderLeft: col.highlight ? '2px solid rgba(79,195,247,0.4)' : 'none',
                        ...(col.highlight && { background: 'linear-gradient(135deg, #0A2342, #1565C0)' }),
                      }}
                    >
                      {col.label}
                      {col.highlight && (
                        <Typography sx={{ color: '#4FC3F7', fontSize: '0.65rem', fontWeight: 500, mt: 0.3 }}>
                          ✦ Our Product
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ROWS.map((row, i) => (
                  <TableRow
                    key={row.label}
                    sx={{
                      background: i % 2 === 0 ? 'white' : '#F8FBFF',
                      '&:hover': { background: '#EFF5FF' },
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <TableCell sx={{
                      fontWeight: 600, color: '#0A2342', fontSize: '0.85rem',
                      borderBottom: '1px solid #EEF2F8', py: 1.8,
                    }}>
                      {row.label}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid #EEF2F8', py: 1.8 }}>
                      <CellValue val={row.tap} isHighlight={false} />
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid #EEF2F8', py: 1.8 }}>
                      <CellValue val={row.generic} isHighlight={false} />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderBottom: '1px solid rgba(79,195,247,0.15)',
                        borderLeft: '2px solid rgba(79,195,247,0.2)',
                        background: 'rgba(21,101,192,0.04)',
                        py: 1.8,
                      }}
                    >
                      <CellValue val={row.sierra} isHighlight={true} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.75rem', mt: 2.5, textAlign: 'center', lineHeight: 1.7 }}>
            Data based on published BIS, FSSAI, and WHO standards. Generic packaged water refers to non-NABL-tested brands.
            Tap water values based on municipal supply reports in Maharashtra, India.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}
