// Builds the pdfmake document for one invoice. Pure: no DOM, no network, no pdfmake import,
// so the backend can render the same invoice from the same code on request (see the ADR, §8.3).
// Money is in minor units (paise / cents) throughout, as in the ADR's Invoice model.

const COLORS = {
  ink: '#172554',
  text: '#273448',
  muted: '#718198',
  faint: '#8793a5',
  line: '#e1e6ed',
  softLine: '#eef2f6',
  panel: '#f8fafc',
  accent: '#2563dc',
  accentSoft: '#f1f6ff'
};

const STATUS_BADGE = {
  PAID: { label: 'PAID', fill: '#e6efff', color: '#2563dc' },
  UNPAID: { label: 'PAYMENT DUE', fill: '#fff4e5', color: '#b45309' },
  VOID: { label: 'VOID', fill: '#f1f5f9', color: '#64748b' },
  COMPLIMENTARY: { label: 'COMPLIMENTARY', fill: '#f1f5f9', color: '#475467' }
};

const LOCALE_BY_CURRENCY = { INR: 'en-IN', USD: 'en-US' };

export function formatMinor(amountMinor, currency) {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency] || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format((Number(amountMinor) || 0) / 100);
}

export function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function formatPercentBps(bps) {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(bps / 100)}%`;
}

// ---- Amount in words (Indian numbering for INR, international for USD)

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
  'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function belowThousand(n) {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts = [];
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest) parts.push(rest < 20 ? ONES[rest] : `${TENS[Math.floor(rest / 10)]}${rest % 10 ? `-${ONES[rest % 10]}` : ''}`);
  return parts.join(' ');
}

function wholeInWords(n, indian) {
  if (n === 0) return 'Zero';
  const scales = indian
    ? [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand']]
    : [[1000000000, 'Billion'], [1000000, 'Million'], [1000, 'Thousand']];
  const parts = [];
  let rest = n;
  scales.forEach(([size, name]) => {
    const count = Math.floor(rest / size);
    if (count) {
      parts.push(`${indian ? wholeInWords(count, true) : belowThousand(count)} ${name}`);
      rest %= size;
    }
  });
  if (rest) parts.push(belowThousand(rest));
  return parts.join(' ');
}

export function amountInWords(amountMinor, currency) {
  const major = Math.floor(amountMinor / 100);
  const minor = amountMinor % 100;
  const isInr = currency === 'INR';
  const unit = isInr ? 'Indian Rupees' : 'US Dollars';
  const minorUnit = isInr ? 'Paise' : 'Cents';
  const words = `${unit} ${wholeInWords(major, isInr)}`;
  return `${minor ? `${words} and ${wholeInWords(minor, false)} ${minorUnit}` : words} Only`;
}

// ---- Building blocks

const label = text => ({ text: text.toUpperCase(), fontSize: 7, bold: true, color: COLORS.muted, characterSpacing: 0.6, margin: [0, 0, 0, 4] });

function partyBlock(title, party) {
  return {
    stack: [
      label(title),
      { text: party.legalName, bold: true, fontSize: 10, color: COLORS.ink, margin: [0, 0, 0, 2] },
      ...party.address.map(line => ({ text: line, fontSize: 8.5, color: COLORS.text })),
      party.gstin ? { text: [{ text: 'GSTIN  ', color: COLORS.muted }, party.gstin], fontSize: 8.5, margin: [0, 4, 0, 0] } : null,
      party.pan ? { text: [{ text: 'PAN  ', color: COLORS.muted }, party.pan], fontSize: 8.5 } : null,
      party.email ? { text: party.email, fontSize: 8.5, color: COLORS.muted, margin: [0, 2, 0, 0] } : null
    ].filter(Boolean)
  };
}

function detailRows(invoice) {
  const rows = [
    ['Invoice no.', invoice.invoiceNumber],
    ['Issue date', formatDate(invoice.issuedAt)]
  ];
  if (invoice.status === 'UNPAID') rows.push(['Due date', formatDate(invoice.dueAt)]);
  if (invoice.status === 'PAID' && invoice.payment) rows.push(['Paid on', formatDate(invoice.payment.paidAt)]);
  if (invoice.placeOfSupply) rows.push(['Place of supply', invoice.placeOfSupply]);
  if (invoice.orderNumber) rows.push(['Order no.', invoice.orderNumber]);
  rows.push(['App', invoice.app.name]);
  return {
    stack: [
      label('Invoice details'),
      {
        table: {
          widths: [62, '*'],
          body: rows.map(([key, value]) => [
            { text: key, fontSize: 8.5, color: COLORS.muted },
            { text: value, fontSize: 8.5, color: COLORS.text, bold: key === 'Invoice no.' }
          ])
        },
        layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0, paddingTop: () => 1, paddingBottom: () => 1 }
      }
    ]
  };
}

function badge(invoice) {
  const key = invoice.settlement === 'COMPLIMENTARY' && invoice.status === 'PAID' ? 'COMPLIMENTARY' : invoice.status;
  const style = STATUS_BADGE[key] || STATUS_BADGE.PAID;
  return {
    table: { body: [[{ text: style.label, bold: true, fontSize: 7.5, color: style.color, characterSpacing: 0.8, margin: [6, 2, 6, 2] }]] },
    layout: { hLineWidth: () => 0, vLineWidth: () => 0, fillColor: () => style.fill },
    alignment: 'right'
  };
}

function itemsTable(invoice) {
  const header = ['#', 'Description', 'SAC', 'Qty', 'Amount'].map((text, i) => ({
    text: text.toUpperCase(), fontSize: 7, bold: true, color: COLORS.muted, characterSpacing: 0.6,
    alignment: i >= 3 ? 'right' : 'left'
  }));
  // Included add-ons are lighter rows with no SAC or quantity, so the paid line stands out
  const rows = invoice.items.map((item, index) => [
    { text: String(index + 1), fontSize: 9, color: COLORS.muted },
    {
      stack: [
        { text: item.description, fontSize: item.included ? 8.5 : 9.5, bold: !item.included, color: item.included ? COLORS.text : COLORS.ink },
        item.detail ? { text: item.detail, fontSize: 8, color: COLORS.muted, margin: [0, 2, 0, 0] } : null
      ].filter(Boolean)
    },
    { text: item.included ? '' : item.sac || '', fontSize: 9, color: COLORS.text },
    { text: item.included ? '' : String(item.quantity || 1), fontSize: 9, alignment: 'right', color: COLORS.text },
    item.included
      ? { text: 'Included', fontSize: 8.5, alignment: 'right', color: COLORS.accent }
      : { text: formatMinor(item.amountMinor, invoice.currency), fontSize: 9.5, alignment: 'right', color: COLORS.ink }
  ]);
  return {
    table: { headerRows: 1, widths: [14, '*', 44, 26, 80], body: [header, ...rows] },
    layout: {
      hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0 : 0.6),
      hLineColor: i => (i === 1 ? COLORS.line : COLORS.softLine),
      vLineWidth: () => 0,
      fillColor: i => (i === 0 ? COLORS.panel : null),
      paddingTop: (i, node) => (node.table.body[i] && i > 1 && invoice.items[i - 1] && invoice.items[i - 1].included ? 5 : 7),
      paddingBottom: (i, node) => (node.table.body[i] && i > 1 && invoice.items[i - 1] && invoice.items[i - 1].included ? 5 : 7),
      paddingLeft: () => 6,
      paddingRight: () => 6
    }
  };
}

function totalsTable(invoice) {
  const { totals, currency } = invoice;
  const money = value => formatMinor(value, currency);
  const rows = [['Subtotal', money(totals.subtotalMinor)]];
  invoice.discounts.forEach(discount => rows.push([discount.label, `− ${money(discount.amountMinor)}`]));
  rows.push(['Taxable value', money(totals.taxableMinor)]);
  invoice.tax.forEach(tax => rows.push([tax.label, money(tax.amountMinor)]));
  const body = rows.map(([key, value]) => [
    { text: key, fontSize: 8.5, color: COLORS.muted },
    { text: value, fontSize: 8.5, alignment: 'right', color: COLORS.text }
  ]);
  body.push([
    { text: 'Total', fontSize: 10.5, bold: true, color: COLORS.ink, margin: [0, 4, 0, 0] },
    { text: money(totals.totalMinor), fontSize: 10.5, bold: true, alignment: 'right', color: COLORS.ink, margin: [0, 4, 0, 0] }
  ]);
  body.push([
    { text: 'Amount paid', fontSize: 8.5, color: COLORS.muted },
    { text: money(totals.amountPaidMinor), fontSize: 8.5, alignment: 'right', color: COLORS.text }
  ]);
  body.push([
    { text: 'Balance due', fontSize: 9.5, bold: true, color: totals.balanceMinor ? '#b45309' : COLORS.ink },
    { text: money(totals.balanceMinor), fontSize: 9.5, bold: true, alignment: 'right', color: totals.balanceMinor ? '#b45309' : COLORS.ink }
  ]);
  const totalRow = body.length - 3;
  return {
    table: { widths: ['*', 90], body },
    layout: {
      hLineWidth: i => (i === totalRow ? 0.8 : 0),
      hLineColor: () => COLORS.line,
      vLineWidth: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 2,
      paddingBottom: () => 2
    }
  };
}

function paymentPanel(invoice) {
  const { payment, paymentLink, settlement, status, currency, totals } = invoice;
  let title;
  let lines;
  let qr = null;
  if (status === 'UNPAID') {
    title = `Payment due by ${formatDate(invoice.dueAt)}`;
    lines = [
      `Pay ${formatMinor(totals.balanceMinor, currency)} securely online. Your credits are activated as soon as the payment is confirmed.`,
      { text: paymentLink.url, link: paymentLink.url, color: COLORS.accent, decoration: 'underline' }
    ];
    qr = paymentLink.url;
  } else if (settlement === 'COMPLIMENTARY') {
    title = 'Complimentary credits';
    lines = ['No payment is due for this invoice.'];
  } else if (settlement === 'OFFLINE') {
    title = `Paid on ${formatDate(payment.paidAt)}`;
    lines = [`${payment.method} · Reference ${payment.reference}`];
  } else {
    title = `Paid on ${formatDate(payment.paidAt)}`;
    lines = [`${payment.method} via ${payment.provider} · Payment ID ${payment.paymentId}`];
  }
  const textStack = {
    stack: [
      { text: title, bold: true, fontSize: 9, color: COLORS.ink, margin: [0, 0, 0, 3] },
      ...lines.map(line => (typeof line === 'string' ? { text: line, fontSize: 8, color: COLORS.text, lineHeight: 1.3 } : { ...line, fontSize: 8 }))
    ]
  };
  return {
    table: {
      widths: ['*'],
      body: [[qr ? { columns: [textStack, { qr, fit: 64, width: 64, foreground: COLORS.ink }], columnGap: 10 } : textStack]]
    },
    layout: {
      hLineWidth: () => 0.6, vLineWidth: () => 0.6,
      hLineColor: () => COLORS.line, vLineColor: () => COLORS.line,
      fillColor: () => COLORS.panel,
      paddingLeft: () => 10, paddingRight: () => 10, paddingTop: () => 8, paddingBottom: () => 8
    }
  };
}

/**
 * @param {object} invoice  Invoice snapshot (see mockInvoices.js for the shape)
 * @param {object} [options]
 * @param {string} [options.logo]  Hypersign logo as a data URL
 */
export function buildInvoiceDocument(invoice, { logo } = {}) {
  const title = invoice.documentTitle || 'Tax Invoice';
  return {
    info: { title: `${title} ${invoice.invoiceNumber}`, author: invoice.supplier.legalName, subject: 'Hypersign credit top-up' },
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 56],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: COLORS.text, lineHeight: 1.2 },
    footer: (currentPage, pageCount) => ({
      margin: [40, 16, 40, 0],
      columns: [
        { text: `This is a computer-generated invoice and does not need a signature. Questions? ${invoice.supplier.supportEmail}`, fontSize: 7, color: COLORS.faint },
        { text: `Page ${currentPage} of ${pageCount}`, fontSize: 7, color: COLORS.faint, alignment: 'right', width: 60 }
      ]
    }),
    content: [
      {
        columns: [
          logo
            ? { image: logo, width: 130, margin: [0, 4, 0, 0] }
            : { text: 'HYPERSIGN', width: 130, bold: true, fontSize: 16, color: COLORS.ink },
          {
            width: '*',
            stack: [
              { text: title.toUpperCase(), bold: true, fontSize: 15, color: COLORS.ink, characterSpacing: 1, alignment: 'right' },
              { text: invoice.invoiceNumber, fontSize: 9, color: COLORS.muted, alignment: 'right', margin: [0, 2, 0, 6] },
              { columns: [{ text: '' }, { width: 'auto', ...badge(invoice) }] }
            ]
          }
        ]
      },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8, lineColor: COLORS.line }], margin: [0, 16, 0, 16] },
      {
        columns: [partyBlock('Billed by', invoice.supplier), partyBlock('Billed to', invoice.customer), detailRows(invoice)],
        columnGap: 18
      },
      { text: '', margin: [0, 0, 0, 18] },
      itemsTable(invoice),
      {
        columns: [
          {
            width: '*',
            stack: [
              label('Amount in words'),
              { text: amountInWords(invoice.totals.totalMinor, invoice.currency), fontSize: 8.5, italics: true, color: COLORS.text, margin: [0, 0, 0, 12] },
              paymentPanel(invoice)
            ]
          },
          { width: 200, ...totalsTable(invoice) }
        ],
        columnGap: 28,
        margin: [0, 16, 0, 0]
      },
      invoice.notes && invoice.notes.length ? {
        stack: [label('Notes'), ...invoice.notes.map(note => ({ text: `•  ${note}`, fontSize: 8, color: COLORS.muted, margin: [0, 0, 0, 2] }))],
        margin: [0, 22, 0, 0]
      } : null
    ].filter(Boolean)
  };
}

export function invoiceFileName(invoice) {
  return `Hypersign-Invoice-${invoice.invoiceNumber.replace(/[^A-Za-z0-9-]+/g, '-')}.pdf`;
}

export { formatPercentBps };
