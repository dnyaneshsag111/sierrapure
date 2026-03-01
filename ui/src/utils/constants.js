export const SEGMENTS = [
  { value: 'hotel',      label: 'Hotels',      icon: '🏨', color: '#C9A84C' },
  { value: 'restaurant', label: 'Restaurants', icon: '🍽️', color: '#E74C3C' },
  { value: 'industry',   label: 'Industry',    icon: '🏭', color: '#1B6CA8' },
  { value: 'travel',     label: 'Travel',      icon: '✈️', color: '#4FC3F7' },
  { value: 'events',     label: 'Events',      icon: '🎉', color: '#2ECC71' },
  { value: 'other',      label: 'Other',       icon: '📦', color: '#9B59B6' },
];

export const BOTTLE_SIZES = ['200ml', '500ml', '1000ml'];

export const BOTTLE_COLORS = {
  '200ml':  '#42A5F5',
  '500ml':  '#1565C0',
  '1000ml': '#C9A84C',
};

export const API_BASE = '/api/v1';

export const REPORT_STATUS = {
  PASS: { label: 'PASS', color: '#1a8a4a', bg: 'rgba(46,204,113,0.12)', border: 'rgba(46,204,113,0.3)' },
  FAIL: { label: 'FAIL', color: '#c0392b', bg: 'rgba(231,76,60,0.12)',  border: 'rgba(231,76,60,0.3)' },
};

export const ENQUIRY_STATUS = [
  { value: 'new',       label: 'New',       color: '#1565C0' },
  { value: 'contacted', label: 'Contacted', color: '#C9A84C' },
  { value: 'closed',    label: 'Closed',    color: '#2ECC71' },
];
