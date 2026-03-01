import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box, Card, TextField, Button, Typography, InputAdornment,
  IconButton, Alert, CircularProgress, Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS = { ADMIN: '#E74C3C', LAB_ANALYST: '#1B6CA8', CLIENT: '#2ECC71' };
const ROLE_LABELS = { ADMIN: 'Administrator', LAB_ANALYST: 'Lab Analyst', CLIENT: 'Client' };

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/admin';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Redirect based on role
      if (user.role === 'ADMIN' || user.role === 'LAB_ANALYST') {
        navigate(from === '/login' ? '/admin' : from, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A2342 0%, #1B6CA8 50%, #0A2342 100%)',
      p: 2,
    }}>
      <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 4, p: { xs: 3, sm: 5 }, boxShadow: '0 24px 80px rgba(10,35,66,0.35)' }}>

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <WaterDropIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
            Sierra Pure
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.88rem', mt: 0.5 }}>
            Sign in to your account
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email Address" type="email" required
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            autoComplete="email" autoFocus
          />
          <TextField
            fullWidth label="Password" required
            type={showPw ? 'text' : 'password'}
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw(s => !s)} edge="end" size="small">
                    {showPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit" fullWidth variant="contained" disabled={loading}
            sx={{ py: 1.5, borderRadius: 9999, fontWeight: 700, fontSize: '0.95rem',
              background: 'linear-gradient(135deg,#0A2342,#1B6CA8)',
              '&:hover': { background: 'linear-gradient(135deg,#0d2c52,#1e7ec7)' } }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Sign In'}
          </Button>
        </Box>

        {/* Demo credentials */}
        <Box sx={{ mt: 4, p: 2, background: '#F8FBFF', borderRadius: 2.5, border: '1px solid #E2EAF4' }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0A2342', mb: 1.5 }}>
            Demo Credentials
          </Typography>
          {[
            { role: 'ADMIN',       email: 'admin@sierrapure.in',  pw: 'Admin@2026' },
            { role: 'LAB_ANALYST', email: 'lab@sierrapure.in',    pw: 'Lab@2026' },
            { role: 'CLIENT',      email: 'client@sierrapure.in', pw: 'Client@2026' },
          ].map(c => (
            <Box key={c.role} onClick={() => setForm({ email: c.email, password: c.pw })}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                mb: 0.8, cursor: 'pointer', p: '4px 6px', borderRadius: 1.5,
                '&:hover': { background: '#EEF4FF' } }}>
              <Chip label={ROLE_LABELS[c.role]} size="small"
                sx={{ fontSize: '0.65rem', fontWeight: 700, background: `${ROLE_COLORS[c.role]}18`, color: ROLE_COLORS[c.role], borderRadius: 9999, height: 20 }} />
              <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.email}</Typography>
            </Box>
          ))}
          <Typography sx={{ fontSize: '0.68rem', color: 'var(--text-muted)', mt: 1 }}>
            Click a row to auto-fill credentials
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: '#1B6CA8', textDecoration: 'none' }}>
            ← Back to Sierra Pure website
          </Link>
        </Box>
      </Card>
    </Box>
  );
}
