import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Stack, Grid, Chip, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import bottle500Fallback from '../../assets/images/bottle-500ml.svg';
import { useImageAssets } from '../../hooks/useImageAssets';

// Drop your looping video here — hero background (desktop only)
// File: ui/src/assets/videos/sierra-hero.mp4
let heroVideo = null;
try { heroVideo = new URL('../../assets/videos/sierra-hero.mp4', import.meta.url).href; } catch { heroVideo = null; }

const BADGES = ['BIS Certified', 'FSSAI Licensed', '7-Stage Filtration', 'NABL Tested'];

export default function HeroSection() {
  const theme    = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { byLabel } = useImageAssets('HERO_BOTTLE');
  const heroBottle = byLabel['hero-bottle'] || bottle500Fallback;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #050E1A 0%, #0B1F3A 40%, #0F2D54 65%, #1565C0 100%)',
        overflow: 'hidden',
        mb: '-1px',
      }}
    >
      {/* ── Video background (desktop only, optional) ── */}
      {isDesktop && heroVideo && (
        <Box
          component="video"
          src={heroVideo}
          autoPlay muted loop playsInline
          sx={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.18, zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Background blobs */}
      <Box
        sx={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute',
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(66,165,245,0.10) 0%, transparent 70%)',
            top: '-20%', right: '-8%',
          },
          '&::after': {
            content: '""', position: 'absolute',
            width: 550, height: 550, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(21,101,192,0.18) 0%, transparent 70%)',
            bottom: '-10%', left: '-5%',
          },
        }}
      />

      {/* Floating droplets */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          style={{
            position: 'absolute',
            width: 8 + i * 4,
            height: 8 + i * 4,
            borderRadius: '50%',
            background: 'rgba(66,165,245,0.22)',
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">

          {/* Left — Text */}
          <Grid item xs={12} lg={6}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: '16px !important', color: '#42A5F5 !important' }} />}
                  label="Premium Quality Assured"
                  sx={{
                    background: 'rgba(66,165,245,0.12)',
                    border: '1px solid rgba(66,165,245,0.35)',
                    color: '#42A5F5',
                    fontWeight: 600, fontSize: '0.78rem',
                    letterSpacing: '0.06em', borderRadius: 9999, height: 34,
                  }}
                />
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem', lg: '4.6rem' },
                  fontWeight: 800, color: 'white', lineHeight: 1.1, mb: 2,
                }}
              >
                Purity You
                <Box component="span" sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #42A5F5, #90CAF9)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  Can Trust.
                </Box>
              </Typography>

              <Typography sx={{
                color: 'rgba(255,255,255,0.70)',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.85, mb: 4, maxWidth: 520,
              }}>
                Sierra Pure manufactures premium mineral water with 7-stage filtration.
                Every batch is lab-tested, certified, and traceable — right from the bottle
                to the report, with a single QR scan.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  component={Link} to="/products" variant="contained" size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
                    color: 'white', px: 4, py: 1.6, fontSize: '1rem', borderRadius: 9999,
                    boxShadow: '0 8px 32px rgba(66,165,245,0.4)',
                    '&:hover': { boxShadow: '0 12px 40px rgba(66,165,245,0.6)', transform: 'translateY(-3px)' },
                  }}
                >
                  Explore Products
                </Button>
                <Button
                  component={Link} to="/lab-reports" variant="outlined" size="large"
                  startIcon={<PlayCircleOutlineIcon />}
                  sx={{
                    color: 'white', borderColor: 'rgba(255,255,255,0.35)',
                    px: 4, py: 1.6, fontSize: '1rem', borderRadius: 9999,
                    '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)' },
                  }}
                >
                  View Lab Reports
                </Button>
              </Stack>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {BADGES.map((badge) => (
                  <Box key={badge} sx={{
                    display: 'flex', alignItems: 'center', gap: 0.6,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 9999, px: 1.8, py: 0.5,
                    fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500,
                  }}>
                    <VerifiedIcon sx={{ fontSize: 13, color: '#42A5F5' }} />
                    {badge}
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Right — Bottle centred, info cards absolutely positioned around it */}
          <Grid item xs={12} lg={6} sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Fixed-size stage so absolute cards have a reliable anchor */}
              <Box sx={{ width: 480, height: 540, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {/* Bottle — centred, capped so it never bleeds over the cards */}
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Box
                    component="img"
                    src={heroBottle}
                    alt="Sierra Pure 500ml Premium Mineral Water"
                    sx={{
                      maxHeight: 340,
                      maxWidth: 140,
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 20px 44px rgba(21,101,192,0.55))',
                    }}
                  />
                </motion.div>

                {/* pH card — top-right */}
                <Box
                  component={motion.div}
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute', right: 0, top: '10%', zIndex: 3,
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(66,165,245,0.25)',
                    borderRadius: 3, px: 2.5, py: 1.8,
                  }}
                >
                  <Typography sx={{ color: '#42A5F5', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em' }}>pH LEVEL</Typography>
                  <Typography sx={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>7.2</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>Perfectly Balanced</Typography>
                </Box>

                {/* Lab tested — bottom-left */}
                <Box
                  component={motion.div}
                  animate={{ x: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute', left: 0, bottom: '18%', zIndex: 3,
                    background: 'rgba(46,204,113,0.12)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(46,204,113,0.28)',
                    borderRadius: 3, px: 2.5, py: 1.8,
                  }}
                >
                  <Typography sx={{ color: '#2ECC71', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em' }}>✓ LAB TESTED</Typography>
                  <Typography sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Today's Report</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>All Parameters PASS</Typography>
                </Box>

                {/* BIS badge — bottom-right */}
                <Box
                  component={motion.div}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute', right: 0, bottom: '30%', zIndex: 3,
                    background: 'rgba(201,168,76,0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(201,168,76,0.4)',
                    borderRadius: 3, px: 2, py: 1.2,
                  }}
                >
                  <Typography sx={{ color: '#C9A84C', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em' }}>⭐ BIS CERTIFIED</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>Bureau of Indian Standards</Typography>
                </Box>

              </Box>
            </motion.div>
          </Grid>

        </Grid>
      </Container>

      {/* Bottom wave */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#0B1F3A" />
        </svg>
      </Box>
    </Box>
  );
}
