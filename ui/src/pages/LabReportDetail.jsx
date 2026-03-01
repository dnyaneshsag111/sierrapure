import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box, Container, Typography, Grid, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Divider, Skeleton, Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import VerifiedIcon from '@mui/icons-material/Verified';
import ScienceIcon from '@mui/icons-material/Science';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QRCode from 'react-qr-code';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { labReportService } from '../services/labReportService';

export default function LabReportDetail() {
  const { id, batchNumber } = useParams();

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['lab-report', id || batchNumber],
    queryFn: () => (id ? labReportService.getById(id) : labReportService.getByBatch(batchNumber)),
    retry: 1,
  });

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `Sierra Pure Lab Report - ${report?.batchNumber}`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (report) {
      labReportService.downloadPDF(report.id, report.batchNumber);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 8, background: '#F8FBFF', minHeight: '80vh' }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4, mb: 3 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
        </Container>
      </Box>
    );
  }

  if (isError || !report) {
    return (
      <Box sx={{ py: 10, background: '#F8FBFF', minHeight: '80vh' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <ScienceIcon sx={{ fontSize: 64, color: '#E2EAF4', mb: 2 }} />
          <Typography variant="h4" sx={{ color: '#0A2342', mb: 2 }}>
            Report Not Found
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', mb: 4 }}>
            This lab report is not available or the batch number is invalid. Please check and try again.
          </Typography>
          <Button component={Link} to="/lab-reports" startIcon={<ArrowBackIcon />} variant="contained"
            sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
            All Reports
          </Button>
        </Container>
      </Box>
    );
  }

  const isPass = report.overallResult === 'PASS';

  return (
    <>
      <Helmet>
        <title>Lab Report {report.reportId} | Sierra Pure</title>
        <meta name="description" content={`Sierra Pure water quality lab report for batch ${report.batchNumber} on ${report.manufacturingDate}. All parameters tested - ${report.overallResult}.`} />
      </Helmet>

      {/* Hero header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0A2342 0%, #1B6CA8 100%)',
          pt: { xs: 4, md: 6 },
          pb: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Button
            component={Link}
            to="/lab-reports"
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'rgba(255,255,255,0.75)', mb: 3, '&:hover': { color: 'white' } }}
          >
            All Reports
          </Button>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Chip
                  label={report.overallResult}
                  icon={isPass ? <VerifiedIcon sx={{ fontSize: '16px !important', color: '#2ECC71 !important' }} /> : undefined}
                  sx={{
                    mb: 2,
                    background: isPass ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)',
                    border: `1px solid ${isPass ? 'rgba(46,204,113,0.5)' : 'rgba(231,76,60,0.5)'}`,
                    color: isPass ? '#2ECC71' : '#E74C3C',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: { xs: '2rem', md: '2.8rem' },
                    mb: 1.5,
                  }}
                >
                  {report.reportId}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {[
                    { icon: <CalendarMonthIcon sx={{ fontSize: 16 }} />, label: 'Manufacturing Date', value: dayjs(report.manufacturingDate).format('DD MMMM YYYY') },
                    { label: 'Batch Number', value: report.batchNumber },
                    { label: 'Tested By', value: report.testedBy || 'N/A' },
                  ].map((item) => (
                    <Box key={item.label}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.1em', mb: 0.3 }}>
                        {item.label.toUpperCase()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 600 }}>
                        {item.icon}
                        {item.value}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Action buttons */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{
                    background: 'linear-gradient(135deg, #4FC3F7, #81D4FA)',
                    color: '#0A2342',
                    fontWeight: 700,
                    borderRadius: 9999,
                    py: 1.4,
                  }}
                >
                  Download PDF
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.35)',
                    borderRadius: 9999,
                    py: 1.4,
                    '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  Share Report
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Wave */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      {/* Report Body */}
      <Box sx={{ py: 6, background: '#F8FBFF' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Parameters table */}
            <Grid item xs={12} md={8}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Box
                  sx={{
                    background: 'white',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(10,35,66,0.08)',
                    border: '1px solid #E2EAF4',
                    overflow: 'hidden',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      px: 3,
                      py: 2.5,
                      background: 'linear-gradient(135deg, #F0F7FF, #F8FBFF)',
                      borderBottom: '1px solid #E2EAF4',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <ScienceIcon sx={{ color: '#1B6CA8' }} />
                    <Typography variant="h6" sx={{ color: '#0A2342', fontWeight: 700 }}>
                      Test Parameters
                    </Typography>
                    <Chip
                      label={`${report.parameters?.filter((p) => p.status === 'PASS').length}/${report.parameters?.length} PASSED`}
                      size="small"
                      sx={{ background: 'rgba(46,204,113,0.12)', color: '#1a8a4a', fontWeight: 600, border: '1px solid rgba(46,204,113,0.3)', borderRadius: 9999, ml: 'auto' }}
                    />
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ background: '#F8FBFF' }}>
                          {['Parameter', 'Value', 'Unit', 'Permissible Limit', 'Status'].map((h) => (
                            <TableCell
                              key={h}
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                color: '#0A2342',
                                letterSpacing: '0.06em',
                                py: 1.5,
                                borderBottom: '2px solid #E2EAF4',
                              }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {report.parameters?.map((param, i) => {
                          const p = param.status === 'PASS';
                          return (
                            <TableRow
                              key={param.name}
                              sx={{
                                background: i % 2 === 0 ? 'white' : '#FAFCFF',
                                '&:hover': { background: '#F0F7FF' },
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600, color: '#0A2342', fontSize: '0.88rem', py: 1.8 }}>
                                {param.name}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 700, color: '#1B6CA8', fontSize: '0.95rem' }}>
                                {param.value}
                              </TableCell>
                              <TableCell sx={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                {param.unit || '—'}
                              </TableCell>
                              <TableCell sx={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                {param.permissibleLimit}
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1.5,
                                    py: 0.4,
                                    borderRadius: 9999,
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    background: p ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                                    color: p ? '#1a8a4a' : '#c0392b',
                                    border: `1px solid ${p ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                                  }}
                                >
                                  {p ? '✓' : '✗'} {param.status}
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Overall result footer */}
                  <Box
                    sx={{
                      px: 3,
                      py: 2.5,
                      background: isPass
                        ? 'linear-gradient(135deg, rgba(46,204,113,0.08), rgba(46,204,113,0.03))'
                        : 'rgba(231,76,60,0.05)',
                      borderTop: '1px solid #E2EAF4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.95rem' }}>
                      Overall Water Quality Result
                    </Typography>
                    <Box
                      sx={{
                        px: 2.5,
                        py: 0.8,
                        borderRadius: 9999,
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        background: isPass ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                        color: isPass ? '#1a8a4a' : '#c0392b',
                        border: `2px solid ${isPass ? 'rgba(46,204,113,0.5)' : 'rgba(231,76,60,0.5)'}`,
                      }}
                    >
                      {isPass ? '✓ ' : '✗ '}{report.overallResult}
                    </Box>
                  </Box>
                </Box>

                {report.remarks && (
                  <Alert severity="info" sx={{ borderRadius: 3 }}>
                    <Typography sx={{ fontSize: '0.88rem' }}>
                      <strong>Remarks:</strong> {report.remarks}
                    </Typography>
                  </Alert>
                )}
              </motion.div>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                {/* Lab Info */}
                <Box
                  sx={{
                    background: 'white',
                    borderRadius: 4,
                    border: '1px solid #E2EAF4',
                    boxShadow: '0 8px 32px rgba(10,35,66,0.08)',
                    p: 3,
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#0A2342', fontWeight: 700, mb: 2.5 }}>
                    Laboratory Details
                  </Typography>
                  {[
                    { label: 'Lab Name', value: report.labName },
                    { label: 'Certification', value: report.labCertification },
                    { label: 'Tested By', value: report.testedBy },
                    { label: 'Report Date', value: dayjs(report.reportDate).format('DD MMM YYYY') },
                    { label: 'Bottle Size', value: report.bottleSize || 'All sizes' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ mb: 1.8 }}>
                      <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em', mb: 0.3 }}>
                        {item.label.toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0A2342' }}>
                        {item.value || 'N/A'}
                      </Typography>
                      <Divider sx={{ mt: 1.5, borderColor: '#F0F4F8' }} />
                    </Box>
                  ))}
                </Box>

                {/* QR Code */}
                <Box
                  sx={{
                    background: 'white',
                    borderRadius: 4,
                    border: '1px solid #E2EAF4',
                    boxShadow: '0 8px 32px rgba(10,35,66,0.08)',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#0A2342', fontWeight: 700, mb: 1, fontSize: '0.95rem' }}>
                    Scan to Verify
                  </Typography>
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.78rem', mb: 2.5 }}>
                    This QR code is printed on the bottle cap
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      background: 'white',
                      borderRadius: 3,
                      border: '1px solid #E2EAF4',
                      boxShadow: '0 4px 12px rgba(10,35,66,0.08)',
                    }}
                  >
                    <QRCode
                      value={report.qrCodeData || window.location.href}
                      size={160}
                      fgColor="#0A2342"
                    />
                  </Box>
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.72rem', mt: 1.5 }}>
                    Batch: {report.batchNumber}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
