// Template invoice-v1: builds the pdfmake document for one invoice. Pure: no DOM, no network,
// no pdfmake import. It takes the layout model that invoiceTemplates.js maps from the server's
// InvoiceDocument (contract §4). Shipped templates never change: a redesign is a new version.
// Money is in minor units (paise / cents) throughout.

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

// Tax and company identifiers, as [label, value] pairs
function partyIds(party) {
  if (Array.isArray(party.ids)) return party.ids;
  return [['GSTIN', party.gstin], ['PAN', party.pan]].filter(([, value]) => value);
}

function partyBlock(title, party) {
  return {
    stack: [
      label(title),
      { text: party.legalName, bold: true, fontSize: 10, color: COLORS.ink, margin: [0, 0, 0, 2] },
      ...party.address.map(line => ({ text: line, fontSize: 8.5, color: COLORS.text })),
      ...partyIds(party).map(([name, value], index) => ({
        text: [{ text: `${name}  `, color: COLORS.muted }, value], fontSize: 8.5, margin: [0, index === 0 ? 4 : 0, 0, 0]
      })),
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
  if (invoice.orderNumber) rows.push(['Order no.', invoice.orderNumber]);
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
      ? { text: item.value || 'Included', fontSize: 8.5, alignment: 'right', color: COLORS.accent }
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
  if (status === 'VOID') {
    title = 'Void';
    lines = [invoice.voidReason || 'This invoice was cancelled. No payment is due.'];
  } else if (status === 'UNPAID') {
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

// ---- Terms & conditions summary (text from the business team, printed as given)

const TERMS_URL = 'https://hypersign.id/terms/business';

const TERMS_INTRO = "By purchasing or using Hypermine services, the Client agrees to Hypermine's Business Terms & Conditions, including the Service Level Agreement (SLA) and Data Processing Agreement (DPA).";

// Each section: a title and its paragraphs; an array in place of a paragraph is a bullet list
const TERMS_SECTIONS = [
  ['1. Service Availability & SLA', [
    'Services are provided on an "AS IS" and "AS AVAILABLE" basis. SLA commitments apply only to Hypermine-controlled infrastructure. They exclude third-party failures, government API outages and other events beyond Hypermine\'s reasonable control. Processing times that depend on external systems are not guaranteed.'
  ]],
  ['2. Verification Disclaimer', [
    "Verification results support the Client's decision-making. Hypermine does not guarantee identity authenticity, verification accuracy, fraud prevention or successful verification outcomes. Final decisions remain the Client's responsibility."
  ]],
  ['3. Credits, Payments & Taxes', [
    "Credits are valid for the period stated in the applicable Order Form or pricing plan and expire unused at the end of that period. Credits are non-transferable and cannot be exchanged for cash. Payments are final, and Credits are non-refundable except as expressly provided in the Agreement or Order Form. Prices exclude taxes, which are the Client's responsibility. Overdue amounts may accrue interest."
  ]],
  ['4. Data Protection & Client Responsibilities', [
    'The Client is responsible for giving end users the required notices, obtaining their consents, establishing a lawful basis for processing, and complying with applicable laws. Personal data processing is governed by the DPA.'
  ]],
  ['5. Platform Usage & Restrictions', [
    "The Client receives a limited, non-exclusive, non-transferable right to use Hypermine's APIs and platform for its own business purposes. The Client may not resell, sublicense or otherwise make the Services available to third parties without a separate written agreement with Hypermine. Reverse engineering, decompiling, creating derivative works, unauthorized load or security testing, injecting malicious code, circumventing verification flows or rate limits, and other abusive use are prohibited."
  ]],
  ['6. Suspension & Termination', [
    'Hypermine may suspend or terminate access, without prior notice where warranted, in the following cases:',
    [
      'non-payment',
      'failed customer background verification',
      'misuse or abuse of the platform, including free-plan abuse',
      'unauthorized security testing',
      'attacks on or threats to the Services',
      'other breaches of the Agreement including Point 4'
    ],
    'If termination is for cause attributable to the Client, unused Credits are forfeited.'
  ]],
  ['7. Liability', [
    "Hypermine's total liability is limited to the fees paid by the Client in the 12 months preceding the claim, subject to the exclusions in the Agreement and applicable law."
  ]],
  ['8. Standard Support', [
    'Chat support is available Monday–Friday, 9:00 AM–6:00 PM CET, excluding public holidays. 24×7 support, including weekends and holidays, is available under a custom support proposal through your account manager.'
  ]]
];

const TERMS_DISCLAIMER = 'This summary is for information only. It does not replace, amend or override the Agreement.';

// Starts on its own page, after the invoice
function termsSection() {
  const paragraph = text => ({ text, fontSize: 7.5, color: COLORS.text, lineHeight: 1.3, margin: [0, 0, 0, 3] });
  const sections = TERMS_SECTIONS.map(([title, paragraphs]) => ({
    stack: [
      { text: title, bold: true, fontSize: 8.5, color: COLORS.ink, margin: [0, 0, 0, 3] },
      ...paragraphs.map(item => (Array.isArray(item)
        ? { ul: item, fontSize: 7.5, color: COLORS.text, lineHeight: 1.3, margin: [6, 0, 0, 3] }
        : paragraph(item)))
    ],
    margin: [0, 0, 0, 8],
    unbreakable: true
  }));
  return {
    pageBreak: 'before',
    stack: [
      { text: 'TERMS & CONDITIONS', bold: true, fontSize: 11, color: COLORS.ink, characterSpacing: 0.6, margin: [0, 0, 0, 8] },
      { ...paragraph(TERMS_INTRO), margin: [0, 0, 0, 12] },
      ...sections,
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.6, lineColor: COLORS.line }], margin: [0, 4, 0, 8] },
      { text: TERMS_DISCLAIMER, fontSize: 7.5, italics: true, color: COLORS.muted, margin: [0, 0, 0, 4] },
      {
        text: [
          { text: 'Full Business Terms & Conditions (including SLA and DPA): ', bold: true, color: COLORS.ink },
          { text: TERMS_URL, link: TERMS_URL, color: COLORS.accent, decoration: 'underline' }
        ],
        fontSize: 7.5
      }
    ]
  };
}

/**
 * @param {object} invoice  Layout model (see toInvoiceV1Model in invoiceTemplates.js)
 * @param {object} [options]
 * @param {string} [options.logo]  Hypermine logo as a data URL
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
        { text: `This is a computer-generated invoice and does not need a signature. Questions? ${invoice.supplier.supportEmail || invoice.supplier.email}`, fontSize: 7, color: COLORS.faint },
        { text: `Page ${currentPage} of ${pageCount}`, fontSize: 7, color: COLORS.faint, alignment: 'right', width: 60 }
      ]
    }),
    content: [
      {
        columns: [
          logo
            ? { image: logo, width: 130, margin: [0, 4, 0, 0] }
            : { text: 'HYPERMINE', width: 130, bold: true, fontSize: 16, color: COLORS.ink },
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
          {
            width: 200,
            stack: [
              totalsTable(invoice),
              // USD invoices paid online: the INR value at the gateway's rate (printed only when set)
              invoice.fxLine ? { text: invoice.fxLine, fontSize: 7.5, color: COLORS.muted, margin: [0, 6, 0, 0] } : null
            ].filter(Boolean)
          }
        ],
        columnGap: 28,
        margin: [0, 16, 0, 0]
      },
      invoice.notes && invoice.notes.length ? {
        stack: [label('Notes'), ...invoice.notes.map(note => ({ text: `•  ${note}`, fontSize: 8, color: COLORS.muted, margin: [0, 0, 0, 2] }))],
        margin: [0, 22, 0, 0]
      } : null,
      termsSection()
    ].filter(Boolean)
  };
}

export { formatPercentBps };
