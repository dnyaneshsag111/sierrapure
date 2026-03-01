import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Chip, Button, Divider, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BLOG_POSTS } from '../data/blogPosts';

const CATEGORY_COLORS = {
  'Water Science':  { bg: '#EEF4FF', color: '#1565C0' },
  'Our Process':    { bg: '#EDFBF0', color: '#1a8a4a' },
  'Transparency':   { bg: '#F3EEF8', color: '#9B59B6' },
  'B2B Guide':      { bg: '#FFF8E1', color: '#C9A84C' },
};

// Minimal markdown-to-JSX renderer (h2, h3, table, hr, blockquote, bold, lists)
function RenderMarkdown({ content }) {
  const lines = content.trim().split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <Typography key={i} component="h2" sx={{ fontSize: { xs: '1.3rem', md: '1.6rem' }, fontWeight: 800, color: '#0A2342', mt: 4, mb: 1.5, fontFamily: "'Playfair Display', serif" }}>
          {line.replace('## ', '')}
        </Typography>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <Typography key={i} component="h3" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2342', mt: 3, mb: 1 }}>
          {line.replace('### ', '')}
        </Typography>
      );
    } else if (line.startsWith('---')) {
      elements.push(<Divider key={i} sx={{ my: 3 }} />);
    } else if (line.startsWith('> ')) {
      elements.push(
        <Box key={i} sx={{ borderLeft: '3px solid #1565C0', pl: 2.5, py: 1, my: 2, background: '#EEF4FF', borderRadius: '0 8px 8px 0' }}>
          <Typography sx={{ color: '#0A2342', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: line.replace('> ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </Box>
      );
    } else if (line.startsWith('| ')) {
      // Table — collect all rows
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].match(/^\|[-|\s]+\|$/)) tableLines.push(lines[i]);
        i++;
      }
      const [headerRow, ...bodyRows] = tableLines;
      const headers = headerRow.split('|').filter(c => c.trim()).map(c => c.trim());
      elements.push(
        <Box key={`table-${i}`} sx={{ overflowX: 'auto', my: 3, borderRadius: 2, border: '1px solid #E2EAF4' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} style={{ background: '#0A2342', color: 'white', padding: '10px 14px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
                return (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? 'white' : '#F8FBFF' }}>
                    {cells.map((cell, ci) => (
                      <td key={ci} style={{ padding: '9px 14px', borderBottom: '1px solid #F0F4F8', fontSize: '0.85rem', color: '#0A2342' }}
                        dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      );
      continue;
    } else if (line.startsWith('- ')) {
      // Bullet list
      const items = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].replace('- ', ''));
        i++;
      }
      elements.push(
        <Box key={`list-${i}`} component="ul" sx={{ pl: 3, my: 1.5 }}>
          {items.map((item, ii) => (
            <Typography key={ii} component="li" sx={{ color: '#0A2342', fontSize: '0.95rem', lineHeight: 1.8, mb: 0.3 }}
              dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </Box>
      );
      continue;
    } else if (line.trim() === '') {
      // spacer
    } else {
      elements.push(
        <Typography key={i} sx={{ color: '#2D3748', fontSize: '0.97rem', lineHeight: 1.9, mb: 0.5 }}
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
      );
    }
    i++;
  }
  return <>{elements}</>;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const currentIndex = BLOG_POSTS.findIndex(p => p.slug === slug);
  const prev = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const next = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;
  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 2);

  if (!post) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#0A2342', mb: 2 }}>Article not found</Typography>
        <Button component={Link} to="/blog" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 9999, color: '#1565C0' }}>
          Back to Blog
        </Button>
      </Container>
    );
  }

  const catStyle = CATEGORY_COLORS[post.category] ?? { bg: '#F0F4F8', color: '#0A2342' };

  return (
    <>
      <Helmet>
        <title>{post.title} | Sierra Pure Blog</title>
        <meta name="description" content={post.subtitle} />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: post.coverGradient, py: { xs: 8, md: 11 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', right: -40, bottom: -40, fontSize: '18rem', opacity: 0.06, lineHeight: 1 }}>
          {post.coverEmoji}
        </Box>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/blog')}
              sx={{ color: 'rgba(255,255,255,0.65)', mb: 3, '&:hover': { color: 'white' } }}>
              All Articles
            </Button>
            <Chip label={post.category}
              sx={{ display: 'block', width: 'fit-content', mb: 2, background: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 700, borderRadius: 9999 }} />
            <Typography component="h1" sx={{
              color: 'white', fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '1.8rem', md: '2.8rem' }, fontWeight: 800, lineHeight: 1.2, mb: 2,
            }}>
              {post.title}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, mb: 3 }}>
              {post.subtitle}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                <AccessTimeIcon sx={{ fontSize: 15 }} /> {post.readTime}
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{post.date}</Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ background: '#F8FBFF', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="md">
          {/* Article body */}
          <Box sx={{ background: 'white', borderRadius: 4, p: { xs: 3, md: 6 }, boxShadow: '0 4px 32px rgba(10,35,66,0.06)', border: '1px solid #E2EAF4', mb: 6 }}>
            <RenderMarkdown content={post.content} />
          </Box>

          {/* Prev / Next nav */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 6 }}>
            {prev ? (
              <Button component={Link} to={`/blog/${prev.slug}`} startIcon={<ArrowBackIcon />}
                sx={{ borderRadius: 9999, color: '#1565C0', fontWeight: 600 }}>
                {prev.title.slice(0, 40)}…
              </Button>
            ) : <Box />}
            {next && (
              <Button component={Link} to={`/blog/${next.slug}`} endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 9999, color: '#1565C0', fontWeight: 600 }}>
                {next.title.slice(0, 40)}…
              </Button>
            )}
          </Box>

          {/* Related articles */}
          <Typography sx={{ fontWeight: 800, color: '#0A2342', fontSize: '1.2rem', mb: 3, fontFamily: "'Playfair Display', serif" }}>
            More Articles
          </Typography>
          <Grid container spacing={3}>
            {related.map(r => {
              const rCat = CATEGORY_COLORS[r.category] ?? { bg: '#F0F4F8', color: '#0A2342' };
              return (
                <Grid item xs={12} sm={6} key={r.slug}>
                  <Card component={Link} to={`/blog/${r.slug}`} sx={{
                    textDecoration: 'none', borderRadius: 3, border: '1px solid #E2EAF4',
                    transition: 'all 0.25s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 36px rgba(10,35,66,0.08)' },
                  }}>
                    <Box sx={{ background: r.coverGradient, height: 100, borderRadius: '12px 12px 0 0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                      {r.coverEmoji}
                    </Box>
                    <CardContent sx={{ p: 2.5 }}>
                      <Chip label={r.category} size="small" sx={{ mb: 1, background: rCat.bg, color: rCat.color, fontWeight: 700, fontSize: '0.68rem', borderRadius: 9999 }} />
                      <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.9rem', lineHeight: 1.4 }}>{r.title}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 1, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <AccessTimeIcon sx={{ fontSize: 12 }} /> {r.readTime}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
