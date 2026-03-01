import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Card, TextField, Button, Typography, InputAdornment,
  Alert, CircularProgress, Stepper, Step, StepLabel, IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';

const STEPS = ['Enter Email', 'Verify OTP', 'New Password'];
const RESEND_SECONDS = 60;

export default function ForgotPassword() {
  const [step, setStep]             = useState(0);
  const [email, setEmail]           = useState('');
  const [otp, setOtp]               = useState('');
  const [newPassword, setNewPw]     = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]           = useState('');
  const [done, setDone]             = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  // Countdown timer for resend
  const startResendTimer = () => {
    setResendTimer(RESEND_SECONDS);
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Step 0 — request OTP
  const requestOtp = useMutation({
    mutationFn: () => api.post('/auth/forgot-password', { email }),
    onSuccess: () => {
      setError('');
      toast.success(`OTP sent to ${email}`, { duration: 5000 });
      if (step === 0) setStep(1);
      startResendTimer();
    },
    onError: (e) => {
      setError(e.message);
      toast.error(e.message);
    },
  });

  // Step 2 — verify OTP + reset password
  const resetPassword = useMutation({
    mutationFn: () => api.post('/auth/reset-password', { email, otp, newPassword }),
    onSuccess: () => {
      setError('');
      setDone(true);
      toast.success('Password reset successfully!');
    },
    onError: (e) => {
      setError(e.message);
      toast.error(e.message);
    },
  });

  const handleStep0 = (e) => {
    e.preventDefault();
    setError('');
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    requestOtp.mutate();
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) { setError('OTP must be exactly 6 digits'); return; }
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPw) { setError('Passwords do not match'); return; }
    resetPassword.mutate();
  };

  const handleResend = () => {
    setOtp('');
    setError('');
    requestOtp.mutate();
  };

  // Shared input sx
  const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: 2 } };
  const btnSx = {
    borderRadius: 9999, py: 1.4, fontWeight: 700,
    background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
    '&:hover': { background: 'linear-gradient(135deg, #0d2c52, #1e7ec7)' },
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A2342 0%, #1B6CA8 50%, #0A2342 100%)',
      p: 2,
    }}>
      <Card sx={{
        width: '100%', maxWidth: 460, borderRadius: 4, overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(10,35,66,0.5)',
      }}>

        {/* ── Header ── */}
        <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', p: 4, textAlign: 'center' }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5,
          }}>
            <LockResetIcon sx={{ color: '#4FC3F7', fontSize: 30 }} />
          </Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
            Reset Password
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', mt: 0.5 }}>
            Sierra Pure — Secure Account Recovery
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* ── Stepper ── */}
          <Stepper activeStep={done ? 3 : step} alternativeLabel sx={{ mb: 3 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.75rem' } }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* ── Step 0: Email ── */}
          {!done && step === 0 && (
            <form onSubmit={handleStep0}>
              <Typography sx={{ color: '#5C6B85', fontSize: '0.88rem', mb: 2.5, lineHeight: 1.7 }}>
                Enter your registered email address. We'll send a <strong>6-digit OTP</strong> to reset your password.
              </Typography>
              <TextField
                fullWidth label="Email Address" type="email" required autoFocus
                value={email} onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#9BADB7', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, ...inputSx }}
              />
              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={requestOtp.isPending}
                sx={btnSx}
              >
                {requestOtp.isPending
                  ? <><CircularProgress size={18} sx={{ color: 'white', mr: 1 }} /> Sending OTP...</>
                  : 'Send OTP via Email'}
              </Button>
            </form>
          )}

          {/* ── Step 1: OTP ── */}
          {!done && step === 1 && (
            <form onSubmit={handleStep1}>
              <Box sx={{ background: '#F0F6FF', borderRadius: 2, p: 2, mb: 2.5, border: '1px solid #C8D8F0' }}>
                <Typography sx={{ color: '#0A2342', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  📧 OTP sent to <strong>{email}</strong>.<br />
                  Check your inbox (and spam). Valid for <strong>15 minutes</strong>.
                </Typography>
              </Box>

              <TextField
                fullWidth label="Enter 6-Digit OTP" required autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputProps={{
                  inputMode: 'numeric', maxLength: 6,
                  style: { letterSpacing: 16, fontSize: 30, textAlign: 'center', fontWeight: 800, fontFamily: 'monospace' },
                }}
                sx={{ mb: 3, ...inputSx }}
              />

              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={otp.length !== 6}
                sx={{ ...btnSx, mb: 1.5 }}
              >
                Verify OTP →
              </Button>

              {/* Resend OTP */}
              <Box sx={{ textAlign: 'center' }}>
                {resendTimer > 0 ? (
                  <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Resend OTP in <strong>{resendTimer}s</strong>
                  </Typography>
                ) : (
                  <Button
                    size="small" variant="text"
                    onClick={handleResend}
                    disabled={requestOtp.isPending}
                    sx={{ color: '#1B6CA8', fontSize: '0.82rem', fontWeight: 600 }}
                  >
                    {requestOtp.isPending ? 'Sending...' : "Didn't receive? Resend OTP"}
                  </Button>
                )}
              </Box>

              <Button
                fullWidth size="small" variant="text"
                onClick={() => { setStep(0); setOtp(''); setError(''); clearInterval(timerRef.current); }}
                sx={{ color: 'var(--text-muted)', fontSize: '0.78rem', mt: 1 }}
              >
                ← Change email address
              </Button>
            </form>
          )}

          {/* ── Step 2: New Password ── */}
          {!done && step === 2 && (
            <form onSubmit={handleStep2}>
              <Typography sx={{ color: '#5C6B85', fontSize: '0.88rem', mb: 2.5, lineHeight: 1.7 }}>
                OTP verified ✓. Choose a strong new password (minimum 8 characters).
              </Typography>

              <TextField
                fullWidth label="New Password" required autoFocus
                type={showPw ? 'text' : 'password'}
                value={newPassword} onChange={(e) => setNewPw(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPw(s => !s)} edge="end">
                        {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={newPassword.length > 0 && newPassword.length < 8 ? 'At least 8 characters required' : ''}
                sx={{ mb: 2, ...inputSx }}
              />

              <TextField
                fullWidth label="Confirm New Password" required
                type={showConfirm ? 'text' : 'password'}
                value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                error={confirmPw.length > 0 && confirmPw !== newPassword}
                helperText={confirmPw.length > 0 && confirmPw !== newPassword ? 'Passwords do not match' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowConfirm(s => !s)} edge="end">
                        {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, ...inputSx }}
              />

              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={resetPassword.isPending || newPassword.length < 8 || newPassword !== confirmPw}
                sx={btnSx}
              >
                {resetPassword.isPending
                  ? <><CircularProgress size={18} sx={{ color: 'white', mr: 1 }} /> Resetting...</>
                  : 'Reset Password'}
              </Button>
            </form>
          )}

          {/* ── Done ── */}
          {done && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: '#2ECC71', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A2342', mb: 1 }}>
                Password Reset Successfully!
              </Typography>
              <Typography sx={{ color: '#5C6B85', fontSize: '0.9rem', mb: 3, lineHeight: 1.7 }}>
                Your password has been updated. You can now sign in with your new password.
              </Typography>
              <Button
                component={Link} to="/login" fullWidth variant="contained" size="large"
                sx={btnSx}
              >
                Go to Sign In →
              </Button>
            </Box>
          )}

          {/* Back to login */}
          {!done && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#9BADB7' }}>
                Remember your password?{' '}
                <Link to="/login" style={{ color: '#1B6CA8', fontWeight: 600, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid #E2EAF4', background: '#F8FBFF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <WaterDropIcon sx={{ fontSize: 14, color: '#4FC3F7' }} />
            <Typography sx={{ fontSize: '0.72rem', color: '#9BADB7', letterSpacing: '0.08em' }}>
              SIERRA PURE — PURITY YOU CAN TRUST
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
