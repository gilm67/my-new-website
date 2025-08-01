"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- Client type ---
interface ClientData {
  clientName: string;
  numClients: number;
  aum: number;
  nnmProjection: number;
}

export default function BusinessPlanBase() {
  // --- NNM inputs ---
  const [nnmY1, setNnmY1] = useState(0);
  const [nnmY2, setNnmY2] = useState(0);
  const [nnmY3, setNnmY3] = useState(0);

  // --- FTE inputs (1-12 months) ---
  const clamp = (v: number) => Math.min(12, Math.max(1, v));
  const [fteY1, setFteY1] = useState(12);
  const [fteY2, setFteY2] = useState(12);
  const [fteY3, setFteY3] = useState(12);

  // --- Clients Breakdown ---
  const [clients, setClients] = useState<ClientData[]>([
    { clientName: "", numClients: 0, aum: 0, nnmProjection: 0 },
  ]);

  const totalClients = useMemo(
    () => clients.reduce((sum, c) => sum + (c.numClients || 0), 0),
    [clients]
  );

  const totalNNM = useMemo(
    () => clients.reduce((sum, c) => sum + (c.nnmProjection || 0), 0),
    [clients]
  );

  useEffect(() => {
    setNnmY1(totalNNM);
  }, [totalNNM]);

  // --- Cost structure ---
  const [annualSalary, setAnnualSalary] = useState(0);
  const [socialCharges, setSocialCharges] = useState(0);
  const [training, setTraining] = useState(0);
  const [marketing, setMarketing] = useState(0);
  const [mobile, setMobile] = useState(0);
  const [travel, setTravel] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const totalCostsCHF =
    annualSalary +
    socialCharges +
    training +
    marketing +
    mobile +
    travel +
    otherExpenses;

  // --- ROA per year (% input) ---
  const [roaY1, setRoaY1] = useState(0.7 / 100); // 0.70%
  const [roaY2, setRoaY2] = useState(1.0 / 100);
  const [roaY3, setRoaY3] = useState(1.0 / 100);

  const usdToChf = 1; // assume 1:1 for now

  // --- Excel-style calculations ---
  const fteInNnmY1 = (nnmY1 / 12) * fteY1;
  const fteInNnmY2 = (nnmY2 / 12) * fteY2;
  const fteInNnmY3 = (nnmY3 / 12) * fteY3;

  const totalRevenueY1CHF = fteInNnmY1 * 1_000_000 * roaY1 * usdToChf;
  const totalRevenueY2CHF = fteInNnmY2 * 1_000_000 * roaY2 * usdToChf;
  const totalRevenueY3CHF = fteInNnmY3 * 1_000_000 * roaY3 * usdToChf;

  const cumRevenueY1 = totalRevenueY1CHF;
  const cumRevenueY2 = totalRevenueY1CHF + totalRevenueY2CHF;
  const cumRevenueY3 = totalRevenueY1CHF + totalRevenueY2CHF + totalRevenueY3CHF;

  const netMarginY1 = totalRevenueY1CHF - totalCostsCHF;
  const netMarginY2 = totalRevenueY2CHF - totalCostsCHF;
  const netMarginY3 = totalRevenueY3CHF - totalCostsCHF;

  const cumNetMarginY1 = netMarginY1;
  const cumNetMarginY2 = netMarginY1 + netMarginY2;
  const cumNetMarginY3 = netMarginY1 + netMarginY2 + netMarginY3;

  // --- Chart Data ---
  const chartData = [
    {
      year: "Year 1",
      NNM: nnmY1,
      Revenue: totalRevenueY1CHF / 1_000_000,
      NetMargin: netMarginY1 / 1_000_000,
    },
    {
      year: "Year 2",
      NNM: nnmY2,
      Revenue: totalRevenueY2CHF / 1_000_000,
      NetMargin: netMarginY2 / 1_000_000,
    },
    {
      year: "Year 3",
      NNM: nnmY3,
      Revenue: totalRevenueY3CHF / 1_000_000,
      NetMargin: netMarginY3 / 1_000_000,
    },
  ];

  // --- Handlers ---
  const handleAddClient = () => {
    setClients([...clients, { clientName: "", numClients: 0, aum: 0, nnmProjection: 0 }]);
  };

  const handleClientChange = (index: number, field: keyof ClientData, value: any) => {
    const newClients = [...clients];
    newClients[index][field] = field === "clientName" ? value : parseFloat(value) || 0;
    setClients(newClients);
  };

  const handleRemoveClient = (index: number) => {
    const newClients = [...clients];
    newClients.splice(index, 1);
    setClients(newClients);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-xl space-y-8">
      <h1 className="text-2xl font-bold">Business Plan Simulator</h1>

      {/* --- Client Breakdown Table --- */}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Client Name</th>
            <th className="border p-2"># Clients</th>
            <th className="border p-2">AUM (Million USD)</th>
            <th className="border p-2">NNM Projection (Million USD)</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, idx) => (
            <tr key={idx}>
              <td className="border p-2">
                <input
                  type="text"
                  value={c.clientName}
                  onChange={(e) => handleClientChange(idx, "clientName", e.target.value)}
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={c.numClients}
                  onChange={(e) => handleClientChange(idx, "numClients", e.target.value)}
                  className="w-full border px-2 py-1 text-right"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={c.aum}
                  onChange={(e) => handleClientChange(idx, "aum", e.target.value)}
                  className="w-full border px-2 py-1 text-right"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={c.nnmProjection}
                  onChange={(e) => handleClientChange(idx, "nnmProjection", e.target.value)}
                  className="w-full border px-2 py-1 text-right"
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleRemoveClient(idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-50">
            <td className="border p-2 text-right">Total</td>
            <td className="border p-2 text-right">{totalClients}</td>
            <td className="border p-2 text-right">
              {clients.reduce((s, c) => s + c.aum, 0).toFixed(2)}
            </td>
            <td className="border p-2 text-right">{totalNNM.toFixed(2)}</td>
            <td className="border p-2"></td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={handleAddClient}
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Add Client
      </button>

      {/* --- Summary --- */}
      <div className="bg-gray-100 p-4 rounded space-y-1">
        <p>Total Revenue Y1 (CHF): {totalRevenueY1CHF.toFixed(0)}</p>
        <p>Total Revenue Y2 (CHF): {totalRevenueY2CHF.toFixed(0)}</p>
        <p>Total Revenue Y3 (CHF): {totalRevenueY3CHF.toFixed(0)}</p>
        <p>Cumulated Revenue Y1 (CHF): {cumRevenueY1.toFixed(0)}</p>
        <p>Cumulated Revenue Y2 (CHF): {cumRevenueY2.toFixed(0)}</p>
        <p>Cumulated Revenue Y3 (CHF): {cumRevenueY3.toFixed(0)}</p>
        <p>Net Margin Y1 (CHF): {netMarginY1.toFixed(0)}</p>
        <p>Net Margin Y2 (CHF): {netMarginY2.toFixed(0)}</p>
        <p>Net Margin Y3 (CHF): {netMarginY3.toFixed(0)}</p>
        <p>Cumulated Net Margin Y3 (CHF): {cumNetMarginY3.toFixed(0)}</p>
      </div>

      {/* --- Chart --- */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="NNM" stroke="#8884d8" />
          <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" />
          <Line type="monotone" dataKey="NetMargin" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}