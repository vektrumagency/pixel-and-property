import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Resend } from "resend";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, phone, message, source } = body;
  if (!name || !email || !message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  const SOURCES = ["contact", "investments", "services"];
  const leadSource = SOURCES.includes(source) ? source : "contact";

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { error } = await supabase.from("leads").insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    message: message.trim(),
    source: leadSource,
  });

  if (error) {
    console.error("leads insert failed:", error.message, error.code, error.details, error.hint);
    return Response.json({ error: "Failed to submit" }, { status: 500 });
  }

  await notifyPixelTeam({
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    message: message.trim(),
    source: leadSource,
  });

  return Response.json({ ok: true });
}

async function notifyPixelTeam(lead: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string;
}) {
  const recipients = process.env.LEADS_NOTIFICATION_EMAILS?.split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (!process.env.RESEND_API_KEY || !process.env.LEADS_FROM_EMAIL || !recipients?.length) {
    console.error("Lead notification email skipped: missing Resend configuration");
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.LEADS_FROM_EMAIL,
      to: recipients,
      subject: `New ${lead.source} lead: ${lead.name}`,
      html: `
        <p><strong>Source:</strong> ${lead.source}</p>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone ?? "-"}</p>
        <p><strong>Message:</strong></p>
        <p>${lead.message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Lead notification email failed:", error);
    }
  } catch (err) {
    console.error("Lead notification email failed:", err);
  }
}
