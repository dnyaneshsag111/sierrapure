import { Box, Container, Typography, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import TerrainIcon from '@mui/icons-material/Terrain';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ScienceIcon from '@mui/icons-material/Science';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const JOURNEY_STEPS = [
  {
    icon: <TerrainIcon sx={{ fontSize: 28, color: '#4FC3F7' }} />,
    label: 'Source',
    title: 'Western Ghats Aquifer',
    desc: 'Deep underground aquifer in the Sahyadri mountain range, 320m below surface.',
    color: '#4FC3F7',
  },
  {
    icon: <WaterDropIcon sx={{ fontSize: 28, color: '#1B6CA8' }} />,
    label: 'Collection',
    title: 'Natural Mineral Formation',
    desc: 'Water naturally filters through granite rock layers over 40+ years, absorbing essential minerals.',
    color: '#1B6CA8',
  },
  {
    icon: <FilterAltIcon sx={{ fontSize: 28, color: '#0A2342' }} />,
    label: 'Purification',
    title: '7-Stage Filtration',
    desc: 'Advanced purification retains natural minerals while removing all contaminants.',
    color: '#0A2342',
  },
  {
    icon: <ScienceIcon sx={{ fontSize: 28, color: '#2ECC71' }} />,
    label: 'Verified',
    title: 'NABL Lab Certified',
    desc: 'Every batch independently tested before bottling. Results published online.',
    color: '#2ECC71',
  },
];

const SOURCE_STATS = [
  { value: '320m', label: 'Aquifer Depth' },
  { value: '40+', label: 'Years Formation' },
  { value: '7.4', label: 'Natural pH' },
  { value: '142', label: 'TDS (mg/L)' },
];

export default function WaterSourceStory() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #F8FBFF 0%, white 100%)' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline"
              sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
              Our Source
            </Typography>
            <Typography variant="h2"
              sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.8rem' }, color: '#0B1F3A' }}>
              Where Our Water Begins
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', maxWidth: 580, mx: 'auto', fontSize: '1rem', lineHeight: 1.8 }}>
              Sierra Pure originates from a deep natural aquifer in the Western Ghats —
              one of the world's biodiversity hotspots. The water spends decades
              percolating through ancient granite, naturally acquiring the perfect mineral balance.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4} alignItems="center">
          {/* Left — Journey Steps */}
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'relative' }}>
              {/* Vertical connector line */}
              <Box sx={{
                position: 'absolute',
                left: { xs: 24, sm: 28 },
                top: 48,
                bottom: 48,
                width: 2,
                background: 'linear-gradient(180deg, #4FC3F7, #1B6CA8, #0A2342, #2ECC71)',
                zIndex: 0,
              }} />

              {JOURNEY_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Box sx={{ display: 'flex', gap: 3, mb: 3, position: 'relative', zIndex: 1 }}>
                    {/* Icon circle */}
                    <Box sx={{
                      flexShrink: 0,
                      width: 56, height: 56,
                      borderRadius: '50%',
                      background: `${step.color}15`,
                      border: `2px solid ${step.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 4px 16px ${step.color}20`,
                    }}>
                      {step.icon}
                    </Box>
                    {/* Content */}
                    <Box sx={{
                      flex: 1, p: 3,
                      background: 'white',
                      borderRadius: 3,
                      border: '1px solid #E2EAF4',
                      boxShadow: '0 4px 16px rgba(10,35,66,0.06)',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip label={step.label} size="small"
                          sx={{ background: `${step.color}15`, color: step.color, fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1rem', mb: 0.5 }}>
                        {step.title}
                      </Typography>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.87rem', lineHeight: 1.7 }}>
                        {step.desc}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Grid>

          {/* Right — Source Stats Card */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #0A2342 0%, #1565C0 100%)',
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(10,35,66,0.25)',
              }}>
                {/* Decorative circles */}
                <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(79,195,247,0.08)' }} />
                <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,168,76,0.06)' }} />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.15em', fontWeight: 700, fontSize: '0.72rem' }}>
                    Source Water Profile
                  </Typography>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.3rem', mt: 1, mb: 0.5, fontFamily: "'Playfair Display', serif" }}>
                    Sahyadri Mountain Aquifer
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', mb: 4 }}>
                    Maharashtra, India · 18.5°N, 73.8°E
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    {SOURCE_STATS.map((stat) => (
                      <Grid item xs={6} key={stat.label}>
                        <Box sx={{
                          background: 'rgba(255,255,255,0.07)',
                          borderRadius: 3,
                          p: 2.5,
                          border: '1px solid rgba(255,255,255,0.1)',
                          textAlign: 'center',
                        }}>
                          <Typography sx={{ color: '#4FC3F7', fontWeight: 800, fontSize: '1.6rem', lineHeight: 1 }}>
                            {stat.value}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', mt: 0.5 }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  {/* TDS/pH comparison */}
                  <Box sx={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, p: 2.5, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 700, mb: 1.5, letterSpacing: '0.08em' }}>
                      SOURCE → BOTTLED WATER
                    </Typography>
                    {[
                      { label: 'TDS', source: '185 mg/L', final: '142 mg/L', note: 'Optimal range' },
                      { label: 'pH', source: '7.4', final: '7.2 – 7.6', note: 'Neutral' },
                    ].map((row) => (
                      <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', width: 32 }}>{row.label}</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>{row.source}</Typography>
                        <Typography sx={{ color: '#4FC3F7', fontSize: '0.9rem' }}>→</Typography>
                        <Typography sx={{ color: '#4FC3F7', fontWeight: 700, fontSize: '0.82rem' }}>{row.final}</Typography>
                        <Typography sx={{ color: '#2ECC71', fontSize: '0.7rem' }}>{row.note}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
