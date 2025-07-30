"use client";
import { useEffect, useState } from "react";

export default function ClientViewPage({ params }: any) {
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");

  useEffect(() => {
    async function checkToken() {
      const res = await fetch(`/api/validate-token?token=${params.token}`);
      const data = await res.json();
      setStatus(data.valid ? "valid" : "invalid");
    }
    checkToken();
  }, [params.token]);

  if (status === "loading") return <p>Validating your link...</p>;
  if (status === "invalid") return <p>❌ This link is invalid or has expired.</p>;
  return <p>✅ Welcome! This link is valid.</p>;
}