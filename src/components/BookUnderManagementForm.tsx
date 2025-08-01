"use client";

import React, { useState, useEffect } from "react";

const segmentationLevels = [
  "0 to 300,000",
  "300,000 to 500,000",
  "500,000 to 1,000,000",
  "1 to 2,000,000",
  "2 to 5,000,000",
  "+5,000,000",
];

const geographicalAreas = [
  "Mexico", "Switzerland", "UK", "UAE", "Singapore", "USA", "Other",
];

const investmentTypes = [
  "Cash, Bonds", "Equities", "Funds", "Structured Products", "Hedge Funds", "Others",
];

const portfolioManagement = ["Discretionary", "Advisory", "Custody"];

const clientTypes = ["Private", "Institutional", "Family Office"];

const currencies = ["CHF", "EUR", "USD", "GBP", "Others"];

const investmentProfiles = [
  "Security",
  "Security & growth",
  "Balanced",
  "Balanced & growth",
  "Growth",
];

export default function BookUnderManagementForm() {
  // State for client counts and AUMs per segmentation
  const [segmentationData, setSegmentationData] = useState(
    segmentationLevels.map(() => ({ clients: 0, aum: 0 }))
  );

  // State for geographical area (clients + aum)
  const [geoData, setGeoData] = useState(
    geographicalAreas.map(() => ({ clients: 0, aum: 0 }))
  );

  // State for investment types (%)
  const [investmentTypeData, setInvestmentTypeData] = useState(
    investmentTypes.map(() => 0)
  );

  // Portfolio Management %
  const [portfolioData, setPortfolioData] = useState(
    portfolioManagement.map(() => 0)
  );

  // Client Types (numbers)
  const [clientTypeData, setClientTypeData] = useState(
    clientTypes.map(() => 0)
  );

  // Currencies (%)
  const [currencyData, setCurrencyData] = useState(
    currencies.map(() => 0)
  );

  // Investment Profiles (%)
  const [investmentProfileData, setInvestmentProfileData] = useState(
    investmentProfiles.map(() => 0)
  );

  // ROA (single number)
  const [roa, setRoa] = useState(0);

  // Level of Account
  const [lowestAccount, setLowestAccount] = useState(0);
  const [highestAccount, setHighestAccount] = useState(0);
  const [averageAccount, setAverageAccount] = useState(0);

  // Total Book (clients and AUM)
  const totalClients = segmentationData.reduce((acc, val) => acc + val.clients, 0);
  const totalAUM = segmentationData.reduce((acc, val) => acc + val.aum, 0);

  // Update handlers for inputs (example for segmentation clients)
  const updateSegmentationClients = (index: number, value: number) => {
    const newData = [...segmentationData];
    newData[index].clients = value;
    setSegmentationData(newData);
  };

  const updateSegmentationAum = (index: number, value: number) => {
    const newData = [...segmentationData];
    newData[index].aum = value;
    setSegmentationData(newData);
  };

  // Add similar handlers for all inputs...

  return (
    <section className="bg-white text-black p-6 rounded shadow max-w-7xl mx-auto my-8 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Current Book Under Management</h2>

      {/* Segmentation Level Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-gray-300 text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Segmentation Level</th>
              <th className="border p-2">Number of Clients</th>
              <th className="border p-2">%</th>
              <th className="border p-2">AUMs (M CHF)</th>
              <th className="border p-2">%</th>
            </tr>
          </thead>
          <tbody>
            {segmentationLevels.map((level, idx) => {
              const clients = segmentationData[idx].clients;
              const aum = segmentationData[idx].aum;
              const clientsPercent = totalClients ? ((clients / totalClients) * 100).toFixed(1) : 0;
              const aumPercent = totalAUM ? ((aum / totalAUM) * 100).toFixed(1) : 0;
              return (
                <tr key={level} className="border-b">
                  <td className="border p-2">{level}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min={0}
                      value={clients}
                      onChange={(e) => updateSegmentationClients(idx, Number(e.target.value))}
                      className="w-20 border rounded px-1"
                    />
                  </td>
                  <td className="border p-2">{clientsPercent}%</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={aum}
                      onChange={(e) => updateSegmentationAum(idx, Number(e.target.value))}
                      className="w-24 border rounded px-1"
                    />
                  </td>
                  <td className="border p-2">{aumPercent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* TODO: Add tables/forms for the other categories here in similar style */}

      {/* ROA & Level of Account */}
      <div className="grid grid-cols-3 gap-6 mt-6 max-w-xl mx-auto">
        <label className="flex flex-col">
          Return on Assets (ROA) %
          <input
            type="number"
            step={0.01}
            min={0}
            max={100}
            value={roa}
            onChange={(e) => setRoa(Number(e.target.value))}
            className="border rounded px-2 py-1 mt-1"
          />
        </label>

        <label className="flex flex-col">
          Lowest Account (M CHF)
          <input
            type="number"
            step={0.01}
            min={0}
            value={lowestAccount}
            onChange={(e) => setLowestAccount(Number(e.target.value))}
            className="border rounded px-2 py-1 mt-1"
          />
        </label>

        <label className="flex flex-col">
          Highest Account (M CHF)
          <input
            type="number"
            step={0.01}
            min={0}
            value={highestAccount}
            onChange={(e) => setHighestAccount(Number(e.target.value))}
            className="border rounded px-2 py-1 mt-1"
          />
        </label>

        <label className="flex flex-col">
          Average Account (M CHF)
          <input
            type="number"
            step={0.01}
            min={0}
            value={averageAccount}
            onChange={(e) => setAverageAccount(Number(e.target.value))}
            className="border rounded px-2 py-1 mt-1"
          />
        </label>
      </div>
    </section>
  );
}