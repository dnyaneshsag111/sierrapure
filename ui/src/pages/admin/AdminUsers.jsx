import { useState } from 'react';
import {
  Box, Typography, Card, Button, Chip, Avatar, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  Select, MenuItem, IconButton, Tooltip, Switch, FormControlLabel,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const ROLE_COLORS = { ADMIN: '#E74C3C', LAB_ANALYST: '#1B6CA8', CLIENT: '#2ECC71' };
const ROLE_LABELS = { ADMIN: 'Administrator', LAB_ANALYST: 'Lab Analyst', CLIENT: 'Client' };

const EMPTY = { name: '', email: '', password: '', phone: '', role: 'CLIENT' };

function AddUserDialog({ open, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY });
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = useMutation({
    mutationFn: (data) => api.post('/auth/register', data).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('User created!'); onClose(); setForm({ ...EMPTY }); },
    onError: (e) => toast.error(e.message || 'Failed to create user'),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#0A2342' }}>Add New User</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Full Name *" value={form.name} onChange={f('name')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Phone" value={form.phone} onChange={f('phone')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12}><TextField fullWidth size="small" label="Email *" type="email" value={form.email} onChange={f('email')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12}><TextField fullWidth size="small" label="Password *" type="password" value={form.password} onChange={f('password')} helperText="Min 8 characters" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          <Grid item xs={12}>
            <TextField fullWidth size="small" select label="Role" value={form.role} onChange={f('role')} SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <option value="CLIENT">Client</option>
              <option value="LAB_ANALYST">Lab Analyst</option>
              <option value="ADMIN">Administrator</option>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Cancel</Button>
        <Button variant="contained" onClick={() => save.mutate(form)}
          disabled={save.isPending || !form.name || !form.email || !form.password}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
          {save.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminUsers() {
  const [addOpen, setAddOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const qc = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter],
    queryFn: () => api.get('/auth/users', { params: roleFilter ? { role: roleFilter } : {} }).then(r => r.data.data),
  });

  const toggle = useMutation({
    mutationFn: (id) => api.patch(`/auth/users/${id}/toggle`).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('User status updated'); },
    onError: () => toast.error('Failed to update'),
  });

  const counts = { ADMIN: 0, LAB_ANALYST: 0, CLIENT: 0 };
  users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
            User Management
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', mt: 0.5 }}>
            {users.length} users — Admin, Lab Analysts, Clients
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
          Add User
        </Button>
      </Box>

      {/* Role summary chips */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {[{ label: `All (${users.length})`, value: '' },
          { label: `Admins (${counts.ADMIN})`, value: 'ADMIN' },
          { label: `Lab Analysts (${counts.LAB_ANALYST})`, value: 'LAB_ANALYST' },
          { label: `Clients (${counts.CLIENT})`, value: 'CLIENT' },
        ].map(r => (
          <Chip key={r.value} label={r.label} onClick={() => setRoleFilter(r.value)}
            sx={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
              background: roleFilter === r.value ? '#0A2342' : '#F0F4F8',
              color: roleFilter === r.value ? 'white' : '#0A2342' }} />
        ))}
      </Box>

      <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ background: '#F8FBFF' }}>
              <TableRow>
                {['User', 'Email', 'Phone', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#0A2342', py: 1.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: 'var(--text-muted)' }}>Loading...</TableCell></TableRow>
                : users.map((u) => {
                    const roleColor = ROLE_COLORS[u.role] ?? '#9B59B6';
                    return (
                      <TableRow key={u.id} sx={{ '&:hover': { background: '#F8FBFF' }, opacity: u.isActive ? 1 : 0.5 }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 34, height: 34, background: `${roleColor}22`, color: roleColor, fontSize: '0.85rem', fontWeight: 700 }}>
                              {u.name?.charAt(0)}
                            </Avatar>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0A2342' }}>{u.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{u.email}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{u.phone || '—'}</TableCell>
                        <TableCell>
                          <Chip label={ROLE_LABELS[u.role] ?? u.role} size="small"
                            sx={{ fontSize: '0.68rem', fontWeight: 700, borderRadius: 9999,
                              background: `${roleColor}18`, color: roleColor }} />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.isActive ? 'Active' : 'Inactive'} size="small"
                            icon={u.isActive ? <CheckCircleIcon sx={{ fontSize: '12px !important', color: '#1a8a4a !important' }} /> : <BlockIcon sx={{ fontSize: '12px !important', color: '#c0392b !important' }} />}
                            sx={{ fontSize: '0.68rem', fontWeight: 700, borderRadius: 9999,
                              background: u.isActive ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                              color: u.isActive ? '#1a8a4a' : '#c0392b' }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</TableCell>
                        <TableCell>
                          <Tooltip title={u.isActive ? 'Deactivate' : 'Activate'}>
                            <IconButton size="small" onClick={() => toggle.mutate(u.id)}>
                              {u.isActive
                                ? <BlockIcon sx={{ fontSize: 16, color: '#c0392b' }} />
                                : <CheckCircleIcon sx={{ fontSize: 16, color: '#1a8a4a' }} />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <AddUserDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </Box>
  );
}
