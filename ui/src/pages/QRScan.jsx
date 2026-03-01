import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, CircularProgress, Alert, Button, Chip,
  Card, CardContent, Divider,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion } from 'framer-motion';
import api from '../services/api';
import { labReportService } from '../services/labReportService';
import { formatDate } from '../utils/formatDate';

export default function QRScan() {
  const { batchNumber } = useParams();
  const navigate = useNavigate();
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!batchNumber) return;
    setLoading(true);
    api.get(`/lab-reports/batch/${batchNumber}`)
      .then(r => {
        const d = r.data?.data;
        if (Array.isArray(d)) setReport(d[0] ?? null);
        else setReport(d);
      })
      .catch(err => setError(err.message || 'Report not found for this batch.'))
      .finally(() => setLoading(false));
  }, [batchNumber]);

  const handleDownloadPDF = async () => {
    if (!report?.id) return;
    try {
      await labReportService.downloadPDF(report.id, report.batchNumber);
    } catch {
      // ignore
    }
  };

  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FBFF' }}>
      <CircularProgress sx={{ color: '#1B6CA8' }} size={48} />
    </Box>
  );

  if (error || !report) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FBFF', p: 2 }}>
      <Box sx={{ textAlign: 'center', maxWidth: 380 }}>
        <QrCodeScannerIcon sx={{ fontSize: 64, color: '#E2EAF4', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0A2342', mb: 1 }}>Report Not Found</Typography>
        <Typography sx={{ color: 'var(--text-muted)', mb: 3 }}>
          {error || `No lab report found for batch "${batchNumber}".`}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/lab-reports')} startIcon={<ArrowBackIcon />}
          sx={{ borderColor: '#1B6CA8', color: '#1B6CA8', borderRadius: 9999 }}>
          Browse Lab Reports
        </Button>
      </Box>
    </Box>
  );

  const isPassed = report.overallResult === 'PASS';

  return (
    <>
      <Helmet>
        <title>Batch {report.batchNumber} Lab Report | Sierra Pure</title>
        <meta name="description" content={`Sierra Pure lab report for batch ${report.batchNumber} — ${report.overallResult}`} />
      </Helmet>

      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 9999, px: 2, py: 0.8, mb: 2 }}>
              <QrCodeScannerIcon sx={{ color: '#4FC3F7', fontSize: 18 }} />
              <Typography sx={{ color: '#4FC3F7', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em' }}>QR VERIFIED REPORT</Typography>
            </Box>
            <Typography variant="h2" sx={{ color: 'white', fontSize: { xs: '1.8rem', md: '2.6rem' }, mb: 1 }}>
              Batch #{report.batchNumber}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem' }}>
              Manufactured: {formatDate(report.manufacturingDate)} · {report.bottleSize}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      <Box sx={{ background: '#F8FBFF', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="md">

          {/* Overall Result */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card sx={{ mb: 3, borderRadius: 3, border: `2px solid ${isPassed ? '#2ECC71' : '#E74C3C'}`, boxShadow: `0 8px 32px ${isPassed ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)'}` }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                {isPassed
                  ? <CheckCircleIcon sx={{ fontSize: 40, color: '#2ECC71' }} />
                  : <CancelIcon sx={{ fontSize: 40, color: '#E74C3C' }} />
                }
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: isPassed ? '#1a8a4a' : '#c0392b' }}>
                    Overall Result: {report.overallResult}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Tested by {report.testedBy} · {report.labName}
                  </Typography>
                </Box>
                <Button variant="contained" size="small" startIcon={<DownloadIcon />} onClick={handleDownloadPDF}
                  sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', borderRadius: 9999, fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  PDF Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Parameters Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2, background: '#F0F6FF', borderBottom: '1px solid #E2EAF4' }}>
                <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.9rem' }}>
                  Test Parameters — {report.parameters?.length} tests conducted
                </Typography>
              </Box>
              {report.parameters?.map((p, i) => (
                <Box key={i}>
                  <Box sx={{ px: 3, py: 1.8, display: 'flex', alignItems: 'center', gap: 2, background: i % 2 === 0 ? 'white' : '#FAFCFF' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: '#0A2342', fontSize: '0.88rem' }}>{p.name}</Typography>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.76rem', mt: 0.3 }}>
                        Method: {p.method} · Limit: {p.permissibleLimit}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.9rem', minWidth: 80, textAlign: 'right' }}>
                      {p.value} {p.unit}
                    </Typography>
                    <Chip
                      label={p.status}
                      size="small"
                      sx={{
                        minWidth: 54, fontWeight: 700, fontSize: '0.7rem', borderRadius: 9999,
                        background: p.status === 'PASS' ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                        color: p.status === 'PASS' ? '#1a8a4a' : '#c0392b',
                      }}
                    />
                  </Box>
                  {i < report.parameters.length - 1 && <Divider sx={{ borderColor: '#EEF3FA' }} />}
                </Box>
              ))}
            </Card>
          </motion.div>

          {/* Lab Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card sx={{ mt: 3, borderRadius: 3, border: '1px solid #E2EAF4' }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, color: '#0A2342', mb: 2, fontSize: '0.9rem' }}>Certification Details</Typography>
                {[
                  ['Lab Name', report.labName],
                  ['Certification', report.labCertification],
                  ['Tested By', report.testedBy],
                  ['Bottle Size', report.bottleSize],
                  ['Remarks', report.remarks || '—'],
                ].map(([k, v]) => (
                  <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{k}</Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#0A2342', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => navigate('/lab-reports')} startIcon={<ArrowBackIcon />}
              sx={{ borderColor: '#1B6CA8', color: '#1B6CA8', borderRadius: 9999, fontWeight: 700 }}>
              All Lab Reports
            </Button>
            <Button variant="contained" onClick={handleDownloadPDF} startIcon={<DownloadIcon />}
              sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', borderRadius: 9999, fontWeight: 700 }}>
              Download PDF
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
