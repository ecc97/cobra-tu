import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const OKLCH_PATTERN = /oklch|oklab|lab\(|lch\(|color\(/i;
const PDF_MARGIN_MM = 10;

function resolveColorValue(property: string, value: string): string {
  if (!OKLCH_PATTERN.test(value)) {
    return value;
  }

  const tempElement = document.createElement('div');
  tempElement.style.setProperty(property, value);
  document.body.appendChild(tempElement);

  const resolved = window.getComputedStyle(tempElement).getPropertyValue(property);
  document.body.removeChild(tempElement);

  if (resolved && !OKLCH_PATTERN.test(resolved)) {
    return resolved;
  }

  // Evita bloques oscuros en fondos cuando html2canvas no interpreta funciones modernas de color.
  if (property.includes('background')) {
    return 'transparent';
  }

  if (property.includes('border')) {
    return '#e5e7eb';
  }

  if (property.includes('color')) {
    return '#111827';
  }

  return value;
}

function isUnsupportedColorError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const message = 'message' in error ? String((error as { message?: string }).message) : '';
  return (
    message.includes('unsupported color function') ||
    message.includes('lab') ||
    message.includes('oklab')
  );
}

async function renderElementCanvas(element: HTMLElement) {
  try {
    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      removeContainer: true,
      onclone: (doc) => {
        // Reduce fuentes de parsing complejo para html2canvas (Tailwind v4 + color functions).
        doc.documentElement.style.setProperty('color-scheme', 'light');
      },
    });
  } catch (error) {
    if (!isUnsupportedColorError(error)) {
      throw error;
    }

    // Fallback: usa renderizado vía foreignObject, más tolerante con funciones de color modernas.
    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      removeContainer: true,
      foreignObjectRendering: true,
      onclone: (doc) => {
        doc.documentElement.style.setProperty('color-scheme', 'light');
      },
    });
  }
}

function createCaptureClone(source: HTMLElement): {
  captureNode: HTMLElement;
  cleanup: () => void;
} {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.zIndex = '-1';
  wrapper.style.background = '#ffffff';
  wrapper.style.padding = '0';
  wrapper.style.margin = '0';

  const clone = source.cloneNode(true) as HTMLElement;
  const sourceElements = [source, ...Array.from(source.querySelectorAll<HTMLElement>('*'))];
  const cloneElements = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))];

  sourceElements.forEach((sourceElement, index) => {
    const cloneElement = cloneElements[index];
    if (!cloneElement) {
      return;
    }

    const computed = window.getComputedStyle(sourceElement);

    for (let i = 0; i < computed.length; i += 1) {
      const property = computed[i];
      let value = computed.getPropertyValue(property);
      const priority = computed.getPropertyPriority(property);

      // Normaliza funciones de color modernas para evitar fallos de parseo en html2canvas.
      if (OKLCH_PATTERN.test(value)) {
        value = resolveColorValue(property, value);
      }

      cloneElement.style.setProperty(property, value, priority);
    }

    // Estabiliza la captura y evita layouts animados o transformados.
    cloneElement.style.animation = 'none';
    cloneElement.style.transition = 'none';
    cloneElement.style.transform = 'none';
  });

  const rect = source.getBoundingClientRect();
  const fallbackWidth = 820;
  const width = rect.width > 0 ? rect.width : fallbackWidth;

  clone.style.display = 'block';
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  clone.style.transform = 'none';
  clone.style.position = 'static';
  clone.style.width = `${Math.round(width)}px`;
  clone.style.maxWidth = `${Math.round(width)}px`;
  clone.style.minHeight = '0';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#111827';

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return {
    captureNode: clone,
    cleanup: () => {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    },
  };
}

export async function generatePDFFromElement(
  elementId: string,
  fileName: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Captura una copia visible para evitar canvas en blanco cuando el preview está oculto por CSS.
    const { captureNode, cleanup } = createCaptureClone(element);
    let canvas;

    try {
      canvas = await renderElementCanvas(captureNode);
    } finally {
      cleanup();
    }

    // Crear PDF multipágina para evitar recortes cuando el contenido supera un A4.
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const contentWidthMm = pdfWidth - PDF_MARGIN_MM * 2;
    const contentHeightMm = pdfHeight - PDF_MARGIN_MM * 2;

    const pxPerMm = canvas.width / contentWidthMm;
    const pageSliceHeightPx = Math.max(1, Math.floor(contentHeightMm * pxPerMm));

    let offsetY = 0;
    let pageIndex = 0;

    while (offsetY < canvas.height) {
      const sliceHeightPx = Math.min(pageSliceHeightPx, canvas.height - offsetY);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;

      const context = pageCanvas.getContext('2d');
      if (!context) {
        throw new Error('No fue posible crear el contexto 2D para paginar PDF');
      }

      context.drawImage(
        canvas,
        0,
        offsetY,
        canvas.width,
        sliceHeightPx,
        0,
        0,
        canvas.width,
        sliceHeightPx
      );

      if (pageIndex > 0) {
        pdf.addPage();
      }

      const imageHeightMm = sliceHeightPx / pxPerMm;
      const imageData = pageCanvas.toDataURL('image/png');
      pdf.addImage(imageData, 'PNG', PDF_MARGIN_MM, PDF_MARGIN_MM, contentWidthMm, imageHeightMm, undefined, 'FAST');

      offsetY += sliceHeightPx;
      pageIndex += 1;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
