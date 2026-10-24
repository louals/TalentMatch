import mammoth from "mammoth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/** Takes a DOCX File, returns a Blob of PDF */
export async function convertDocxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  // 1. Convert DOCX → HTML
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  // 2. Place HTML in hidden iframe so jsPDF can “see” layout
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.left = "-9999px";
  document.body.appendChild(iframe);
  iframe.contentDocument!.write(html);
  iframe.contentDocument!.close();

  // 3. Render iframe to canvas
  const canvas = await html2canvas(iframe.contentDocument!.body, {
    backgroundColor: "#ffffff",
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");

  // 4. Put canvas image into jsPDF
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "l" : "p",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

  // cleanup
  document.body.removeChild(iframe);

  return pdf.output("blob");
}
