import { useState } from 'react';
import { Box, Typography, Tooltip, Zoom, Collapse } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const WA_NUMBER   = '9423192573'; // replace with real number
const WA_MESSAGE  = encodeURIComponent(
  "Hi Sierra Pure! I'm interested in your premium mineral water. Could you please share pricing and customization details?"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 24, md: 32 },
        right:  { xs: 20, md: 32 },
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1.5,
      }}
    >
      {/* Pop-up chat bubble */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.85,  y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <Box
              sx={{
                width: 300,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(10,35,66,0.22)',
                border: '1px solid rgba(37,211,102,0.2)',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #075E54, #128C7E)',
                  px: 2.5, py: 2,
                  display: 'flex', alignItems: 'center', gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <WhatsAppIcon sx={{ color: 'white', fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
                    Sierra Pure
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
                    Typically replies in minutes
                  </Typography>
                </Box>
                <Box
                  onClick={() => setOpen(false)}
                  sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>

              {/* Body */}
              <Box sx={{ background: '#ECE5DD', p: 2.5 }}>
                {/* Chat bubble */}
                <Box
                  sx={{
                    background: 'white', borderRadius: '0 12px 12px 12px',
                    px: 2, py: 1.5, mb: 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    display: 'inline-block', maxWidth: '90%',
                  }}
                >
                  <Typography sx={{ fontSize: '0.85rem', color: '#111', lineHeight: 1.6 }}>
                    Hello! How can we help you today? Ask us about:
                  </Typography>
                  <Box component="ul" sx={{ mt: 0.8, mb: 0, pl: 2.5 }}>
                    {['Custom label pricing', 'Bulk order enquiry', 'Product specifications', 'Sample request'].map(i => (
                      <Typography key={i} component="li" sx={{ fontSize: '0.78rem', color: '#333', lineHeight: 1.7 }}>{i}</Typography>
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#999', mt: 0.8, textAlign: 'right' }}>
                    Sierra Pure Team
                  </Typography>
                </Box>
              </Box>

              {/* CTA */}
              <Box
                component="a"
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 1, py: 1.8,
                  background: '#25D366',
                  color: 'white',
                  fontWeight: 700, fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  '&:hover': { background: '#20b858' },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 20 }} />
                Start Chat on WhatsApp
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <Tooltip title="Chat on WhatsApp" placement="left" TransitionComponent={Zoom}>
        <Box
          onClick={() => setOpen(o => !o)}
          sx={{
            width: 58, height: 58, borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(37,211,102,0.45)',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'scale(1.1)', boxShadow: '0 12px 32px rgba(37,211,102,0.6)' },
            position: 'relative',
          }}
        >
          {/* Pulse ring */}
          <Box
            sx={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: '2px solid rgba(37,211,102,0.4)',
              animation: 'waPulse 2s ease-out infinite',
              '@keyframes waPulse': {
                '0%':   { transform: 'scale(1)',    opacity: 0.8 },
                '70%':  { transform: 'scale(1.35)', opacity: 0   },
                '100%': { transform: 'scale(1.35)', opacity: 0   },
              },
            }}
          />
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <CloseIcon sx={{ color: 'white', fontSize: 26 }} />
                </motion.div>
              : <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <WhatsAppIcon sx={{ color: 'white', fontSize: 30 }} />
                </motion.div>
            }
          </AnimatePresence>
        </Box>
      </Tooltip>
    </Box>
  );
}
