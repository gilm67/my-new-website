import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { candidates } = await req.json();
    if (!candidates || !Array.isArray(candidates)) {
      return NextResponse.json({ error: "Invalid candidates data" }, { status: 400 });
    }

    const zip = new JSZip();

    // Load logo if it exists
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoExists = fs.existsSync(logoPath);
    const logoBytes = logoExists ? fs.readFileSync(logoPath) : null;

    for (const candidate of candidates) {
      const { name, position, aum, market, keyStrengths } = candidate;

      // Create PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Embed logo at top if exists
      if (logoBytes) {
        const logoImage = await pdfDoc.embedPng(logoBytes);
        page.drawImage(logoImage, { x: 50, y: 760, width: 120, height: 50 });
      }

      // Title
      page.drawText("Executive Partners – Candidate Profile", {
        x: 50,
        y: 700,
        size: 18,
        font,
        color: rgb(0, 0, 0.5),
      });

      // Candidate info
      const content = [
        `Name: ${name || "N/A"}`,
        `Position: ${position || "N/A"}`,
        `AUM: ${aum || "N/A"}`,
        `Market: ${market || "N/A"}`,
        "Key Strengths:",
        ...(keyStrengths && keyStrengths.length
          ? keyStrengths.map((ks: string) => `- ${ks}`)
          : ["- N/A"]),
      ].join("\n");

      page.drawText(content, {
        x: 50,
        y: 660,
        size: 12,
        font,
        color: rgb(0, 0, 0),
        lineHeight: 18,
      });

      const pdfBytes = await pdfDoc.save();

      // Add to ZIP
      zip.file(`${name || "Candidate"}_Profile.pdf`, pdfBytes);
    }

    // Generate ZIP
    const zipBytes = await zip.generateAsync({ type: "uint8array" });

    return new NextResponse(zipBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="Candidate_Profiles.zip"',
      },
    });
  } catch (err: any) {
    console.error("ZIP Generation Error:", err);
    return NextResponse.json(
      { error: "ZIP generation failed", details: err.message },
      { status: 500 }
    );
  }
}