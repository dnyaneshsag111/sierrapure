import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, Button, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';

const FILTER_OPTIONS = [
  { label: 'All',         value: '' },
  { label: '200ml',       value: 'size:200ml' },
  { label: '500ml',       value: 'size:500ml' },
  { label: '1000ml',      value: 'size:1000ml' },
  { label: 'Hotels',      value: 'segment:hotel' },
  { label: 'Restaurants', value: 'segment:restaurant' },
  { label: 'Travel',      value: 'segment:travel' },
];

function ProductSkeleton() {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2EAF4' }}>
        <Skeleton variant="rectangular" height={220} />
        <Box sx={{ p: 3 }}>
          <Skeleton width="60%" height={28} sx={{ mb: 1 }} />
          <Skeleton width="100%" height={18} />
          <Skeleton width="90%" height={18} sx={{ mb: 2 }} />
          <Skeleton width="40%" height={22} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={42} sx={{ borderRadius: 9999 }} />
        </Box>
      </Box>
    </Grid>
  );
}

export default function Products() {
  const [filter, setFilter] = useState('');

  const params = {};
  if (filter.startsWith('size:'))    params.size    = filter.replace('size:', '');
  if (filter.startsWith('segment:')) params.segment = filter.replace('segment:', '');

  const { data: products = [], isLoading } = useProducts(params);

  return (
    <>
      <Helmet>
        <title>Products | Sierra Pure</title>
        <meta name="description" content="Explore Sierra Pure premium mineral water bottles — 200ml, 500ml, and 1000ml. BIS certified, 7-stage filtered, daily lab tested." />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.18em', fontWeight: 700 }}>
            Sierra Pure Range
          </Typography>
          <Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.2rem', md: '3rem' }, mt: 1, mb: 2 }}>
            Our Products
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem' }}>
            Three sizes. One standard of purity. All batch-tested daily.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, background: '#F8FBFF', minHeight: '50vh' }}>
        <Container maxWidth="xl">
          {/* Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6, flexWrap: 'wrap', gap: 1 }}>
            <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => setFilter(v ?? '')} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {FILTER_OPTIONS.map((opt) => (
                <ToggleButton key={opt.value} value={opt.value}
                  sx={{
                    borderRadius: '9999px !important', border: '1px solid #E2EAF4 !important',
                    px: 2.5, py: 0.8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)',
                    '&.Mui-selected': { background: 'linear-gradient(135deg,#0A2342,#1B6CA8) !important', color: 'white !important', border: 'none !important' },
                  }}>
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Grid container spacing={3}>
            {isLoading
              ? [1, 2, 3].map((i) => <ProductSkeleton key={i} />)
              : products.length === 0
                ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                      <Typography sx={{ color: 'var(--text-muted)', mb: 3 }}>No products found for this filter.</Typography>
                      <Button component={Link} to="/contact" variant="contained"
                        sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
                        Contact for Enquiry
                      </Button>
                    </Box>
                  </Grid>
                )
                : products.map((product, i) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard product={product} index={i} />
                  </Grid>
                ))
            }
          </Grid>
        </Container>
      </Box>
    </>
  );
}
