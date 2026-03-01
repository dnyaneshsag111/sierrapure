import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, MenuItem,
  IconButton, Chip, Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScienceIcon from '@mui/icons-material/Science';
import SendIcon from '@mui/icons-material/Send';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactService } from '../../services/contactService';

const SEGMENTS = ['hotel', 'restaurant', 'industry', 'travel', 'events', 'other'];
const SIZES    = ['200ml', '500ml', '1000ml'];

export default function SampleRequestModal({ open, onClose, preselectedSize = null }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    segment: '', deliveryAddress: '',
    bottleSizes: preselectedSize ? [preselectedSize] : [],
  });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) => contactService.submit(data),
    onSuccess: () => {
      toast.success('🎉 Sample request received! We\'ll dispatch within 2–3 working days.');
      onClose();
      setForm({ name: '', email: '', phone: '', company: '', segment: '', deliveryAddress: '', bottleSizes: preselectedSize ? [preselectedSize] : [] });
    },
    onError: () => toast.error('Failed to submit. Please try again.'),
  });

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const toggleSize = (s) =>
    set('bottleSizes', form.bottleSizes.includes(s)
      ? form.bottleSizes.filter(x => x !== s)
      : [...form.bottleSizes, s]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name = 'Name required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^[+]?[0-9]{10,15}$/)) e.phone = 'Valid phone required';
    if (!form.segment) e.segment = 'Segment required';
    if (!form.deliveryAddress.trim()) e.deliveryAddress = 'Delivery address required';
    if (form.bottleSizes.length === 0) e.bottleSizes = 'Select at least one size';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      ...form,
      message: `Sample request for: ${form.bottleSizes.join(', ')}. Delivery: ${form.deliveryAddress}`,
      customLabel: false,
      sampleRequest: true,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>

      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1565C0)', px: 4, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ScienceIcon sx={{ color: '#4FC3F7', fontSize: 28 }} />
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>Request Free Sample</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem' }}>
              Dispatched within 2–3 working days
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3.5 }}>

          {/* Info note */}
          <Box sx={{ mb: 3, p: 2, background: '#EEF4FF', borderRadius: 2, border: '1px solid #D4E8FF' }}>
            <Typography sx={{ fontSize: '0.83rem', color: '#0A2342', lineHeight: 1.7 }}>
              ✅ <strong>Complimentary sample</strong> — no payment needed. Available for qualified business buyers (hotels, restaurants, corporates). We'll send 1–2 bottles of each selected size.
            </Typography>
          </Box>

          {/* Size selection */}
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0A2342', mb: 1 }}>
            Sample Sizes *
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: errors.bottleSizes ? 0.5 : 2.5 }}>
            {SIZES.map(s => (
              <Chip key={s} label={s} onClick={() => toggleSize(s)}
                sx={{
                  cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', borderRadius: 9999,
                  border: form.bottleSizes.includes(s) ? '2px solid #1565C0' : '1px solid #E2EAF4',
                  background: form.bottleSizes.includes(s) ? '#EEF4FF' : 'white',
                  color: form.bottleSizes.includes(s) ? '#1565C0' : 'var(--text-muted)',
                }} />
            ))}
          </Box>
          {errors.bottleSizes && (
            <Typography sx={{ color: '#E74C3C', fontSize: '0.75rem', mb: 2 }}>{errors.bottleSizes}</Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth size="small" label="Full Name *" value={form.name}
                onChange={e => set('name', e.target.value)} error={!!errors.name} helperText={errors.name} />
              <TextField fullWidth size="small" label="Company / Hotel" value={form.company}
                onChange={e => set('company', e.target.value)} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth size="small" label="Email *" value={form.email}
                onChange={e => set('email', e.target.value)} error={!!errors.email} helperText={errors.email} />
              <TextField fullWidth size="small" label="Phone *" value={form.phone}
                onChange={e => set('phone', e.target.value)} error={!!errors.phone} helperText={errors.phone} />
            </Box>
            <TextField select fullWidth size="small" label="Business Segment *" value={form.segment}
              onChange={e => set('segment', e.target.value)} error={!!errors.segment} helperText={errors.segment}>
              {SEGMENTS.map(s => (
                <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField fullWidth size="small" label="Delivery Address *" value={form.deliveryAddress}
              onChange={e => set('deliveryAddress', e.target.value)}
              error={!!errors.deliveryAddress} helperText={errors.deliveryAddress || 'Full address including pin code'}
              multiline rows={2} />
          </Box>

          {mutation.isError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>Submission failed. Please try again.</Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3.5, pb: 3, pt: 0, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={mutation.isPending}
          endIcon={<SendIcon />}
          sx={{
            borderRadius: 9999, background: 'linear-gradient(135deg, #0A2342, #1565C0)',
            fontWeight: 700, px: 4, py: 1.1,
            boxShadow: '0 4px 16px rgba(10,35,66,0.25)',
          }}>
          {mutation.isPending ? 'Submitting...' : 'Request Sample'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
