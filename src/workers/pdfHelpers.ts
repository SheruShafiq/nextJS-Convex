import { PDFDocument } from "pdf-lib";

export function chunk<T>(arr: T[], nChunks: number): T[][] {
  const size = Math.ceil(arr.length / Math.min(nChunks, arr.length));
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function distributeWorkload<T>(items: T[], workerCount: number): T[][] {
  if (items.length <= workerCount) {
    return items.map((item) => [item]);
  }

  const workBuckets: T[][] = Array.from({ length: workerCount }, () => []);

  items.forEach((item, idx) => {
    const bucketIndex = idx % workerCount;
    workBuckets[bucketIndex].push(item);
  });

  return workBuckets.filter((bucket) => bucket.length > 0);
}

export async function mergePdfBuffers(buffers: ArrayBuffer[]): Promise<Blob> {
  const merged = await PDFDocument.create();

  for (const buf of buffers) {
    const src = await PDFDocument.load(buf);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  const bytes = await merged.save(); 
  return new Blob([bytes.buffer as ArrayBuffer], {
    type: "application/pdf",
  });
}

