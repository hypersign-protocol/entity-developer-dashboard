// Browser side of invoice PDFs: renders an invoice on the fly with pdfmake and downloads it.
// downloadInvoiceDocument takes the server's InvoiceDocument (contract §4); the template is
// chosen by its templateVersion in invoiceTemplates.js.
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// Invoices are issued by Hypermine Technologies, so they carry the Hypermine logo, not Hypersign's
import logoSrc from '@/assets/hypermine_full.png';
import { buildInvoicePdfDefinition, invoiceDocumentFileName } from './invoiceTemplates';

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

/**
 * Renders and saves an InvoiceDocument. Throws UnknownInvoiceTemplateError (message:
 * "Please refresh the dashboard to download this invoice") for a template this build lacks.
 */
export async function downloadInvoiceDocument(doc) {
  // Checked before loading fonts and the logo, so an unknown version fails fast
  buildInvoicePdfDefinition(doc);
  ensureFonts();
  const logo = await loadLogo();
  await pdfMake.createPdf(buildInvoicePdfDefinition(doc, { logo })).download(invoiceDocumentFileName(doc));
}
