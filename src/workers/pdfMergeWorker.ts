import { PDFDocument } from "pdf-lib";

self.onmessage = async (e: MessageEvent<ArrayBuffer[]>) => {
  const buffers = e.data;
  const merged = await PDFDocument.create();
  for (const buf of buffers) {
    const src = await PDFDocument.load(buf);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const bytes = await merged.save(); 
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  (self as any).postMessage({ blob }, [bytes.buffer]);
};
