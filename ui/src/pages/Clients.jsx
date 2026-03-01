import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Tab, Tabs, Chip, Skeleton, Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useClients } from '../hooks/useClients';
import { SEGMENTS } from '../utils/constants';

const ALL_TABS = [{ value: '', label: 'All', icon: '🌐' }, ...SEGMENTS];

function ClientCardSkeleton() {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
      <Box sx={{ borderRadius: 4, border: '1px solid #E2EAF4', p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Skeleton variant="circular" width={56} height={56} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="70%" height={22} />
            <Skeleton width="50%" height={16} />
          </Box>
        </Box>
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
        <Skeleton width="80%" height={16} />
      </Box>
    </Grid>
  );
}

function ClientCard({ client, index }) {
  const segment = SEGMENTS.find((s) => s.value === client.segment);
  const initial = client.name?.charAt(0) ?? '?';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
      <Card
        sx={{
          borderRadius: 4, border: '1px solid #E2EAF4', height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 48px rgba(10,35,66,0.12)', borderColor: segment?.color ?? '#1B6CA8' },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            {client.logoUrl ? (
              <Box
                component="img"
                src={client.logoUrl}
                alt={client.name}
                sx={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 2, border: '1px solid #E2EAF4', p: 0.5 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 56, height: 56, fontSize: '1.4rem', fontWeight: 700,
                  background: `linear-gradient(135deg, ${segment?.color ?? '#1B6CA8'}33, ${segment?.color ?? '#1B6CA8'}11)`,
                  color: segment?.color ?? '#1B6CA8', border: `2px solid ${segment?.color ?? '#1B6CA8'}33`,
                }}
              >
                {initial}
              </Avatar>
            )}
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1rem', lineHeight: 1.3 }}>
                {client.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.4 }}>
                <LocationOnIcon sx={{ fontSize: 12, color: 'var(--text-muted)' }} />
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {client.location}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Segment + Bottle size chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {segment && (
              <Chip
                label={`${segment.icon} ${segment.label}`} size="small"
                sx={{ background: `${segment.color}15`, color: segment.color, fontWeight: 600, fontSize: '0.72rem', borderRadius: 9999 }}
              />
            )}
            {client.bottleSizeUsed && (
              <Chip label={client.bottleSizeUsed} size="small"
                sx={{ background: '#EEF4FF', color: '#1B6CA8', fontWeight: 600, fontSize: '0.72rem', borderRadius: 9999 }} />
            )}
          </Box>

          {/* Description */}
          <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, mb: 2 }}>
            {client.description}
          </Typography>

          {/* Testimonial */}
          {client.testimonial && (
            <Box sx={{ background: '#F5F9FF', borderRadius: 2, p: 2, borderLeft: `3px solid ${segment?.color ?? '#1B6CA8'}` }}>
              <FormatQuoteIcon sx={{ fontSize: 18, color: segment?.color ?? '#1B6CA8', mb: 0.5 }} />
              <Typography sx={{ fontSize: '0.8rem', color: '#0A2342', fontStyle: 'italic', lineHeight: 1.65 }}>
                "{client.testimonial}"
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Clients() {
  const [activeSegment, setActiveSegment] = useState('');
  const { data: clients = [], isLoading } = useClients(activeSegment || undefined);

  return (
    <>
      <Helmet>
        <title>Our Clients | Sierra Pure</title>
        <meta name="description" content="Sierra Pure serves hotels, restaurants, corporates, airlines and event companies across Maharashtra with premium custom-branded mineral water." />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '-30%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(79,195,247,0.06)' }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.18em', fontWeight: 700 }}>
            Trusted By
          </Typography>
          <Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.2rem', md: '3rem' }, mt: 1, mb: 2 }}>
            Our Clients
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            200+ clients across hotels, restaurants, corporates, airlines and events
            trust Sierra Pure for premium quality water supply.
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
          {/* Segment Filter Tabs */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Tabs
              value={activeSegment}
              onChange={(_, v) => setActiveSegment(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                  borderRadius: 9999, mx: 0.5, px: 2.5, py: 1,
                  fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)',
                  minHeight: 42, border: '1px solid #E2EAF4', transition: 'all 0.25s ease',
                },
                '& .Mui-selected': {
                  color: 'white !important',
                  background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
                  border: '1px solid transparent !important',
                  boxShadow: '0 4px 16px rgba(10,35,66,0.25)',
                },
              }}
            >
              {ALL_TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={`${tab.icon} ${tab.label}`} />
              ))}
            </Tabs>
          </Box>

          {/* Client Grid */}
          <Grid container spacing={3}>
            {isLoading
              ? [1, 2, 3, 4, 5, 6].map((i) => <ClientCardSkeleton key={i} />)
              : clients.length === 0
                ? (
                  <Grid size={12}>
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                      <Typography sx={{ color: 'var(--text-muted)' }}>No clients found for this segment.</Typography>
                    </Box>
                  </Grid>
                )
                : clients.map((client, i) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={client.id}>
                    <ClientCard client={client} index={i} />
                  </Grid>
                ))
            }
          </Grid>
        </Container>
      </Box>
    </>
  );
}
