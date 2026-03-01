import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>404 — Page Not Found | Sierra Pure</title></Helmet>
      <Box sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A2342 0%, #1B6CA8 60%, #0A2342 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        {[{ top: '10%', left: '5%', size: 300 }, { bottom: '10%', right: '5%', size: 400 }].map((b, i) => (
          <Box key={i} sx={{
            position: 'absolute', width: b.size, height: b.size, borderRadius: '50%',
            background: 'rgba(79,195,247,0.06)', top: b.top, left: b.left, bottom: b.bottom, right: b.right,
          }} />
        ))}

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            {/* Large 404 */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Typography sx={{
                fontSize: { xs: '7rem', md: '10rem' }, fontWeight: 900,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(79,195,247,0.4))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 1, letterSpacing: '-0.05em', fontFamily: "'Playfair Display', serif",
              }}>
                404
              </Typography>
            </motion.div>

            {/* Water drop icon */}
            <Box sx={{ fontSize: '4rem', mb: 2, mt: -2 }}>💧</Box>

            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1.5, fontFamily: "'Playfair Display', serif" }}>
              Page Not Found
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.8, mb: 4, px: 2 }}>
              The page you're looking for has drifted away like a water drop in the ocean.
              Let us guide you back to solid ground.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link} to="/" variant="contained" startIcon={<HomeIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #4FC3F7, #81D4FA)', color: '#0A2342',
                  fontWeight: 700, px: 3, py: 1.4, borderRadius: 9999,
                  boxShadow: '0 8px 24px rgba(79,195,247,0.4)',
                  '&:hover': { boxShadow: '0 12px 32px rgba(79,195,247,0.55)' },
                }}
              >
                Go Home
              </Button>
              <Button
                onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)', color: 'white', fontWeight: 600,
                  px: 3, py: 1.4, borderRadius: 9999,
                  '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.08)' },
                }}
              >
                Go Back
              </Button>
            </Box>

            {/* Quick links */}
            <Box sx={{ mt: 5, display: 'flex', gap: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { to: '/products', label: 'Products' },
                { to: '/lab-reports', label: 'Lab Reports' },
                { to: '/contact', label: 'Contact' },
              ].map(l => (
                <Link key={l.to} to={l.to}
                  style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
                  {l.label}
                </Link>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
