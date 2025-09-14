import { NextResponse } from "next/server";

// Minimal example: forward to your CRM/email/webhook, or write to a DB.
// No admin token comes from the client. If you must call a protected API,
// read the token from process.env on the server (never expose it to the browser).

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // TODO: server-side action, e.g.:
    // await fetch(process.env.LEADS_WEBHOOK_URL!, {
    //   method: "POST",
    //   headers: {"Content-Type": "application/json", "Authorization": `Bearer ${process.env.LEADS_TOKEN}`},
    //   body: JSON.stringify(body),
    // });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "error" }, { status: 500 });
  }
}