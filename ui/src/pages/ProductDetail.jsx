import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box, Container, Typography, Grid, Button, Chip, Divider,
  Table, TableBody, TableRow, TableCell, Skeleton, Accordion,
  AccordionSummary, AccordionDetails, Breadcrumbs,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScienceIcon from '@mui/icons-material/Science';
import QrCodeIcon from '@mui/icons-material/QrCode';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useProduct } from '../hooks/useProducts';
import { BOTTLE_COLORS, SEGMENTS } from '../utils/constants';
import { MINERAL_DATA } from '../components/common/MineralProfile';
import bottle200 from '../assets/images/bottle-200ml.svg';
import bottle500 from '../assets/images/bottle-500ml.svg';
import bottle1000 from '../assets/images/bottle-1000ml.svg';

const BOTTLE_IMAGES = { '200ml': bottle200, '500ml': bottle500, '1000ml': bottle1000 };

const HEALTH_BENEFITS = [
  { mineral: 'Ca²⁺', icon: '🦴', title: 'Strong Bones & Teeth', desc: 'Calcium at 32 mg/L supports skeletal strength and dental health — essential for growing children and active adults.' },
  { mineral: 'Mg²⁺', icon: '💪', title: 'Muscle Recovery', desc: 'Magnesium at 12 mg/L aids muscle contraction and nerve function — ideal for athletes and physically active individuals.' },
  { mineral: 'Na⁺',  icon: '❤️', title: 'Heart Healthy', desc: 'Low sodium at just 8 mg/L means Sierra Pure is safe for those monitoring cardiovascular health and blood pressure.' },
  { mineral: 'HCO₃⁻', icon: '⚖️', title: 'Natural Alkalinity', desc: 'Bicarbonates at 95 mg/L naturally buffer acidity, promoting a healthy digestive environment and pH balance.' },
];

const CERTIFICATIONS = [
  { label: 'BIS IS 13428',   desc: 'Bureau of Indian Standards — Packaged Natural Mineral Water',       icon: '🏆' },
  { label: 'FSSAI Licensed', desc: 'Food Safety and Standards Authority of India — License No. XXXXXXX', icon: '🛡️' },
  { label: 'NABL Accredited',desc: 'National Accreditation Board for Testing & Calibration Labs',        icon: '🔬' },
  { label: 'ISO 9001:2015',  desc: 'Quality Management System — International Standards Organisation',   icon: '✅' },
];

function ProductSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Skeleton variant="rectangular" height={440} sx={{ borderRadius: 4 }} />
        </Grid>
        <Grid item xs={12} md={7}>
          <Skeleton width="40%" height={24} sx={{ mb: 1 }} />
          <Skeleton width="70%" height={48} sx={{ mb: 2 }} />
          <Skeleton width="100%" height={80} sx={{ mb: 3 }} />
          <Skeleton width="100%" height={180} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) return <ProductSkeleton />;
  if (isError || !product) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#0A2342', mb: 2 }}>Product not found</Typography>
        <Button component={Link} to="/products" startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 9999, color: '#1B6CA8' }}>Back to Products</Button>
      </Container>
    );
  }

  const color      = BOTTLE_COLORS[product.size] ?? '#1B6CA8';
  const bottleImg  = product.imageUrl || BOTTLE_IMAGES[product.size];
  const segments   = (product.targetSegments ?? []).map(s => SEGMENTS.find(x => x.value === s)).filter(Boolean);
  const packConfs  = product.packConfigurations ?? [];

  return (
    <>
      <Helmet>
        <title>{product.name} | Sierra Pure</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Hero bar */}
      <Box sx={{ background: `linear-gradient(135deg, #0A2342, ${color}CC)`, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="xl">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 2, '& *': { color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem' } }}>
            <Box component={Link} to="/" sx={{ textDecoration: 'none', '&:hover': { color: 'white' } }}>Home</Box>
            <Box component={Link} to="/products" sx={{ textDecoration: 'none', '&:hover': { color: 'white' } }}>Products</Box>
            <Typography sx={{ color: 'white !important', fontSize: '0.82rem' }}>{product.name}</Typography>
          </Breadcrumbs>
          <Typography variant="h1"
            sx={{ color: 'white', fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800 }}>
            {product.name}
          </Typography>
          <Chip label={product.size} sx={{ mt: 1.5, background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 700, fontSize: '0.9rem', borderRadius: 9999 }} />
        </Container>
      </Box>

      <Box sx={{ background: '#F8FBFF', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">

          {/* ── Section 1: Hero image + Key Info ── */}
          <Grid container spacing={6} sx={{ mb: 8 }}>

            {/* Left – Bottle image */}
            <Grid item xs={12} md={5}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <Box sx={{
                  background: `linear-gradient(135deg, ${color}10, ${color}04)`,
                  borderRadius: 5, border: `1px solid ${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: { xs: 300, md: 480 }, position: 'relative', overflow: 'hidden',
                }}>
                  {/* Glow */}
                  <Box sx={{
                    position: 'absolute', width: 280, height: 280, borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}18, transparent 70%)`,
                  }} />
                  <Box
                    component="img" src={bottleImg} alt={product.name}
                    sx={{ height: { xs: 200, md: 360 }, width: 'auto', objectFit: 'contain',
                      filter: `drop-shadow(0 20px 48px ${color}55)`, position: 'relative', zIndex: 1 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  {product.isCustomizable && (
                    <Box sx={{
                      position: 'absolute', top: 16, left: 16, zIndex: 2,
                      background: 'rgba(255,255,255,0.92)', borderRadius: 9999,
                      px: 2, py: 0.6, fontSize: '0.75rem', fontWeight: 700, color: '#0A2342',
                    }}>
                      ✨ Custom Label Available
                    </Box>
                  )}
                </Box>
              </motion.div>
            </Grid>

            {/* Right – Info */}
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>

                {product.priceRange && (
                  <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: color, mb: 1 }}>
                    {product.priceRange}
                  </Typography>
                )}

                <Typography sx={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, mb: 3 }}>
                  {product.description}
                </Typography>

                {/* Target segments */}
                {segments.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', mb: 1 }}>
                      BEST FOR
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {segments.map(s => (
                        <Chip key={s.value} label={`${s.icon} ${s.label}`} size="small"
                          sx={{ background: `${s.color}15`, color: s.color, fontWeight: 700, fontSize: '0.78rem', borderRadius: 9999 }} />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Features */}
                {product.features?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', mb: 1.5 }}>
                      FEATURES
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      {product.features.map(f => (
                        <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VerifiedIcon sx={{ fontSize: 15, color }} />
                          <Typography sx={{ fontSize: '0.9rem', color: '#0A2342', fontWeight: 500 }}>{f}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Pack configurations */}
                {packConfs.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', mb: 1.5 }}>
                      PACK CONFIGURATIONS
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {packConfs.map((pc, i) => (
                        <Box key={i} sx={{
                          border: `1px solid ${color}30`, borderRadius: 2.5,
                          px: 2, py: 1.2, background: `${color}08`, textAlign: 'center', minWidth: 100,
                        }}>
                          <Typography sx={{ fontWeight: 800, color, fontSize: '1.1rem' }}>{pc.quantity}</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {pc.unit} / {pc.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {product.packagingInfo && (
                  <Box sx={{ mb: 3, p: 2, background: '#EEF4FF', borderRadius: 2, border: '1px solid #D4E8FF' }}>
                    <Typography sx={{ fontSize: '0.82rem', color: '#0A2342', lineHeight: 1.7 }}>
                      📦 {product.packagingInfo}
                    </Typography>
                  </Box>
                )}

                {/* CTAs */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  <Button variant="contained" size="large" component={Link} to="/contact"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: `linear-gradient(135deg, #0A2342, ${color})`,
                      borderRadius: 9999, px: 4, py: 1.4, fontWeight: 700,
                      boxShadow: `0 8px 24px ${color}44`,
                    }}>
                    Get a Quote
                  </Button>
                  {product.isCustomizable && (
                    <Button variant="outlined" size="large" component={Link} to="/customization"
                      sx={{ borderRadius: 9999, borderColor: color, color, fontWeight: 700, px: 3, py: 1.4 }}>
                      Custom Label →
                    </Button>
                  )}
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* ── Section 2: Mineral Profile ── */}
          <Box sx={{ mb: 8 }}>
            <SectionHeading icon={<ScienceIcon />} label="Mineral Composition" />
            <Typography sx={{ color: 'var(--text-muted)', mb: 3, fontSize: '0.93rem' }}>
              Exact mineral values per litre — verified by NABL-accredited laboratory. Hover a card to read the health benefit.
            </Typography>
            <Grid container spacing={2}>
              {MINERAL_DATA.map((m, i) => (
                <Grid item xs={6} sm={4} md={3} key={m.symbol}>
                  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                    <Box sx={{
                      p: 2.5, background: 'white', borderRadius: 3,
                      border: `1px solid ${m.color}22`,
                      transition: 'all 0.25s',
                      '&:hover': { boxShadow: `0 8px 28px ${m.color}20`, borderColor: `${m.color}55`, transform: 'translateY(-3px)' },
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: m.color, fontSize: '0.88rem', fontFamily: 'monospace' }}>{m.symbol}</Typography>
                          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{m.name}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 800, color: '#0A2342', fontSize: '1.05rem' }}>{m.value}</Typography>
                          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{m.unit}</Typography>
                        </Box>
                      </Box>
                      {m.dri && (
                        <Box>
                          <Box sx={{ height: 4, background: '#F0F7FF', borderRadius: 9999, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.dri}%` }}
                              viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.06 + 0.3 }}
                              style={{ height: '100%', background: m.color, borderRadius: 9999 }} />
                          </Box>
                          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.62rem', mt: 0.4 }}>{m.dri}% daily intake</Typography>
                        </Box>
                      )}
                      {!m.dri && (
                        <Typography sx={{ color: m.color, fontSize: '0.68rem', fontWeight: 600 }}>{m.benefit}</Typography>
                      )}
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* ── Section 3: Pack Size Table ── */}
          {packConfs.length > 0 && (
            <Box sx={{ mb: 8 }}>
              <SectionHeading icon={<LocalShippingIcon />} label="Pack Size & Ordering Guide" />
              <Box sx={{ background: 'white', borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
                <Table>
                  <TableBody>
                    <TableRow sx={{ background: '#0A2342' }}>
                      {['Pack Type', 'Quantity', 'Unit', 'Ideal For'].map(h => (
                        <TableCell key={h} sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                    {packConfs.map((pc, i) => (
                      <TableRow key={i} sx={{ background: i % 2 === 0 ? 'white' : '#F8FBFF' }}>
                        <TableCell sx={{ fontWeight: 700, color: '#0A2342' }}>{pc.label}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color }}>{pc.quantity}</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)' }}>{pc.unit}</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{pc.idealFor ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* ── Section 4: Health Benefits ── */}
          <Box sx={{ mb: 8 }}>
            <SectionHeading icon={<EmojiEventsIcon />} label="Health Benefits" />
            <Grid container spacing={3}>
              {HEALTH_BENEFITS.map((b, i) => (
                <Grid item xs={12} sm={6} md={3} key={b.title}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Box sx={{
                      p: 3, background: 'white', borderRadius: 3,
                      border: '1px solid #E2EAF4', height: '100%',
                      transition: 'all 0.25s',
                      '&:hover': { boxShadow: '0 8px 32px rgba(10,35,66,0.08)', transform: 'translateY(-4px)' },
                    }}>
                      <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>{b.icon}</Typography>
                      <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.95rem', mb: 0.5 }}>{b.title}</Typography>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.7 }}>{b.desc}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* ── Section 5: Certifications ── */}
          <Box sx={{ mb: 8 }}>
            <SectionHeading icon={<VerifiedIcon />} label="Certifications & Standards" />
            <Grid container spacing={3}>
              {CERTIFICATIONS.map((c, i) => (
                <Grid item xs={12} sm={6} key={c.label}>
                  <motion.div initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Box sx={{
                      display: 'flex', alignItems: 'flex-start', gap: 2,
                      p: 2.5, background: 'white', borderRadius: 3, border: '1px solid #E2EAF4',
                    }}>
                      <Typography sx={{ fontSize: '1.8rem' }}>{c.icon}</Typography>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.95rem' }}>{c.label}</Typography>
                        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.8rem', mt: 0.3, lineHeight: 1.6 }}>{c.desc}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* ── Section 6: QR Traceability ── */}
          <Box sx={{ mb: 8, p: { xs: 3, md: 5 }, background: 'linear-gradient(135deg, #0A2342, #1565C0)', borderRadius: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <QrCodeIcon sx={{ color: '#4FC3F7', fontSize: 40 }} />
                  <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', fontFamily: "'Playfair Display', serif" }}>
                    QR Batch Traceability
                  </Typography>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.8, mb: 2 }}>
                  Every Sierra Pure bottle carries a unique QR code linked to its batch lab report.
                  Scan it to instantly verify: testing date, all parameters tested, and the PASS/FAIL status —
                  in real time, from any device. No other brand in Maharashtra offers this level of transparency.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button component={Link} to="/lab-reports" variant="outlined" size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 9999, borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontWeight: 700, px: 3,
                    '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: 'white' } }}>
                  View Lab Reports
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* ── Section 7: FAQ ── */}
          <Box sx={{ mb: 6 }}>
            <SectionHeading label="Frequently Asked Questions" />
            {[
              { q: `What is the MOQ for the ${product.size} bottle?`, a: 'Minimum order quantity is 500 units per SKU. Volume discounts apply from 1,000 units.' },
              { q: 'Can I get a custom label on this product?', a: product.isCustomizable ? 'Yes — custom label printing is available for this size. Contact us with your design or our team will create one for you.' : 'Custom labels are currently available on our 500ml and 1000ml ranges. Contact us for more details.' },
              { q: 'What is the shelf life?', a: 'Sierra Pure mineral water has a shelf life of 12 months from the date of manufacture when stored in a cool, dry place away from direct sunlight.' },
              { q: 'Is delivery available pan-India?', a: 'Yes. We deliver across Maharashtra with priority dispatch, and pan-India for orders above 10,000 units.' },
              { q: 'How do I verify the batch quality?', a: 'Every bottle has a QR code on the label. Scan it to instantly view the full NABL lab report for that batch, including all test parameters.' },
            ].map((item, i) => (
              <Accordion key={i} disableGutters elevation={0}
                sx={{ mb: 1, border: '1px solid #E2EAF4', borderRadius: '12px !important', '&::before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#1B6CA8' }} />}
                  sx={{ px: 3, py: 1.5, '& .MuiAccordionSummary-content': { my: 0 } }}>
                  <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.92rem' }}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.8 }}>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Back + CTA */}
          <Divider sx={{ mb: 5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')}
              sx={{ borderRadius: 9999, color: 'var(--text-muted)', fontWeight: 600 }}>
              Back to Products
            </Button>
            <Button variant="contained" component={Link} to="/contact" endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 9999, background: `linear-gradient(135deg, #0A2342, ${color})`,
                fontWeight: 700, px: 4, py: 1.2, boxShadow: `0 6px 20px ${color}40` }}>
              Request a Quote for {product.size}
            </Button>
          </Box>

        </Container>
      </Box>
    </>
  );
}

function SectionHeading({ icon, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
      {icon && <Box sx={{ color: '#1B6CA8', display: 'flex' }}>{icon}</Box>}
      <Typography sx={{ fontWeight: 800, color: '#0A2342', fontSize: { xs: '1.2rem', md: '1.5rem' }, fontFamily: "'Playfair Display', serif" }}>
        {label}
      </Typography>
    </Box>
  );
}
