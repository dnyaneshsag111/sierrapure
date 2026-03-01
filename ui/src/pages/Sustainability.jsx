import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, LinearProgress, Button, Chip, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WaterIcon from '@mui/icons-material/Water';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import Co2Icon from '@mui/icons-material/Co2';
import NatureIcon from '@mui/icons-material/Nature';
import VerifiedIcon from '@mui/icons-material/Verified';

const PILLARS = [
  {
    icon: <RecyclingIcon sx={{ fontSize: 36 }} />,
    color: '#1a8a4a',
    title: 'Recyclable Packaging',
    stat: '100%',
    statLabel: 'PET bottles are 100% recyclable',
    body: 'Every Sierra Pure bottle is made from Food Grade PET (Polyethylene Terephthalate) — the most widely recycled plastic in India. Our bottles carry the standard recycling symbol (PET-1) and weigh 15% less than industry average, reducing plastic per litre used.',
    targets: [
      'Reduce bottle weight by 20% by 2027 (lightweighting programme)',
      'Switch to 30% rPET (recycled PET) content by 2028',
      'Partner with local waste aggregators in Maharashtra for bottle take-back',
    ],
  },
  {
    icon: <WaterIcon sx={{ fontSize: 36 }} />,
    color: '#1565C0',
    title: 'Water Stewardship',
    stat: '8:1',
    statLabel: 'Recovery ratio — 8 litres bottled per 10 litres processed',
    body: 'Our facility operates at an 80% water recovery rate, significantly above the industry norm of 50–60% for RO-based systems. Reject water from our reverse osmosis stage is recycled for facility cleaning and green belt maintenance — not discharged to drain.',
    targets: [
      'Achieve 85% water recovery by 2026',
      'Zero liquid discharge (ZLD) certification by 2027',
      'Rainwater harvesting installation: 50,000 litres capacity',
    ],
  },
  {
    icon: <SolarPowerIcon sx={{ fontSize: 36 }} />,
    color: '#C9A84C',
    title: 'Clean Energy',
    stat: '40%',
    statLabel: 'of facility power from rooftop solar (2025)',
    body: 'In 2024 we commissioned a 120 kWp rooftop solar array, covering approximately 40% of our manufacturing facility\'s daytime energy needs. This displaces an estimated 140 tonnes of CO₂ per year compared to full grid power dependency.',
    targets: [
      'Scale solar to 80% facility coverage by 2026',
      'Evaluate wind energy certificates for the balance 20%',
      'LED upgrade of all facility lighting completed',
    ],
  },
  {
    icon: <Co2Icon sx={{ fontSize: 36 }} />,
    color: '#9B59B6',
    title: 'Carbon Footprint',
    stat: '—',
    statLabel: 'Baseline measurement underway (2026)',
    body: 'We have commissioned a third-party Scope 1 + Scope 2 carbon footprint audit for our facility, results expected Q2 2026. This will form the baseline for our net-zero roadmap. Scope 3 (logistics) measurement follows in 2027.',
    targets: [
      'Publish first GHG inventory by June 2026',
      'Set science-based targets (SBTi) for 2030',
      'Offer carbon-neutral shipping option for enterprise clients by 2027',
    ],
  },
  {
    icon: <NatureIcon sx={{ fontSize: 36 }} />,
    color: '#E67E22',
    title: 'Community & Green Belt',
    stat: '500+',
    statLabel: 'trees planted around facility perimeter (2023–2025)',
    body: 'Sierra Pure has planted over 500 native tree species around our facility boundary, supporting local biodiversity and providing a natural windbreak. We partner with local schools for annual tree planting drives and water awareness workshops.',
    targets: [
      'Plant 1,000 total trees by 2026',
      'Annual school water literacy programme in 5 local villages',
      'Groundwater recharge structure construction underway',
    ],
  },
];

const PROGRESS_ITEMS = [
  { label: 'Bottle recyclability', value: 100, color: '#1a8a4a' },
  { label: 'Water recovery rate', value: 80, color: '#1565C0' },
  { label: 'Solar energy share', value: 40, color: '#C9A84C' },
  { label: 'rPET content (2025)', value: 0, color: '#9B59B6', note: 'Target: 30% by 2028' },
];

const CERTIFICATIONS_PLANNED = [
  { label: 'BIS IS 13428', status: 'Active', color: '#1a8a4a' },
  { label: 'FSSAI Licensed', status: 'Active', color: '#1a8a4a' },
  { label: 'ISO 9001:2015', status: 'Active', color: '#1a8a4a' },
  { label: 'ISO 14001 (Environment)', status: '2027 Target', color: '#C9A84C' },
  { label: 'Zero Liquid Discharge', status: '2027 Target', color: '#C9A84C' },
  { label: 'GHG Scope 1+2 Report', status: 'In Progress', color: '#1565C0' },
];

