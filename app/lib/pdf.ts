import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const OKLCH_PATTERN = /oklch|oklab|lab\(|lch\(|color\(/i;

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

      // ✅ Convierte colores no soportados a hex equivalente aproximado
      if (OKLCH_PATTERN.test(value)) {
        // Crear un elemento temporal para que el browser resuelva el color
        const tmp = document.createElement('div');
        tmp.style.setProperty(property, value);
        document.body.appendChild(tmp);
        const resolved = window.getComputedStyle(tmp).getPropertyValue(property);
        document.body.removeChild(tmp);

        // Si el browser pudo resolverlo a rgb(), usarlo; si no, fallback seguro
        value = resolved && !OKLCH_PATTERN.test(resolved) ? resolved : '#111827';
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

    // Crear PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 20; // Márgenes
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
