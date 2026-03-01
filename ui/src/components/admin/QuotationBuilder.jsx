import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, Divider,
  MenuItem, Select, FormControl, InputLabel, Grid,
  DialogTitle, DialogContent, DialogActions, Chip, Tooltip,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { SEGMENTS, BOTTLE_SIZES } from '../../utils/constants';

const BOTTLE_PRICES = { '200ml': 8, '500ml': 14, '1000ml': 22 };

const emptyItem = () => ({
  _key: Math.random(),
  description: '',
  size: '500ml',
  quantity: 100,
  unitPrice: BOTTLE_PRICES['500ml'],
  customLabel: false,
  note: '',
});

const defaultForm = () => ({
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientCompany: '',
  clientSegment: '',
  clientAddress: '',
  validDays: 15,
  items: [emptyItem()],
  discount: 0,
  gstPercent: 18,
  termsAndConditions:
    '1. Prices are inclusive of standard packaging.\n' +
    '2. Minimum order quantity applies per size.\n' +
    '3. Custom label design charges may apply for first-time orders.\n' +
    '4. Delivery charges are extra based on location.\n' +
    '5. Payment: 50% advance, 50% before dispatch.\n' +
    '6. This quotation is valid for the duration mentioned above.',
  notes: '',
  status: 'draft',
});