export default function Sustainability() {
  return (
    <>
      <Helmet>
        <title>Sustainability | Sierra Pure Mineral Water</title>
        <meta name="description" content="Sierra Pure's environmental commitments — recyclable packaging, 80% water recovery, 40% solar energy, carbon footprint roadmap and community green belt programme." />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342 0%, #0A3A2A 60%, #1a8a4a 100%)', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.05, fontSize: '22rem', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          🌿
        </Box>
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.18em', fontWeight: 700 }}>
              Environment & Responsibility
            </Typography>
            <Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2.2rem', md: '3rem' }, mt: 1, mb: 2 }}>
              Sustainability at Sierra Pure
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8, mb: 4, maxWidth: 600, mx: 'auto' }}>
              Producing premium water responsibly — from source protection to recyclable packaging, clean energy to community reforestation.
            </Typography>
            <Chip label="ESG Report 2026 — In Preparation" sx={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, borderRadius: 9999 }} />
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1a8a4a)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      <Box sx={{ background: '#F8FBFF', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">

          {/* Progress snapshot */}
          <Box sx={{ mb: 8, p: { xs: 3, md: 5 }, background: 'white', borderRadius: 4, border: '1px solid #E2EAF4' }}>
            <Typography sx={{ fontWeight: 800, color: '#0A2342', fontSize: '1.2rem', mb: 1, fontFamily: "'Playfair Display', serif" }}>
              2026 Progress Snapshot
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.88rem', mb: 4 }}>
              Key sustainability metrics — updated annually. Full ESG disclosure planned for 2026.
            </Typography>
            <Grid container spacing={4}>
              {PROGRESS_ITEMS.map((item, i) => (
                <Grid item xs={12} sm={6} key={item.label}>
                  <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0A2342' }}>{item.label}</Typography>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: item.color }}>
                        {item.value}%{item.note ? '' : ''}
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={item.value}
                      sx={{ height: 8, borderRadius: 9999, background: '#F0F4F8',
                        '& .MuiLinearProgress-bar': { background: item.color, borderRadius: 9999 } }} />
                    {item.note && <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.72rem', mt: 0.5 }}>{item.note}</Typography>}
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Five pillars */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="overline" sx={{ color: '#1a8a4a', fontWeight: 700, letterSpacing: '0.18em' }}>Our Commitments</Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, color: '#0A2342', mt: 1, fontFamily: "'Playfair Display', serif" }}>
                Five Pillars of Responsible Production
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {PILLARS.map((pillar, i) => (
                <motion.div key={pillar.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Box sx={{ background: 'white', borderRadius: 4, border: '1px solid #E2EAF4', overflow: 'hidden' }}>
                    <Grid container>
                      {/* Color accent side */}
                      <Grid item xs={12} md="auto">
                        <Box sx={{ background: `${pillar.color}12`, borderRight: `3px solid ${pillar.color}`, px: { xs: 3, md: 4 }, py: 4,
                          minWidth: { md: 200 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <Box sx={{ color: pillar.color, mb: 1.5 }}>{pillar.icon}</Box>
                          <Typography sx={{ fontWeight: 800, color: pillar.color, fontSize: '2rem', lineHeight: 1 }}>{pillar.stat}</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)', mt: 0.5, maxWidth: 140, lineHeight: 1.4 }}>{pillar.statLabel}</Typography>
                        </Box>
                      </Grid>
                      {/* Content */}
                      <Grid item xs={12} md>
                        <Box sx={{ p: { xs: 3, md: 4 } }}>
                          <Typography sx={{ fontWeight: 800, color: '#0A2342', fontSize: '1.1rem', mb: 1.5 }}>{pillar.title}</Typography>
                          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8, mb: 2.5 }}>{pillar.body}</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                            {pillar.targets.map(t => (
                              <Box key={t} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: pillar.color, mt: 0.8, flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '0.84rem', color: '#0A2342' }}>{t}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>

          {/* Certifications status */}
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ fontWeight: 800, color: '#0A2342', fontSize: '1.3rem', mb: 3, fontFamily: "'Playfair Display', serif" }}>
              Certifications & Environmental Targets
            </Typography>
            <Grid container spacing={2}>
              {CERTIFICATIONS_PLANNED.map((cert, i) => (
                <Grid item xs={12} sm={6} md={4} key={cert.label}>
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                    <Box sx={{ p: 2.5, background: 'white', borderRadius: 3, border: '1px solid #E2EAF4',
                      display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <VerifiedIcon sx={{ color: cert.color, fontSize: 22 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.9rem' }}>{cert.label}</Typography>
                      </Box>
                      <Chip label={cert.status} size="small"
                        sx={{ background: `${cert.color}15`, color: cert.color, fontWeight: 700, fontSize: '0.65rem', borderRadius: 9999 }} />
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* CTA */}
          <Box sx={{ textAlign: 'center', p: { xs: 4, md: 6 }, background: 'linear-gradient(135deg, #0A3A2A, #1a8a4a)', borderRadius: 4 }}>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.8rem' },
              fontFamily: "'Playfair Display', serif", mb: 1.5 }}>
              Sustainability Is a Supplier Criteria
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.97rem', mb: 3, maxWidth: 560, mx: 'auto', lineHeight: 1.8 }}>
              Hotels, hospitals, and corporates increasingly require ESG credentials from their water suppliers.
              Contact us for our current sustainability documentation, lab certifications, and 2026 ESG disclosure timeline.
            </Typography>
            <Button component={Link} to="/contact" variant="contained" size="large" endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 9999, background: 'white', color: '#0A3A2A', fontWeight: 700, px: 4, py: 1.4,
                '&:hover': { background: '#F0F4F8' } }}>
              Request Sustainability Credentials
            </Button>
          </Box>

        </Container>
      </Box>
    </>
  );
}
