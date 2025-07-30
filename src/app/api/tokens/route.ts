// src/app/api/tokens/route.ts
import { NextResponse } from "next/server";
import { getAllTokens } from "@/lib/serverTokenStore";

export async function GET() {
  // Fetch all tokens from the serverTokenStore
  const tokens = getAllTokens();
  
  // Return them as JSON
  return NextResponse.json(tokens);
}