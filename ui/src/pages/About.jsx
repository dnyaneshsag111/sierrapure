import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import FactoryIcon from '@mui/icons-material/Factory';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import facilitySvg from '../assets/images/facility.svg';
import CertificationStrip from '../components/common/CertificationStrip';
import WaterSourceStory from '../components/home/WaterSourceStory';

const TIMELINE = [
	{ year: '2014', title: 'Founded', desc: 'Sierra Pure established with a vision to deliver premium mineral water.' },
	{ year: '2016', title: 'BIS Certification', desc: 'Received Bureau of Indian Standards certification for quality assurance.' },
	{ year: '2019', title: 'Custom Branding Launch', desc: 'Launched custom label solutions for hotels, restaurants, and corporate clients.' },
	{ year: '2022', title: 'NABL Lab Partnership', desc: 'Partnered with NABL-certified laboratory for daily independent water quality testing.' },
	{ year: '2024', title: 'QR Transparency System', desc: 'Launched QR-based batch traceability — every bottle linked to its lab report.' },
	{ year: '2026', title: 'Expansion', desc: 'Scaled to 150+ clients with 5,000+ batches tested and 99.8% purity rate maintained.' },
];

export default function About() {
	return (
		<>
			<Helmet>
				<title>About Us | Sierra Pure</title>
				<meta name="description" content="Learn about Sierra Pure — our story, manufacturing process, certifications and commitment to premium water quality." />
			</Helmet>

			{/* Hero */}
			<Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', py: { xs: 8, md: 14 }, position: 'relative', overflow: 'hidden' }}>
				<Box sx={{ position: 'absolute', top: '-20%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(79,195,247,0.08)' }} />
				<Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
					<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
						<Typography variant="overline" sx={{ color: '#4FC3F7', letterSpacing: '0.18em', fontWeight: 700 }}>
							Our Story
						</Typography>
						<Typography variant="h1" sx={{ color: 'white', fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.4rem', md: '3.4rem' }, mt: 1, mb: 2.5 }}>
							Purity Is Our Promise
						</Typography>
						<Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.85 }}>
							Founded in 2014, Sierra Pure has grown from a small manufacturing unit to one of the region's
							most trusted premium mineral water brands — serving hotels, restaurants, industries and travellers
							with water that is rigorously tested and transparently reported.
						</Typography>
					</motion.div>
				</Container>
			</Box>

			<Box sx={{ background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', lineHeight: 0 }}>
				<svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
					<path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F8FBFF" />
				</svg>
			</Box>

			{/* Mission & Vision */}
			<Box sx={{ py: { xs: 8, md: 12 }, background: '#F8FBFF' }}>
				<Container maxWidth="xl">
					<Grid container spacing={5}>
						{[
							{
								icon: <GroupsIcon sx={{ fontSize: 40, color: '#1B6CA8' }} />,
								title: 'Our Mission',
								text: 'To provide the purest, most transparent mineral water — where every drop is tested, every result is published, and every customer can verify what they drink.',
							},
							{
								icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#C9A84C' }} />,
								title: 'Our Vision',
								text: "To be India's most trusted premium mineral water brand — synonymous with quality, transparency, and sustainable manufacturing excellence.",
							},
							{
								icon: <FactoryIcon sx={{ fontSize: 40, color: '#2ECC71' }} />,
								title: 'Manufacturing',
								text: 'Our state-of-the-art manufacturing facility uses 7-stage filtration technology including sediment filters, activated carbon, UV treatment, and reverse osmosis.',
							},
						].map((item, i) => (
							<Grid item xs={12} md={4} key={item.title}>
								<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
									<Box sx={{ p: 4, background: 'white', borderRadius: 4, border: '1px solid #E2EAF4', boxShadow: '0 8px 32px rgba(10,35,66,0.07)', height: '100%' }}>
										<Box sx={{ width: 68, height: 68, borderRadius: 3, background: '#F0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
											{item.icon}
										</Box>
										<Typography variant="h5" sx={{ mb: 2, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
											{item.title}
										</Typography>
										<Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
											{item.text}
										</Typography>
									</Box>
								</motion.div>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

			{/* Certifications — animated logo strip */}
			<CertificationStrip />

			{/* Facility Image */}
			<Box sx={{ py: { xs: 7, md: 10 }, background: '#F8FBFF' }}>
				<Container maxWidth="lg">
					<Box sx={{ textAlign: 'center', mb: 5 }}>
						<Typography variant="overline" sx={{ color: '#1B6CA8', letterSpacing: '0.15em', fontWeight: 700 }}>
							Manufacturing
						</Typography>
						<Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#0A2342', mt: 1 }}>
							Our Facility
						</Typography>
						<Typography sx={{ color: 'var(--text-muted)', mt: 1.5, fontSize: '1rem', maxWidth: 560, mx: 'auto' }}>
							State-of-the-art 7-stage filtration facility built to the highest standards of hygiene, precision and environmental responsibility.
						</Typography>
					</Box>
					<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
						<Box sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2EAF4', boxShadow: '0 16px 64px rgba(10,35,66,0.1)', background: 'white', p: { xs: 3, md: 6 }, textAlign: 'center' }}>
							<Box component="img" src={facilitySvg} alt="Sierra Pure Manufacturing Facility"
								sx={{ width: '100%', maxWidth: 720, height: 'auto', mx: 'auto', display: 'block' }} />
						</Box>
					</motion.div>
				</Container>
			</Box>

			{/* Water Source Story */}
			<WaterSourceStory />

			{/* Timeline */}
			<Box sx={{ py: { xs: 8, md: 12 }, background: '#F8FBFF' }}>
				<Container maxWidth="md">
					<Box sx={{ textAlign: 'center', mb: 6 }}>
						<Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, color: '#0A2342' }}>
							Our Journey
						</Typography>
					</Box>
					{TIMELINE.map((item, i) => (
						<motion.div key={item.year} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
							<Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'flex-start' }}>
								<Box sx={{ flexShrink: 0, width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, #0A2342, #1B6CA8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
									<Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.82rem' }}>{item.year}</Typography>
								</Box>
								<Box sx={{ pt: 1.5, flex: 1 }}>
									<Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1.05rem', mb: 0.5 }}>{item.title}</Typography>
									<Typography sx={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>{item.desc}</Typography>
									{i < TIMELINE.length - 1 && <Divider sx={{ mt: 3, borderStyle: 'dashed', borderColor: '#D0E8FF' }} />}
								</Box>
							</Box>
						</motion.div>
					))}
				</Container>
			</Box>
		</>
	);
}
