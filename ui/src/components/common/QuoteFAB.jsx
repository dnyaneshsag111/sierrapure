import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Fab, Tooltip, Zoom, Badge } from '@mui/material';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollTrigger } from '@mui/material';

export default function QuoteFAB() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  // Show after user scrolls 400px
  const triggered = useScrollTrigger({ threshold: 400, disableHysteresis: true });
  const visible   = triggered && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0,  scale: 1   }}
          exit={{   opacity: 0, y: 40,  scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{
            position: 'fixed',
            bottom: 104,           // sit above WhatsApp widget
            right: 32,
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          {/* Label chip */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
              color: 'white',
              px: 2, py: 0.8,
              borderRadius: 9999,
              fontSize: '0.78rem',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(10,35,66,0.3)',
              whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 1,
            }}
          >
            <RequestQuoteIcon sx={{ fontSize: 15 }} />
            Get a Free Quote
          </Box>

          {/* FAB row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Dismiss button */}
            <Tooltip title="Dismiss" placement="left">
              <Box
                onClick={() => setDismissed(true)}
                sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(10,35,66,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  '&:hover': { background: 'rgba(10,35,66,0.15)' },
                }}
              >
                <CloseIcon sx={{ fontSize: 14, color: '#5C6B85' }} />
              </Box>
            </Tooltip>

            {/* Main FAB */}
            <Tooltip title="Request a Quote" placement="left" TransitionComponent={Zoom}>
              <Fab
                onClick={() => navigate('/contact')}
                sx={{
                  background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
                  color: 'white',
                  width: 56, height: 56,
                  boxShadow: '0 8px 24px rgba(10,35,66,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0d2c52, #1e7ec7)',
                    boxShadow: '0 12px 32px rgba(10,35,66,0.5)',
                    transform: 'scale(1.08)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                <RequestQuoteIcon sx={{ fontSize: 26 }} />
              </Fab>
            </Tooltip>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
