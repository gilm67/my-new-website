// src/app/api/generate-token/route.ts
import { NextResponse } from "next/server";
import { generateToken } from "../../../lib/serverTokenStore";

export async function GET() {
  const token = generateToken("Client Link", 24);
  return NextResponse.json({ token });
}