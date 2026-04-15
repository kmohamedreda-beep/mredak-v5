import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !subject || !message?.trim()) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Branchement futur : Resend, SendGrid, Nodemailer, etc.
    console.info("[contact]", { name, email, subject, messageLength: message.length });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
