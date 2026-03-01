import { useState } from 'react';
import {
  Box, Typography, Card, Button, Chip, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Switch, FormControlLabel, Select, MenuItem,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { labReportService } from '../../services/labReportService';

const PARAM_TEMPLATE = { name: '', value: '', unit: '', permissibleLimit: '', method: '', status: 'PASS' };
const DEFAULT_PARAMS = [
  { name: 'pH Level', unit: '', permissibleLimit: '6.5 – 8.5', method: 'IS 3025 Part 22', value: '', status: 'PASS' },
  { name: 'Total Dissolved Solids (TDS)', unit: 'mg/L', permissibleLimit: '≤ 500', method: 'IS 3025 Part 16', value: '', status: 'PASS' },
  { name: 'Turbidity', unit: 'NTU', permissibleLimit: '≤ 1', method: 'IS 3025 Part 10', value: '', status: 'PASS' },
  { name: 'Total Hardness (as CaCO₃)', unit: 'mg/L', permissibleLimit: '≤ 300', method: 'IS 3025 Part 21', value: '', status: 'PASS' },
  { name: 'Total Coliform', unit: 'MPN/100mL', permissibleLimit: 'Absent', method: 'IS 1622', value: 'Absent', status: 'PASS' },
  { name: 'E. Coli / Faecal Coliform', unit: 'MPN/100mL', permissibleLimit: 'Absent', method: 'IS 1622', value: 'Absent', status: 'PASS' },
];

function ReportDialog({ report, open, onClose }) {
  const qc = useQueryClient();
  const isNew = !report;
  const [form, setForm] = useState(report ? { ...report } : {
    batchNumber: '', manufacturingDate: '', bottleSize: '500ml',
    labName: 'Aqua Analytics Lab, Pune', labCertification: 'NABL Accredited (CC-2874)',
    testedBy: 'Dr. Priya Sharma', overallResult: 'PASS', isPublished: true, remarks: '',
    parameters: DEFAULT_PARAMS.map(p => ({ ...p })),
  });

  const save = useMutation({
    mutationFn: (data) => isNew
      ? api.post('/lab-reports', data).then(r => r.data.data)
      : api.put(`/lab-reports/${report.id}`, data).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries(['admin-reports']); toast.success(isNew ? 'Report created!' : 'Report updated!'); onClose(); },
    onError: () => toast.error('Save failed'),
  });

  const updateParam = (i, key, val) => setForm(f => {
    const params = [...f.parameters];
    params[i] = { ...params[i], [key]: val };
    return { ...f, parameters: params };
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#0A2342' }}>{isNew ? 'Create New Lab Report' : `Edit Report — ${report.reportId}`}</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        <Grid container spacing={2} sx={{ pt: 1, mb: 2 }}>
          <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Batch Number *" value={form.batchNumber} onChange={e => setForm(f => ({ ...f, batchNumber: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Manufacturing Date" type="date" InputLabelProps={{ shrink: true }} value={form.manufacturingDate?.split('T')[0] || ''} onChange={e => setForm(f => ({ ...f, manufacturingDate: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" select label="Bottle Size" value={form.bottleSize || '500ml'} onChange={e => setForm(f => ({ ...f, bottleSize: e.target.value }))} SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              {['200ml', '500ml', '1000ml'].map(s => <option key={s} value={s}>{s}</option>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth size="small" label="Lab Name" value={form.labName} onChange={e => setForm(f => ({ ...f, labName: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth size="small" label="Tested By" value={form.testedBy} onChange={e => setForm(f => ({ ...f, testedBy: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12}><TextField fullWidth size="small" label="Remarks" value={form.remarks || ''} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch checked={form.overallResult === 'PASS'} onChange={e => setForm(f => ({ ...f, overallResult: e.target.checked ? 'PASS' : 'FAIL' }))} />} label={`Result: ${form.overallResult}`} />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />} label={form.isPublished ? 'Published' : 'Draft'} />
          </Grid>
        </Grid>

        {/* Parameters */}
        <Typography sx={{ fontWeight: 700, color: '#0A2342', mb: 1.5, fontSize: '0.92rem' }}>Test Parameters ({form.parameters.length})</Typography>
        {form.parameters.map((p, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <TextField size="small" label="Parameter" value={p.name} onChange={e => updateParam(i, 'name', e.target.value)} sx={{ flex: 2, minWidth: 140, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.8rem' } }} />
            <TextField size="small" label="Value" value={p.value} onChange={e => updateParam(i, 'value', e.target.value)} sx={{ flex: 1, minWidth: 80, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.8rem' } }} />
            <TextField size="small" label="Unit" value={p.unit} onChange={e => updateParam(i, 'unit', e.target.value)} sx={{ flex: 1, minWidth: 70, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.8rem' } }} />
            <Select size="small" value={p.status} onChange={e => updateParam(i, 'status', e.target.value)}
              sx={{ minWidth: 80, borderRadius: 2, fontSize: '0.78rem', color: p.status === 'PASS' ? '#1a8a4a' : '#c0392b', fontWeight: 700 }}>
              <MenuItem value="PASS">PASS</MenuItem>
              <MenuItem value="FAIL">FAIL</MenuItem>
            </Select>
          </Box>
        ))}
        <Button size="small" startIcon={<AddIcon />} onClick={() => setForm(f => ({ ...f, parameters: [...f.parameters, { ...PARAM_TEMPLATE }] }))}
          sx={{ mt: 1, color: '#1B6CA8', fontWeight: 600 }}>
          Add Parameter
        </Button>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Cancel</Button>
        <Button variant="contained" onClick={() => save.mutate(form)} disabled={save.isPending || !form.batchNumber}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
          {save.isPending ? 'Saving...' : isNew ? 'Create Report' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminReports() {
  const [dialog, setDialog] = useState(null);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => api.get('/lab-reports?page=0&size=50').then(r => r.data.data),
  });
  const reports = data?.content ?? [];

  const togglePublish = useMutation({
    mutationFn: ({ id, current }) => api.patch(`/lab-reports/${id}/publish`, { isPublished: !current }).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries(['admin-reports']); toast.success('Visibility updated'); },
    onError: () => toast.error('Failed to update'),
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
            Manage Lab Reports
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', mt: 0.5 }}>
            {reports.length} reports · Create, edit, publish/unpublish, and download PDFs.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog('new')}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
          New Report
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ background: '#F8FBFF' }}>
              <TableRow>
                {['Report ID', 'Batch', 'Date', 'Size', 'Lab', 'Result', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#0A2342', py: 1.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: 'var(--text-muted)' }}>Loading...</TableCell></TableRow>
              ) : reports.map((r) => (
                <TableRow key={r.id} sx={{ '&:hover': { background: '#F8FBFF' } }}>
                  <TableCell sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B6CA8' }}>{r.reportId}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{r.batchNumber}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{formatDate(r.manufacturingDate)}</TableCell>
                  <TableCell><Chip label={r.bottleSize} size="small" sx={{ fontSize: '0.65rem', background: '#EEF4FF', color: '#1B6CA8', borderRadius: 9999 }} /></TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.labName}</TableCell>
                  <TableCell>
                    <Chip label={r.overallResult} size="small"
                      sx={{ fontSize: '0.65rem', fontWeight: 700, borderRadius: 9999,
                        background: r.overallResult === 'PASS' ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                        color: r.overallResult === 'PASS' ? '#1a8a4a' : '#c0392b' }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={r.isPublished ? 'Published' : 'Draft'} size="small"
                      sx={{ fontSize: '0.65rem', fontWeight: 700, borderRadius: 9999,
                        background: r.isPublished ? 'rgba(46,204,113,0.1)' : '#F0F4F8',
                        color: r.isPublished ? '#1a8a4a' : '#5C6B85' }} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => setDialog(r)}><EditIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                      <Tooltip title={r.isPublished ? 'Unpublish' : 'Publish'}>
                        <IconButton size="small" onClick={() => togglePublish.mutate({ id: r.id, current: r.isPublished })}>
                          {r.isPublished ? <VisibilityOffIcon sx={{ fontSize: 15 }} /> : <VisibilityIcon sx={{ fontSize: 15 }} />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton size="small" onClick={() => labReportService.downloadPDF(r.id, r.batchNumber)}>
                          <DownloadIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {dialog && (
        <ReportDialog report={dialog === 'new' ? null : dialog} open onClose={() => setDialog(null)} />
      )}
    </Box>
  );
}
