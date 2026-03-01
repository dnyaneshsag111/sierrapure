import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ScienceIcon from '@mui/icons-material/Science';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuery } from '@tanstack/react-query';
import { labReportService } from '../../services/labReportService';
import dayjs from 'dayjs';

function ParameterRow({ param }) {
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
            px: 1.4,
            py: 0.3,
            borderRadius: 9999,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
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

export default function LatestLabReport() {
  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['latest-lab-report'],
    queryFn: labReportService.getLatest,
    retry: 1,
  });

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #EEF4FF 0%, #F5F9FF 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          {/* Left: Content */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ScienceIcon sx={{ color: '#1565C0', fontSize: 22 }} />
                <Typography
                  variant="overline"
                  sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}
                >
                  Transparency First
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{ mb: 2.5, fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#0A2342' }}
              >
                Daily Lab Reports —
                <Box component="span" sx={{ color: '#1B6CA8' }}> Open to All</Box>
              </Typography>

              <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.85, mb: 3, fontSize: '1rem' }}>
                Every single batch we manufacture is tested by a NABL-certified laboratory.
                We publish the full report — all parameters, values, and results — for complete
                transparency. Scan the QR code on any bottle to instantly view that day's report.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                {[
                  'Daily testing for every batch manufactured',
                  'NABL certified independent laboratory',
                  'Full parameter report published publicly',
                  'QR code on bottle links to exact batch report',
                  'Downloadable PDF with official lab signature',
                ].map((point) => (
                  <Box key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <VerifiedIcon sx={{ color: '#2ECC71', fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.92rem', color: '#4A5568', lineHeight: 1.6 }}>
                      {point}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/lab-reports"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
                    color: 'white',
                    borderRadius: 9999,
                    px: 3,
                    py: 1.3,
                    boxShadow: '0 4px 20px rgba(10,35,66,0.2)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(10,35,66,0.3)' },
                  }}
                >
                  All Lab Reports
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Right: Report Card */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  background: 'white',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(10,35,66,0.12)',
                  overflow: 'hidden',
                  border: '1px solid #E2EAF4',
                }}
              >
                {/* Card header */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #0B1F3A, #1565C0)',
                    px: 3,
                    py: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', letterSpacing: '0.1em', mb: 0.3 }}>
                      LATEST LAB REPORT
                    </Typography>
                    <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', fontFamily: "'Playfair Display', serif" }}>
                      {isLoading ? 'Loading...' : report ? report.reportId : 'No reports yet'}
                    </Typography>
                    {report && (
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', mt: 0.3 }}>
                        {dayjs(report.manufacturingDate).format('DD MMMM YYYY')} • Batch: {report.batchNumber}
                      </Typography>
                    )}
                  </Box>
                  {report && (
                    <Chip
                      label={report.overallResult}
                      icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#1a8a4a !important' }} />}
                      sx={{
                        background: 'rgba(46,204,113,0.2)',
                        border: '1px solid rgba(46,204,113,0.4)',
                        color: '#2ECC71',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        letterSpacing: '0.06em',
                      }}
                    />
                  )}
                </Box>

                {/* Parameters */}
                <Box sx={{ px: 0, py: 1 }}>
                  {isLoading && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography sx={{ color: 'var(--text-muted)' }}>Loading latest report...</Typography>
                    </Box>
                  )}

                  {isError && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Lab reports will appear here once published.
                      </Typography>
                    </Box>
                  )}

                  {report && report.parameters?.slice(0, 5).map((param) => (
                    <ParameterRow key={param.name} param={param} />
                  ))}

                  {report && report.parameters?.length > 5 && (
                    <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        +{report.parameters.length - 5} more parameters tested...
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Footer */}
                {report && (
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      background: '#F8FBFF',
                      borderTop: '1px solid #E2EAF4',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Tested by: <strong>{report.labName}</strong> · {report.labCertification}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Button
                        component={Link}
                        to={`/lab-reports/${report.id}`}
                        size="small"
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ borderRadius: 9999, fontSize: '0.78rem', borderColor: '#1B6CA8', color: '#1B6CA8' }}
                      >
                        Full Report
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => labReportService.downloadPDF(report.id, report.batchNumber)}
                        sx={{
                          borderRadius: 9999,
                          fontSize: '0.78rem',
                          background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
                          color: 'white',
                        }}
                      >
                        PDF
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
