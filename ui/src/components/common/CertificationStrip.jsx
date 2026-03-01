import { Box, Container, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

// SVG badge components for each certification (inline, no external assets needed)
const BIS_SVG = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
    <circle cx="40" cy="40" r="38" fill="#003580" stroke="#C9A84C" strokeWidth="3"/>
    <text x="40" y="28" textAnchor="middle" fill="#C9A84C" fontSize="11" fontWeight="bold" fontFamily="Arial">BIS</text>
    <text x="40" y="43" textAnchor="middle" fill="white" fontSize="7" fontFamily="Arial">CERTIFIED</text>
    <text x="40" y="56" textAnchor="middle" fill="#4FC3F7" fontSize="6.5" fontFamily="Arial">IS 13428</text>
    <circle cx="40" cy="40" r="35" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="4 3"/>
  </svg>
);

const FSSAI_SVG = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
    <rect x="2" y="2" width="76" height="76" rx="8" fill="#FF6B00" stroke="#FFD700" strokeWidth="2"/>
    <text x="40" y="26" textAnchor="middle" fill="white" fontSize="9.5" fontWeight="bold" fontFamily="Arial">FSSAI</text>
    <text x="40" y="39" textAnchor="middle" fill="#FFD700" fontSize="6.5" fontFamily="Arial">LICENSED</text>
    <text x="40" y="52" textAnchor="middle" fill="white" fontSize="6" fontFamily="Arial">Food Safety</text>
    <text x="40" y="63" textAnchor="middle" fill="white" fontSize="6" fontFamily="Arial">Authority of India</text>
  </svg>
);

const NABL_SVG = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
    <circle cx="40" cy="40" r="38" fill="#1A5276" stroke="#85C1E9" strokeWidth="2"/>
    <text x="40" y="28" textAnchor="middle" fill="#85C1E9" fontSize="12" fontWeight="bold" fontFamily="Arial">NABL</text>
    <text x="40" y="42" textAnchor="middle" fill="white" fontSize="6.5" fontFamily="Arial">ACCREDITED</text>
    <text x="40" y="54" textAnchor="middle" fill="#85C1E9" fontSize="5.5" fontFamily="Arial">LAB TESTED</text>
    <text x="40" y="65" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="5" fontFamily="Arial">ISO 17025</text>
  </svg>
);

const ISO_SVG = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
    <rect x="2" y="2" width="76" height="76" rx="6" fill="#2E4057" stroke="#4FC3F7" strokeWidth="2"/>
    <text x="40" y="26" textAnchor="middle" fill="#4FC3F7" fontSize="13" fontWeight="bold" fontFamily="Arial">ISO</text>
    <text x="40" y="40" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">9001</text>
    <text x="40" y="53" textAnchor="middle" fill="#4FC3F7" fontSize="7" fontFamily="Arial">: 2015</text>
    <text x="40" y="65" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="5.5" fontFamily="Arial">Quality Mgmt</text>
  </svg>
);

const WHO_SVG = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
    <circle cx="40" cy="40" r="38" fill="#006EB5" stroke="#82C8E5" strokeWidth="2"/>
    <text x="40" y="32" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">WHO</text>
    <text x="40" y="46" textAnchor="middle" fill="#82C8E5" fontSize="6" fontFamily="Arial">COMPLIANT</text>
    <text x="40" y="58" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="5.5" fontFamily="Arial">Water Standards</text>
  </svg>
);

const CERTS = [
  { component: <BIS_SVG />,   name: 'BIS Certified',   desc: 'Bureau of Indian Standards · IS 13428',    tooltip: 'Bureau of Indian Standards — India\'s official product quality mark for packaged drinking water (IS 13428).' },
  { component: <FSSAI_SVG />, name: 'FSSAI Licensed',  desc: 'Food Safety & Standards Authority of India', tooltip: 'Licensed by FSSAI — the apex food regulatory body under Ministry of Health & Family Welfare, Government of India.' },
  { component: <NABL_SVG />,  name: 'NABL Accredited', desc: 'National Accreditation Board for Testing',   tooltip: 'Our water is tested by a NABL-accredited laboratory (ISO/IEC 17025) — the highest standard for lab testing in India.' },
  { component: <ISO_SVG />,   name: 'ISO 9001:2015',   desc: 'Quality Management System Certified',        tooltip: 'ISO 9001:2015 certified quality management system — ensuring consistent product quality and continuous improvement.' },
  { component: <WHO_SVG />,   name: 'WHO Compliant',   desc: 'World Health Organization Water Standards',  tooltip: 'All mineral values comply with WHO 2022 Guidelines for Drinking-Water Quality.' },
];

// Duplicate list for seamless infinite marquee
const MARQUEE_LIST = [...CERTS, ...CERTS];

export default function CertificationStrip({ minimal = false }) {
  return (
    <Box sx={{ py: minimal ? 3 : { xs: 5, md: 7 }, background: minimal ? 'transparent' : 'white', overflow: 'hidden' }}>
      {!minimal && (
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Typography variant="overline" sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
                Certifications & Standards
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#0B1F3A' }}>
                Certified at Every Level
              </Typography>
            </motion.div>
          </Box>
        </Container>
      )}

      {/* Marquee track */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Fade edges */}
        <Box sx={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: minimal
            ? 'linear-gradient(90deg, #F8FBFF, transparent)'
            : 'linear-gradient(90deg, white, transparent)',
        }} />
        <Box sx={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: minimal
            ? 'linear-gradient(90deg, transparent, #F8FBFF)'
            : 'linear-gradient(90deg, transparent, white)',
        }} />

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            width: 'max-content',
            animation: 'certScroll 28s linear infinite',
            '&:hover': { animationPlayState: 'paused' },
            '@keyframes certScroll': {
              '0%':   { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
          }}
        >
          {MARQUEE_LIST.map((cert, i) => (
            <Tooltip key={i} title={cert.tooltip} placement="top" arrow>
              <Box
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 1.5, px: 3, py: 2.5,
                  background: '#F8FBFF',
                  borderRadius: 3,
                  border: '1px solid #E2EAF4',
                  minWidth: 140,
                  cursor: 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': { boxShadow: '0 8px 24px rgba(10,35,66,0.10)', transform: 'translateY(-3px)', borderColor: '#B0CCE8' },
                }}
              >
                {cert.component}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.82rem', lineHeight: 1.2 }}>
                    {cert.name}
                  </Typography>
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.67rem', mt: 0.3, lineHeight: 1.3 }}>
                    {cert.desc}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