export default function QuotationBuilder({ onClose, onSaved, editing, enquiryContext }) {
  const [form, setForm] = useState(defaultForm());

  // Pre-fill from editing quotation or enquiry context
  useEffect(() => {
    if (editing) {
      setForm({
        ...defaultForm(),
        ...editing,
        items: editing.items?.length
          ? editing.items.map(it => ({ ...it, _key: Math.random() }))
          : [emptyItem()],
      });
    } else if (enquiryContext) {
      setForm(prev => ({
        ...prev,
        clientName:    enquiryContext.name    ?? '',
        clientEmail:   enquiryContext.email   ?? '',
        clientPhone:   enquiryContext.phone   ?? '',
        clientCompany: enquiryContext.company ?? '',
        clientSegment: enquiryContext.segment ?? '',
        items: enquiryContext.bottleSizes?.length
          ? enquiryContext.bottleSizes.map(size => ({ ...emptyItem(), size, unitPrice: BOTTLE_PRICES[size] ?? 14 }))
          : [emptyItem()],
        enquiryId: enquiryContext.id,
      }));
    }
  }, [editing, enquiryContext]);

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));

  // ── Line items helpers ──────────────────────────────────────────────────
  const addItem = () => setForm(p => ({ ...p, items: [...p.items, emptyItem()] }));
  const removeItem = (key) => setForm(p => ({ ...p, items: p.items.filter(it => it._key !== key) }));
  const updateItem = (key, field, value) =>
    setForm(p => ({
      ...p,
      items: p.items.map(it => {
        if (it._key !== key) return it;
        const updated = { ...it, [field]: value };
        if (field === 'size') updated.unitPrice = BOTTLE_PRICES[value] ?? it.unitPrice;
        return updated;
      }),
    }));

  // ── Totals ──────────────────────────────────────────────────────────────
  const subtotal  = form.items.reduce((s, it) => s + (Number(it.quantity) * Number(it.unitPrice)), 0);
  const discountAmt = (subtotal * Number(form.discount)) / 100;
  const taxable   = subtotal - discountAmt;
  const gstAmt    = (taxable * Number(form.gstPercent)) / 100;
  const grandTotal = taxable + gstAmt;

  // ── Save / Send mutations ───────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing?.id
        ? api.put(`/quotations/${editing.id}`, payload).then(r => r.data.data)
        : api.post('/quotations', payload).then(r => r.data.data),
    onSuccess: () => { toast.success(editing?.id ? 'Quotation updated.' : 'Quotation saved.'); onSaved(); },
    onError: (e) => toast.error(e?.response?.data?.message ?? 'Failed to save quotation.'),
  });

  const sendMutation = useMutation({
    mutationFn: (payload) => {
      const base = editing?.id
        ? api.put(`/quotations/${editing.id}`, payload)
        : api.post('/quotations', payload);
      return base.then(r => api.post(`/quotations/${r.data.data.id}/send`)).then(r => r.data);
    },
    onSuccess: () => { toast.success('Quotation sent to client!'); onSaved(); },
    onError: (e) => toast.error(e?.response?.data?.message ?? 'Failed to send quotation.'),
  });

  const buildPayload = (status) => ({
    ...form,
    status,
    subtotal,
    discountAmount: discountAmt,
    gstAmount: gstAmt,
    totalAmount: grandTotal,
    validUntil: new Date(Date.now() + form.validDays * 86400000).toISOString().split('T')[0],
    items: form.items.map(({ _key, ...it }) => it),
  });

  const handleSave = () => saveMutation.mutate(buildPayload('draft'));
  const handleSend = () => {
    if (!form.clientEmail) { toast.error('Client email is required to send.'); return; }
    sendMutation.mutate(buildPayload('sent'));
  };

  const isBusy = saveMutation.isPending || sendMutation.isPending;

  return (
    <>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #E2EAF4' }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
            {editing?.id ? `Edit Quotation — ${editing.quotationNumber ?? `QT-${String(editing.id).padStart(4,'0')}`}` : 'New Quotation'}
          </Typography>
          {enquiryContext && (
            <Chip label={`From enquiry: ${enquiryContext.name}`} size="small"
              sx={{ mt: 0.5, background: '#EEF4FF', color: '#1565C0', fontWeight: 600, fontSize: '0.7rem' }} />
          )}
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* ── Client Details ──────────────────────────────────────────── */}
        <Typography sx={{ fontWeight: 700, color: '#0A2342', mb: 2, fontSize: '0.88rem', letterSpacing: '0.06em' }}>
          CLIENT DETAILS
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Client Name *" value={form.clientName}
              onChange={e => set('clientName', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Email *" value={form.clientEmail}
              onChange={e => set('clientEmail', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Phone" value={form.clientPhone}
              onChange={e => set('clientPhone', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Company" value={form.clientCompany}
              onChange={e => set('clientCompany', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Segment</InputLabel>
              <Select value={form.clientSegment} label="Segment" onChange={e => set('clientSegment', e.target.value)}>
                <MenuItem value=""><em>Select segment</em></MenuItem>
                {SEGMENTS.map(s => <MenuItem key={s.value} value={s.value}>{s.icon} {s.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Address / City" value={form.clientAddress}
              onChange={e => set('clientAddress', e.target.value)} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* ── Line Items ──────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.88rem', letterSpacing: '0.06em' }}>
            LINE ITEMS
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addItem}
            sx={{ borderRadius: 9999, color: '#1B6CA8', fontWeight: 600 }}>
            Add Item
          </Button>
        </Box>

        {/* Item header */}
        <Grid container spacing={1} sx={{ mb: 1, px: 0.5 }}>
          {['Description', 'Size', 'Qty', 'Unit Price (₹)', 'Amount (₹)', ''].map(h => (
            <Grid item xs key={h} sx={{ flex: h === 'Description' ? 3 : h === '' ? 0.4 : 1 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{h}</Typography>
            </Grid>
          ))}
        </Grid>

        {form.items.map((item, idx) => (
          <Box key={item._key} sx={{
            background: '#F8FBFF', borderRadius: 2, border: '1px solid #E2EAF4',
            p: 1.5, mb: 1.5,
          }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item sx={{ flex: 3 }}>
                <TextField fullWidth size="small" placeholder={`Item ${idx + 1} description`}
                  value={item.description}
                  onChange={e => updateItem(item._key, 'description', e.target.value)} />
              </Grid>
              <Grid item sx={{ flex: 1 }}>
                <Select fullWidth size="small" value={item.size}
                  onChange={e => updateItem(item._key, 'size', e.target.value)}>
                  {BOTTLE_SIZES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item sx={{ flex: 1 }}>
                <TextField fullWidth size="small" type="number" inputProps={{ min: 1 }}
                  value={item.quantity}
                  onChange={e => updateItem(item._key, 'quantity', e.target.value)} />
              </Grid>
              <Grid item sx={{ flex: 1 }}>
                <TextField fullWidth size="small" type="number" inputProps={{ min: 0, step: 0.5 }}
                  value={item.unitPrice}
                  onChange={e => updateItem(item._key, 'unitPrice', e.target.value)} />
              </Grid>
              <Grid item sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.88rem', pl: 0.5 }}>
                  ₹{(Number(item.quantity) * Number(item.unitPrice)).toLocaleString('en-IN')}
                </Typography>
              </Grid>
              <Grid item sx={{ flex: 0.4 }}>
                <Tooltip title="Remove item">
                  <IconButton size="small" onClick={() => removeItem(item._key)}
                    disabled={form.items.length === 1} sx={{ color: '#E74C3C' }}>
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <TextField fullWidth size="small" placeholder="Item note (optional)"
              value={item.note} onChange={e => updateItem(item._key, 'note', e.target.value)}
              sx={{ mt: 1 }} InputProps={{ sx: { fontSize: '0.78rem' } }} />
          </Box>
        ))}

        {/* ── Totals ──────────────────────────────────────────────────── */}
        <Box sx={{ background: '#F0F7FF', borderRadius: 3, p: 2.5, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" label="Discount (%)" type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={form.discount} onChange={e => set('discount', e.target.value)} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" label="GST (%)" type="number"
                    inputProps={{ min: 0, max: 28 }}
                    value={form.gstPercent} onChange={e => set('gstPercent', e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size="small" label="Valid for (days)" type="number"
                    inputProps={{ min: 1 }}
                    value={form.validDays} onChange={e => set('validDays', e.target.value)} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {[
                  { label: 'Subtotal',    value: subtotal,    muted: true },
                  { label: `Discount (${form.discount}%)`, value: -discountAmt, muted: true },
                  { label: `GST (${form.gstPercent}%)`,   value: gstAmt, muted: true },
                ].map(row => (
                  <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{row.label}</Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: row.value < 0 ? '#c0392b' : '#0A2342', fontWeight: 600 }}>
                      {row.value < 0 ? '-' : ''}₹{Math.abs(row.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 800, color: '#0A2342', fontSize: '1rem' }}>Grand Total</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#1565C0', fontSize: '1.05rem' }}>
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ── Terms & Notes ────────────────────────────────────────────── */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth multiline minRows={5} size="small" label="Terms & Conditions"
              value={form.termsAndConditions}
              onChange={e => set('termsAndConditions', e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth multiline minRows={5} size="small" label="Additional Notes"
              value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="e.g. custom label included, free sample available, etc." />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #E2EAF4', gap: 1 }}>
        <Button onClick={onClose} disabled={isBusy} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>
          Cancel
        </Button>
        <Button
          variant="outlined" startIcon={<SaveIcon />}
          onClick={handleSave} disabled={isBusy || !form.clientName}
          sx={{ borderRadius: 9999, borderColor: '#1B6CA8', color: '#1B6CA8', fontWeight: 700, px: 3 }}
        >
          {saveMutation.isPending ? 'Saving…' : 'Save Draft'}
        </Button>
        <Button
          variant="contained" startIcon={<SendIcon />}
          onClick={handleSend} disabled={isBusy || !form.clientName || !form.clientEmail}
          sx={{
            borderRadius: 9999, fontWeight: 700, px: 3,
            background: 'linear-gradient(135deg, #0A2342, #1565C0)',
            boxShadow: '0 4px 16px rgba(10,35,66,0.25)',
          }}
        >
          {sendMutation.isPending ? 'Sending…' : 'Save & Send'}
        </Button>
      </DialogActions>
    </>
  );
}
