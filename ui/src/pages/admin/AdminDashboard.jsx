import { useQuery } from '@tanstack/react-query';
import { Box, Grid, Typography, Card, CardContent, Skeleton, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ScienceIcon from '@mui/icons-material/Science';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import MailIcon from '@mui/icons-material/Mail';
import ImageIcon from '@mui/icons-material/Image';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';

function StatCard({ label, value, icon, color, path }) {
  return (
    <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4', boxShadow: '0 2px 12px rgba(10,35,66,0.06)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 2, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ color, fontSize: 24 }}>{icon}</Box>
          </Box>
          <Button component={Link} to={path} size="small" sx={{ fontSize: '0.75rem', color: '#1B6CA8' }}>View →</Button>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0A2342', mb: 0.5 }}>
          {value ?? <Skeleton width={60} />}
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</Typography>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: products } = useQuery({ queryKey: ['admin-products'], queryFn: () => api.get('/products').then(r => r.data.data) });
  const { data: clients }  = useQuery({ queryKey: ['admin-clients'],  queryFn: () => api.get('/clients').then(r => r.data.data) });
  const { data: reports }  = useQuery({ queryKey: ['admin-reports'],  queryFn: () => api.get('/lab-reports').then(r => r.data.data) });
  const { data: enquiries }= useQuery({ queryKey: ['admin-enquiries'],queryFn: () => api.get('/contact').then(r => r.data.data) });
  const { data: images }   = useQuery({ queryKey: ['admin-images'],   queryFn: () => api.get('/images?category=BOTTLE').then(r => r.data.data) });

  const newEnquiries = enquiries?.filter(e => e.status === 'new').length ?? 0;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0A2342', mb: 0.5, fontFamily: "'Playfair Display', serif" }}>
        Dashboard
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)', mb: 4, fontSize: '0.9rem' }}>
        {formatDate(new Date(), 'dddd, DD MMMM YYYY')} — Sierra Pure Admin
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard label="Lab Reports" value={reports?.content?.length ?? reports?.totalElements ?? '—'} icon={<ScienceIcon />} color="#1B6CA8" path="/admin/reports" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard label="Active Clients" value={clients?.length} icon={<PeopleIcon />} color="#C9A84C" path="/admin/clients" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard label="Products" value={products?.length} icon={<InventoryIcon />} color="#2ECC71" path="/admin/products" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard label="New Enquiries" value={newEnquiries} icon={<MailIcon />} color="#E74C3C" path="/admin/enquiries" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard label="Uploaded Images" value={images?.length} icon={<ImageIcon />} color="#9B59B6" path="/admin/images" />
        </Grid>
      </Grid>

      {/* Recent Enquiries */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A2342', mb: 2 }}>Recent Enquiries</Typography>
      <Card sx={{ borderRadius: 3, border: '1px solid #E2EAF4' }}>
        {enquiries?.slice(0, 5).map((e, i) => (
          <Box key={e.id} sx={{ px: 3, py: 2, borderBottom: i < 4 ? '1px solid #F0F4F8' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0A2342' }}>{e.name}</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{e.company || e.email} · {e.segment}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(e.createdAt)}</Typography>
              <Box sx={{
                px: 1.2, py: 0.2, borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700,
                background: e.status === 'new' ? '#EEF4FF' : e.status === 'contacted' ? '#FFF8E1' : '#EDFBF0',
                color: e.status === 'new' ? '#1565C0' : e.status === 'contacted' ? '#C9A84C' : '#1a8a4a',
              }}>
                {e.status?.toUpperCase()}
              </Box>
            </Box>
          </Box>
        ))}
        {!enquiries?.length && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--text-muted)' }}>No enquiries yet.</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
