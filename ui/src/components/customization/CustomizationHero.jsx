import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CustomizationHero() {
  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', py: { xs: 8, md: 14 }, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: '-30%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(79,195,247,0.06)' }} />
      <Box sx={{ position: 'absolute', bottom: '-20%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(201,168,76,0.05)' }} />
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.18em', fontWeight: 700 }}>
            Custom Branding
          </Typography>
          <Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.4rem', md: '3.4rem' }, mt: 1, mb: 2.5 }}>
            Your Brand.<br />Our Premium Quality.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.85, mb: 4 }}>
            Custom-labeled Sierra Pure water bottles with your logo and brand identity.
            Minimum 500 units. Fast turnaround. Premium finish.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box component={Link} to="/contact" sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              background: 'linear-gradient(135deg, #4FC3F7, #81D4FA)', color: '#0A2342',
              fontWeight: 700, px: 4, py: 1.6, borderRadius: 9999, textDecoration: 'none',
              fontSize: '0.95rem', boxShadow: '0 8px 32px rgba(79,195,247,0.4)',
              transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 12px 40px rgba(79,195,247,0.55)', transform: 'translateY(-2px)' },
            }}>
              Request Custom Quote <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
