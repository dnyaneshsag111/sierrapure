import { Box, Typography, Grid, Container } from '@mui/material';
import { motion } from 'framer-motion';

const SEGMENTS = [
  { icon: '🏨', label: 'Hotels & Resorts', desc: 'In-room, lobby, restaurant, and banquet custom bottles. Reflect your brand in every sip.', color: '#C9A84C' },
  { icon: '🍽️', label: 'Restaurants & Cafés', desc: 'Table-service custom bottles that elevate your dining experience and brand visibility.', color: '#E74C3C' },
  { icon: '🏭', label: 'Corporates & Industry', desc: 'Bulk supply for offices, factories, and campuses with custom corporate branding.', color: '#1B6CA8' },
  { icon: '✈️', label: 'Travel & Transport', desc: 'Compact 200ml bottles for airlines, buses, trains, and travel operators.', color: '#4FC3F7' },
  { icon: '🎉', label: 'Events & Weddings', desc: 'Personalized wedding and event bottles. Make every occasion memorable.', color: '#2ECC71' },
  { icon: '🎁', label: 'Corporate Gifting', desc: 'Premium branded water bottles as corporate gifts, hampers, and promotional items.', color: '#9B59B6' },
];

export default function WhoWeServe() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: '#F8FBFF' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography variant="overline" sx={{ color: '#1B6CA8', letterSpacing: '0.15em', fontWeight: 700 }}>
            Industries We Serve
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#0A2342', mt: 1 }}>
            Who We Customize For
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {SEGMENTS.map((seg, i) => (
            <Grid item xs={12} sm={6} md={4} key={seg.label}>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Box sx={{
                  p: 4, background: 'white', borderRadius: 4, border: '1px solid #E2EAF4',
                  transition: 'all 0.3s ease', height: '100%', cursor: 'default',
                  '&:hover': {
                    borderColor: seg.color,
                    boxShadow: `0 12px 40px ${seg.color}22`,
                    transform: 'translateY(-6px)',
                  },
                }}>
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
  );
}
