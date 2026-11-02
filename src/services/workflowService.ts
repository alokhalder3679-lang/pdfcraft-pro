import { rotatePDF, addWatermark, addPageNumbers, compressPDF, convertToPDFA } from './pdfService';

export interface WorkflowStep {
  id: string;
  type: 'rotate' | 'watermark' | 'page-numbers' | 'compress' | 'pdfa';
  name: string;
  enabled: boolean;
  params: Record<string, any>;
}

export async function executeWorkflow(
  initialPdfBytes: ArrayBuffer,
  steps: WorkflowStep[],
  onStepProgress?: (stepIndex: number, stepName: string) => void
): Promise<{ finalPdf: Uint8Array; log: string[] }> {
  let currentBytes = initialPdfBytes;
  const log: string[] = [`Workflow started with document of size ${(initialPdfBytes.byteLength / 1024).toFixed(1)} KB`];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step.enabled) {
      log.push(`Skipped step ${i + 1}: ${step.name}`);
      continue;
    }

    onStepProgress?.(i, step.name);
    log.push(`Executing step ${i + 1}: ${step.name}...`);

    switch (step.type) {
      case 'rotate': {
        const angle = (step.params.angle || 90) as 90 | 180 | 270;
        const res = await rotatePDF(currentBytes, angle);
        currentBytes = (res.buffer as ArrayBuffer);
        log.push(`✓ Rotated pages by ${angle}°`);
        break;
      }
      case 'watermark': {
        const text = step.params.text || 'CONFIDENTIAL';
        const opacity = step.params.opacity || 0.3;
        const res = await addWatermark(currentBytes, { text, opacity });
        currentBytes = (res.buffer as ArrayBuffer);
        log.push(`✓ Stamped watermark "${text}"`);
        break;
      }
      case 'page-numbers': {
        const res = await addPageNumbers(currentBytes, {
          format: step.params.format || 'Page {n} of {total}',
          position: 'bottom-center',
        });
        currentBytes = (res.buffer as ArrayBuffer);
        log.push(`✓ Injected page numbering`);
        break;
      }
      case 'compress': {
        const res = await compressPDF(currentBytes, 'recommended');
        currentBytes = (res.data.buffer as ArrayBuffer);
        log.push(`✓ Compressed document: ${res.reductionPercent}% reduction`);
        break;
      }
      case 'pdfa': {
        const res = await convertToPDFA(currentBytes);
        currentBytes = (res.buffer as ArrayBuffer);
        log.push(`✓ Tagged with ISO PDF/A compliance metadata`);
        break;
      }
    }
  }

  log.push(`Workflow finished successfully! Final size: ${(currentBytes.byteLength / 1024).toFixed(1)} KB`);
  return {
    finalPdf: new Uint8Array(currentBytes),
    log,
  };
}
