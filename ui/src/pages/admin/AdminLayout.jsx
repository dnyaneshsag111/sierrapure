import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, AppBar, Toolbar, IconButton, Divider,
  useMediaQuery, useTheme, Avatar, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ImageIcon from '@mui/icons-material/Image';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ScienceIcon from '@mui/icons-material/Science';
import MailIcon from '@mui/icons-material/Mail';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import sierraLogo from '../../assets/images/Sierra.svg';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const NAV = [
  { label: 'Dashboard',     path: '/admin',            icon: <DashboardIcon />, roles: ['ADMIN','LAB_ANALYST'] },
  { label: 'Upload Images', path: '/admin/images',     icon: <ImageIcon />,     roles: ['ADMIN','LAB_ANALYST'] },
  { label: 'Products',      path: '/admin/products',   icon: <InventoryIcon />, roles: ['ADMIN'] },
  { label: 'Clients',       path: '/admin/clients',    icon: <PeopleIcon />,    roles: ['ADMIN'] },
  { label: 'Lab Reports',   path: '/admin/reports',    icon: <ScienceIcon />,   roles: ['ADMIN','LAB_ANALYST'] },
  { label: 'Enquiries',     path: '/admin/enquiries',   icon: <MailIcon />,           roles: ['ADMIN','LAB_ANALYST'] },
  { label: 'Quotations',    path: '/admin/quotations',  icon: <RequestQuoteIcon />,   roles: ['ADMIN'] },
  { label: 'Users',         path: '/admin/users',       icon: <PeopleAltIcon />,      roles: ['ADMIN'] },
  { label: 'My Profile',    path: '/admin/profile',    icon: <AccountCircleIcon />, roles: ['ADMIN','LAB_ANALYST'] },
];

const ROLE_COLORS = { ADMIN: '#E74C3C', LAB_ANALYST: '#4FC3F7', CLIENT: '#2ECC71' };
const ROLE_LABELS = { ADMIN: 'Administrator', LAB_ANALYST: 'Lab Analyst', CLIENT: 'Client' };

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  const visibleNav = NAV.filter(n => !user?.role || n.roles.includes(user.role));

  const drawer = (
    <Box sx={{ height: '100%', background: '#0A2342', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box component="img" src={sierraLogo} alt="Sierra Pure"
          sx={{ height: 36, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', mt: 0.5, letterSpacing: '0.15em', fontWeight: 600 }}>
          ADMIN PANEL
        </Typography>
      </Box>

      <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
        {visibleNav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link} to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2, py: 1.1,
                  background: active ? 'rgba(79,195,247,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(79,195,247,0.25)' : '1px solid transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.06)' },
                }}
              >
                <ListItemIcon sx={{ color: active ? '#4FC3F7' : 'rgba(255,255,255,0.5)', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.88rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#4FC3F7' : 'rgba(255,255,255,0.75)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* User info + actions */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, px: 1 }}>
          <Avatar sx={{
            width: 34, height: 34,
            background: `${ROLE_COLORS[user?.role] ?? '#4FC3F7'}30`,
            color: ROLE_COLORS[user?.role] ?? '#4FC3F7',
            fontSize: '0.85rem', fontWeight: 700,
          }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: ROLE_COLORS[user?.role] ?? '#4FC3F7', fontWeight: 600 }}>
              {ROLE_LABELS[user?.role] ?? user?.role}
            </Typography>
          </Box>
        </Box>

        <ListItemButton component={Link} to="/"
          sx={{ borderRadius: 2, mb: 0.5, '&:hover': { background: 'rgba(255,255,255,0.06)' } }}>
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.5)', minWidth: 38 }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Back to Site"
            primaryTypographyProps={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }} />
        </ListItemButton>

        <ListItemButton onClick={handleLogout}
          sx={{ borderRadius: 2, '&:hover': { background: 'rgba(231,76,60,0.12)' } }}>
          <ListItemIcon sx={{ color: 'rgba(231,76,60,0.7)', minWidth: 38 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Sign Out"
            primaryTypographyProps={{ fontSize: '0.82rem', color: 'rgba(231,76,60,0.8)' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8' }}>
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
          {drawer}
        </Drawer>
      ) : (
        <Drawer variant="permanent"
          sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', boxSizing: 'border-box' } }}>
          {drawer}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {isMobile && (
          <AppBar position="static" sx={{ background: '#0A2342', boxShadow: 'none' }}>
            <Toolbar>
              <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Sierra Pure Admin</Typography>
            </Toolbar>
          </AppBar>
        )}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
