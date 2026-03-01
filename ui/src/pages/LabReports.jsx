import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  TextField, Button, Chip, Pagination, InputAdornment, Skeleton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedIcon from '@mui/icons-material/Verified';
import dayjs from 'dayjs';
import { labReportService } from '../services/labReportService';

function ReportCard({ report, index }) {
  const isPass = report.overallResult === 'PASS';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid #E2EAF4',
          boxShadow: '0 4px 16px rgba(10,35,66,0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#1B6CA8',
            boxShadow: '0 12px 40px rgba(10,35,66,0.12)',
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#0A2342',
                  mb: 0.4,
                }}
              >
                {report.reportId}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CalendarMonthIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
                <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {dayjs(report.manufacturingDate).format('DD MMMM YYYY')}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={report.overallResult}
              icon={isPass ? <VerifiedIcon sx={{ fontSize: '14px !important' }} /> : undefined}
              size="small"
              sx={{
                background: isPass ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                color: isPass ? '#1a8a4a' : '#c0392b',
                border: `1px solid ${isPass ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                fontWeight: 700,
                fontSize: '0.75rem',
                '& .MuiChip-icon': { color: '#1a8a4a !important' },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
            <Box
              sx={{
                px: 1.5,
                py: 0.4,
                background: '#F0F7FF',
                borderRadius: 9999,
                fontSize: '0.75rem',
                color: '#1B6CA8',
                fontWeight: 600,
              }}
            >
              Batch: {report.batchNumber}
            </Box>
            {report.bottleSize && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.4,
                  background: '#F8FBFF',
                  border: '1px solid #E2EAF4',
                  borderRadius: 9999,
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                }}
              >
                {report.bottleSize}
              </Box>
            )}
          </Box>

          <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-muted)', mb: 2.5 }}>
            <strong style={{ color: '#4A5568' }}>{report.labName}</strong> · {report.labCertification}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              component={Link}
              to={`/lab-reports/${report.id}`}
              variant="outlined"
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 9999, fontSize: '0.78rem', borderColor: '#1B6CA8', color: '#1B6CA8', flex: 1 }}
            >
              View Full Report
            </Button>
            <Button
              variant="contained"
              size="small"
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
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function LabReports() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['lab-reports', page - 1],
    queryFn: () => labReportService.getAll(page - 1, 12),
    keepPreviousData: true,
  });

  const { data: searchResult, isLoading: isSearching } = useQuery({
    queryKey: ['lab-report-batch', search],
    queryFn: () => labReportService.getByBatch(search),
    enabled: !!search,
    retry: 0,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim().toUpperCase());
  };

  const reports = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <>
      <Helmet>
        <title>Lab Reports | Sierra Pure</title>
        <meta name="description" content="View all daily water quality lab reports for Sierra Pure mineral water. Download PDF reports and verify batch purity." />
      </Helmet>

      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0A2342 0%, #1B6CA8 100%)',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute', top: '-30%', right: '-10%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'rgba(79,195,247,0.08)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ScienceIcon sx={{ fontSize: 48, color: '#4FC3F7' }} />
          </Box>
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              fontFamily: "'Playfair Display', serif",
              mb: 2,
            }}
          >
            Lab Quality Reports
          </Typography>
          <Typography
            sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', mb: 4, lineHeight: 1.8 }}
          >
            Every batch. Every day. Tested and published.
            Search by batch number or scan the QR code on your bottle.
          </Typography>

          {/* Search */}
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1.5, maxWidth: 500, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Enter Batch Number (e.g. BATCH-20260228-A1)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                  </InputAdornment>
                ),
                sx: {
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  borderRadius: 9999,
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.25)', borderRadius: 9999 },
                  '& input::placeholder': { color: 'rgba(255,255,255,0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: 9999,
                px: 3,
                background: 'linear-gradient(135deg, #4FC3F7, #81D4FA)',
                color: '#0A2342',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Wave */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      {/* Content */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: '#F8FBFF', minHeight: '50vh' }}>
        <Container maxWidth="xl">
          {/* Search result */}
          {search && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ color: '#0A2342', fontWeight: 700 }}>
                  Search Result for "{search}"
                </Typography>
                <Button
                  variant="text"
                  onClick={() => { setSearch(''); setSearchInput(''); }}
                  sx={{ color: '#1B6CA8' }}
                >
                  Clear search
                </Button>
              </Box>
              {isSearching ? (
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
              ) : searchResult ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <ReportCard report={searchResult} index={0} />
                  </Grid>
                </Grid>
              ) : (
                <Typography sx={{ color: 'var(--text-muted)' }}>
                  No report found for batch "{search}". Please check the batch number and try again.
                </Typography>
              )}
            </Box>
          )}

          {/* All Reports */}
          {!search && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#0A2342', fontWeight: 700 }}>
                  All Lab Reports
                </Typography>
                {data?.totalElements && (
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {data.totalElements} reports published
                  </Typography>
                )}
              </Box>

              {isLoading ? (
                <Grid container spacing={3}>
                  {[...Array(6)].map((_, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
                    </Grid>
                  ))}
                </Grid>
              ) : reports.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <ScienceIcon sx={{ fontSize: 60, color: '#E2EAF4', mb: 2 }} />
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                    No lab reports published yet. Check back soon.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {reports.map((report, i) => (
                    <Grid item xs={12} sm={6} md={4} key={report.id}>
                      <ReportCard report={report} index={i} />
                    </Grid>
                  ))}
                </Grid>
              )}

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': { borderRadius: 9999, fontWeight: 600 },
                      '& .Mui-selected': {
                        background: 'linear-gradient(135deg, #0A2342, #1B6CA8) !important',
                        color: 'white !important',
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
