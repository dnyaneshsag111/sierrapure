import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, Button, Step, Stepper, StepLabel, StepContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const STEPS = [
  { label: 'Choose Bottle Size', desc: 'Select from 200ml, 500ml, or 1000ml based on your use case and volume requirements.' },
  { label: 'Design Your Label', desc: 'Share your logo, brand colors, and design preferences. Our team creates a premium label design for approval.' },
  { label: 'Review & Approve', desc: 'Review the label design digitally and approve. Revisions are included at no extra cost.' },
  { label: 'Production', desc: 'We manufacture your branded bottles with the same rigorous 7-stage filtration and quality standards.' },
  { label: 'Delivery', desc: 'Packaged securely and delivered to your location on schedule. Bulk orders get priority delivery.' },
];

const SEGMENTS = [
  { icon: '🏨', label: 'Hotels & Resorts', desc: 'In-room, lobby, restaurant, and banquet custom bottles. Reflect your brand in every sip.', color: '#C9A84C' },
  { icon: '🍽️', label: 'Restaurants & Cafés', desc: 'Table-service custom bottles that elevate your dining experience and brand visibility.', color: '#E74C3C' },
  { icon: '🏭', label: 'Corporates & Industry', desc: 'Bulk supply for offices, factories, and campuses with custom corporate branding.', color: '#1B6CA8' },
  { icon: '✈️', label: 'Travel & Transport', desc: 'Compact 200ml bottles for airlines, buses, trains, and travel operators.', color: '#4FC3F7' },
  { icon: '🎉', label: 'Events & Weddings', desc: 'Personalized wedding and event bottles. Make every occasion memorable.', color: '#2ECC71' },
  { icon: '🎁', label: 'Corporate Gifting', desc: 'Premium branded water bottles as corporate gifts, hampers, and promotional items.', color: '#9B59B6' },
];

export default function Customization() {
  return (
    <>
      <Helmet>
        <title>Customization | Sierra Pure</title>
        <meta name="description" content="Get custom-labeled Sierra Pure mineral water bottles for hotels, restaurants, events, travel, and corporate branding." />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', py: { xs: 8, md: 14 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '-30%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(79,195,247,0.06)' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.18em', fontWeight: 700 }}>Custom Branding</Typography>
            <Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.4rem', md: '3.4rem' }, mt: 1, mb: 2.5 }}>
              Your Brand.<br />Our Premium Quality.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.85, mb: 4 }}>
              Custom-labeled Sierra Pure water bottles with your logo and brand identity.
              Minimum 500 units. Fast turnaround. Premium finish.
            </Typography>
            <Button component={Link} to="/contact" variant="contained" size="large" endIcon={<ArrowForwardIcon />}
              sx={{ background: 'linear-gradient(135deg, #4FC3F7, #81D4FA)', color: '#0A2342', fontWeight: 700, px: 4, py: 1.6, borderRadius: 9999, boxShadow: '0 8px 32px rgba(79,195,247,0.4)' }}>
              Request Custom Quote
            </Button>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      {/* Who we serve */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: '#F8FBFF' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#0A2342' }}>Who We Customize For</Typography>
          </Box>
          <Grid container spacing={3}>
            {SEGMENTS.map((seg, i) => (
              <Grid item xs={12} sm={6} md={4} key={seg.label}>
                <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Box
                    sx={{
                      p: 4, background: 'white', borderRadius: 4, border: '1px solid #E2EAF4',
                      transition: 'all 0.3s ease', height: '100%',
                      '&:hover': { borderColor: seg.color, boxShadow: `0 12px 40px ${seg.color}22`, transform: 'translateY(-6px)' },
                    }}
                  >
                    <Typography sx={{ fontSize: '2.8rem', mb: 2 }}>{seg.icon}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A2342', mb: 1.5 }}>{seg.label}</Typography>
                    <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.92rem' }}>{seg.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Process steps */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'white' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#0A2342' }}>
              How It Works
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', mt: 1.5, fontSize: '1rem' }}>
              Simple 5-step process from enquiry to delivery
            </Typography>
          </Box>
          <Stepper orientation="vertical">
            {STEPS.map((step, i) => (
              <Step key={step.label} active>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.MuiStepIcon-root': { color: '#1B6CA8', fontSize: 32 },
                      '&.MuiStepIcon-root.Mui-active': { color: '#0A2342' },
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1.05rem' }}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.75, pb: 2, fontSize: '0.92rem' }}>
                    {step.desc}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button component={Link} to="/contact" variant="contained" size="large" endIcon={<ArrowForwardIcon />}
              sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', color: 'white', borderRadius: 9999, px: 4, py: 1.5, boxShadow: '0 4px 20px rgba(10,35,66,0.25)' }}>
              Start Your Custom Order
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
