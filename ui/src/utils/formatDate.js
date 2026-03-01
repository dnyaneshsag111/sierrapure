import dayjs from 'dayjs';

export const formatDate = (date, fmt = 'DD MMM YYYY') =>
  date ? dayjs(date).format(fmt) : '—';

export const formatDateLong = (date) =>
  date ? dayjs(date).format('DD MMMM YYYY') : '—';

export const formatDateShort = (date) =>
  date ? dayjs(date).format('DD/MM/YYYY') : '—';
