"use client";

import React from "react";

export default function BusinessPlanPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        💼 Business Plan Simulator
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-2xl">
        Use our interactive tool to simulate your 3-year private banking business plan.
      </p>

      {/* Embed the Python Streamlit app via iframe */}
      <iframe
        src="http://localhost:8502"
        className="w-full h-[900px] border rounded-lg shadow-lg"
        title="Business Plan Simulator"
      />
    </div>
  );
}