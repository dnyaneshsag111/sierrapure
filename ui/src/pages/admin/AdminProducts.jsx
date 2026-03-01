import { useState, useRef } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  CircularProgress, Chip, IconButton, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/CloudUpload';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { imageService } from '../../services/imageService';

const SIZE_COLORS = { '200ml': '#42A5F5', '500ml': '#1565C0', '1000ml': '#C9A84C' };

function ProductEditDialog({ product, open, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...product });
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const save = useMutation({
    mutationFn: (data) => api.put(`/products/${product.id}`, data).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast.success('Product saved!'); onClose(); },
    onError: () => toast.error('Save failed'),
  });

  const handleImageUpload = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post(`/products/${product.id}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, imageUrl: res.data.data.imageUrl }));
      qc.invalidateQueries(['admin-products']);
      toast.success('Image uploaded!');
    } catch { toast.error('Image upload failed'); }
    finally { setUploading(false); }
  };

  const featuresStr = form.features?.join(', ') || '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#0A2342' }}>Edit — {product.name}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          {/* Image upload */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Box
              onClick={() => fileRef.current.click()}
              sx={{ cursor: 'pointer', height: 130, background: '#F8FBFF', borderRadius: 3, border: '2px dashed #C8D8E8',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                '&:hover': { borderColor: '#1B6CA8' } }}
            >
              {preview || form.imageUrl ? (
                <Box component="img" src={preview || form.imageUrl} alt="product"
                  sx={{ maxHeight: 110, objectFit: 'contain' }} />
              ) : (
                <>
                  {uploading ? <CircularProgress size={24} /> : <UploadIcon sx={{ color: '#1B6CA8' }} />}
                  <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Click to upload image</Typography>
                </>
              )}
            </Box>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleImageUpload(e.target.files[0])} />
          </Grid>
          {[
            { label: 'Name', key: 'name' },
            { label: 'Description', key: 'description', multiline: true, rows: 3 },
            { label: 'Price Range', key: 'priceRange' },
            { label: 'Packaging Info', key: 'packagingInfo' },
          ].map(f => (
            <Grid item xs={12} key={f.key}>
              <TextField fullWidth size="small" label={f.label} value={form[f.key] || ''}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                multiline={f.multiline} rows={f.rows}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField fullWidth size="small" label="Features (comma-separated)"
              value={featuresStr}
              onChange={e => setForm(p => ({ ...p, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Cancel</Button>
        <Button variant="contained" onClick={() => save.mutate(form)} disabled={save.isPending}
          sx={{ background: 'linear-gradient(135deg,#0A2342,#1B6CA8)', color: 'white', borderRadius: 9999, px: 3 }}>
          {save.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminProducts() {
  const [editProduct, setEditProduct] = useState(null);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products').then(r => r.data.data),
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A2342', mb: 0.5, fontFamily: "'Playfair Display', serif" }}>
        Manage Products
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)', mb: 3, fontSize: '0.9rem' }}>
        Edit product details and upload bottle images for each size.
      </Typography>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => {
            const color = SIZE_COLORS[product.size] ?? '#1B6CA8';
            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', height: '100%' }}>
                  <Box sx={{ height: 160, background: `linear-gradient(135deg,${color}12,${color}06)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {product.imageUrl ? (
                      <Box component="img" src={product.imageUrl} alt={product.name}
                        sx={{ maxHeight: 140, objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No image yet</Typography>
                    )}
                    <Chip label={product.size} size="small"
                      sx={{ position: 'absolute', top: 10, right: 10, background: color, color: 'white', fontWeight: 700, borderRadius: 9999 }} />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontWeight: 700, color: '#0A2342', mb: 0.5 }}>{product.name}</Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)', mb: 1.5 }}>{product.priceRange}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 2 }}>
                      {product.features?.slice(0, 3).map(f => (
                        <Chip key={f} label={f} size="small" sx={{ fontSize: '0.68rem', background: '#F0F4F8', color: '#0A2342' }} />
                      ))}
                    </Box>
                    <Button fullWidth variant="outlined" startIcon={<EditIcon />}
                      onClick={() => setEditProduct(product)}
                      sx={{ borderRadius: 9999, borderColor: color, color, fontWeight: 600 }}>
                      Edit Product
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {editProduct && (
        <ProductEditDialog product={editProduct} open onClose={() => setEditProduct(null)} />
      )}
    </Box>
  );
}
