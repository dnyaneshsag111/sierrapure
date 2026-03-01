import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import ScienceIcon from '@mui/icons-material/Science';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VerifiedIcon from '@mui/icons-material/Verified';
import TuneIcon from '@mui/icons-material/Tune';

const STAGES = [
  {
    number: '01',
    icon: <FilterAltIcon sx={{ fontSize: 30 }} />,
    title: 'Sediment Filter',
    desc: 'Removes dust, sand, rust, and large suspended particles down to 5 microns.',
    benefit: 'Crystal clear water',
    color: '#4FC3F7',
  },
  {
    number: '02',
    icon: <LocalDrinkIcon sx={{ fontSize: 30 }} />,
    title: 'Activated Carbon',
    desc: 'Eliminates chlorine, organic compounds, bad odours and improves taste.',
    benefit: 'Pure taste & odour',
    color: '#1B6CA8',
  },
  {
    number: '03',
    icon: <TuneIcon sx={{ fontSize: 30 }} />,
    title: 'Reverse Osmosis',
    desc: 'High-pressure membrane filters dissolved salts, heavy metals and microbes.',
    benefit: 'Remove contaminants',
    color: '#0A2342',
  },
  {
    number: '04',
    icon: <WbSunnyIcon sx={{ fontSize: 30 }} />,
    title: 'UV Sterilisation',
    desc: 'Ultraviolet light destroys 99.9% of bacteria, viruses and pathogens.',
    benefit: '99.9% bacteria-free',
    color: '#C9A84C',
  },
  {
    number: '05',
    icon: <WaterDropIcon sx={{ fontSize: 30 }} />,
    title: 'Ozonation',
    desc: 'Ozone treatment provides a final kill step and extends shelf life naturally.',
    benefit: 'Extended freshness',
    color: '#2ECC71',
  },
  {
    number: '06',
    icon: <ScienceIcon sx={{ fontSize: 30 }} />,
    title: 'Mineral Addition',
    desc: 'Essential minerals (Ca, Mg, K) added back in precise WHO-compliant proportions.',
    benefit: 'Balanced minerals',
    color: '#9B59B6',
  },
  {
    number: '07',
    icon: <VerifiedIcon sx={{ fontSize: 30 }} />,
    title: 'Quality Check',
    desc: 'Final NABL-certified lab test for TDS, pH, microbial safety before bottling.',
    benefit: 'Lab certified batch',
    color: '#E74C3C',
  },
];

export default function FiltrationProcess() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: 'white' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline"
              sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
              Our Technology
            </Typography>
            <Typography variant="h2"
              sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.8rem' }, color: '#0B1F3A' }}>
              7-Stage Filtration Process
            </Typography>
            <Typography
              sx={{ color: 'var(--text-muted)', maxWidth: 560, mx: 'auto', fontSize: '1rem', lineHeight: 1.8 }}>
              Every drop of Sierra Pure water passes through seven rigorous purification
              stages before it reaches your bottle.
            </Typography>
          </motion.div>
        </Box>

        {/* Process Flow */}
        <Grid container spacing={3} justifyContent="center">
          {STAGES.map((stage, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={stage.number}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Box
                  sx={{
                    p: 3.5, borderRadius: 4, height: '100%',
                    border: '1px solid #E2EAF4',
                    background: 'white',
                    position: 'relative', overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: stage.color,
                      boxShadow: `0 16px 48px ${stage.color}22`,
                      transform: 'translateY(-6px)',
                    },
                  }}
                >
                  {/* Stage number watermark */}
                  <Typography
                    sx={{
                      position: 'absolute', top: 12, right: 16,
                      fontSize: '3.5rem', fontWeight: 900, lineHeight: 1,
                      color: `${stage.color}10`,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {stage.number}
                  </Typography>

                  {/* Icon */}
                  <Box
                    sx={{
                      width: 60, height: 60, borderRadius: 3, mb: 2.5,
                      background: `linear-gradient(135deg, ${stage.color}22, ${stage.color}0a)`,
                      border: `1.5px solid ${stage.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: stage.color,
                    }}
                  >
                    {stage.icon}
                  </Box>

                  {/* Step label */}
                  <Typography
                    sx={{
                      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
                      color: stage.color, mb: 0.8, textTransform: 'uppercase',
                    }}
                  >
                    Stage {stage.number}
                  </Typography>

                  <Typography variant="h6"
                    sx={{ fontWeight: 700, color: '#0A2342', mb: 1.2, fontSize: '1rem' }}>
                    {stage.title}
                  </Typography>

                  <Typography
                    sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.75, mb: 2 }}>
                    {stage.desc}
                  </Typography>

                  {/* Benefit pill */}
                  <Box
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.6,
                      px: 1.5, py: 0.5,
                      background: `${stage.color}12`,
                      border: `1px solid ${stage.color}25`,
                      borderRadius: 9999,
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: stage.color }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: stage.color }}>
                      {stage.benefit}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Flow connector line (desktop) */}
        <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'center', mt: 5 }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              background: 'linear-gradient(135deg, #F0F7FF, #EEF4FF)',
              border: '1px solid #D0E8FF',
              borderRadius: 9999, px: 4, py: 1.5,
            }}
          >
            <VerifiedIcon sx={{ color: '#2ECC71', fontSize: 18 }} />
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0A2342' }}>
              Every batch is individually tested and certified before distribution
            </Typography>
            <VerifiedIcon sx={{ color: '#2ECC71', fontSize: 18 }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
