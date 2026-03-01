import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useImageAssets } from '../../hooks/useImageAssets';

// Local fallbacks (used only if no image has been uploaded yet)
import bottle200Fallback from '../../assets/images/bottle-200ml.svg';
import bottle500Fallback from '../../assets/images/bottle-500ml.svg';
import bottle1000Fallback from '../../assets/images/bottle-1000ml.svg';

const PRODUCT_META = [
  {
    name: 'Sierra Mini',
    size: '200 ml',
    apiLabel: '200ml',
    fallback: bottle200Fallback,
    tagline: 'Perfect for travel & events',
    segments: ['Travel', 'Airlines', 'Events'],
    color: '#42A5F5',
    features: ['UV Treated', 'Tamper-proof', 'Lightweight'],
    description: 'Compact and convenient — ideal for airlines, events, and on-the-go hydration.',
  },
  {
    name: 'Sierra Classic',
    size: '500 ml',
    apiLabel: '500ml',
    fallback: bottle500Fallback,
    tagline: 'Everyday premium hydration',
    segments: ['Retail', 'Gym', 'Office'],
    color: '#1565C0',
    features: ['7-Stage Filtration', 'BIS Certified', 'Ergonomic Design'],
    description: 'Our bestseller. Perfect for everyday use — offices, gyms, cafes and retail.',
    featured: true,
  },
  {
    name: 'Sierra Pro',
    size: '1000 ml',
    apiLabel: '1000ml',
    fallback: bottle1000Fallback,
    tagline: 'Designed for hospitality',
    segments: ['Hotel', 'Restaurant', 'Industry'],
    color: '#C9A84C',
    features: ['Premium Label', 'Custom Branding', 'Bulk Supply'],
    description: 'Premium 1L bottle crafted for hotels, restaurants, and industrial supply.',
  },
];

export default function ProductHighlights() {
  const { byLabel } = useImageAssets('BOTTLE');

  // Merge API images into product list — API image wins over fallback
  const PRODUCTS = PRODUCT_META.map((p) => ({
    ...p,
    image: byLabel[p.apiLabel] || p.fallback,
  }));
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: '#F5F9FF', mt: '-2px' }}>
      <Container maxWidth="xl">
        {/* Section header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="overline"
              sx={{ color: '#1B6CA8', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}
            >
              Our Products
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
              Choose Your Perfect Bottle
            </Typography>
            <Typography
              sx={{ color: 'var(--text-muted)', maxWidth: 560, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.8 }}
            >
              Three sizes, one standard of purity. All bottles undergo our rigorous 7-stage
              filtration and daily lab testing.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {PRODUCTS.map((product, i) => (
            <Grid item xs={12} sm={6} md={4} key={product.name}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    border: product.featured ? `2px solid ${product.color}` : '1px solid #DDE6F5',
                    position: 'relative',
                    overflow: 'visible',
                    background: 'white',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 24px 64px rgba(11,31,58,0.14)`,
                    },
                  }}
                >
                  {product.featured && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: `linear-gradient(135deg, #0B1F3A, #1565C0)`,
                        color: 'white',
                        px: 2.5,
                        py: 0.5,
                        borderRadius: 9999,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ★ BESTSELLER
                    </Box>
                  )}

                  <CardContent sx={{ p: 4 }}>
                    {/* Bottle image */}
                    <Box
                      sx={{
                        height: 185,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        background: `linear-gradient(135deg, ${product.color}10, ${product.color}05)`,
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={`Sierra Pure ${product.size}`}
                        sx={{
                          maxHeight: '175px',
                          maxWidth: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          display: 'block',
                          mixBlendMode: 'multiply',
                          filter: `drop-shadow(0 8px 20px ${product.color}40) brightness(1.05)`,
                          transition: 'transform 0.4s ease',
                          '&:hover': { transform: 'scale(1.06)' },
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                      <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", color: '#0B1F3A' }}>
                        {product.name}
                      </Typography>
                      <Chip
                        label={product.size}
                        size="small"
                        sx={{
                          background: `${product.color}15`,
                          color: product.color,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          border: `1px solid ${product.color}40`,
                          borderRadius: 9999,
                        }}
                      />
                    </Box>

                    <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.88rem', mb: 2.5 }}>
                      {product.description}
                    </Typography>

                    {/* Features */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
                      {product.features.map((f) => (
                        <Box
                          key={f}
                          sx={{
                            px: 1.5,
                            py: 0.4,
                            background: '#EFF5FF',
                            borderRadius: 9999,
                            fontSize: '0.75rem',
                            color: '#1565C0',
                            fontWeight: 500,
                            border: '1px solid #C8DEFF',
                          }}
                        >
                          ✓ {f}
                        </Box>
                      ))}
                    </Box>

                    {/* Segments */}
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                      {product.segments.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          size="small"
                          sx={{ fontSize: '0.7rem', background: '#F5F9FF', border: '1px solid #DDE6F5' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: 'linear-gradient(135deg, #0B1F3A, #1565C0)',
              color: 'white',
              px: 4,
              py: 1.4,
              borderRadius: 9999,
              boxShadow: '0 4px 20px rgba(21,101,192,0.25)',
              '&:hover': { boxShadow: '0 8px 32px rgba(21,101,192,0.4)', transform: 'translateY(-2px)' },
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
