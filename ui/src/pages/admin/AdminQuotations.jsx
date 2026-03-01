import { useState } from 'react';
import {
  Box, Typography, Card, Chip, Button, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip,
  TablePagination, Dialog,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import QuotationBuilder from '../../components/admin/QuotationBuilder';
import QuotationPreview from '../../components/admin/QuotationPreview';

const STATUS_STYLES = {
  draft:    { bg: '#F5F5F5',  color: '#666',    label: 'DRAFT' },
  sent:     { bg: '#EEF4FF',  color: '#1565C0', label: 'SENT' },
  accepted: { bg: '#EDFBF0',  color: '#1a8a4a', label: 'ACCEPTED' },
  rejected: { bg: '#FFF0EE',  color: '#c0392b', label: 'REJECTED' },
  expired:  { bg: '#FFF8E1',  color: '#C9A84C', label: 'EXPIRED' },
};

export default function AdminQuotations() {
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [page, setPage]             = useState(0);
  const [rowsPerPage, setRPP]       = useState(10);
  const [builderOpen, setBuilder]   = useState(false);
  const [previewOpen, setPreview]   = useState(false);
  const [editing, setEditing]       = useState(null);   // quotation obj being edited
  const [previewing, setPreviewing] = useState(null);   // quotation obj being previewed
  const [enquiryCtx, setEnquiryCtx] = useState(null);  // pre-fill from enquiry

  const qc = useQueryClient();

  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ['admin-quotations'],
    queryFn: () => api.get('/quotations').then(r => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/quotations/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-quotations']); toast.success('Quotation deleted.'); },
    onError: () => toast.error('Failed to delete quotation.'),
  });

  const filtered = quotations.filter(q => {
    const matchStatus = !statusFilter || q.status === statusFilter;
    const matchSearch = !search || [q.quotationNumber, q.clientName, q.clientEmail, q.clientCompany]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const counts = { draft: 0, sent: 0, accepted: 0, rejected: 0, expired: 0 };
  quotations.forEach(q => { if (counts[q.status] !== undefined) counts[q.status]++; });

  const openNew = (enquiry = null) => {
    setEditing(null);
    setEnquiryCtx(enquiry);
    setBuilder(true);
  };

  const openEdit = (quotation) => {
    setEditing(quotation);
    setEnquiryCtx(null);
    setBuilder(true);
  };

  const openPreview = (quotation) => {
    setPreviewing(quotation);
    setPreview(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
            Quotations
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', mt: 0.5, fontSize: '0.9rem' }}>
            {quotations.length} total — {counts.draft} draft, {counts.sent} sent, {counts.accepted} accepted
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<AddIcon />}
          onClick={() => openNew()}
          sx={{
            background: 'linear-gradient(135deg, #0A2342, #1565C0)',
            borderRadius: 9999, px: 3, py: 1.2, fontWeight: 700,
            boxShadow: '0 4px 16px rgba(10,35,66,0.25)',
          }}
        >
          New Quotation
        </Button>
      </Box>

      {/* Status filter chips */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {[
          { value: '', label: `All (${quotations.length})` },
          ...Object.entries(STATUS_STYLES).map(([v, s]) => ({ value: v, label: `${s.label} (${counts[v] ?? 0})` })),
        ].map(s => (
          <Chip key={s.value} label={s.label} onClick={() => { setStatus(s.value); setPage(0); }}
            sx={{
              cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
              background: statusFilter === s.value ? '#0A2342' : '#F0F4F8',
              color: statusFilter === s.value ? 'white' : '#0A2342',
            }}
          />
        ))}
      </Box>

      {/* Search */}
      <TextField
        size="small" placeholder="Search by quotation #, client name, email, company..."
        value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
        sx={{ mb: 3, width: { xs: '100%', sm: 420 }, '& .MuiOutlinedInput-root': { borderRadius: 9999 } }}
      />

      {/* Table */}
      <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ background: '#F8FBFF' }}>
              <TableRow>
                {['Quote #', 'Client', 'Company', 'Items', 'Total', 'Valid Until', 'Status', 'Created', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#0A2342', py: 1.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 5, color: 'var(--text-muted)' }}>Loading...</TableCell>
                </TableRow>
              ) : paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 8 }}>
                    <Typography sx={{ color: 'var(--text-muted)', mb: 2 }}>No quotations found.</Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={() => openNew()}
                      sx={{ borderRadius: 9999, borderColor: '#1B6CA8', color: '#1B6CA8' }}>
                      Create First Quotation
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                paged.map(q => {
                  const st = STATUS_STYLES[q.status] ?? STATUS_STYLES.draft;
                  const total = q.items?.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0) ?? 0;
                  return (
                    <TableRow key={q.id} sx={{ '&:hover': { background: '#F8FBFF' } }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#1565C0' }}>
                        {q.quotationNumber ?? `QT-${String(q.id).padStart(4, '0')}`}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#0A2342' }}>{q.clientName}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{q.clientEmail}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.82rem' }}>{q.clientCompany || '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.82rem' }}>{q.items?.length ?? 0} item{q.items?.length !== 1 ? 's' : ''}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A2342' }}>
                        ₹{total.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.78rem', color: q.validUntil && new Date(q.validUntil) < new Date() ? '#c0392b' : 'var(--text-muted)' }}>
                        {q.validUntil ? formatDate(q.validUntil) : '—'}
                      </TableCell>
                      <TableCell>
                        <Chip label={st.label} size="small"
                          sx={{ background: st.bg, color: st.color, fontWeight: 700, fontSize: '0.68rem', borderRadius: 9999 }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(q.createdAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.3 }}>
                          <Tooltip title="Preview / Print">
                            <IconButton size="small" onClick={() => openPreview(q)} sx={{ color: '#1B6CA8' }}>
                              <VisibilityIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openEdit(q)} sx={{ color: '#C9A84C' }}>
                              <EditIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Duplicate">
                            <IconButton size="small" onClick={() => openNew({ ...q, id: undefined, status: 'draft' })} sx={{ color: '#9B59B6' }}>
                              <ContentCopyIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => { if (window.confirm('Delete this quotation?')) deleteMutation.mutate(q.id); }} sx={{ color: '#E74C3C' }}>
                              <DeleteIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => { setRPP(+e.target.value); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ borderTop: '1px solid #E2EAF4', fontSize: '0.78rem' }}
        />
      </Card>

      {/* Quotation Builder Dialog */}
      <Dialog open={builderOpen} onClose={() => setBuilder(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 4, maxHeight: '96vh' } }}>
        <QuotationBuilder
          onClose={() => setBuilder(false)}
          editing={editing}
          enquiryContext={enquiryCtx}
          onSaved={() => { setBuilder(false); qc.invalidateQueries(['admin-quotations']); }}
        />
      </Dialog>

      {/* Quotation Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreview(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 4, maxHeight: '96vh' } }}>
        {previewing && (
          <QuotationPreview quotation={previewing} onClose={() => setPreview(false)} />
        )}
      </Dialog>
    </Box>
  );
}
