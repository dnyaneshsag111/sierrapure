import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BLOG_POSTS } from '../data/blogPosts';

const CATEGORY_COLORS = {
  'Water Science':  { bg: '#EEF4FF', color: '#1565C0' },
  'Our Process':    { bg: '#EDFBF0', color: '#1a8a4a' },
  'Transparency':   { bg: '#F3EEF8', color: '#9B59B6' },
  'B2B Guide':      { bg: '#FFF8E1', color: '#C9A84C' },
};

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog | Sierra Pure Mineral Water</title>
        <meta name="description" content="Water quality insights, filtration explained, lab report guides and B2B hospitality tips from the Sierra Pure team." />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1565C0)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.18em', fontWeight: 700 }}>
              Insights & Guides
            </Typography>
            <Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2.2rem', md: '3rem' }, mt: 1, mb: 2 }}>
              Water Quality Blog
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Science-backed articles on TDS, filtration, lab reports, and how to choose the right water for your business.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1565C0)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      <Box sx={{ background: '#F8FBFF', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">

          {/* Featured post (first) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box component={Link} to={`/blog/${BLOG_POSTS[0].slug}`} sx={{ textDecoration: 'none', display: 'block', mb: 6 }}>
              <Box sx={{
                background: BLOG_POSTS[0].coverGradient, borderRadius: 4,
                p: { xs: 4, md: 6 }, position: 'relative', overflow: 'hidden',
                transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' },
              }}>
                <Box sx={{ position: 'absolute', right: -20, top: -20, fontSize: '10rem', opacity: 0.08, lineHeight: 1 }}>
                  {BLOG_POSTS[0].coverEmoji}
                </Box>
                <Chip label={BLOG_POSTS[0].category}
                  sx={{ mb: 2, background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 700, fontSize: '0.75rem', borderRadius: 9999 }} />
                <Typography sx={{ color: 'white', fontFamily: "'Playfair Display', serif",
                  fontSize: { xs: '1.6rem', md: '2.4rem' }, fontWeight: 800, mb: 1.5, maxWidth: 700 }}>
                  {BLOG_POSTS[0].title}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', mb: 3, maxWidth: 600, lineHeight: 1.7 }}>
                  {BLOG_POSTS[0].subtitle}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>
                    <AccessTimeIcon sx={{ fontSize: 15 }} />
                    {BLOG_POSTS[0].readTime}
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>{BLOG_POSTS[0].date}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#4FC3F7', fontWeight: 600, fontSize: '0.85rem' }}>
                    Read Article <ArrowForwardIcon sx={{ fontSize: 15 }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Rest of posts */}
          <Grid container spacing={3}>
            {BLOG_POSTS.slice(1).map((post, i) => {
              const catStyle = CATEGORY_COLORS[post.category] ?? { bg: '#F0F4F8', color: '#0A2342' };
              return (
                <Grid item xs={12} md={4} key={post.slug}>
                  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ height: '100%' }}>
                    <Card component={Link} to={`/blog/${post.slug}`} sx={{
                      textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column',
                      borderRadius: 3, border: '1px solid #E2EAF4',
                      transition: 'all 0.25s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 16px 48px rgba(10,35,66,0.1)' },
                    }}>
                      {/* Card top */}
                      <Box sx={{ background: post.coverGradient, height: 140, borderRadius: '12px 12px 0 0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                        {post.coverEmoji}
                      </Box>
                      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Chip label={post.category} size="small"
                          sx={{ alignSelf: 'flex-start', mb: 1.5, background: catStyle.bg, color: catStyle.color, fontWeight: 700, fontSize: '0.7rem', borderRadius: 9999 }} />
                        <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1rem', mb: 1, lineHeight: 1.4 }}>
                          {post.title}
                        </Typography>
                        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.7, mb: 2, flex: 1 }}>
                          {post.excerpt}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            <AccessTimeIcon sx={{ fontSize: 13 }} /> {post.readTime}
                          </Box>
                          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{post.date}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>

          {/* CTA */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--text-muted)', mb: 2 }}>
              More articles coming soon. Have a water quality question?
            </Typography>
            <Button component={Link} to="/contact" variant="outlined" endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 9999, borderColor: '#1565C0', color: '#1565C0', fontWeight: 700, px: 4 }}>
              Ask Our Experts
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
