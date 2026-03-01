import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, Button, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BrushIcon from '@mui/icons-material/Brush';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedIcon from '@mui/icons-material/Verified';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const TIERS = [
  {
    id: 'starter',
    label: 'Starter',
    units: '500 – 999',
    unitLabel: 'units / order',
    priceNote: '₹10 – ₹18 per bottle',
    color: '#42A5F5',
    gradient: 'linear-gradient(135deg, #42A5F5, #1B6CA8)',
    badge: null,
    leadTime: '5 – 7 business days',
    features: [
      'All 3 bottle sizes available (200ml, 500ml, 1000ml)',
      'Standard Sierra Pure label',
      'BIS & FSSAI certified product',
      'NABL lab report with each batch',
      'Email & WhatsApp support',
      'Delivery across Maharashtra',
    ],
    notIncluded: ['Custom label design', 'Priority dispatch', 'Dedicated account manager'],
  },
  {
    id: 'business',
    label: 'Business',
    units: '1,000 – 4,999',
    unitLabel: 'units / order',
    priceNote: '₹8 – ₹14 per bottle',
    color: '#1565C0',
    gradient: 'linear-gradient(135deg, #0A2342, #1565C0)',
    badge: 'Most Popular',
    leadTime: '3 – 5 business days',
    features: [
      'All 3 bottle sizes available',
      'Custom label design included (1 design)',
      'BIS, FSSAI & NABL certified',
      'Batch lab reports via QR scan',
      'Priority email & WhatsApp support',
      'Pan-Maharashtra delivery',
      'Volume discount auto-applied',
    ],
    notIncluded: ['Dedicated account manager', 'Pan-India logistics'],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    units: '5,000+',
    unitLabel: 'units / order',
    priceNote: 'Best negotiated rates',
    color: '#C9A84C',
    gradient: 'linear-gradient(135deg, #8B6914, #C9A84C)',
    badge: 'Best Value',
    leadTime: '2 – 3 business days',
    features: [
      'All sizes + custom sizes on request',
      'Unlimited custom label variants',
      'Full QR traceability per batch',
      'Dedicated account manager',
      'SLA-backed delivery schedule',
      'Pan-India delivery available',
      'Monthly consolidated invoicing',
      'Co-branding & event packaging',
    ],
    notIncluded: [],
  },
];

