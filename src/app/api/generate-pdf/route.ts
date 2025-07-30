import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "N/A";
    const position = searchParams.get("position") || "N/A";
    const aum = searchParams.get("aum") || "N/A";
    const market = searchParams.get("market") || "N/A";
    const keyStrengths =
      searchParams.get("keyStrengths")?.split("|") || ["N/A"];

    // Create new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add logo (if exists)
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      const logoImageBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      page.drawImage(logoImage, {
        x: 50,
        y: 750,
        width: 120,
        height: 50,
      });
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
      `Name: ${name}`,
      `Position: ${position}`,
      `AUM: ${aum}`,
      `Market: ${market}`,
      "Key Strengths:",
      ...keyStrengths.map((ks) => `- ${ks}`),
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

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${name}_Profile.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF Generation Error:", err);
    return NextResponse.json(
      { error: "PDF generation failed", details: err.message },
      { status: 500 }
    );
  }
}