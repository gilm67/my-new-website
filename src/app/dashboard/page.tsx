"use client";

import { useEffect, useState } from "react";

interface TokenEntry {
  token: string;
  expiresAt?: number;
}

export default function DashboardPage() {
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all tokens
  const fetchTokens = async () => {
    try {
      const res = await fetch("/api/tokens");
      const data = await res.json();
      setTokens(data);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  // Generate new client token
  const generateToken = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-token");
      const data = await res.json();
      const newLink = `${window.location.origin}/client-view/${data.token}`;
      alert(`✅ New link generated: ${newLink}`);
      await fetchTokens();
    } catch (error) {
      alert("❌ Failed to generate token.");
    } finally {
      setLoading(false);
    }
  };

  // Delete token
  const deleteToken = async (token: string) => {
    if (!confirm("Are you sure you want to delete this token?")) return;
    try {
      await fetch(`/api/tokens/${token}`, { method: "DELETE" });
      await fetchTokens();
    } catch (error) {
      console.error("Error deleting token:", error);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Executive Partners Dashboard</h1>

      <button onClick={generateToken} disabled={loading}>
        {loading ? "Generating..." : "Generate Client Link"}
      </button>

      <table
        border={1}
        cellPadding={8}
        style={{ marginTop: 20, borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Token</th>
            <th>Expires At</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tokens.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No tokens found.
              </td>
            </tr>
          ) : (
            tokens.map((t) => (
              <tr key={t.token}>
                <td
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                  onClick={() => {
                    const link = `${window.location.origin}/client-view/${t.token}`;
                    navigator.clipboard.writeText(link);
                    alert(`Copied link: ${link}`);
                  }}
                >
                  {t.token}
                </td>
                <td>{t.expiresAt ? new Date(t.expiresAt).toLocaleString() : "Never"}</td>
                <td>
                  <button onClick={() => deleteToken(t.token)}>❌ Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}