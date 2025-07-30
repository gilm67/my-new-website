import { NextResponse } from "next/server";
import { deleteToken } from "@/lib/serverTokenStore";

export async function DELETE(
  request: Request,
  { params }: { params: { token: string } }
) {
  const success = deleteToken(params.token);

  if (success) {
    return NextResponse.json({ message: "Token deleted" });
  } else {
    return NextResponse.json({ message: "Token not found" }, { status: 404 });
  }
}