const WHY_ITEMS = [
  { icon: <VerifiedIcon />,       title: 'BIS + FSSAI Certified',  desc: 'Every bottle meets Bureau of Indian Standards IS 13428 and holds a valid FSSAI licence.' },
  { icon: <LocalShippingIcon />,  title: 'Reliable Supply Chain',  desc: 'We maintain 30-day buffer stock across all SKUs to ensure your orders are never delayed.' },
  { icon: <BrushIcon />,          title: 'In-House Label Design',   desc: 'Our design team creates professional custom labels — no external vendor fees.' },
  { icon: <SupportAgentIcon />,   title: 'Dedicated B2B Support',  desc: 'Assigned account managers for Business and Enterprise clients with guaranteed response times.' },
];

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>B2B Pricing | Sierra Pure Mineral Water</title>
        <meta name="description" content="Transparent bulk and B2B pricing tiers for Sierra Pure mineral water. Starter from 500 units, Business from 1,000 units, Enterprise 5,000+ with dedicated support." />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1565C0)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.18em', fontWeight: 700 }}>
              Volume Pricing
            </Typography>
            <Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2.2rem', md: '3rem' }, mt: 1, mb: 2 }}>
              Transparent B2B Pricing
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', mb: 4, lineHeight: 1.8 }}>
              No hidden fees. No ambiguous quotes. Choose the tier that fits your order volume —
              from boutique hotels to large hospital chains.
            </Typography>
            <Button component={Link} to="/contact" variant="outlined" size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 9999, borderColor: 'rgba(255,255,255,0.4)', color: 'white',
                px: 4, py: 1.4, fontWeight: 700, fontSize: '1rem',
                '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' } }}>
              Get Exact Quote
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Wave */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1565C0)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      {/* Pricing tiers */}
      <Box sx={{ background: '#F8FBFF', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">

          <Grid container spacing={4} sx={{ mb: 10 }}>
            {TIERS.map((tier, i) => (
              <Grid item xs={12} md={4} key={tier.id}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }} style={{ height: '100%' }}>
                  <Box sx={{
                    position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
                    background: 'white', borderRadius: 4,
                    border: tier.badge === 'Most Popular' ? `2px solid ${tier.color}` : '1px solid #E2EAF4',
                    boxShadow: tier.badge === 'Most Popular'
                      ? `0 20px 60px ${tier.color}22`
                      : '0 4px 24px rgba(10,35,66,0.06)',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 24px 64px ${tier.color}28` },
                  }}>

                    {/* Badge */}
                    {tier.badge && (
                      <Box sx={{
                        position: 'absolute', top: 18, right: 18,
                        background: tier.gradient, color: 'white',
                        fontSize: '0.68rem', fontWeight: 800, px: 1.5, py: 0.5,
                        borderRadius: 9999, letterSpacing: '0.06em',
                      }}>
                        {tier.badge}
                      </Box>
                    )}

                    {/* Header */}
                    <Box sx={{ background: tier.gradient, p: 3.5, pb: 3 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', mb: 0.5 }}>
                        {tier.label.toUpperCase()}
                      </Typography>
                      <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '2rem', lineHeight: 1, mb: 0.3 }}>
                        {tier.units}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{tier.unitLabel}</Typography>
                      <Box sx={{ mt: 2, p: 1.5, background: 'rgba(255,255,255,0.12)', borderRadius: 2, display: 'inline-block' }}>
                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{tier.priceNote}</Typography>
                      </Box>
                    </Box>

                    {/* Lead time */}
                    <Box sx={{ px: 3, py: 1.5, background: `${tier.color}08`, borderBottom: '1px solid #F0F4F8' }}>
                      <Typography sx={{ fontSize: '0.78rem', color: tier.color, fontWeight: 700 }}>
                        🚚 Lead time: {tier.leadTime}
                      </Typography>
                    </Box>

                    {/* Features */}
                    <Box sx={{ p: 3, flex: 1 }}>
                      <List dense disablePadding>
                        {tier.features.map(f => (
                          <ListItem key={f} disablePadding sx={{ mb: 0.6 }}>
                            <ListItemIcon sx={{ minWidth: 26 }}>
                              <CheckCircleIcon sx={{ fontSize: 16, color: tier.color }} />
                            </ListItemIcon>
                            <ListItemText primary={f} primaryTypographyProps={{ fontSize: '0.85rem', color: '#0A2342', fontWeight: 500 }} />
                          </ListItem>
                        ))}
                        {tier.notIncluded.map(f => (
                          <ListItem key={f} disablePadding sx={{ mb: 0.6, opacity: 0.4 }}>
                            <ListItemIcon sx={{ minWidth: 26 }}>
                              <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{ width: 8, height: 1.5, background: '#ccc' }} />
                              </Box>
                            </ListItemIcon>
                            <ListItemText primary={f} primaryTypographyProps={{ fontSize: '0.83rem', color: 'var(--text-muted)', textDecoration: 'line-through' }} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {/* CTA */}
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button component={Link} to="/contact" fullWidth variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          borderRadius: 9999, background: tier.gradient,
                          fontWeight: 700, py: 1.3, fontSize: '0.92rem',
                          boxShadow: `0 6px 20px ${tier.color}35`,
                          '&:hover': { boxShadow: `0 10px 30px ${tier.color}55` },
                        }}>
                        Get Exact Quote
                      </Button>
                      <Button
                        component="a"
                        href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in the ${tier.label} plan (${tier.units} units) for Sierra Pure mineral water. Please share pricing.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        fullWidth startIcon={<WhatsAppIcon />}
                        sx={{ mt: 1, borderRadius: 9999, color: '#25D366', fontWeight: 600, fontSize: '0.85rem',
                          '&:hover': { background: '#25D36610' } }}>
                        Chat on WhatsApp
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Why choose Sierra Pure */}
          <Box sx={{ mb: 10 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="overline" sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em' }}>
                Why B2B Clients Choose Sierra Pure
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, color: '#0A2342', mt: 1, fontFamily: "'Playfair Display', serif" }}>
                Built for Business
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {WHY_ITEMS.map((item, i) => (
                <Grid item xs={12} sm={6} md={3} key={item.title}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Box sx={{ p: 3, background: 'white', borderRadius: 3, border: '1px solid #E2EAF4', height: '100%',
                      transition: 'all 0.25s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 36px rgba(10,35,66,0.08)' } }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 2.5, background: '#EEF4FF', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', mb: 2, color: '#1565C0' }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: '#0A2342', mb: 0.8, fontSize: '0.98rem' }}>{item.title}</Typography>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.7 }}>{item.desc}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Note section */}
          <Box sx={{ p: { xs: 3, md: 5 }, background: 'linear-gradient(135deg, #0A2342, #1565C0)', borderRadius: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.8rem' },
              fontFamily: "'Playfair Display', serif", mb: 1.5 }}>
              Prices shown are indicative estimates.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', mb: 3, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
              Final pricing depends on bottle size mix, label requirements, delivery location, and order frequency.
              Our team responds within 4 hours during business hours.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button component={Link} to="/contact" variant="contained" size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 9999, background: 'white', color: '#0A2342', fontWeight: 700, px: 4, py: 1.4,
                  '&:hover': { background: '#F0F4F8' } }}>
                Request Formal Quote
              </Button>
              <Button component="a" href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                variant="outlined" size="large" startIcon={<WhatsAppIcon />}
                sx={{ borderRadius: 9999, borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontWeight: 700, px: 4, py: 1.4,
                  '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' } }}>
                WhatsApp Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
