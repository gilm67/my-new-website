
"use client";
export default function HomePage() {
  // Step 1: Create a function to download the PDF
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
      <h1>Hello Gil – Brand New Website Works!</h1>
      <p>This is the start of your Executive Partners website.</p>
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
          cursor: "pointer"
        }}
      >
        📄 Download Candidate PDF
      </button>
    </main>
  );
}
