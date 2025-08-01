"use client";

export default function PDFFormPage() {
  // Function to download the PDF
  const downloadPDF = async () => {
    const response = await fetch("/api/generate-pdf");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "candidate.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Candidate PDF Form</h1>
      <p>Click the button below to generate and download the candidate PDF.</p>

      <button
        onClick={downloadPDF}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📄 Download Candidate PDF
      </button>
    </main>
  );
}