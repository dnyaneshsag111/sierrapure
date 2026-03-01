import { Box, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VerifiedIcon from '@mui/icons-material/Verified';
import ScienceIcon from '@mui/icons-material/Science';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BrushIcon from '@mui/icons-material/Brush';
import SecurityIcon from '@mui/icons-material/Security';

const FEATURES = [
  {
    icon: <WaterDropIcon sx={{ fontSize: 32 }} />,
    title: '7-Stage Filtration',
    description: 'Advanced multi-stage filtration removes all impurities while retaining essential minerals.',
    color: '#42A5F5',
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 32 }} />,
    title: 'BIS Certified',
    description: 'Bureau of Indian Standards certified — meeting the highest national quality standards.',
    color: '#2ECC71',
  },
  {
    icon: <ScienceIcon sx={{ fontSize: 32 }} />,
    title: 'Daily Lab Testing',
    description: 'Every batch tested daily by NABL-certified labs. Full reports published publicly.',
    color: '#1565C0',
  },
  {
    icon: <BrushIcon sx={{ fontSize: 32 }} />,
    title: 'Custom Labelling',
    description: 'Personalized labels for hotels, restaurants, brands and events. Your logo, your identity.',
    color: '#C9A84C',
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 32 }} />,
    title: 'Reliable Supply',
    description: 'Consistent bulk supply with flexible delivery schedules. Never run out of premium water.',
    color: '#1565C0',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: 'QR Transparency',
    description: 'Scan the QR code on any bottle to instantly view the full batch lab report online.',
    color: '#42A5F5',
  },
];

export default function WhyChooseUs() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: 'white' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="overline"
              sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}
            >
              Why Sierra Pure
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.8rem' }, color: '#0B1F3A' }}>
              The Sierra Pure Difference
            </Typography>
            <Typography
              sx={{ color: 'var(--text-muted)', maxWidth: 540, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.8 }}
            >
              We don't just sell water — we deliver a promise of purity, backed by science
              and visible to every customer.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {FEATURES.map((feature, i) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid #DDE6F5',
                    background: 'white',
                    transition: 'all 0.35s ease',
                    cursor: 'default',
                    '&:hover': {
                      borderColor: feature.color,
                      boxShadow: `0 12px 40px ${feature.color}22`,
                      transform: 'translateY(-6px)',
                      '& .feature-icon-box': {
                        background: `${feature.color}18`,
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  <Box
                    className="feature-icon-box"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      background: `${feature.color}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feature.color,
                      mb: 3,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 1.5, fontWeight: 700, color: '#0B1F3A', fontSize: '1.05rem' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.92rem' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
