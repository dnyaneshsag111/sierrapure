import { Box, Card, CardContent, Typography, Button, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import bottle200 from '../../assets/images/bottle-200ml.svg';
import bottle500 from '../../assets/images/bottle-500ml.svg';
import bottle1000 from '../../assets/images/bottle-1000ml.svg';
import { MineralProfileCompact } from '../common/MineralProfile';

const BOTTLE_IMAGES = { '200ml': bottle200, '500ml': bottle500, '1000ml': bottle1000 };
const SIZE_COLORS   = { '200ml': '#42A5F5', '500ml': '#1565C0', '1000ml': '#C9A84C' };

export default function ProductCard({ product, index = 0 }) {
  const fallbackImg = BOTTLE_IMAGES[product.size];
  const color = SIZE_COLORS[product.size] ?? '#1B6CA8';
  const packConfs = product.packConfigurations ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card
        sx={{
          borderRadius: 4, border: '1px solid #E2EAF4', height: '100%', display: 'flex', flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 20px 60px ${color}22` },
        }}
      >
        {/* Image Area */}
        <Box
          sx={{
            height: 220, background: `linear-gradient(135deg, ${color}10, ${color}05)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={fallbackImg}
            alt={product.name}
            sx={{ height: 180, width: 'auto', objectFit: 'contain', filter: `drop-shadow(0 12px 24px ${color}44)` }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <Chip
            label={product.size}
            size="small"
            sx={{
              position: 'absolute', top: 12, right: 12,
              background: color, color: 'white', fontWeight: 700, fontSize: '0.75rem', borderRadius: 9999,
            }}
          />
          {product.isCustomizable && (
            <Box sx={{
              position: 'absolute', top: 12, left: 12,
              background: 'rgba(255,255,255,0.92)', borderRadius: 9999, px: 1.2, py: 0.3,
              fontSize: '0.68rem', fontWeight: 700, color: '#0A2342',
            }}>
              ✨ Custom Label
            </Box>
          )}
        </Box>

        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A2342', mb: 0.5 }}>
            {product.name}
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.87rem', mb: 2, lineHeight: 1.7, flex: 1 }}>
            {product.description}
          </Typography>

          {/* Features */}
          {product.features?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 1.5 }}>
              {product.features.slice(0, 3).map((f) => (
                <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 0.4, fontSize: '0.72rem', color: '#1B6CA8', fontWeight: 600 }}>
                  <VerifiedIcon sx={{ fontSize: 11, color }} />
                  {f}
                </Box>
              ))}
            </Box>
          )}

          {/* Mineral profile mini chips */}
          <MineralProfileCompact size={product.size} />

          {/* Pack configurations */}
          {packConfs.length > 0 && (
            <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {packConfs.map((pc, i) => (
                <Chip key={i} size="small"
                  label={`${pc.label}: ${pc.quantity} ${pc.unit}`}
                  sx={{ fontSize: '0.68rem', background: `${color}10`, color, fontWeight: 600, borderRadius: 9999 }}
                />
              ))}
            </Box>
          )}

          {product.priceRange && (
            <Typography sx={{ fontWeight: 700, color: '#0A2342', mt: 1.5, mb: 1, fontSize: '0.9rem' }}>
              {product.priceRange}
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 1 }}>
            <Button
              component={Link} to={`/products/${product.id}`} variant="outlined" fullWidth
              startIcon={<InfoOutlinedIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 9999, borderColor: color, color, fontWeight: 600, fontSize: '0.8rem',
                '&:hover': { background: `${color}10` },
              }}
            >
              Details
            </Button>
            <Button
              component={Link} to="/contact" variant="contained" fullWidth
              endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderRadius: 9999, background: `linear-gradient(135deg, #0A2342, ${color})`,
                color: 'white', fontWeight: 600, fontSize: '0.8rem',
                boxShadow: `0 4px 12px ${color}30`,
              }}
            >
              Quote
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
