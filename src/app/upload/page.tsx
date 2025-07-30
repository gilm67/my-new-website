"use client";

import { useState } from "react";

export default function UploadPage() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [aum, setAum] = useState("");

  const downloadPDF = () => {
    if (!name || !position || !aum) {
      alert("Please fill in all fields before generating PDF.");
      return;
    }

    // Trigger PDF download with dynamic candidate data
    window.open(
      `/api/generate-pdf?name=${encodeURIComponent(name)}&position=${encodeURIComponent(position)}&aum=${encodeURIComponent(aum)}`,
      "_blank"
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1>Candidate PDF Generator</h1>
      
      <input
        type="text"
        placeholder="Candidate Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "300px" }}
      />
      
      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "300px" }}
      />
      
      <input
        type="text"
        placeholder="AUM (USD)"
        value={aum}
        onChange={(e) => setAum(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "300px" }}
      />

      <button
        onClick={downloadPDF}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: "#0A3D62",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Download Candidate PDF
      </button>
    </div>
  );
}