import { Link } from 'react-router-dom';
import {
  Box, Container, Grid, Typography, IconButton,
  Divider, List, ListItem, Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
import sierraLogoFallback from '../../assets/images/sierra-logo.svg';
import { useImageAssets } from '../../hooks/useImageAssets';

const QUICK_LINKS = [
  { label: 'Home',          path: '/' },
  { label: 'About Us',      path: '/about' },
  { label: 'Products',      path: '/products' },
  { label: 'B2B Pricing',   path: '/pricing' },
  { label: 'Our Clients',   path: '/clients' },
  { label: 'Customization', path: '/customization' },
  { label: 'Lab Reports',   path: '/lab-reports' },
  { label: 'Contact Us',    path: '/contact' },
];

const CERTIFICATIONS = ['BIS Certified', 'FSSAI Licensed', 'NABL Tested Lab', 'ISO 9001:2015'];

export default function Footer() {
  const { first: uploadedLogo } = useImageAssets('SIERRA_LOGO');
  const sierraLogo = uploadedLogo || sierraLogoFallback;
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #050E1A 0%, #0B1F3A 100%)',
        color: 'rgba(255,255,255,0.85)',
        pt: 8,
        pb: 3,
        borderTop: '3px solid transparent',
        borderImage: 'linear-gradient(90deg, transparent, #C9A84C 30%, #F0C040 50%, #C9A84C 70%, transparent) 1',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2.5 }}>
              <Box
                component="img"
                src={sierraLogo}
                alt="Sierra Pure Logo"
                sx={{
                  height: 50,
                  width: 'auto',
                  objectFit: 'contain',
                  opacity: 0.95,
                  mb: 0.5,
                  filter: uploadedLogo ? 'none' : 'brightness(0) invert(1)',
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, lineHeight: 1.8, maxWidth: 320 }}>
              Crafting the purest mineral water with 7-stage filtration technology.
              Trusted by hotels, restaurants, industries, and travellers across the country.
            </Typography>

            {/* Certifications */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {CERTIFICATIONS.map((cert) => (
                <Box
                  key={cert}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    background: 'rgba(66,165,245,0.08)',
                    border: '1px solid rgba(66,165,245,0.2)',
                    borderRadius: 9999,
                    px: 1.5,
                    py: 0.4,
                    fontSize: '0.72rem',
                    color: '#42A5F5',
                    fontWeight: 500,
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 12 }} />
                  {cert}
                </Box>
              ))}
            </Box>

            {/* Social Icons */}
            <Stack direction="row" spacing={1}>
              {[
                { icon: <FacebookIcon />, href: '#', color: '#1877F2' },
                { icon: <InstagramIcon />, href: '#', color: '#E4405F' },
                { icon: <LinkedInIcon />, href: '#', color: '#0A66C2' },
                { icon: <WhatsAppIcon />, href: 'https://wa.me/919876543210', color: '#25D366' },
              ].map((s, i) => (
                <IconButton
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    width: 36,
                    height: 36,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      color: s.color,
                      borderColor: s.color,
                      background: `${s.color}14`,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                color: '#42A5F5',
                textTransform: 'uppercase',
                mb: 2.5,
              }}
            >
              Quick Links
            </Typography>
            <List disablePadding>
              {QUICK_LINKS.map((link) => (
                <ListItem key={link.path} disablePadding sx={{ mb: 0.75 }}>
                  <Box
                    component={Link}
                    to={link.path}
                    sx={{
                      color: 'rgba(255,255,255,0.65)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      '&:hover': { color: '#42A5F5', pl: 0.75 },
                      '&::before': {
                        content: '"›"',
                        color: '#1565C0',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Products */}
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                color: '#42A5F5',
                textTransform: 'uppercase',
                mb: 2.5,
              }}
            >
              Our Products
            </Typography>
            <List disablePadding>
              {[
                { label: 'Sierra Mini 200ml', desc: 'Travel & Events' },
                { label: 'Sierra Classic 500ml', desc: 'Retail & Office' },
                { label: 'Sierra Pro 1000ml', desc: 'Hotel & Industry' },
                { label: 'Custom Label', desc: 'Your Brand' },
              ].map((p) => (
                <ListItem key={p.label} disablePadding sx={{ mb: 1.25, display: 'block' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: 500 }}>
                    {p.label}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                    {p.desc}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                color: '#42A5F5',
                textTransform: 'uppercase',
                mb: 2.5,
              }}
            >
              Get In Touch
            </Typography>
            <Stack spacing={2.5}>
              {[
                {
                  icon: <LocationOnIcon sx={{ color: '#42A5F5', fontSize: 20, mt: 0.2, flexShrink: 0 }} />,
                  text: 'Sierra Pure Manufacturing Unit, Industrial Area, Maharashtra, India',
                },
                {
                  icon: <PhoneIcon sx={{ color: '#42A5F5', fontSize: 20, flexShrink: 0 }} />,
                  text: '+91 98765 43210',
                  href: 'tel:+919876543210',
                },
                {
                  icon: <EmailIcon sx={{ color: '#42A5F5', fontSize: 20, flexShrink: 0 }} />,
                  text: 'contact@sierrapure.com',
                  href: 'mailto:contact@sierrapure.com',
                },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  {item.icon}
                  {item.href ? (
                    <Box
                      component="a"
                      href={item.href}
                      sx={{
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: '0.88rem',
                        textDecoration: 'none',
                        lineHeight: 1.6,
                        '&:hover': { color: '#42A5F5' },
                        transition: 'color 0.2s',
                      }}
                    >
                      {item.text}
                    </Box>
                  ) : (
                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                      {item.text}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} Sierra Pure. All rights reserved. Premium Mineral Water.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Use', 'Lab Report Verification'].map((item) => (
              <Box
                key={item}
                component={Link}
                to="/"
                sx={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  '&:hover': { color: '#42A5F5' },
                  transition: 'color 0.2s',
                }}
              >
                {item}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
