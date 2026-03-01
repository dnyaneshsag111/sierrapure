import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ProductHighlights from '../components/home/ProductHighlights';
import LatestLabReport from '../components/home/LatestLabReport';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ClientSegments from '../components/home/ClientSegments';
import FiltrationProcess from '../components/home/FiltrationProcess';
import TestimonialsSection from '../components/home/TestimonialsSection';
import WaterSourceStory from '../components/home/WaterSourceStory';
import HowToOrder from '../components/home/HowToOrder';
import CertificationStrip from '../components/common/CertificationStrip';
import MineralProfile from '../components/common/MineralProfile';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';
import { BLOG_POSTS } from '../data/blogPosts';

export default function Home() {
  return (
    <Box sx={{ background: '#F5F9FF' }}>
      <Helmet>
        <title>Sierra Pure | Premium Mineral Water Manufacturer</title>
        <meta
          name="description"
          content="Sierra Pure manufactures premium mineral water bottles (200ml, 500ml, 1000ml) with 7-stage filtration and daily lab-tested quality. Custom branding for hotels, restaurants, industries and travel."
        />
      </Helmet>

      <HeroSection />
      <StatsSection />
      <ProductHighlights />
      <WhyChooseUs />
      <WaterSourceStory />
      <FiltrationProcess />
      <MineralProfile />
      <LatestLabReport />
      <HowToOrder />
      <ClientSegments />
      <TestimonialsSection />
      <CertificationStrip />

      {/* ── Latest Articles ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, background: '#F8FBFF' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
                Water Quality Insights
              </Typography>
              <Typography variant="h2" sx={{ mt: 0.5, fontSize: { xs: '1.8rem', md: '2.4rem' }, color: '#0B1F3A', fontFamily: "'Playfair Display', serif" }}>
                Latest Articles
              </Typography>
            </Box>
            <Button component={Link} to="/blog" endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 9999, color: '#1565C0', fontWeight: 700, '&:hover': { background: '#EEF4FF' } }}>
              All Articles
            </Button>
          </Box>
          <Grid container spacing={3}>
            {BLOG_POSTS.slice(0, 3).map((post, i) => (
              <Grid item xs={12} md={4} key={post.slug}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Box component={Link} to={`/blog/${post.slug}`} sx={{
                    textDecoration: 'none', display: 'block', background: 'white', borderRadius: 3,
                    border: '1px solid #E2EAF4', overflow: 'hidden',
                    transition: 'all 0.25s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 14px 40px rgba(10,35,66,0.08)' },
                  }}>
                    <Box sx={{ background: post.coverGradient, height: 120, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '3.5rem' }}>
                      {post.coverEmoji}
                    </Box>
                    <Box sx={{ p: 2.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1565C0', letterSpacing: '0.1em', mb: 0.8 }}>
                        {post.category.toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.95rem', lineHeight: 1.4, mb: 1 }}>
                        {post.title}
                      </Typography>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, mb: 1.5 }}>
                        {post.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        <AccessTimeIcon sx={{ fontSize: 12 }} /> {post.readTime}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Customization CTA Banner */}
      <Box
        sx={{
          py: { xs: 9, md: 12 },
          background: 'linear-gradient(135deg, #0B1F3A 0%, #1565C0 55%, #0F2D54 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-40%',
            right: '-8%',
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'rgba(66,165,245,0.07)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.05)',
          },
        }}
      >
        {/* Gold accent line at top */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #F0C040 50%, #C9A84C 70%, transparent)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: 'inline-block',
                px: 2.5,
                py: 0.6,
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: 9999,
                mb: 2.5,
              }}
            >
              <Typography sx={{ color: '#C9A84C', letterSpacing: '0.2em', fontWeight: 700, fontSize: '0.75rem' }}>
                CUSTOM BRANDING
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontSize: { xs: '2rem', md: '3rem' },
                mt: 1,
                mb: 2.5,
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1.15,
              }}
            >
              Your Brand.{' '}
              <Box component="span" sx={{ color: '#42A5F5' }}>Our Quality.</Box>
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: '1.05rem',
                lineHeight: 1.85,
                mb: 5,
                maxWidth: 580,
                mx: 'auto',
              }}
            >
              Get custom-labeled Sierra Pure water bottles with your logo, colors, and brand identity.
              Perfect for hotels, restaurants, events, and corporate gifting.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/customization"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #42A5F5, #90CAF9)',
                  color: '#0B1F3A',
                  fontWeight: 700,
                  px: 4.5,
                  py: 1.7,
                  borderRadius: 9999,
                  boxShadow: '0 8px 32px rgba(66,165,245,0.4)',
                  '&:hover': { boxShadow: '0 12px 40px rgba(66,165,245,0.6)', transform: 'translateY(-2px)' },
                }}
              >
                Explore Customization
              </Button>
              <Button
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.35)',
                  px: 4,
                  py: 1.7,
                  borderRadius: 9999,
                  '&:hover': { borderColor: '#25D366', color: '#25D366', background: 'rgba(37,211,102,0.08)' },
                }}
              >
                WhatsApp Us
              </Button>
            </Box>
          </motion.div>
        </Container>
        {/* Gold bottom accent */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #F0C040 50%, #C9A84C 70%, transparent)',
          }}
        />
      </Box>
    </Box>
  );
}
