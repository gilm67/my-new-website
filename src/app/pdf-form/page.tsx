"use client";

import { useState } from "react";

export default function PdfFormPage() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [aum, setAum] = useState("");
  const [message, setMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // ✅ For preview

  const handleDownload = async () => {
    try {
      setMessage("Generating PDF...");

      const url = `/api/generate-pdf?name=${encodeURIComponent(
        name
      )}&position=${encodeURIComponent(position)}&aum=${encodeURIComponent(aum)}`;

      const response = await fetch(url);
      const blob = await response.blob();

      // ✅ Create a downloadable link
      const fileUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "candidate.pdf";
      link.click();

      // ✅ Show PDF preview
      setPdfUrl(fileUrl);

      // ✅ Auto-hide preview after 1 minute
      setTimeout(() => setPdfUrl(null), 60000);

      // ✅ Reset form fields
      setName("");
      setPosition("");
      setAum("");

      setMessage("✅ Candidate PDF generated and downloaded!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error generating PDF. Please try again.");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Candidate PDF Generator</h1>

      <div style={{ marginTop: "20px" }}>
        <label>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ margin: "5px" }}
          />
        </label>
      </div>

      <div>
        <label>
          Position:{" "}
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={{ margin: "5px" }}
          />
        </label>
      </div>

      <div>
        <label>
          AUM (USD):{" "}
          <input
            type="text"
            value={aum}
            onChange={(e) => setAum(e.target.value)}
            style={{ margin: "5px" }}
          />
        </label>
      </div>

      <button
        onClick={handleDownload}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#003366",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Download Candidate PDF
      </button>

      {message && (
        <p
          style={{
            marginTop: "20px",
            color: message.startsWith("✅") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}

      {/* ✅ PDF Preview (auto-hides after 1 minute) */}
      {pdfUrl && (
        <div style={{ marginTop: "30px" }}>
          <h3>Preview PDF (disappears in 1 min):</h3>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: "1px solid #ccc" }}
          />
        </div>
      )}
    </div>
  );
}