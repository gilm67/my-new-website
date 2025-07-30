"use client";

export default function BusinessPlanPage() {
  const downloadPDF = () => {
    // ✅ This forces browser to download instead of showing inline
    const url = `/api/generate-pdf?name=Gil%20Malalel&position=SRM&aum=500`;
    const link = document.createElement("a");
    link.href = url;
    link.download = "candidate.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Candidate PDF Generator</h1>
      <button
        onClick={downloadPDF}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0A2A66",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Download Candidate PDF
      </button>
    </div>
  );
}