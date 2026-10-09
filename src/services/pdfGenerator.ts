import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';

export interface GeneratedPdfResult {
  blob: Blob;
  blobUrl: string;
  filename: string;
  pageCount: number;
}

export async function generateUnified7PagePDF(
  containerId: string, 
  filename: string,
  onProgress?: (current: number, total: number) => void
): Promise<GeneratedPdfResult> {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error('تعذر العثور على حاوية المستندات');
  }

  // Find all 7 official paper elements
  const pageElements = container.querySelectorAll('.official-government-paper');
  if (pageElements.length === 0) {
    throw new Error('لم يتم العثور على صفحات القوالب الرسمية');
  }

  // A4 dimensions in points/mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const total = pageElements.length;

  // Create an isolated rendering sandbox with fixed desktop A4 dimensions (794px)
  // This prevents mobile viewports from squishing the tables and content to phone screen width
  const sandbox = document.createElement('div');
  sandbox.id = 'pdf-render-sandbox';
  sandbox.style.position = 'fixed';
  sandbox.style.top = '0';
  sandbox.style.left = '-9999px';
  sandbox.style.width = '794px';
  sandbox.style.minWidth = '794px';
  sandbox.style.maxWidth = '794px';
  sandbox.style.backgroundColor = '#ffffff';
  sandbox.style.zIndex = '-9999';
  sandbox.style.opacity = '1';
  sandbox.style.pointerEvents = 'none';
  sandbox.style.boxSizing = 'border-box';
  document.body.appendChild(sandbox);

  try {
    for (let i = 0; i < total; i++) {
      const el = pageElements[i] as HTMLElement;
      
      // Report progress to UI
      onProgress?.(i + 1, total);

      // Clone element into isolated 794px sandbox to ensure full-width A4 layout
      const cloned = el.cloneNode(true) as HTMLElement;
      cloned.classList.remove('hidden');
      cloned.style.display = 'block';
      cloned.style.visibility = 'visible';
      cloned.style.width = '794px';
      cloned.style.minWidth = '794px';
      cloned.style.maxWidth = '794px';
      cloned.style.minHeight = '1123px';
      cloned.style.height = '1123px';
      cloned.style.margin = '0';
      cloned.style.boxShadow = 'none';
      cloned.style.boxSizing = 'border-box';

      sandbox.innerHTML = '';
      sandbox.appendChild(cloned);

      // Brief tick for browser reflow
      await new Promise(r => setTimeout(r, 30));

      // Render image with crisp DPI using native browser rendering engine
      const imgData = await toJpeg(cloned, {
        quality: 0.95,
        width: 794,
        height: 1123,
        canvasWidth: 794 * 2,
        canvasHeight: 1123 * 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        fontEmbedCSS: '',
        skipFonts: true,
      });

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }
  } finally {
    if (sandbox.parentNode) {
      sandbox.parentNode.removeChild(sandbox);
    }
  }

  // Output single compiled PDF
  const blob = pdf.output('blob');
  pdf.save(filename);
  const blobUrl = URL.createObjectURL(blob);

  return {
    blob,
    blobUrl,
    filename,
    pageCount: total
  };
}
