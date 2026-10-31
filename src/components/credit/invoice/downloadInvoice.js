// Browser side of invoice PDFs: renders an invoice on the fly with pdfmake and downloads or opens it.
// The layout lives in invoiceDocument.js so the backend can render the same PDF.
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import logoSrc from '@/assets/Entity_full.png';
import { buildInvoiceDocument, invoiceFileName } from './invoiceDocument';

let fontsReady = false;
let logoDataUrl = null;

function ensureFonts() {
  if (fontsReady) return;
  // Merge rather than replace: other pages register extra fonts on the same pdfMake instance
  pdfMake.vfs = { ...(pdfMake.vfs || {}), ...(pdfFonts.vfs || pdfFonts) };
  pdfMake.addFonts({
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  });
  fontsReady = true;
}

function loadLogo() {
  if (logoDataUrl) return Promise.resolve(logoDataUrl);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      logoDataUrl = canvas.toDataURL('image/png');
      resolve(logoDataUrl);
    };
    // Falls back to a text wordmark in the PDF
    img.onerror = () => resolve(null);
    img.src = logoSrc;
  });
}

async function createInvoicePdf(invoice) {
  ensureFonts();
  const logo = await loadLogo();
  return pdfMake.createPdf(buildInvoiceDocument(invoice, { logo }));
}

export async function downloadInvoicePdf(invoice) {
  const pdf = await createInvoicePdf(invoice);
  await pdf.download(invoiceFileName(invoice));
}

export async function openInvoicePdf(invoice) {
  const pdf = await createInvoicePdf(invoice);
  await pdf.open();
}
