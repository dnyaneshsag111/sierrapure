import { useState } from 'react';
import {
  Box, Typography, Card, Chip, TextField, Button, Select,
  MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Collapse,
  Divider, Grid, TablePagination, Dialog,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { SEGMENTS, ENQUIRY_STATUS } from '../../utils/constants';
import QuotationBuilder from '../../components/admin/QuotationBuilder';

const STATUS_STYLES = {
  new:       { bg: '#EEF4FF', color: '#1565C0', label: 'NEW' },
  contacted: { bg: '#FFF8E1', color: '#C9A84C', label: 'CONTACTED' },
  closed:    { bg: '#EDFBF0', color: '#1a8a4a', label: 'CLOSED' },
};

function EnquiryRow({ enquiry, onCreateQuote }) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const style = STATUS_STYLES[enquiry.status] ?? STATUS_STYLES.new;
  const seg = SEGMENTS.find(s => s.value === enquiry.segment);

  const updateStatus = useMutation({
    mutationFn: (status) => api.patch(`/contact/${enquiry.id}/status`, { status }).then(r => r.data.data),
    onSuccess: () => qc.invalidateQueries(['admin-enquiries']),
  });

  return (
    <>
      <TableRow sx={{ '&:hover': { background: '#F8FBFF' }, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <TableCell sx={{ py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0A2342' }}>{enquiry.name}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{enquiry.email}</Typography>
        </TableCell>
        <TableCell sx={{ fontSize: '0.8rem' }}>{enquiry.phone || '—'}</TableCell>
        <TableCell sx={{ fontSize: '0.8rem' }}>{enquiry.company || '—'}</TableCell>
        <TableCell>
          {seg && <Chip label={`${seg.icon} ${seg.label}`} size="small" sx={{ fontSize: '0.68rem', background: `${seg.color}15`, color: seg.color, fontWeight: 600 }} />}
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
            {enquiry.bottleSizes?.map(s => <Chip key={s} label={s} size="small" sx={{ fontSize: '0.65rem', background: '#EEF4FF', color: '#1B6CA8', borderRadius: 9999 }} />)}
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(enquiry.createdAt)}</TableCell>
        <TableCell onClick={e => e.stopPropagation()}>
          <Select size="small" value={enquiry.status} onChange={e => updateStatus.mutate(e.target.value)}
            sx={{ fontSize: '0.75rem', fontWeight: 700, color: style.color, background: style.bg, borderRadius: 9999,
              '& .MuiSelect-select': { py: 0.5, px: 1.5 }, '& fieldset': { border: 'none' } }}>
            {ENQUIRY_STATUS.map(s => <MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.78rem' }}>{s.label}</MenuItem>)}
          </Select>
        </TableCell>
        <TableCell>
          <IconButton size="small">{open ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}</IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={8} sx={{ p: 0, border: 'none' }}>
          <Collapse in={open}>
            <Box sx={{ px: 4, py: 2.5, background: '#F8FBFF', borderBottom: '1px solid #E2EAF4' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0A2342', mb: 0.5 }}>Message</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {enquiry.message || 'No message provided.'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Custom Label?</Typography>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: enquiry.customLabel ? '#1a8a4a' : '#5C6B85' }}>
                        {enquiry.customLabel ? 'Yes' : 'No'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Submitted: {formatDate(enquiry.createdAt, 'DD MMM YYYY, hh:mm A')}
                    </Typography>
                    <Divider />
                    <Button
                      size="small" variant="contained"
                      startIcon={<RequestQuoteIcon sx={{ fontSize: 16 }} />}
                      onClick={(e) => { e.stopPropagation(); onCreateQuote(enquiry); }}
                      sx={{
                        mt: 0.5, borderRadius: 9999, fontWeight: 700, fontSize: '0.78rem',
                        background: 'linear-gradient(135deg, #0A2342, #1565C0)',
                        boxShadow: '0 4px 12px rgba(10,35,66,0.2)',
                      }}
                    >
                      Create Quotation
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function AdminEnquiries() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [enquiryCtx, setEnquiryCtx]   = useState(null);

  const qc = useQueryClient();

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ['admin-enquiries'],
    queryFn: () => api.get('/contact').then(r => r.data.data),
  });

  const filtered = enquiries.filter(e => {
    const matchStatus = !statusFilter || e.status === statusFilter;
    const matchSearch = !search || [e.name, e.email, e.company, e.segment].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const counts = { new: 0, contacted: 0, closed: 0 };
  enquiries.forEach(e => { if (counts[e.status] !== undefined) counts[e.status]++; });

  const handleCreateQuote = (enquiry) => {
    setEnquiryCtx(enquiry);
    setBuilderOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', mb: 0.5, fontFamily: "'Playfair Display', serif" }}>
        Enquiries
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)', mb: 3, fontSize: '0.9rem' }}>
        {enquiries.length} total — {counts.new} new, {counts.contacted} contacted, {counts.closed} closed
      </Typography>

      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {[{ value: '', label: `All (${enquiries.length})` }, ...ENQUIRY_STATUS.map(s => ({ ...s, label: `${s.label} (${counts[s.value] ?? 0})` }))].map(s => (
          <Chip key={s.value} label={s.label} onClick={() => setStatusFilter(s.value)}
            sx={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
              background: statusFilter === s.value ? '#0A2342' : '#F0F4F8',
              color: statusFilter === s.value ? 'white' : '#0A2342' }} />
        ))}
      </Box>

      {/* Search */}
      <TextField size="small" placeholder="Search by name, email, company, segment..."
        value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
        sx={{ mb: 2.5, width: { xs: '100%', sm: 380 }, '& .MuiOutlinedInput-root': { borderRadius: 9999 } }} />

      <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ background: '#F8FBFF' }}>
              <TableRow>
                {['Name / Email', 'Phone', 'Company', 'Segment', 'Bottle Sizes', 'Date', 'Status', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#0A2342', py: 1.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 5, color: 'var(--text-muted)' }}>Loading...</TableCell></TableRow>
                : paged.length === 0
                  ? <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 5, color: 'var(--text-muted)' }}>No enquiries found.</TableCell></TableRow>
                  : paged.map(e => <EnquiryRow key={e.id} enquiry={e} onCreateQuote={handleCreateQuote} />)
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ borderTop: '1px solid #E2EAF4', fontSize: '0.78rem' }}
        />
      </Card>

      {/* Quotation Builder — pre-filled from enquiry */}
      <Dialog open={builderOpen} onClose={() => setBuilderOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 4, maxHeight: '96vh' } }}>
        <QuotationBuilder
          enquiryContext={enquiryCtx}
          onClose={() => setBuilderOpen(false)}
          onSaved={() => { setBuilderOpen(false); qc.invalidateQueries(['admin-quotations']); }}
        />
      </Dialog>
    </Box>
  );
}
