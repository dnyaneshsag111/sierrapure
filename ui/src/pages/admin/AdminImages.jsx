import { useRef, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  Tab, Tabs, CircularProgress, IconButton, Tooltip,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import { imageService } from '../../services/imageService';

const CATEGORIES = [
  {
    key: 'BOTTLE',
    label: 'Product Bottle Images',
    description: 'Images shown on the Products section of home page and Products page.',
    sub: ['200ml', '500ml', '1000ml'],
  },
  {
    key: 'HERO_BOTTLE',
    label: 'Hero Section Bottle',
    description: 'The large animated bottle shown in the Home page hero banner.',
    sub: ['hero-bottle'],
    singleUpload: true,
  },
  {
    key: 'SIERRA_LOGO',
    label: 'Sierra Pure Logo',
    description: 'Brand logo shown in Navbar and Footer. Any label works — the most recently uploaded image is used automatically.',
    sub: ['primary', 'white', 'dark'],
  },
  {
    key: 'CLIENT_LOGO',
    label: 'Client Logos',
    description: 'Client company logos shown in the Clients section.',
    sub: [],
  },
];

function DropZone({ onFile, uploading, accept = 'image/*' }) {
  const ref = useRef();
  const [over, setOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault(); setOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) onFile(f);
  };

  return (
    <Box
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onClick={() => ref.current.click()}
      sx={{
        border: `2px dashed ${over ? '#1B6CA8' : '#C8D8E8'}`,
        borderRadius: 3, p: 4, textAlign: 'center', cursor: 'pointer',
        background: over ? 'rgba(27,108,168,0.04)' : '#F8FBFF',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: '#1B6CA8', background: 'rgba(27,108,168,0.04)' },
      }}
    >
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
        onChange={(e) => onFile(e.target.files[0])} />
      {uploading
        ? <CircularProgress size={28} sx={{ color: '#1B6CA8' }} />
        : <>
          <UploadIcon sx={{ fontSize: 36, color: '#1B6CA8', mb: 1 }} />
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0A2342' }}>
            Click or drag & drop to upload
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5 }}>
            PNG, JPG, SVG, WebP supported
          </Typography>
        </>
      }
    </Box>
  );
}

function ImageGrid({ category }) {
  const qc = useQueryClient();
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['admin-images', category],
    queryFn: () => imageService.listByCategory(category),
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await imageService.delete(id);
      qc.invalidateQueries({ queryKey: ['admin-images', category] });
      qc.invalidateQueries({ queryKey: ['image-assets', category] });
      toast.success('Image deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (isLoading) return <Typography sx={{ color: 'var(--text-muted)', py: 2 }}>Loading...</Typography>;
  if (!images.length) return <Typography sx={{ color: 'var(--text-muted)', py: 2 }}>No images uploaded yet.</Typography>;

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {images.map((img) => (
        <Grid item xs={6} sm={4} md={3} key={img.id}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', overflow: 'hidden', position: 'relative' }}>
            <Box sx={{ height: 120, background: '#F8FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
              <Box component="img" src={img.publicUrl} alt={img.label}
                sx={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.src = 'data:image/svg+xml,<svg/>'; }} />
            </Box>
            <CardContent sx={{ p: 1.5, pt: 1 }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0A2342', mb: 0.5 }}>{img.label}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{img.originalName}</Typography>
            </CardContent>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => handleDelete(img.id)}
                sx={{ position: 'absolute', top: 6, right: 6, background: 'rgba(255,255,255,0.9)', '&:hover': { background: '#ffebee' } }}>
                <DeleteIcon sx={{ fontSize: 16, color: '#E74C3C' }} />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function AdminImages() {
  const [tab, setTab] = useState(0);
  const [label, setLabel] = useState(CATEGORIES[0].sub[0] || '');
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();
  const cat = CATEGORIES[tab];

  const handleTabChange = (_, v) => {
    setTab(v);
    setLabel(CATEGORIES[v].sub[0] || '');
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      if (cat.key === 'BOTTLE')       await imageService.uploadBottle(file, label);
      else if (cat.key === 'HERO_BOTTLE') await imageService.uploadHeroBottle(file);
      else if (cat.key === 'SIERRA_LOGO') await imageService.uploadSierraLogo(file, label);
      else if (cat.key === 'CLIENT_LOGO') await imageService.uploadClientLogo(file, label || 'client');
      qc.invalidateQueries({ queryKey: ['admin-images', cat.key] });
      qc.invalidateQueries({ queryKey: ['image-assets', cat.key] });
      toast.success('Image uploaded successfully!');
    } catch (e) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', mb: 0.5, fontFamily: "'Playfair Display', serif" }}>
        Upload Images
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)', mb: 3, fontSize: '0.9rem' }}>
        Upload bottle images, client logos, and brand logos. Stored locally in the project <code>uploads/</code> folder.
      </Typography>

      <Tabs value={tab} onChange={handleTabChange}
        sx={{ mb: 1, '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' }, '& .Mui-selected': { color: '#1B6CA8' }, '& .MuiTabs-indicator': { background: '#1B6CA8' } }}>
        {CATEGORIES.map((c) => <Tab key={c.key} label={c.label} />)}
      </Tabs>

      {/* Description */}
      <Box sx={{ mb: 3, px: 0.5 }}>
        <Typography sx={{ fontSize: '0.82rem', color: '#1B6CA8', fontWeight: 600 }}>
          📌 {cat.description}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', p: 3 }}>
            <Typography sx={{ fontWeight: 700, color: '#0A2342', mb: 2 }}>
              Upload {cat.label}
            </Typography>

            {/* Label selector — hidden for hero (always hero-bottle) */}
            {cat.sub.length > 1 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)', width: '100%', mb: 0.5 }}>
                  Select label:
                </Typography>
                {cat.sub.map((s) => (
                  <Chip key={s} label={s} onClick={() => setLabel(s)}
                    sx={{
                      cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem',
                      background: label === s ? '#0A2342' : '#F0F4F8',
                      color: label === s ? 'white' : '#0A2342',
                    }} />
                ))}
              </Box>
            )}

            {/* Free-text label for client logos */}
            {cat.sub.length === 0 && (
              <Box sx={{ mb: 2 }}>
                <input
                  placeholder="Client name (label)"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #C8D8E8', fontSize: '0.88rem', outline: 'none' }}
                />
              </Box>
            )}

            {/* Info pill for single-upload categories */}
            {cat.singleUpload && (
              <Box sx={{ mb: 2, p: 1.5, background: 'rgba(27,108,168,0.06)', borderRadius: 2, border: '1px solid rgba(27,108,168,0.15)' }}>
                <Typography sx={{ fontSize: '0.78rem', color: '#1B6CA8' }}>
                  ℹ️ Uploading a new image will replace the existing hero bottle image automatically.
                </Typography>
              </Box>
            )}

            <DropZone onFile={handleUpload} uploading={uploading} />

            {uploading && (
              <Typography sx={{ fontSize: '0.8rem', color: '#1B6CA8', mt: 1.5, textAlign: 'center' }}>
                Uploading...
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', p: 3 }}>
            <Typography sx={{ fontWeight: 700, color: '#0A2342', mb: 2 }}>
              Uploaded {cat.label}
            </Typography>
            <ImageGrid category={cat.key} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
