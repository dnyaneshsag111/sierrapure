import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import BrushIcon from '@mui/icons-material/Brush';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const STEPS = [
  {
    number: '01',
    icon: <ChatIcon sx={{ fontSize: 32 }} />,
    title: 'Enquire',
    desc: 'Tell us your volume, bottle size, and branding needs. Get a custom quote within 24 hours.',
    color: '#4FC3F7',
    cta: null,
  },
  {
    number: '02',
    icon: <BrushIcon sx={{ fontSize: 32 }} />,
    title: 'Customise',
    desc: 'Our design team crafts your label. Review digitally and approve — revisions are free.',
    color: '#1B6CA8',
    cta: null,
  },
  {
    number: '03',
    icon: <LocalShippingIcon sx={{ fontSize: 32 }} />,
    title: 'Receive',
    desc: 'Your branded bottles — batch-tested, QR-linked and packed — delivered on schedule.',
    color: '#2ECC71',
    cta: null,
  },
];

export default function HowToOrder() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #F0F7FF 0%, #F8FBFF 100%)' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline"
              sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
              Simple Process
            </Typography>
            <Typography variant="h2"
              sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.8rem' }, color: '#0B1F3A' }}>
              How to Order
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', maxWidth: 480, mx: 'auto', fontSize: '1rem', lineHeight: 1.8 }}>
              Getting your custom-branded Sierra Pure water is a 3-step process.
              Most orders are delivered within 7–10 business days.
            </Typography>
          </motion.div>
        </Box>

        {/* Steps */}
        <Grid container spacing={3} justifyContent="center" sx={{ position: 'relative' }}>
          {/* Connector line — desktop only */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: 52,
            left: '16%',
            right: '16%',
            height: 2,
            background: 'linear-gradient(90deg, #4FC3F7, #1B6CA8, #2ECC71)',
            zIndex: 0,
            opacity: 0.35,
          }} />

          {STEPS.map((step, i) => (
            <Grid item xs={12} sm={4} key={step.number}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  {/* Icon circle */}
                  <Box sx={{
                    width: 88, height: 88,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${step.color}20, ${step.color}08)`,
                    border: `2px solid ${step.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 3,
                    position: 'relative',
                    boxShadow: `0 8px 24px ${step.color}20`,
                    color: step.color,
                  }}>
                    {step.icon}
                    {/* Step number badge */}
                    <Box sx={{
                      position: 'absolute', top: -6, right: -6,
                      width: 28, height: 28,
                      borderRadius: '50%',
                      background: step.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 4px 12px ${step.color}50`,
                    }}>
                      <Typography sx={{ color: 'white', fontSize: '0.7rem', fontWeight: 800, lineHeight: 1 }}>
                        {step.number}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1.15rem', mb: 1.5 }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.75, maxWidth: 260, mx: 'auto' }}>
                    {step.desc}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
          <Box sx={{ textAlign: 'center', mt: 7, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link} to="/contact"
              variant="contained" size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: 'linear-gradient(135deg, #0A2342, #1565C0)',
                color: 'white', borderRadius: 9999,
                px: 4.5, py: 1.6, fontWeight: 700,
                boxShadow: '0 8px 24px rgba(10,35,66,0.25)',
                '&:hover': { boxShadow: '0 12px 36px rgba(10,35,66,0.35)', transform: 'translateY(-2px)' },
              }}
            >
              Start Your Order
            </Button>
            <Button
              component={Link} to="/customization"
              variant="outlined" size="large"
              sx={{
                borderColor: '#1B6CA8', color: '#1B6CA8',
                borderRadius: 9999, px: 4, py: 1.6, fontWeight: 600,
                '&:hover': { background: '#1B6CA808', borderColor: '#0A2342', color: '#0A2342' },
              }}
            >
              Learn About Customization
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
