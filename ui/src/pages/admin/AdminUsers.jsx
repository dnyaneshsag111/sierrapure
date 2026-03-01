import { useState } from 'react';
import {
  Box, Typography, Card, Button, Chip, Avatar, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  IconButton, Tooltip, InputAdornment, Alert,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import LockResetIcon from '@mui/icons-material/LockReset';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const ROLE_COLORS = { ADMIN: '#E74C3C', LAB_ANALYST: '#1B6CA8', CLIENT: '#2ECC71' };
const ROLE_LABELS = { ADMIN: 'Administrator', LAB_ANALYST: 'Lab Analyst', CLIENT: 'Client' };
const ROLES = ['CLIENT', 'LAB_ANALYST', 'ADMIN'];

const EMPTY_CREATE = { name: '', email: '', password: '', phone: '', role: 'CLIENT' };
const EMPTY_EDIT   = { name: '', phone: '', role: 'CLIENT', isActive: true, newPassword: '' };

// ── Shared field sx ─────────────────────────────────────────────────────────
const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: 2 } };

// ── Role select field ────────────────────────────────────────────────────────
function RoleSelect({ value, onChange }) {
  return (
    <TextField fullWidth size="small" select label="Role" value={value} onChange={onChange}
      SelectProps={{ native: true }} sx={fieldSx}>
      {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
    </TextField>
  );
}

// ── Password field with show/hide ─────────────────────────────────────────────
function PasswordField({ label, value, onChange, helperText, required = false }) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      fullWidth size="small" label={label} required={required}
      type={show ? 'text' : 'password'} value={value} onChange={onChange}
      helperText={helperText} sx={fieldSx}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => setShow(s => !s)} edge="end">
              {show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

// ── Create User Dialog ────────────────────────────────────────────────────────
function CreateUserDialog({ open, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY_CREATE });
  const [error, setError] = useState('');
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = useMutation({
    mutationFn: (data) => api.post('/auth/register', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-users']);
      toast.success(`User "${form.name}" created!`);
      onClose();
      setForm({ ...EMPTY_CREATE });
      setError('');
    },
    onError: (e) => setError(e.message || 'Failed to create user'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim())            { setError('Name is required'); return; }
    if (!form.email.trim())           { setError('Email is required'); return; }
    if (form.password.length < 8)     { setError('Password must be at least 8 characters'); return; }
    save.mutate(form);
  };

  const handleClose = () => { onClose(); setForm({ ...EMPTY_CREATE }); setError(''); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#0A2342', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon sx={{ color: '#1B6CA8' }} /> Add New User
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        <form id="create-user-form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Full Name *" value={form.name} onChange={f('name')} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Phone" value={form.phone} onChange={f('phone')} sx={fieldSx} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Email Address *" type="email" value={form.email} onChange={f('email')} sx={fieldSx} />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                label="Password *" required value={form.password}
                onChange={f('password')}
                helperText="Minimum 8 characters. User can change it after login."
              />
            </Grid>
            <Grid item xs={12}>
              <RoleSelect value={form.role} onChange={f('role')} />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={handleClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Cancel</Button>
        <Button
          type="submit" form="create-user-form" variant="contained"
          disabled={save.isPending}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}
        >
          {save.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Edit User Dialog ──────────────────────────────────────────────────────────
function EditUserDialog({ user, open, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    role: user?.role || 'CLIENT', isActive: user?.isActive ?? true, newPassword: '',
  });
  const [error, setError] = useState('');
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = useMutation({
    mutationFn: (data) => api.put(`/auth/users/${user.id}`, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-users']);
      toast.success('User updated successfully!');
      onClose();
      setError('');
    },
    onError: (e) => setError(e.message || 'Failed to update user'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (form.newPassword && form.newPassword.length < 8) {
      setError('New password must be at least 8 characters'); return;
    }
    // Only send newPassword if filled
    const payload = { ...form };
    if (!payload.newPassword) delete payload.newPassword;
    save.mutate(payload);
  };

  const handleClose = () => { onClose(); setError(''); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#0A2342', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon sx={{ color: '#1B6CA8' }} /> Edit User — {user?.name}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        <form id="edit-user-form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Full Name *" value={form.name} onChange={f('name')} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Phone" value={form.phone} onChange={f('phone')} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RoleSelect value={form.role} onChange={f('role')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" select label="Status" value={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'true' }))}
                SelectProps={{ native: true }} sx={fieldSx}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                label="Reset Password (optional)"
                value={form.newPassword}
                onChange={f('newPassword')}
                helperText="Leave blank to keep current password. Min 8 characters if changing."
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={handleClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Cancel</Button>
        <Button
          type="submit" form="edit-user-form" variant="contained"
          disabled={save.isPending}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}
        >
          {save.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────
function DeleteDialog({ user, open, onClose }) {
  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: () => api.delete(`/auth/users/${user.id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('User deleted'); onClose(); },
    onError: (e) => toast.error(e.message || 'Delete failed'),
  });
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#c0392b' }}>Delete User?</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#5C6B85', fontSize: '0.9rem' }}>
          Are you sure you want to <strong>permanently delete</strong> the account for{' '}
          <strong>{user?.name}</strong> ({user?.email})?
          <br /><br />
          This action <strong>cannot be undone</strong>.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Cancel</Button>
        <Button
          variant="contained" onClick={() => del.mutate()}
          disabled={del.isPending}
          sx={{ background: '#E74C3C', color: 'white', borderRadius: 9999, px: 3,
               '&:hover': { background: '#c0392b' } }}
        >
          {del.isPending ? 'Deleting...' : 'Yes, Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main AdminUsers page ──────────────────────────────────────────────────────
export default function AdminUsers() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser,   setEditUser]   = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const qc = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/auth/users').then(r => r.data.data),
  });

  const toggle = useMutation({
    mutationFn: (id) => api.patch(`/auth/users/${id}/toggle`).then(r => r.data.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries(['admin-users']);
      const u = users.find(u => u.id === id);
      toast.success(u?.isActive ? 'User deactivated' : 'User activated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  // Filter
  const filtered = users.filter(u => {
    const matchRole   = !roleFilter || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const counts = { ADMIN: 0, LAB_ANALYST: 0, CLIENT: 0 };
  users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });

  return (
    <Box>
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
            User Management
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', mt: 0.5 }}>
            {users.length} total users · {users.filter(u => u.isActive).length} active
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3, height: 40 }}
        >
          Add User
        </Button>
      </Box>

      {/* ── Filters ── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Search by name or email…" value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#9BADB7' }} /></InputAdornment> }}
          sx={{ width: 260, '& .MuiOutlinedInput-root': { borderRadius: 9999 } }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[
            { label: `All (${users.length})`,                      value: '' },
            { label: `Admins (${counts.ADMIN})`,                   value: 'ADMIN' },
            { label: `Lab Analysts (${counts.LAB_ANALYST})`,       value: 'LAB_ANALYST' },
            { label: `Clients (${counts.CLIENT})`,                 value: 'CLIENT' },
          ].map(r => (
            <Chip key={r.value} label={r.label} onClick={() => setRoleFilter(r.value)}
              sx={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
                background: roleFilter === r.value ? '#0A2342' : '#F0F4F8',
                color: roleFilter === r.value ? 'white' : '#0A2342',
                '&:hover': { background: roleFilter === r.value ? '#0d2c52' : '#E2EAF4' } }} />
          ))}
        </Box>
      </Box>

      {/* ── Table ── */}
      <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ background: '#F8FBFF' }}>
              <TableRow>
                {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#0A2342', py: 1.5, whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: 'var(--text-muted)' }}>
                    Loading users...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: 'var(--text-muted)' }}>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map(u => {
                const roleColor = ROLE_COLORS[u.role] ?? '#9B59B6';
                return (
                  <TableRow key={u.id}
                    sx={{ '&:hover': { background: '#F8FBFF' }, opacity: u.isActive ? 1 : 0.55, transition: 'opacity 0.2s' }}>

                    {/* User */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, background: `${roleColor}22`, color: roleColor, fontSize: '0.85rem', fontWeight: 700 }}>
                          {u.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0A2342' }}>
                          {u.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Email */}
                    <TableCell sx={{ fontSize: '0.8rem', color: '#5C6B85', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.email}
                    </TableCell>

                    {/* Phone */}
                    <TableCell sx={{ fontSize: '0.8rem', color: '#5C6B85' }}>{u.phone || '—'}</TableCell>

                    {/* Role */}
                    <TableCell>
                      <Chip label={ROLE_LABELS[u.role] ?? u.role} size="small"
                        sx={{ fontSize: '0.68rem', fontWeight: 700, borderRadius: 9999,
                          background: `${roleColor}18`, color: roleColor }} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={u.isActive ? 'Active' : 'Inactive'} size="small"
                        icon={u.isActive
                          ? <CheckCircleIcon sx={{ fontSize: '12px !important', color: '#1a8a4a !important' }} />
                          : <BlockIcon sx={{ fontSize: '12px !important', color: '#c0392b !important' }} />}
                        sx={{ fontSize: '0.68rem', fontWeight: 700, borderRadius: 9999,
                          background: u.isActive ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                          color: u.isActive ? '#1a8a4a' : '#c0392b' }}
                      />
                    </TableCell>

                    {/* Joined */}
                    <TableCell sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDate(u.createdAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {/* Edit */}
                        <Tooltip title="Edit user">
                          <IconButton size="small" onClick={() => setEditUser(u)}>
                            <EditIcon sx={{ fontSize: 16, color: '#1B6CA8' }} />
                          </IconButton>
                        </Tooltip>

                        {/* Toggle active */}
                        <Tooltip title={u.isActive ? 'Deactivate' : 'Activate'}>
                          <IconButton size="small" onClick={() => toggle.mutate(u.id)}>
                            {u.isActive
                              ? <BlockIcon sx={{ fontSize: 16, color: '#C9A84C' }} />
                              : <CheckCircleIcon sx={{ fontSize: 16, color: '#2ECC71' }} />}
                          </IconButton>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip title="Delete user permanently">
                          <IconButton size="small" onClick={() => setDeleteUser(u)}>
                            <DeleteIcon sx={{ fontSize: 16, color: '#E74C3C' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── Legend ── */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <EditIcon sx={{ fontSize: 14, color: '#1B6CA8' }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Edit name / role / password</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LockResetIcon sx={{ fontSize: 14, color: '#C9A84C' }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Block / unblock account</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <DeleteIcon sx={{ fontSize: 14, color: '#E74C3C' }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delete permanently</Typography>
        </Box>
      </Box>

      {/* ── Dialogs ── */}
      <CreateUserDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      {editUser   && <EditUserDialog   user={editUser}   open={!!editUser}   onClose={() => setEditUser(null)} />}
      {deleteUser && <DeleteDialog     user={deleteUser} open={!!deleteUser} onClose={() => setDeleteUser(null)} />}
    </Box>
  );
}
