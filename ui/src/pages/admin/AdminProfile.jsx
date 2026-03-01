import { useState } from 'react';
import {
  Box, Card, Typography, TextField, Button, InputAdornment,
  IconButton, Alert, CircularProgress, Divider, LinearProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score  = checks.filter(Boolean).length;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#E74C3C', '#E74C3C', '#F39C12', '#C9A84C', '#2ECC71'];

  if (!password) return null;
  return (
    <Box sx={{ mt: 1, mb: 0.5 }}>
      <LinearProgress
        variant="determinate"
        value={(score / 4) * 100}
        sx={{
          height: 4, borderRadius: 9999,
          background: '#E2EAF4',
          '& .MuiLinearProgress-bar': { background: colors[score], borderRadius: 9999 },
        }}
      />
      <Typography sx={{ fontSize: '0.72rem', color: colors[score], mt: 0.5, fontWeight: 600 }}>
        {labels[score]}
      </Typography>
    </Box>
  );
}

export default function AdminProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const toggle = (key) => () => setShow(s => ({ ...s, [key]: !s[key] }));
  const f = (key) => (e) => { setForm(p => ({ ...p, [key]: e.target.value })); setError(''); setSuccess(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.newPassword.length < 8)       { setError('New password must be at least 8 characters.'); return; }
    if (form.newPassword !== form.confirmPassword) { setError('New passwords do not match.'); return; }
    if (form.currentPassword === form.newPassword) { setError('New password must be different from current.'); return; }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully!');
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to change password. Check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', mb: 0.5, fontFamily: "'Playfair Display', serif" }}>
        My Profile
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)', mb: 4, fontSize: '0.9rem' }}>
        Manage your account details and security settings
      </Typography>

      {/* Account info card */}
      <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', mb: 3, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', px: 3, py: 2 }}>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Account Information</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          {[
            ['Full Name', user?.name],
            ['Email Address', user?.email],
            ['Role', user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'LAB_ANALYST' ? 'Lab Analyst' : 'Client'],
          ].map(([label, value]) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</Typography>
              <Typography sx={{ fontSize: '0.88rem', color: '#0A2342', fontWeight: 700 }}>{value || '—'}</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Change password card */}
      <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LockIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }} />
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Change Password</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2.5, borderRadius: 2 }}>
                  Password changed successfully!
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Current Password" required type={show.current ? 'text' : 'password'}
              value={form.currentPassword} onChange={f('currentPassword')}
              autoComplete="current-password"
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={toggle('current')} size="small" edge="end">{show.current ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <Divider sx={{ my: 2, borderStyle: 'dashed', borderColor: '#E2EAF4' }} />
            <TextField
              fullWidth label="New Password" required type={show.new ? 'text' : 'password'}
              value={form.newPassword} onChange={f('newPassword')}
              autoComplete="new-password"
              helperText="At least 8 characters with uppercase, number and symbol"
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={toggle('new')} size="small" edge="end">{show.new ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }}
              sx={{ mb: 0.5, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <PasswordStrength password={form.newPassword} />
            <TextField
              fullWidth label="Confirm New Password" required type={show.confirm ? 'text' : 'password'}
              value={form.confirmPassword} onChange={f('confirmPassword')}
              autoComplete="new-password"
              error={!!form.confirmPassword && form.confirmPassword !== form.newPassword}
              helperText={form.confirmPassword && form.confirmPassword !== form.newPassword ? 'Passwords do not match' : ''}
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={toggle('confirm')} size="small" edge="end">{show.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }}
              sx={{ mt: 2, mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <Button
              type="submit" variant="contained" disabled={loading}
              sx={{ px: 4, py: 1.3, borderRadius: 9999, fontWeight: 700, background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', '&:hover': { background: 'linear-gradient(135deg,#0d2c52,#1e7ec7)' } }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Update Password'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
