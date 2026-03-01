import { useState, useRef } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Avatar, Chip, Switch, FormControlLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, CircularProgress,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/CloudUpload';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { SEGMENTS } from '../../utils/constants';

const EMPTY_CLIENT = { name: '', segment: 'hotel', location: '', description: '', testimonial: '', bottleSizeUsed: '500ml', isFeatured: false, isActive: true, sortOrder: 99 };

function ClientDialog({ client, open, onClose }) {
  const qc = useQueryClient();
  const isNew = !client?.id;
  const [form, setForm] = useState(client ? { ...client } : { ...EMPTY_CLIENT });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const f = (key) => e => setForm(p => ({ ...p, [key]: e.target.value }));

  const save = useMutation({
    mutationFn: async (data) => {
      const res = isNew
        ? await api.post('/clients', data)
        : await api.put(`/clients/${client.id}`, data);
      // Upload logo if selected
      if (logoFile && res.data.data.id) {
        const fd = new FormData(); fd.append('file', logoFile);
        await api.post(`/clients/${res.data.data.id}/logo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setUploading(false);
      }
      return res.data.data;
    },
    onSuccess: () => { qc.invalidateQueries(['admin-clients']); toast.success(isNew ? 'Client created!' : 'Client saved!'); onClose(); },
    onError: () => toast.error('Save failed'),
  });

  const handleLogoChange = (file) => {
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const seg = SEGMENTS.find(s => s.value === form.segment);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#0A2342' }}>{isNew ? 'Add New Client' : `Edit — ${client.name}`}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          {/* Logo upload */}
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box onClick={() => fileRef.current.click()}
              sx={{ cursor: 'pointer', width: 72, height: 72, borderRadius: 2.5, border: '2px dashed #C8D8E8',
                display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FBFF',
                overflow: 'hidden', flexShrink: 0, '&:hover': { borderColor: '#1B6CA8' } }}>
              {logoPreview || form.logoUrl ? (
                <Box component="img" src={logoPreview || form.logoUrl} alt="logo"
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }} />
              ) : (
                <UploadIcon sx={{ color: '#C8D8E8' }} />
              )}
            </Box>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleLogoChange(e.target.files[0])} />
            <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click avatar to upload client logo</Typography>
          </Grid>

          <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Client Name *" value={form.name} onChange={f('name')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" select label="Segment" value={form.segment} onChange={f('segment')} SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              {SEGMENTS.map(s => <option key={s.value} value={s.value}>{s.icon} {s.label}</option>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Location" value={form.location} onChange={f('location')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" select label="Bottle Size" value={form.bottleSizeUsed} onChange={f('bottleSizeUsed')} SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              {['200ml', '500ml', '1000ml'].map(s => <option key={s} value={s}>{s}</option>)}
            </TextField>
          </Grid>
          <Grid item xs={12}><TextField fullWidth size="small" label="Description" value={form.description} onChange={f('description')} multiline rows={3} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12}><TextField fullWidth size="small" label="Testimonial (optional)" value={form.testimonial || ''} onChange={f('testimonial')} multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={6}><TextField fullWidth size="small" label="Sort Order" type="number" value={form.sortOrder} onChange={f('sortOrder')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel control={<Switch checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} size="small" />} label="Featured" sx={{ fontSize: '0.85rem' }} />
            <FormControlLabel control={<Switch checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} size="small" />} label="Active" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Cancel</Button>
        <Button variant="contained" onClick={() => save.mutate(form)} disabled={save.isPending || !form.name}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
          {save.isPending ? 'Saving...' : isNew ? 'Add Client' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminClients() {
  const [dialog, setDialog] = useState(null); // null | 'new' | client object
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: () => api.get('/clients').then(r => r.data.data),
  });

  const grouped = SEGMENTS.map(s => ({
    ...s, items: clients.filter(c => c.segment === s.value),
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
            Manage Clients
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', mt: 0.5 }}>
            {clients.length} clients · Add, edit, upload logos and toggle featured status.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog('new')}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
          Add Client
        </Button>
      </Box>

      {isLoading ? <Typography>Loading...</Typography> : grouped.map((seg) => seg.items.length > 0 && (
        <Box key={seg.value} sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0A2342', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ background: `${seg.color}18`, color: seg.color, borderRadius: 9999, padding: '2px 10px', fontSize: '0.82rem' }}>
              {seg.icon} {seg.label}
            </span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.82rem' }}>· {seg.items.length} clients</span>
          </Typography>
          <Grid container spacing={2}>
            {seg.items.map((client) => (
              <Grid item xs={12} sm={6} lg={4} key={client.id}>
                <Card sx={{ borderRadius: 3, border: `1px solid ${client.isFeatured ? seg.color + '40' : '#E2EAF4'}`, p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1.5 }}>
                    {client.logoUrl ? (
                      <Box component="img" src={client.logoUrl} alt={client.name}
                        sx={{ width: 48, height: 48, objectFit: 'contain', border: '1px solid #E2EAF4', borderRadius: 2, p: 0.5 }} />
                    ) : (
                      <Avatar sx={{ width: 48, height: 48, background: `${seg.color}22`, color: seg.color, fontWeight: 700 }}>
                        {client.name?.charAt(0)}
                      </Avatar>
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0A2342', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {client.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client.location} · {client.bottleSizeUsed}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {client.isFeatured && <Chip label="⭐ Featured" size="small" sx={{ fontSize: '0.68rem', background: `${seg.color}18`, color: seg.color, fontWeight: 700 }} />}
                    {!client.logoUrl && <Chip label="No Logo" size="small" sx={{ fontSize: '0.68rem', background: '#FFF3E0', color: '#E65100' }} />}
                  </Box>
                  <Button fullWidth size="small" variant="outlined" startIcon={<EditIcon />}
                    onClick={() => setDialog(client)}
                    sx={{ borderRadius: 9999, borderColor: seg.color, color: seg.color, fontWeight: 600, fontSize: '0.78rem' }}>
                    Edit / Upload Logo
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {dialog && (
        <ClientDialog
          client={dialog === 'new' ? null : dialog}
          open
          onClose={() => setDialog(null)}
        />
      )}
    </Box>
  );
}
