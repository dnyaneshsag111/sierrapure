import { useState } from 'react';
import {
  Box, Container, Typography, Accordion, AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

const FAQS = [
  {
    q: 'What is the Minimum Order Quantity (MOQ) for custom-label bottles?',
    a: 'Our minimum order quantity for custom-labeled Sierra Pure mineral water is 500 units per batch. For standard (unbranded) bulk orders, we supply from 100 units. Larger volumes receive priority scheduling and better pricing.',
  },
  {
    q: 'How long does it take from order to delivery?',
    a: 'Standard turnaround is 7-10 working days for custom labels (includes label design approval) and 3-5 working days for standard orders. Bulk enterprise orders (5,000+ units) are handled on a dedicated production schedule - typically 10-14 days.',
  },
  {
    q: 'What is included in the custom label design service?',
    a: 'We provide end-to-end label design at no extra cost - you share your logo, brand colors and preferences, our team creates a premium design for your approval. Up to 3 revision rounds are included. You receive a digital proof before production begins.',
  },
  {
    q: 'What bottle sizes are available for custom branding?',
    a: 'All three sizes are available for custom labeling: Sierra Mini (200ml) - ideal for travel, airlines and events; Sierra Classic (500ml) - perfect for restaurants, offices and retail; Sierra Pro (1000ml) - suited for hotel rooms, industry and hospitality.',
  },
  {
    q: 'How can I verify the water quality of a specific batch?',
    a: 'Every bottle has a QR code printed on the label. Scanning it takes you directly to that batch\'s live lab report on our website - showing TDS, pH, turbidity, microbial tests and overall result. You can also search by batch number at sierrapure.in/lab-reports.',
  },
  {
    q: 'What certifications does Sierra Pure hold?',
    a: 'Sierra Pure is BIS Certified (IS 14543), FSSAI Licensed, ISO 9001:2015 quality management certified, and every batch is independently tested by a NABL-accredited laboratory. Copies of all certificates are available on request.',
  },
  {
    q: 'What is the approximate price per case?',
    a: 'Pricing depends on volume, bottle size and label type. As a guide: 500ml standard cases start from Rs. 240/case (24 bottles) for bulk orders. Custom-label pricing is shared after a brief consultation. Contact us via WhatsApp or the enquiry form for an exact quote within 2 hours.',
  },
  {
    q: 'Do you offer free samples before a bulk order?',
    a: 'Yes! We offer complimentary water samples (200ml or 500ml) to qualified business buyers. Samples are dispatched within 2-3 working days. Use the "Request Sample" option on our Products page or contact us directly.',
  },
  {
    q: 'What are your delivery coverage areas?',
    a: 'We currently deliver across Maharashtra and to major cities in neighbouring states. For interstate bulk orders (1,000+ units), we arrange dedicated freight. Contact us with your location for a delivery timeline and freight quote.',
  },
  {
    q: 'Can I get water with a specific TDS or mineral profile?',
    a: 'Our standard mineral water has a TDS of 150-250 mg/L and a pH of 7.0-7.5, meeting BIS IS 14543 standards. We add Ca, Mg and K in WHO-recommended proportions. We do not alter the mineral profile per client, but our published lab reports confirm exact values for every batch.',
  },
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: '#F8FBFF' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline"
              sx={{ color: '#1565C0', fontWeight: 700, letterSpacing: '0.18em', fontSize: '0.8rem' }}>
              FAQ
            </Typography>
            <Typography variant="h2"
              sx={{ mt: 1, mb: 2, fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#0B1F3A' }}>
              Frequently Asked Questions
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8 }}>
              Everything you need to know about ordering, customization, quality and delivery.
            </Typography>
          </motion.div>
        </Box>

        {/* Accordion */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <Box>
            {FAQS.map((faq, i) => (
              <Accordion
                key={i}
                expanded={expanded === i}
                onChange={handleChange(i)}
                disableGutters
                elevation={0}
                sx={{
                  mb: 1.5,
                  borderRadius: '12px !important',
                  border: expanded === i ? '1.5px solid #1B6CA8' : '1px solid #E2EAF4',
                  background: expanded === i ? '#F0F7FF' : 'white',
                  transition: 'all 0.25s ease',
                  '&:before': { display: 'none' },
                  '&:hover': { borderColor: expanded === i ? '#1B6CA8' : '#B8D0F0' },
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box
                      sx={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: expanded === i ? '#1B6CA8' : '#F0F4F8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.25s ease', flexShrink: 0,
                      }}
                    >
                      <ExpandMoreIcon
                        sx={{
                          fontSize: 18,
                          color: expanded === i ? 'white' : '#5C6B85',
                          transition: 'transform 0.25s ease',
                          transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </Box>
                  }
                  sx={{ px: 3, py: 2, '& .MuiAccordionSummary-expandIconWrapper': { transform: 'none !important' } }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.7rem', fontWeight: 800, color: '#1B6CA8',
                        background: '#EEF4FF', borderRadius: 9999,
                        width: 24, height: 24, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#0A2342', fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {faq.q}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0 }}>
                  <Box sx={{ pl: 5 }}>
                    <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.85 }}>
                      {faq.a}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <Box
            sx={{
              mt: 5, p: 3.5, borderRadius: 3,
              background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                Still have questions?
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', mt: 0.3 }}>
                Our team responds within 2 hours on WhatsApp
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Box
                component="a"
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: 2.5, py: 1.2, borderRadius: 9999,
                  background: '#25D366', color: 'white',
                  fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
                  transition: 'all 0.2s', '&:hover': { background: '#20b858', transform: 'translateY(-1px)' },
                }}
              >
                WhatsApp Us
              </Box>
              <Box
                component="a"
                href="/contact"
                sx={{
                  display: 'inline-flex', alignItems: 'center',
                  px: 2.5, py: 1.2, borderRadius: 9999,
                  border: '1.5px solid rgba(255,255,255,0.4)', color: 'white',
                  fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
                  transition: 'all 0.2s', '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.08)' },
                }}
              >
                Send Enquiry
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
