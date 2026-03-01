import { Box, Container, Typography, Grid, Avatar, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { SEGMENTS } from '../../utils/constants';

// Static fallback testimonials shown when no DB data with testimonials exists
const FALLBACK = [
  {
    name: 'Rajesh Mehta',
    designation: 'F&B Manager',
    company: 'The Grand Palace Hotel',
    segment: 'hotel',
    testimonial: 'Sierra Pure has been our trusted water partner for 3 years. The custom-labeled bottles elevate our guest experience and the QR lab reports give us complete confidence in the quality we serve.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    designation: 'Operations Head',
    company: 'Spice Garden Restaurants',
    segment: 'restaurant',
    testimonial: 'Switching to Sierra Pure was the best decision for our restaurants. The 7-stage filtered water has noticeably improved the taste of our beverages and guests regularly compliment it.',
    rating: 5,
  },
  {
    name: 'Anil Kumar',
    designation: 'Procurement Manager',
    company: 'TechCorp Industries',
    segment: 'industry',
    testimonial: 'Reliable bulk supply, transparent lab reports, and competitive pricing. Sierra Pure understands corporate needs perfectly. The online lab report verification is a standout feature.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const { data: clients = [] } = useQuery({
    queryKey: ['clients-featured'],
    queryFn: () => api.get('/clients?featured=true').then(r => r.data.data),
  });

  // Use clients from DB that have a testimonial, fallback to static data
  const withTestimonials = clients.filter(c => c.testimonial && c.isFeatured);
  const testimonials = withTestimonials.length >= 2 ? withTestimonials.slice(0, 3) : FALLBACK;

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #F5F9FF 0%, white 100%)' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline"
              sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
              Client Stories
            </Typography>
            <Typography variant="h2"
              sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.8rem' }, color: '#0B1F3A' }}>
              Trusted by Industry Leaders
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', maxWidth: 520, mx: 'auto', fontSize: '1rem', lineHeight: 1.8 }}>
              From 5-star hotels to corporate campuses — hear what our clients say
              about Sierra Pure's quality and service.
            </Typography>
          </motion.div>
        </Box>

        {/* Cards */}
        <Grid container spacing={3}>
          {testimonials.map((t, i) => {
            const seg = SEGMENTS.find(s => s.value === (t.segment ?? ''));
            const color = seg?.color ?? '#1B6CA8';
            const initial = (t.name ?? '?').charAt(0);

            return (
              <Grid item xs={12} md={4} key={t.id ?? t.name}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  style={{ height: '100%' }}
                >
                  <Box
                    sx={{
                      p: 4, height: '100%', display: 'flex', flexDirection: 'column',
                      background: 'white', borderRadius: 4,
                      border: '1px solid #E2EAF4',
                      boxShadow: '0 8px 32px rgba(10,35,66,0.06)',
                      transition: 'all 0.3s ease',
                      position: 'relative', overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 20px 60px rgba(10,35,66,0.12)`,
                        borderColor: color,
                      },
                    }}
                  >
                    {/* Decorative quote icon */}
                    <FormatQuoteIcon
                      sx={{
                        position: 'absolute', top: 20, right: 20,
                        fontSize: 56, color: `${color}14`,
                      }}
                    />

                    {/* Star rating */}
                    <Rating
                      value={t.rating ?? 5}
                      readOnly
                      size="small"
                      sx={{ mb: 2.5, '& .MuiRating-iconFilled': { color: '#C9A84C' } }}
                    />

                    {/* Testimonial text */}
                    <Typography
                      sx={{
                        color: '#3D4F6B', fontSize: '0.95rem', lineHeight: 1.85,
                        fontStyle: 'italic', flex: 1, mb: 3,
                      }}
                    >
                      "{t.testimonial}"
                    </Typography>

                    {/* Divider accent */}
                    <Box sx={{ width: 40, height: 2, background: `linear-gradient(90deg, ${color}, ${color}44)`, borderRadius: 1, mb: 2.5 }} />

                    {/* Client info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {t.logoUrl ? (
                        <Box
                          component="img" src={t.logoUrl} alt={t.name}
                          sx={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 2, border: '1px solid #E2EAF4', p: 0.5 }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 48, height: 48, fontWeight: 800, fontSize: '1.1rem',
                            background: `linear-gradient(135deg, ${color}33, ${color}15)`,
                            color,
                            border: `2px solid ${color}25`,
                          }}
                        >
                          {initial}
                        </Avatar>
                      )}
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.9rem', lineHeight: 1.3 }}>
                          {t.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {t.designation && `${t.designation}, `}{t.company ?? t.location}
                        </Typography>
                        {seg && (
                          <Box
                            sx={{
                              display: 'inline-flex', alignItems: 'center', gap: 0.4,
                              mt: 0.5, px: 1, py: 0.2,
                              background: `${color}12`, borderRadius: 9999,
                            }}
                          >
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color, letterSpacing: '0.06em' }}>
                              {seg.icon} {seg.label}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Summary bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <Box
            sx={{
              mt: 6, p: { xs: 3, md: 4 },
              background: 'linear-gradient(135deg, #0B1F3A, #1565C0)',
              borderRadius: 4, display: 'flex',
              flexWrap: 'wrap', gap: 4, justifyContent: 'center', alignItems: 'center',
            }}
          >
            {[
              { value: '150+', label: 'Happy Clients' },
              { value: '4.9 / 5', label: 'Average Rating' },
              { value: '99.8%', label: 'Reorder Rate' },
              { value: '5 yrs+', label: 'Average Relationship' },
            ].map(s => (
              <Box key={s.label} sx={{ textAlign: 'center', px: 3 }}>
                <Typography sx={{ color: '#42A5F5', fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' }, fontFamily: "'Playfair Display', serif" }}>
                  {s.value}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', mt: 0.3 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
