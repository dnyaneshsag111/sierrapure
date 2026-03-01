import { useRef, useState, useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';

const STATS = [
	{ number: 5000, suffix: '+', label: 'Batches Tested', sub: 'Quality Verified Daily' },
	{ number: 99.8, suffix: '%', decimals: 1, label: 'Purity Rate', sub: 'Consistently Maintained' },
	{ number: 200, suffix: '+', label: 'Happy Clients', sub: 'Hotels, Restaurants & More' },
	{ number: 12, suffix: '+', label: 'Years Experience', sub: 'In Manufacturing' },
];

function useCountUp(end, duration = 2500, decimals = 0, active = false) {
	const [count, setCount] = useState(0);
	useEffect(() => {
		if (!active) return;
		let startTime = null;
		const step = (timestamp) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			// ease-out cubic
			const eased = 1 - Math.pow(1 - progress, 3);
			setCount(parseFloat((eased * end).toFixed(decimals)));
			if (progress < 1) requestAnimationFrame(step);
			else setCount(end);
		};
		requestAnimationFrame(step);
	}, [active, end, duration, decimals]);
	return count;
}

function StatCounter({ stat, active }) {
	const value = useCountUp(stat.number, 2500, stat.decimals || 0, active);
	const display = stat.decimals ? value.toFixed(stat.decimals) : Math.floor(value);
	return <>{display}{stat.suffix}</>;
}

export default function StatsSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true });

	return (
		<Box
			sx={{
				background: 'linear-gradient(135deg, #0B1F3A 0%, #1565C0 100%)',
				py: { xs: 7, md: 9 },
				pb: { xs: 11, md: 14 },
				position: 'relative',
				overflow: 'hidden',
				mt: '-2px', // close sub-pixel gap left by HeroSection wave
			}}
		>
			<Container maxWidth="xl" ref={ref} sx={{ position: 'relative', zIndex: 1 }}>
				<Grid container spacing={2} justifyContent="center">
					{STATS.map((stat, i) => (
						<Grid item xs={6} md={3} key={stat.label}>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: i * 0.15, duration: 0.6 }}
							>
								<Box
									sx={{
										textAlign: 'center',
										p: { xs: 2.5, md: 4 },
										borderRight: { md: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' },
									}}
								>
									{/* Gold accent */}
									<Box sx={{ width: 32, height: 2, background: 'linear-gradient(90deg, #C9A84C, #F0C040)', borderRadius: 1, mx: 'auto', mb: 2 }} />
									<Typography
										sx={{
											fontFamily: "'Playfair Display', serif",
											fontSize: { xs: '2.4rem', md: '3.2rem' },
											fontWeight: 800,
											color: '#42A5F5',
											lineHeight: 1,
											mb: 0.5,
										}}
									>
										<StatCounter stat={stat} active={inView} />
									</Typography>
									<Typography sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '0.9rem', md: '1rem' }, mb: 0.4 }}>
										{stat.label}
									</Typography>
									<Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>
										{stat.sub}
									</Typography>
								</Box>
							</motion.div>
						</Grid>
					))}
				</Grid>
			</Container>

			{/* Wave transitioning to light ProductHighlights section */}
			<Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0, zIndex: 2 }}>
				<svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
					<path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#F5F9FF" />
				</svg>
			</Box>
		</Box>
	);
}
