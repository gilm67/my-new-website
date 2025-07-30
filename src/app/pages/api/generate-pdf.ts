import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name = "N/A", position = "N/A", aum = "N/A" } = req.query;

    // 1️⃣ Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 2️⃣ Header Bar
    page.drawRectangle({
      x: 0,
      y: 740,
      width: 600,
      height: 60,
      color: rgb(0.1, 0.2, 0.4),
    });
    page.drawText("Executive Partners – Candidate Profile", {
      x: 50,
      y: 760,
      size: 18,
      font,
      color: rgb(1, 1, 1),
    });

    // 3️⃣ Logo (optional)
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      const logoImage = await pdfDoc.embedPng(fs.readFileSync(logoPath));
      page.drawImage(logoImage, { x: 450, y: 730, width: 100, height: 50 });
    }

    // 4️⃣ Candidate Info
    page.drawRectangle({
      x: 40,
      y: 500,
      width: 520,
      height: 180,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    page.drawText(`Name: ${name}`, { x: 60, y: 640, size: 14, font });
    page.drawText(`Position: ${position}`, { x: 60, y: 620, size: 14, font });
    page.drawText(`AUM: USD ${aum}`, { x: 60, y: 600, size: 14, font });

    // 5️⃣ Key Strengths
    page.drawText("Key Strengths:", { x: 60, y: 570, size: 14, font });
    const strengths = [
      "• UHNW & Family Office coverage",
      "• Expertise in private markets & structured products",
      "• Track record in business development and client acquisition",
    ];
    strengths.forEach((s, i) => {
      page.drawText(s, { x: 70, y: 550 - i * 20, size: 12, font });
    });

    // 6️⃣ Generate PDF and force download
    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="candidate.pdf"');
    res.end(Buffer.from(pdfBytes)); // ✅ Force download

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating PDF" });
  }
}