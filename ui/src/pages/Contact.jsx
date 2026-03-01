import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  TextField, Button, MenuItem, Checkbox, FormControlLabel,
  FormGroup, Alert, Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { contactService } from '../services/contactService';

const SEGMENTS = ['hotel', 'restaurant', 'industry', 'travel', 'events', 'other'];
const BOTTLE_SIZES = ['200ml', '500ml', '1000ml'];

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    segment: '', bottleSizes: [], message: '', customLabel: false,
  });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: contactService.submit,
    onSuccess: (res) => {
      toast.success(res.message || 'Enquiry submitted successfully!');
      setForm({ name: '', email: '', phone: '', company: '', segment: '', bottleSizes: [], message: '', customLabel: false });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      bottleSizes: prev.bottleSizes.includes(size)
        ? prev.bottleSizes.filter((s) => s !== size)
        : [...prev.bottleSizes, size],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^[+]?[0-9]{10,15}$/)) e.phone = 'Valid phone required';
    if (!form.segment) e.segment = 'Please select a segment';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) mutation.mutate(form);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Sierra Pure</title>
        <meta name="description" content="Get in touch with Sierra Pure for custom mineral water bottles, bulk orders, and pricing enquiries." />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342 0%, #1B6CA8 100%)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.2rem', md: '3rem' }, mb: 2 }}>
            Let's Talk
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem' }}>
            Ready to order custom bottles or need pricing? We'll get back within 24 hours.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, background: '#F8FBFF' }}>
        <Container maxWidth="xl">
          <Grid container spacing={5}>
            {/* Form */}
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    background: 'white',
                    borderRadius: 4,
                    p: { xs: 3, md: 5 },
                    boxShadow: '0 12px 40px rgba(10,35,66,0.1)',
                    border: '1px solid #E2EAF4',
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#0A2342', mb: 3, fontWeight: 700 }}>
                    Send Enquiry
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Full Name *" name="name" value={form.name} onChange={handleChange}
                        error={!!errors.name} helperText={errors.name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Company / Hotel Name" name="company" value={form.company} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email Address *" name="email" value={form.email} onChange={handleChange}
                        error={!!errors.email} helperText={errors.email} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Phone Number *" name="phone" value={form.phone} onChange={handleChange}
                        error={!!errors.phone} helperText={errors.phone} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField select fullWidth label="Business Segment *" name="segment" value={form.segment} onChange={handleChange}
                        error={!!errors.segment} helperText={errors.segment}>
                        {SEGMENTS.map((s) => (
                          <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '0.9rem', color: '#0A2342', fontWeight: 600, mb: 1.5 }}>
                        Bottle Sizes Required
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {BOTTLE_SIZES.map((size) => (
                          <Chip
                            key={size}
                            label={size}
                            onClick={() => toggleSize(size)}
                            sx={{
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              borderRadius: 9999,
                              border: form.bottleSizes.includes(size) ? '2px solid #1B6CA8' : '1px solid #E2EAF4',
                              background: form.bottleSizes.includes(size) ? 'rgba(27,108,168,0.1)' : 'white',
                              color: form.bottleSizes.includes(size) ? '#1B6CA8' : 'var(--text-muted)',
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth multiline rows={4} label="Message / Requirement *" name="message"
                        value={form.message} onChange={handleChange} error={!!errors.message} helperText={errors.message}
                        placeholder="Tell us about your requirements, quantity, delivery location, etc." />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox checked={form.customLabel} name="customLabel" onChange={handleChange} sx={{ color: '#1B6CA8', '&.Mui-checked': { color: '#1B6CA8' } }} />}
                        label={<Typography sx={{ fontSize: '0.92rem', color: '#4A5568' }}>I need custom label / branding on the bottles</Typography>}
                      />
                    </Grid>
                  </Grid>

                  {mutation.isError && (
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{mutation.error?.message}</Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    disabled={mutation.isPending}
                    sx={{
                      mt: 3,
                      background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
                      color: 'white',
                      borderRadius: 9999,
                      py: 1.6,
                      fontSize: '1rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 20px rgba(10,35,66,0.25)',
                      '&:hover': { boxShadow: '0 8px 32px rgba(10,35,66,0.35)', transform: 'translateY(-1px)' },
                    }}
                  >
                    {mutation.isPending ? 'Submitting...' : 'Submit Enquiry'}
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <Typography variant="h4" sx={{ color: '#0A2342', mb: 3, fontWeight: 700 }}>
                  Get In Touch
                </Typography>

                {[
                  { icon: <PhoneIcon sx={{ color: '#1B6CA8', fontSize: 28 }} />, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: <EmailIcon sx={{ color: '#1B6CA8', fontSize: 28 }} />, label: 'Email', value: 'contact@sierrapure.com', href: 'mailto:contact@sierrapure.com' },
                  { icon: <WhatsAppIcon sx={{ color: '#25D366', fontSize: 28 }} />, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
                  { icon: <LocationOnIcon sx={{ color: '#1B6CA8', fontSize: 28 }} />, label: 'Address', value: 'Sierra Pure Manufacturing Unit,\nIndustrial Area, Maharashtra, India' },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                      p: 3,
                      mb: 2,
                      background: 'white',
                      borderRadius: 3,
                      border: '1px solid #E2EAF4',
                      boxShadow: '0 4px 16px rgba(10,35,66,0.06)',
                      transition: 'all 0.25s',
                      '&:hover': { boxShadow: '0 8px 32px rgba(10,35,66,0.1)', transform: 'translateY(-2px)' },
                    }}
                  >
                    <Box sx={{ width: 52, height: 52, borderRadius: 2.5, background: '#F0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', mb: 0.5 }}>
                        {item.label.toUpperCase()}
                      </Typography>
                      {item.href ? (
                        <Box component="a" href={item.href} target={item.href.startsWith('http') ? '_blank' : '_self'}
                          sx={{ color: '#0A2342', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', '&:hover': { color: '#1B6CA8' } }}>
                          {item.value}
                        </Box>
                      ) : (
                        <Typography sx={{ color: '#0A2342', fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'pre-line' }}>
                          {item.value}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}

                <Box sx={{ mt: 3, p: 3, background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', borderRadius: 3 }}>
                  <Typography sx={{ color: 'white', fontWeight: 700, mb: 1 }}>Business Hours</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.8 }}>
                    Monday – Saturday: 9:00 AM – 7:00 PM<br />
                    Sunday: 10:00 AM – 4:00 PM<br />
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>WhatsApp available 24/7</span>
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
