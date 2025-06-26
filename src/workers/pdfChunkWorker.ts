import { jsPDF } from "jspdf";

export type MsgIn = {
  images: string[];
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  workerIndex: number;
};

self.onmessage = (e: MessageEvent<MsgIn>) => {
  const { images, width, height, orientation, workerIndex } = e.data;

  const doc = new jsPDF({
    orientation,
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"],
  });

  (self as any).postMessage({ progress: 0, workerIndex });

  

  images.forEach((img, i) => {
    if (i) doc.addPage();
    doc.addImage(img, "JPEG", 0, 0, width, height, undefined, "FAST");
    const currentProgress = Math.round(((i + 1) / images.length) * 100);
    (self as any).postMessage({ progress: currentProgress, workerIndex });
    
  });

  const pdfBytes = doc.output("arraybuffer");
  (self as any).postMessage({ pdfBytes, workerIndex }, [pdfBytes]);
};
