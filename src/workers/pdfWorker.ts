import { jsPDF } from "jspdf";

type MsgIn = {
  images: string[];
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
};

self.onmessage = async (e: MessageEvent<MsgIn>) => {
  const { images, width, height, orientation } = e.data;

  // Create PDF with proper dimensions
  const doc = new jsPDF({
    orientation,
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"], // Add hotfix for better pixel scaling
  });

  // Process each image
  for (let i = 0; i < images.length; i++) {
    if (i > 0) doc.addPage();

    // Add each image with precise positioning
    doc.addImage(
      images[i],
      "JPEG",
      0, // x position
      0, // y position
      width,
      height,
      undefined, // alias
      "FAST" // compression - use FAST for better quality
    );

    const prog = Math.round(((i + 1) / images.length) * 100);
    (self as any).postMessage({ progress: prog });
  }

  const blob = doc.output("blob");
  (self as any).postMessage({ pdfBlob: blob });
};
