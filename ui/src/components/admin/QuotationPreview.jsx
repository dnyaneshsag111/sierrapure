import { useRef } from 'react';
import {
  Box, Typography, Button, Divider, Grid, Chip,
  DialogTitle, DialogContent, DialogActions, IconButton, Table,
  TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import sierraLogo from '../../assets/images/sierra-logo.svg';
import { SEGMENTS } from '../../utils/constants';

const INR = (v) => `₹${Number(v ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const STATUS_COLORS = {
  draft: '#666', sent: '#1565C0', accepted: '#1a8a4a', rejected: '#c0392b', expired: '#C9A84C',
};

export default function QuotationPreview({ quotation: q, onClose }) {
  const printRef = useRef();

  const subtotal     = q.items?.reduce((s, it) => s + (it.quantity * it.unitPrice), 0) ?? 0;
  const discountAmt  = q.discountAmount ?? (subtotal * (q.discount ?? 0)) / 100;
  const taxable      = subtotal - discountAmt;
  const gstAmt       = q.gstAmount ?? (taxable * (q.gstPercent ?? 18)) / 100;
  const grandTotal   = q.totalAmount ?? (taxable + gstAmt);
  const qNumber      = q.quotationNumber ?? `QT-${String(q.id).padStart(4, '0')}`;
  const seg          = SEGMENTS.find(s => s.value === q.clientSegment);

  const handlePrint = () => {
    const subtotalVal   = q.items?.reduce((s, it) => s + (it.quantity * it.unitPrice), 0) ?? 0;
    const discountAmtV  = q.discountAmount ?? (subtotalVal * (q.discount ?? 0)) / 100;
    const taxableVal    = subtotalVal - discountAmtV;
    const gstAmtV       = q.gstAmount ?? (taxableVal * (q.gstPercent ?? 18)) / 100;
    const grandTotalV   = q.totalAmount ?? (taxableVal + gstAmtV);
    const fmtD = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const fmtINR = (v) => `₹${Number(v ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const itemRows = (q.items ?? []).map((item, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#F8FBFF'}">
        <td style="color:#888">${i + 1}</td>
        <td>
          <div style="font-weight:600;color:#0A2342">${item.description || `Sierra Pure ${item.size} Mineral Water`}</div>
          ${item.note ? `<div style="font-size:10px;color:#888;margin-top:2px">${item.note}</div>` : ''}
        </td>
        <td>${item.size ?? ''}</td>
        <td>${Number(item.quantity).toLocaleString('en-IN')}</td>
        <td>${fmtINR(item.unitPrice)}</td>
        <td style="font-weight:700;color:#0A2342">${fmtINR(item.quantity * item.unitPrice)}</td>
      </tr>
    `).join('');

    const win = window.open('', '_blank', 'width=900,height=750');
    win.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <title>Quotation — ${qNumber}</title>
          <style>
            @page { size: A4; margin: 16mm 14mm; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 11px;
              color: #0F1F35;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page { max-width: 780px; margin: 0 auto; padding: 20px; }

            /* ── Header bar ── */
            .header-bar {
              background: linear-gradient(135deg, #0A2342 0%, #1565C0 100%);
              border-radius: 8px;
              padding: 24px 28px;
              margin-bottom: 20px;
              overflow: hidden;
            }
            .header-inner {
              display: table;
              width: 100%;
            }
            .header-left  { display: table-cell; vertical-align: top; width: 60%; }
            .header-right { display: table-cell; vertical-align: top; text-align: right; width: 40%; }
            .company-name { color: white; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
            .company-sub  { color: rgba(255,255,255,0.6); font-size: 10px; margin-top: 6px; line-height: 1.7; }
            .qt-label { color: #4FC3F7; font-size: 9px; font-weight: 700; letter-spacing: 2px; }
            .qt-number { color: white; font-size: 18px; font-weight: 800; margin-top: 2px; }
            .qt-meta { color: rgba(255,255,255,0.55); font-size: 10px; margin-top: 6px; line-height: 1.7; }

            /* ── Two-column row ── */
            .two-col { display: table; width: 100%; border-spacing: 12px; margin-bottom: 16px; }
            .col-left  { display: table-cell; vertical-align: top; width: 50%; }
            .col-right { display: table-cell; vertical-align: top; width: 50%; }
            .info-box {
              background: #F8FBFF;
              border: 1px solid #E2EAF4;
              border-radius: 6px;
              padding: 14px 16px;
              height: 100%;
            }
            .info-box-alt {
              background: #F0F7FF;
              border: 1px solid #D4E8FF;
              border-radius: 6px;
              padding: 14px 16px;
              height: 100%;
            }
            .box-label { font-size: 9px; font-weight: 700; color: #888; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
            .box-name { font-size: 14px; font-weight: 700; color: #0A2342; }
            .box-text { font-size: 11px; color: #5C6B85; line-height: 1.7; margin-top: 4px; }
            .summary-row { display: table; width: 100%; margin-bottom: 5px; }
            .summary-lbl { display: table-cell; font-size: 10px; color: #888; }
            .summary-val { display: table-cell; text-align: right; font-size: 11px; font-weight: 600; color: #0A2342; }
            .summary-val.grand { font-weight: 800; color: #1565C0; font-size: 13px; }

            /* ── Section heading ── */
            .section-heading {
              font-size: 10px; font-weight: 700; color: #5C6B85;
              letter-spacing: 1.5px; text-transform: uppercase;
              margin: 18px 0 8px;
            }

            /* ── Items table ── */
            table.items { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
            table.items thead th {
              background: #0A2342;
              color: white;
              padding: 8px 10px;
              text-align: left;
              font-size: 10px;
              font-weight: 700;
            }
            table.items tbody td {
              padding: 8px 10px;
              border-bottom: 1px solid #F0F4F8;
              font-size: 11px;
              vertical-align: top;
            }

            /* ── Totals ── */
            .totals-wrap { display: table; width: 100%; margin-top: 12px; }
            .totals-spacer { display: table-cell; width: 55%; }
            .totals-box   { display: table-cell; width: 45%; vertical-align: top; }
            .total-line { display: table; width: 100%; padding: 5px 0; border-bottom: 1px solid #F0F4F8; }
            .total-lbl  { display: table-cell; font-size: 11px; color: #5C6B85; }
            .total-val  { display: table-cell; text-align: right; font-size: 11px; font-weight: 600; color: #0A2342; }
            .total-val.red { color: #c0392b; }
            .grand-line { display: table; width: 100%; padding: 10px 0 5px; border-top: 2px solid #1565C0; margin-top: 4px; }
            .grand-lbl  { display: table-cell; font-size: 13px; font-weight: 800; color: #0A2342; }
            .grand-val  { display: table-cell; text-align: right; font-size: 14px; font-weight: 800; color: #1565C0; }

            /* ── Terms / Notes ── */
            .terms-section { margin-top: 20px; padding-top: 16px; border-top: 1px solid #E2EAF4; }
            .terms-cols { display: table; width: 100%; border-spacing: 12px; }
            .terms-col  { display: table-cell; vertical-align: top; width: 50%; }
            .terms-col.full { width: 100%; }
            .terms-title { font-size: 10px; font-weight: 700; color: #0A2342; letter-spacing: 1px; margin-bottom: 6px; }
            .terms-text  { font-size: 10px; color: #5C6B85; line-height: 1.8; white-space: pre-line; }

            /* ── Footer ── */
            .footer {
              margin-top: 24px;
              padding-top: 14px;
              border-top: 1px solid #E2EAF4;
              display: table;
              width: 100%;
            }
            .footer-left  { display: table-cell; vertical-align: bottom; width: 65%; font-size: 9px; color: #888; line-height: 1.7; }
            .footer-right { display: table-cell; vertical-align: bottom; text-align: right; width: 35%; }
            .sig-line { border-top: 1px solid #0A2342; padding-top: 6px; display: inline-block; min-width: 140px; }
            .sig-name { font-size: 11px; font-weight: 700; color: #0A2342; }
            .sig-role { font-size: 9px; color: #888; }

            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .page { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="page">

            <!-- Header -->
            <div class="header-bar">
              <div class="header-inner">
                <div class="header-left">
                  <div class="company-name">Sierra Pure</div>
                  <div class="company-sub">
                    Sierra Pure Mineral Water Pvt. Ltd.<br/>
                    Industrial Area, Maharashtra, India<br/>
                    info@sierrapure.com &nbsp;·&nbsp; +91 98765 43210<br/>
                    GSTIN: 27AAACS1234F1Z5
                  </div>
                </div>
                <div class="header-right">
                  <div class="qt-label">QUOTATION</div>
                  <div class="qt-number">${qNumber}</div>
                  <div class="qt-meta">
                    Date: ${fmtD(q.createdAt ?? new Date())}<br/>
                    Valid until: ${fmtD(q.validUntil)}
                  </div>
                </div>
              </div>
            </div>

            <!-- Bill to / Summary -->
            <div class="two-col">
              <div class="col-left">
                <div class="info-box">
                  <div class="box-label">Bill To</div>
                  <div class="box-name">${q.clientName ?? ''}</div>
                  ${q.clientCompany ? `<div class="box-text" style="font-weight:600">${q.clientCompany}</div>` : ''}
                  <div class="box-text">
                    ${q.clientEmail ?? ''}<br/>
                    ${q.clientPhone ? q.clientPhone + '<br/>' : ''}
                    ${q.clientAddress ?? ''}
                  </div>
                </div>
              </div>
              <div class="col-right">
                <div class="info-box-alt">
                  <div class="box-label">Summary</div>
                  <div class="summary-row"><span class="summary-lbl">Quotation #</span><span class="summary-val">${qNumber}</span></div>
                  <div class="summary-row"><span class="summary-lbl">Date</span><span class="summary-val">${fmtD(q.createdAt ?? new Date())}</span></div>
                  <div class="summary-row"><span class="summary-lbl">Valid Until</span><span class="summary-val">${fmtD(q.validUntil)}</span></div>
                  <div class="summary-row"><span class="summary-lbl">Grand Total</span><span class="summary-val grand">${fmtINR(grandTotalV)}</span></div>
                </div>
              </div>
            </div>

            <!-- Line Items -->
            <div class="section-heading">Line Items</div>
            <table class="items">
              <thead>
                <tr>
                  <th style="width:30px">#</th>
                  <th>Description</th>
                  <th style="width:60px">Size</th>
                  <th style="width:60px">Qty</th>
                  <th style="width:90px">Unit Price</th>
                  <th style="width:100px">Amount</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <!-- Totals -->
            <div class="totals-wrap">
              <div class="totals-spacer"></div>
              <div class="totals-box">
                <div class="total-line">
                  <span class="total-lbl">Subtotal</span>
                  <span class="total-val">${fmtINR(subtotalVal)}</span>
                </div>
                ${(q.discount ?? 0) > 0 ? `
                <div class="total-line">
                  <span class="total-lbl">Discount (${q.discount ?? 0}%)</span>
                  <span class="total-val red">-${fmtINR(discountAmtV)}</span>
                </div>` : ''}
                <div class="total-line">
                  <span class="total-lbl">GST (${q.gstPercent ?? 18}%)</span>
                  <span class="total-val">${fmtINR(gstAmtV)}</span>
                </div>
                <div class="grand-line">
                  <span class="grand-lbl">Grand Total</span>
                  <span class="grand-val">${fmtINR(grandTotalV)}</span>
                </div>
              </div>
            </div>

            <!-- Terms & Notes -->
            ${(q.termsAndConditions || q.notes) ? `
            <div class="terms-section">
              <div class="terms-cols">
                ${q.termsAndConditions ? `
                <div class="terms-col${!q.notes ? ' full' : ''}">
                  <div class="terms-title">TERMS &amp; CONDITIONS</div>
                  <div class="terms-text">${q.termsAndConditions}</div>
                </div>` : ''}
                ${q.notes ? `
                <div class="terms-col${!q.termsAndConditions ? ' full' : ''}">
                  <div class="terms-title">NOTES</div>
                  <div class="terms-text">${q.notes}</div>
                </div>` : ''}
              </div>
            </div>` : ''}

            <!-- Footer -->
            <div class="footer">
              <div class="footer-left">
                Sierra Pure Mineral Water Pvt. Ltd. &nbsp;·&nbsp; GSTIN: 27AAACS1234F1Z5<br/>
                This is a computer-generated quotation and does not require a physical signature.
              </div>
              <div class="footer-right">
                <div class="sig-line">
                  <div class="sig-role">Authorised Signatory</div>
                  <div class="sig-name">Sierra Pure</div>
                </div>
              </div>
            </div>

          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #E2EAF4' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontWeight: 800, color: '#0A2342', fontFamily: "'Playfair Display', serif" }}>
            {qNumber}
          </Typography>
          <Chip
            label={(q.status ?? 'draft').toUpperCase()}
            size="small"
            sx={{ background: `${STATUS_COLORS[q.status] ?? '#666'}18`, color: STATUS_COLORS[q.status] ?? '#666', fontWeight: 700, fontSize: '0.68rem' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" startIcon={<PrintIcon />} onClick={handlePrint}
            sx={{ borderRadius: 9999, color: '#1B6CA8', fontWeight: 600 }}>Print / PDF</Button>
          <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* ── Printable content ─────────────────────────────────────────── */}
        <Box ref={printRef} className="page" sx={{ p: { xs: 2.5, sm: 4 } }}>

          {/* Header bar */}
          <Box sx={{
            background: 'linear-gradient(135deg, #0A2342 0%, #1565C0 100%)',
            borderRadius: 3, p: { xs: 2.5, sm: 3.5 }, mb: 3,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2,
          }}>
            <Box>
              <Box component="img" src={sierraLogo} alt="Sierra Pure"
                sx={{ height: 40, filter: 'brightness(0) invert(1)', opacity: 0.95, mb: 1.5 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', lineHeight: 1.6 }}>
                Sierra Pure Mineral Water Pvt. Ltd.<br />
                Industrial Area, Maharashtra, India<br />
                info@sierrapure.com · +91 98765 43210<br />
                GSTIN: 27AAACS1234F1Z5
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ color: '#4FC3F7', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', mb: 0.5 }}>
                QUOTATION
              </Typography>
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>{qNumber}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', mt: 1 }}>
                Date: {fmtDate(q.createdAt ?? new Date())}<br />
                Valid until: {fmtDate(q.validUntil)}
              </Typography>
            </Box>
          </Box>

          {/* Bill to */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ background: '#F8FBFF', borderRadius: 2, p: 2.5, border: '1px solid #E2EAF4', height: '100%' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', mb: 1.5 }}>
                  BILL TO
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '1rem' }}>{q.clientName}</Typography>
                {q.clientCompany && <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{q.clientCompany}</Typography>}
                {seg && <Chip label={`${seg.icon} ${seg.label}`} size="small" sx={{ mt: 0.5, fontSize: '0.65rem', background: `${seg.color}15`, color: seg.color, fontWeight: 600 }} />}
                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.82rem', mt: 1, lineHeight: 1.7 }}>
                  {q.clientEmail}<br />
                  {q.clientPhone && <>{q.clientPhone}<br /></>}
                  {q.clientAddress}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ background: '#F0F7FF', borderRadius: 2, p: 2.5, border: '1px solid #D4E8FF', height: '100%' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', mb: 1.5 }}>
                  SUMMARY
                </Typography>
                {[
                  { label: 'Quotation #',  value: qNumber },
                  { label: 'Date',         value: fmtDate(q.createdAt ?? new Date()) },
                  { label: 'Valid Until',  value: fmtDate(q.validUntil) },
                  { label: 'Grand Total',  value: INR(grandTotal), bold: true, color: '#1565C0' },
                ].map(row => (
                  <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.label}</Typography>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: row.bold ? 800 : 600, color: row.color ?? '#0A2342' }}>
                      {row.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Line items table */}
          <Typography sx={{ fontWeight: 700, color: '#0A2342', mb: 1.5, fontSize: '0.88rem', letterSpacing: '0.06em' }}>
            LINE ITEMS
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: '#0A2342' }}>
                {['#', 'Description', 'Size', 'Qty', 'Unit Price', 'Amount'].map(h => (
                  <TableCell key={h} sx={{ color: 'white', fontWeight: 700, fontSize: '0.75rem', py: 1.2 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(q.items ?? []).map((item, i) => (
                <TableRow key={i} sx={{ background: i % 2 === 0 ? 'white' : '#F8FBFF' }}>
                  <TableCell sx={{ fontSize: '0.78rem', color: 'var(--text-muted)', py: 1.2 }}>{i + 1}</TableCell>
                  <TableCell sx={{ py: 1.2 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#0A2342' }}>
                      {item.description || `Sierra Pure ${item.size} Mineral Water`}
                    </Typography>
                    {item.note && <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.note}</Typography>}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.82rem', py: 1.2 }}>{item.size}</TableCell>
                  <TableCell sx={{ fontSize: '0.82rem', py: 1.2 }}>{Number(item.quantity).toLocaleString('en-IN')}</TableCell>
                  <TableCell sx={{ fontSize: '0.82rem', py: 1.2 }}>{INR(item.unitPrice)}</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A2342', py: 1.2 }}>
                    {INR(item.quantity * item.unitPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: 320 } }}>
              {[
                { label: 'Subtotal',          value: INR(subtotal) },
                { label: `Discount (${q.discount ?? 0}%)`, value: `-${INR(discountAmt)}`, color: '#c0392b' },
                { label: `GST (${q.gstPercent ?? 18}%)`,  value: INR(gstAmt) },
              ].map(row => (
                <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6, borderBottom: '1px solid #F0F4F8' }}>
                  <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{row.label}</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: row.color ?? '#0A2342' }}>{row.value}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5, borderTop: '2px solid #1565C0', mt: 0.5 }}>
                <Typography sx={{ fontWeight: 800, color: '#0A2342', fontSize: '1rem' }}>Grand Total</Typography>
                <Typography sx={{ fontWeight: 800, color: '#1565C0', fontSize: '1.1rem' }}>{INR(grandTotal)}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Terms + Notes */}
          {(q.termsAndConditions || q.notes) && (
            <>
              <Divider sx={{ my: 3 }} />
              <Grid container spacing={3}>
                {q.termsAndConditions && (
                  <Grid item xs={12} sm={q.notes ? 6 : 12}>
                    <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.82rem', letterSpacing: '0.06em', mb: 1 }}>
                      TERMS & CONDITIONS
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                      {q.termsAndConditions}
                    </Typography>
                  </Grid>
                )}
                {q.notes && (
                  <Grid item xs={12} sm={q.termsAndConditions ? 6 : 12}>
                    <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.82rem', letterSpacing: '0.06em', mb: 1 }}>
                      NOTES
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                      {q.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {/* Footer */}
          <Box sx={{ mt: 4, pt: 2.5, borderTop: '1px solid #E2EAF4', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
            <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Sierra Pure Mineral Water Pvt. Ltd. · GSTIN: 27AAACS1234F1Z5<br />
              This is a computer-generated quotation and does not require a physical signature.
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ borderTop: '1px solid #0A2342', pt: 1, minWidth: 160 }}>
                <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Authorised Signatory</Typography>
                <Typography sx={{ fontWeight: 700, color: '#0A2342', fontSize: '0.82rem' }}>Sierra Pure</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #E2EAF4' }}>
        <Button onClick={onClose} sx={{ borderRadius: 9999, color: 'var(--text-muted)' }}>Close</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}
          sx={{ borderRadius: 9999, background: 'linear-gradient(135deg, #0A2342, #1565C0)', fontWeight: 700, px: 3 }}>
          Print / Save as PDF
        </Button>
      </DialogActions>
    </>
  );
}
