import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import CustomizationHero from '../components/customization/CustomizationHero';
import WhoWeServe from '../components/customization/WhoWeServe';
import CustomizationProcess from '../components/customization/CustomizationProcess';

export default function Customization() {
  return (
    <>
      <Helmet>
        <title>Customization | Sierra Pure</title>
        <meta name="description" content="Get custom-labeled Sierra Pure mineral water bottles for hotels, restaurants, events, travel, and corporate branding." />
      </Helmet>

      <CustomizationHero />

      <Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
        </svg>
      </Box>

      <WhoWeServe />
      <CustomizationProcess />
    </>
  );
}
