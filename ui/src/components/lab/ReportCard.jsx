import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReportStatusBadge from './ReportStatusBadge';
import { formatDate } from '../../utils/formatDate';
import { labReportService } from '../../services/labReportService';

export default function ReportCard({ report, index = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
      <Card
        sx={{
          borderRadius: 3, border: '1px solid #E2EAF4',
          boxShadow: '0 4px 16px rgba(10,35,66,0.06)',
          transition: 'all 0.3s ease',
          '&:hover': { borderColor: '#1B6CA8', boxShadow: '0 12px 40px rgba(10,35,66,0.12)', transform: 'translateY(-4px)' },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.05rem', color: '#0A2342', mb: 0.4 }}>
                {report.reportId}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <CalendarMonthIcon sx={{ fontSize: 13, color: 'var(--text-muted)' }} />
                <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {formatDate(report.manufacturingDate)}
                </Typography>
              </Box>
            </Box>
            <ReportStatusBadge status={report.overallResult} />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
            <Chip label={`Batch: ${report.batchNumber}`} size="small"
              sx={{ background: '#EEF4FF', color: '#1B6CA8', fontWeight: 600, fontSize: '0.72rem', borderRadius: 9999 }} />
            {report.bottleSize && (
              <Chip label={report.bottleSize} size="small"
                sx={{ background: '#F5F9FF', color: '#0A2342', fontWeight: 600, fontSize: '0.72rem', borderRadius: 9999 }} />
            )}
            <Chip label={`${report.parameters?.length ?? 0} Parameters`} size="small"
              sx={{ background: '#F5F9FF', color: '#5C6B85', fontSize: '0.72rem', borderRadius: 9999 }} />
          </Box>

          <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)', mb: 2.5, lineHeight: 1.6 }}>
            {report.labName} · {report.labCertification}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button component={Link} to={`/lab-reports/${report.id}`} size="small" variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 9999, fontSize: '0.78rem', borderColor: '#1B6CA8', color: '#1B6CA8', flex: 1 }}>
              View Report
            </Button>
            <Button size="small" variant="contained" startIcon={<DownloadIcon />}
              onClick={() => labReportService.downloadPDF(report.id, report.batchNumber)}
              sx={{ borderRadius: 9999, fontSize: '0.78rem', background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white' }}>
              PDF
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
