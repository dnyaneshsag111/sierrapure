import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer,
  List, ListItem, ListItemText, Container,
  useMediaQuery, useTheme, Avatar, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ScienceIcon from '@mui/icons-material/Science';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { motion } from 'framer-motion';
import sierraLogoFallback from '../../assets/images/sierra-logo.svg';
import { useAuth } from '../../context/AuthContext';
import { useImageAssets } from '../../hooks/useImageAssets';

const NAV_LINKS = [
  { label: 'Home',          path: '/' },
  { label: 'About',         path: '/about' },
  { label: 'Products',      path: '/products' },
  { label: 'Pricing',       path: '/pricing' },
  { label: 'Clients',       path: '/clients' },
  { label: 'Customization', path: '/customization' },
  { label: 'Lab Reports',   path: '/lab-reports', icon: <ScienceIcon sx={{ fontSize: 16, mr: 0.5 }} /> },
  { label: 'Contact',       path: '/contact' },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('md'));
  const { isLoggedIn, user, logout, isAdmin, isLabAnalyst } = useAuth();
  const { first: uploadedLogo } = useImageAssets('SIERRA_LOGO');
  const sierraLogo = uploadedLogo || sierraLogoFallback;

  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? 'rgba(11, 31, 58, 0.97)'
            : 'linear-gradient(180deg, rgba(5,14,26,0.88) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: scrolled ? '1px solid rgba(66,165,245,0.15)' : 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1, px: { xs: 0, md: 2 }, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1,
              }}
            >
              <Box
                component="img"
                src={sierraLogo}
                alt="Sierra Pure Logo"
                sx={{
                  height: 46,
                  width: 'auto',
                  objectFit: 'contain',
                  opacity: 0.97,
                  filter: uploadedLogo ? 'none' : 'brightness(0) invert(1)',
                }}
              />
            </Box>

            {/* Desktop Nav */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    startIcon={link.icon}
                    sx={{
                      color: isActive(link.path) ? '#42A5F5' : 'rgba(255,255,255,0.85)',
                      fontWeight: isActive(link.path) ? 600 : 500,
                      fontSize: '0.88rem',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      '&:hover': { color: '#42A5F5', background: 'rgba(66,165,245,0.08)' },
                      '&::after': isActive(link.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: 2,
                        background: '#42A5F5',
                        borderRadius: 1,
                      } : {},
                    }}
                  >
                    {link.label}
                  </Button>
                ))}

                {/* Auth buttons */}
                {isLoggedIn && (isAdmin || isLabAnalyst) ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1.5 }}>
                    <Tooltip title="Admin Panel">
                      <IconButton component={Link} to="/admin" size="small"
                        sx={{ color: '#42A5F5', background: 'rgba(66,165,245,0.1)', '&:hover': { background: 'rgba(66,165,245,0.2)' } }}>
                        <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Sign out (${user?.name})`}>
                      <IconButton size="small" onClick={handleLogout}
                        sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#E74C3C', background: 'rgba(231,76,60,0.1)' } }}>
                        <LogoutIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1.5 }}>
                    <Button
                      component={Link} to="/login"
                      sx={{
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '0.88rem', fontWeight: 500,
                        px: 1.5, py: 0.75, borderRadius: 2,
                        '&:hover': { color: '#42A5F5', background: 'rgba(66,165,245,0.08)' },
                      }}>
                      Login
                    </Button>
                    <Button
                      component={Link} to="/contact" variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #1565C0, #42A5F5)', color: 'white',
                        px: 2.5, py: 0.9, fontSize: '0.88rem', borderRadius: 9999,
                        boxShadow: '0 4px 16px rgba(66,165,245,0.35)',
                        '&:hover': { boxShadow: '0 6px 24px rgba(66,165,245,0.5)', transform: 'translateY(-1px)' },
                      }}>
                      Get Quote
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: 'white', p: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            background: 'linear-gradient(180deg, #050E1A 0%, #0B1F3A 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: '1.2rem',
                color: 'white',
                letterSpacing: '0.06em',
              }}
            >
              SIERRA PURE
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List disablePadding>
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <ListItem
                  component={Link}
                  to={link.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: isActive(link.path) ? '#42A5F5' : 'rgba(255,255,255,0.85)',
                    background: isActive(link.path) ? 'rgba(66,165,245,0.1)' : 'transparent',
                    '&:hover': { background: 'rgba(66,165,245,0.08)', color: '#42A5F5' },
                    textDecoration: 'none',
                  }}
                >
                  {link.icon && <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>{link.icon}</Box>}
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{ fontWeight: isActive(link.path) ? 600 : 400, fontSize: '1rem' }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {isLoggedIn && (isAdmin || isLabAnalyst) ? (
              <>
                <Button
                  component={Link} to="/admin" fullWidth variant="outlined"
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{ borderRadius: 9999, py: 1.2, fontWeight: 600, color: '#42A5F5', borderColor: 'rgba(66,165,245,0.4)', '&:hover': { borderColor: '#42A5F5', background: 'rgba(66,165,245,0.08)' } }}>
                  Admin Panel
                </Button>
                <Button
                  fullWidth variant="outlined" onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ borderRadius: 9999, py: 1.2, fontWeight: 600, color: 'rgba(231,76,60,0.8)', borderColor: 'rgba(231,76,60,0.3)', '&:hover': { borderColor: '#E74C3C', background: 'rgba(231,76,60,0.08)' } }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link} to="/login" fullWidth variant="outlined"
                  sx={{ borderRadius: 9999, py: 1.2, fontWeight: 600, color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)', '&:hover': { borderColor: '#42A5F5', color: '#42A5F5', background: 'rgba(66,165,245,0.08)' } }}>
                  Login
                </Button>
                <Button
                  component={Link} to="/contact" fullWidth variant="contained"
                  sx={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)', borderRadius: 9999, py: 1.4, fontWeight: 600, boxShadow: '0 4px 20px rgba(66,165,245,0.3)' }}>
                  Get a Quote
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}
