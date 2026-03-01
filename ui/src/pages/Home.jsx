import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ProductHighlights from '../components/home/ProductHighlights';
import LatestLabReport from '../components/home/LatestLabReport';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ClientSegments from '../components/home/ClientSegments';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <Box sx={{ background: '#F5F9FF' }}>
      <Helmet>
        <title>Sierra Pure | Premium Mineral Water Manufacturer</title>
        <meta
          name="description"
          content="Sierra Pure manufactures premium mineral water bottles (200ml, 500ml, 1000ml) with 7-stage filtration and daily lab-tested quality. Custom branding for hotels, restaurants, industries and travel."
        />
      </Helmet>

      <HeroSection />
      <StatsSection />
      <ProductHighlights />
      <WhyChooseUs />
      <LatestLabReport />
      <ClientSegments />

      {/* Customization CTA Banner */}
      <Box
        sx={{
          py: { xs: 9, md: 12 },
          background: 'linear-gradient(135deg, #0B1F3A 0%, #1565C0 55%, #0F2D54 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-40%',
            right: '-8%',
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'rgba(66,165,245,0.07)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.05)',
          },
        }}
      >
        {/* Gold accent line at top */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #F0C040 50%, #C9A84C 70%, transparent)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: 'inline-block',
                px: 2.5,
                py: 0.6,
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: 9999,
                mb: 2.5,
              }}
            >
              <Typography sx={{ color: '#C9A84C', letterSpacing: '0.2em', fontWeight: 700, fontSize: '0.75rem' }}>
                CUSTOM BRANDING
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontSize: { xs: '2rem', md: '3rem' },
                mt: 1,
                mb: 2.5,
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1.15,
              }}
            >
              Your Brand.{' '}
              <Box component="span" sx={{ color: '#42A5F5' }}>Our Quality.</Box>
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: '1.05rem',
                lineHeight: 1.85,
                mb: 5,
                maxWidth: 580,
                mx: 'auto',
              }}
            >
              Get custom-labeled Sierra Pure water bottles with your logo, colors, and brand identity.
              Perfect for hotels, restaurants, events, and corporate gifting.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/customization"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #42A5F5, #90CAF9)',
                  color: '#0B1F3A',
                  fontWeight: 700,
                  px: 4.5,
                  py: 1.7,
                  borderRadius: 9999,
                  boxShadow: '0 8px 32px rgba(66,165,245,0.4)',
                  '&:hover': { boxShadow: '0 12px 40px rgba(66,165,245,0.6)', transform: 'translateY(-2px)' },
                }}
              >
                Explore Customization
              </Button>
              <Button
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.35)',
                  px: 4,
                  py: 1.7,
                  borderRadius: 9999,
                  '&:hover': { borderColor: '#25D366', color: '#25D366', background: 'rgba(37,211,102,0.08)' },
                }}
              >
                WhatsApp Us
              </Button>
            </Box>
          </motion.div>
        </Container>
        {/* Gold bottom accent */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #F0C040 50%, #C9A84C 70%, transparent)',
          }}
        />
      </Box>
    </Box>
  );
}
