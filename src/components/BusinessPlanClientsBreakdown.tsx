"use client";

import React, { useState } from "react";

interface ClientData {
  clientName: string;
  numClients: number;
  aum: number; // Million USD
  nnmProjection: number; // Million USD
}

export default function BusinessPlanClientsBreakdown() {
  const [clients, setClients] = useState<ClientData[]>([
    { clientName: "", numClients: 0, aum: 0, nnmProjection: 0 },
  ]);

  const handleChange = (
    index: number,
    field: keyof ClientData,
    value: string
  ) => {
    const updated = [...clients];

    if (field === "clientName") {
      // Keep text as string
      updated[index][field] = value as any;
    } else {
      // Convert numeric fields
      updated[index][field] = value === "" ? 0 : parseFloat(value) as any;
    }

    setClients(updated);
  };

  const addClient = () => {
    setClients([
      ...clients,
      { clientName: "", numClients: 0, aum: 0, nnmProjection: 0 },
    ]);
  };

  const removeClient = (index: number) => {
    const updated = clients.filter((_, i) => i !== index);
    setClients(updated);
  };

  // --- Totals ---
  const totalAUM = clients.reduce((sum, c) => sum + (c.aum || 0), 0);
  const totalNNM = clients.reduce((sum, c) => sum + (c.nnmProjection || 0), 0);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Business Plan Clients Breakdown
      </h2>

      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-3 py-2 text-left">Client Name</th>
            <th className="border px-3 py-2 text-center"># Clients</th>
            <th className="border px-3 py-2 text-center">AUM (Million USD)</th>
            <th className="border px-3 py-2 text-center">
              NNM Projection (Million USD)
            </th>
            <th className="border px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index}>
              <td className="border px-3 py-2">
                <input
                  type="text"
                  value={client.clientName}
                  onChange={(e) =>
                    handleChange(index, "clientName", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                  placeholder="Client Name"
                />
              </td>
              <td className="border px-3 py-2 text-center">
                <input
                  type="number"
                  value={client.numClients}
                  onChange={(e) =>
                    handleChange(index, "numClients", e.target.value)
                  }
                  className="w-20 border rounded px-2 py-1 text-right"
                />
              </td>
              <td className="border px-3 py-2 text-center">
                <input
                  type="number"
                  step="0.01"
                  value={client.aum}
                  onChange={(e) => handleChange(index, "aum", e.target.value)}
                  className="w-28 border rounded px-2 py-1 text-right"
                />
              </td>
              <td className="border px-3 py-2 text-center">
                <input
                  type="number"
                  step="0.01"
                  value={client.nnmProjection}
                  onChange={(e) =>
                    handleChange(index, "nnmProjection", e.target.value)
                  }
                  className="w-28 border rounded px-2 py-1 text-right"
                />
              </td>
              <td className="border px-3 py-2 text-center">
                <button
                  onClick={() => removeClient(index)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {/* --- Totals Row --- */}
          <tr className="bg-gray-50 font-bold text-right">
            <td className="border px-3 py-2 text-center">Total</td>
            <td className="border px-3 py-2"></td>
            <td className="border px-3 py-2">{totalAUM.toFixed(2)}</td>
            <td className="border px-3 py-2">{totalNNM.toFixed(2)}</td>
            <td className="border px-3 py-2"></td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={addClient}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Client
      </button>
    </div>
  );
}