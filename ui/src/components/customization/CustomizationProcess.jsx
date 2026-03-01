import { Box, Typography, Container, Stepper, Step, StepLabel, StepContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const STEPS = [
  { label: 'Choose Bottle Size', desc: 'Select from 200ml, 500ml, or 1000ml based on your use case and volume requirements.' },
  { label: 'Design Your Label', desc: 'Share your logo, brand colors, and design preferences. Our team creates a premium label design for approval.' },
  { label: 'Review & Approve', desc: 'Review the label design digitally and approve. Revisions are included at no extra cost.' },
  { label: 'Production', desc: 'We manufacture your branded bottles with the same rigorous 7-stage filtration and quality standards.' },
  { label: 'Delivery', desc: 'Packaged securely and delivered to your location on schedule. Bulk orders get priority delivery.' },
];

export default function CustomizationProcess() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: 'white' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography variant="overline" sx={{ color: '#1B6CA8', letterSpacing: '0.15em', fontWeight: 700 }}>
            Simple Process
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#0A2342', mt: 1 }}>
            How It Works
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', mt: 1.5, fontSize: '1rem' }}>
            5-step process from enquiry to delivery
          </Typography>
        </Box>

        <Stepper orientation="vertical">
          {STEPS.map((step) => (
            <Step key={step.label} active>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.MuiStepIcon-root': { color: '#1B6CA8', fontSize: 32 },
                    '&.MuiStepIcon-root.Mui-active': { color: '#0A2342' },
                  },
                }}
              >
                <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1.05rem' }}>{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.75, pb: 2, fontSize: '0.92rem' }}>
                  {step.desc}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            component={Link} to="/contact"
            variant="contained" size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: 'linear-gradient(135deg, #0A2342, #1B6CA8)',
              color: 'white', borderRadius: 9999, px: 4, py: 1.5,
              boxShadow: '0 4px 20px rgba(10,35,66,0.25)',
            }}
          >
            Start Your Custom Order
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
