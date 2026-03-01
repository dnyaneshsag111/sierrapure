import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, Tab, Tabs, Avatar } from '@mui/material';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleIcon from '@mui/icons-material/People';
import { useFeaturedClients } from '../../hooks/useClients';
import { SEGMENTS } from '../../utils/constants';

// Static fallback content per segment
const SEGMENT_META = {
  hotel:      { title: 'Elevate Guest Experience',  description: "Branded mineral water bottles that reflect your hotel's premium identity. Custom labels with your logo, room service delivery, and bulk pricing for 5-star hospitality.", benefits: ['Custom hotel branding','In-room & banquet supply','Flexible batch sizes','Premium label finish'] },
  restaurant: { title: 'Serve with Distinction',    description: 'Elevate every dining experience with Sierra Pure water. Custom label bottles for fine dining, cafes, and banquet halls. Perfect for table service and complimentary water.', benefits: ['Table service bottles','Custom restaurant branding','Eco-friendly packaging','Wholesale rates'] },
  industry:   { title: 'Corporate & Industrial',    description: 'Reliable bulk supply for factories, office campuses, construction sites, and industrial units. Consistent delivery, volume pricing, and tamper-proof packaging.', benefits: ['Bulk volume supply','Tamper-proof caps','Corporate pricing','Scheduled delivery'] },
  travel:     { title: 'Hydration on the Move',     description: 'Compact 200ml bottles for airlines, trains, buses, and travel operators. Lightweight, spill-proof, and perfectly sized for on-the-go hydration during journeys.', benefits: ['Compact 200ml size','Airline grade quality','Lightweight packaging','Travel branding'] },
  events:     { title: 'Events & Weddings',          description: 'Make your event unforgettable with custom-branded water bottles. Perfect for weddings, corporate events, conferences, and sports tournaments with personalized labels.', benefits: ['Event branding','Wedding custom labels','Minimum 500 units','Quick turnaround'] },
};

export default function ClientSegments() {
  const [active, setActive] = useState(0);
  const segment = SEGMENTS[active];
  const meta = SEGMENT_META[segment.value] ?? SEGMENT_META.hotel;

  const { data: featuredClients = [] } = useFeaturedClients();
  const segmentClients = featuredClients.filter((c) => c.segment === segment.value);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #F5F9FF 0%, #EEF4FF 100%)' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 7 } }}>
          <Typography variant="overline" sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
            We Serve
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.8rem' }, color: '#0B1F3A' }}>
            Solutions for Every Sector
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
          <Tabs value={active} onChange={(_, v) => setActive(v)} variant="scrollable" scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': { borderRadius: 9999, mx: 0.5, px: 2.5, py: 1, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', minHeight: 42, border: '1px solid #E2EAF4', transition: 'all 0.25s ease' },
              '& .Mui-selected': { color: 'white !important', background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', border: '1px solid transparent !important', boxShadow: '0 4px 16px rgba(10,35,66,0.25)' },
            }}>
            {SEGMENTS.map((s, i) => <Tab key={s.value} label={`${s.icon} ${s.label}`} value={i} />)}
          </Tabs>
        </Box>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <Grid container spacing={5} alignItems="center">
              {/* Info Card */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, background: 'white', boxShadow: '0 12px 40px rgba(10,35,66,0.1)', border: `2px solid ${segment.color}20` }}>
                  <Typography sx={{ fontSize: '2.8rem', mb: 2, lineHeight: 1 }}>{segment.icon}</Typography>
                  <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.6rem', md: '1.9rem' }, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
                    {meta.title}
                  </Typography>
                  <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.85, mb: 3.5, fontSize: '0.98rem' }}>
                    {meta.description}
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mb: 4 }}>
                    {meta.benefits.map((b) => (
                      <Grid item xs={6} key={b}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, background: `${segment.color}0d`, border: `1px solid ${segment.color}25` }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: segment.color, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0A2342' }}>{b}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button component={Link} to="/customization" variant="contained" endIcon={<ArrowForwardIcon />}
                      sx={{ background: `linear-gradient(135deg, #0A2342, ${segment.color})`, color: 'white', borderRadius: 9999, px: 3, py: 1.3, '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${segment.color}40` } }}>
                      Get Custom Quote
                    </Button>
                    <Button component={Link} to="/clients" variant="outlined" startIcon={<PeopleIcon />}
                      sx={{ borderRadius: 9999, borderColor: segment.color, color: segment.color, px: 2.5, py: 1.3 }}>
                      View All Clients
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Visual — show client logos if available, else decorative */}
              <Grid item xs={12} md={6}>
                {segmentClients.length > 0 ? (
                  <Box sx={{ borderRadius: 4, background: `linear-gradient(135deg, ${segment.color}15, ${segment.color}05)`, border: `2px solid ${segment.color}20`, p: 4 }}>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#0A2342', mb: 3, textAlign: 'center' }}>
                      {segment.label} Clients We Serve
                    </Typography>
                    <Grid container spacing={2}>
                      {segmentClients.slice(0, 4).map((client) => (
                        <Grid item xs={6} key={client.id}>
                          <Box sx={{ background: 'white', borderRadius: 3, p: 2, display: 'flex', alignItems: 'center', gap: 1.5, boxShadow: '0 2px 8px rgba(10,35,66,0.08)' }}>
                            {client.logoUrl ? (
                              <Box component="img" src={client.logoUrl} alt={client.name}
                                sx={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 1 }} />
                            ) : (
                              <Avatar sx={{ width: 36, height: 36, fontSize: '1rem', background: `${segment.color}22`, color: segment.color }}>
                                {client.name?.charAt(0)}
                              </Avatar>
                            )}
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0A2342', lineHeight: 1.3 }}>
                              {client.name}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    {segmentClients.length > 4 && (
                      <Typography sx={{ textAlign: 'center', mt: 2.5, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        +{segmentClients.length - 4} more {segment.label.toLowerCase()} clients
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ height: 380, borderRadius: 4, background: `linear-gradient(135deg, ${segment.color}15, ${segment.color}08)`, border: `2px solid ${segment.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={{ fontSize: '6rem', lineHeight: 1 }}>{segment.icon}</Typography>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#0A2342' }}>
                      {segment.label} Solutions
                    </Typography>
                    <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Custom Sierra Pure branding</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
}
