"use client";
import { useState } from "react";

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState([
    { name: "Gil Malalel", position: "SRM", aum: "500M" },
    { name: "John Doe", position: "Private Banker", aum: "200M" },
  ]);

  const downloadPDF = (candidate: any) => {
    const params = new URLSearchParams({
      name: candidate.name,
      position: candidate.position,
      aum: candidate.aum,
    });
    window.open(`/api/generate-pdf?${params.toString()}`, "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Candidate Dashboard</h1>
      <table border={1} cellPadding={10} style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>AUM</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>{c.position}</td>
              <td>{c.aum}</td>
              <td>
                <button onClick={() => downloadPDF(c)}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}