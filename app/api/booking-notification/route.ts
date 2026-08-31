type BookingNotification = {
  customerName?: string;
  contact?: string;
  preferredDate?: string | null;
  serviceName?: string;
  guestCount?: number;
  notes?: string;
  source?: string;
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipients = (
    process.env.BOOKING_NOTIFICATION_EMAIL ||
    "devalihassan01@gmail.com,inhere.studiohoian@gmail.com"
  )
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const sender =
    process.env.BOOKING_FROM_EMAIL ||
    "INHERE Bookings <bookings@inherestudiohoian.com>";

  if (!resendApiKey) {
    return Response.json(
      { sent: false, error: "Email notifications are not configured." },
      { status: 503 },
    );
  }

  let booking: BookingNotification;
  try {
    booking = (await request.json()) as BookingNotification;
  } catch {
    return Response.json({ sent: false, error: "Invalid request." }, { status: 400 });
  }

  const customerName = booking.customerName?.trim();
  const contact = booking.contact?.trim();
  const serviceName = booking.serviceName?.trim();
  if (!customerName || !contact || !serviceName) {
    return Response.json(
      { sent: false, error: "Missing booking details." },
      { status: 400 },
    );
  }

  const subject = `New INHERE booking — ${serviceName}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: recipients,
      subject,
      reply_to: contact.includes("@") ? contact : undefined,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#241f1b">
          <div style="background:#241f1b;color:#fff;padding:24px 28px">
            <p style="margin:0;font-size:12px;letter-spacing:2px">INHERE · HỘI AN</p>
            <h1 style="margin:10px 0 0;font-size:26px">New booking request</h1>
          </div>
          <div style="border:1px solid #e7dfd8;border-top:0;padding:26px 28px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:9px 0;color:#756b63">Customer</td><td style="padding:9px 0;font-weight:700">${escapeHtml(customerName)}</td></tr>
              <tr><td style="padding:9px 0;color:#756b63">Contact</td><td style="padding:9px 0;font-weight:700">${escapeHtml(contact)}</td></tr>
              <tr><td style="padding:9px 0;color:#756b63">Preferred date</td><td style="padding:9px 0">${escapeHtml(booking.preferredDate || "Not provided")}</td></tr>
              <tr><td style="padding:9px 0;color:#756b63">Service/package</td><td style="padding:9px 0">${escapeHtml(serviceName)}</td></tr>
              <tr><td style="padding:9px 0;color:#756b63">Guests</td><td style="padding:9px 0">${escapeHtml(booking.guestCount || 1)}</td></tr>
              <tr><td style="padding:9px 0;color:#756b63">Source</td><td style="padding:9px 0">${escapeHtml(booking.source || "Website")}</td></tr>
            </table>
            <div style="margin-top:18px;padding:18px;background:#f7f3ef">
              <strong>Notes</strong>
              <p style="margin:8px 0 0;line-height:1.6">${escapeHtml(booking.notes || "No additional notes.")}</p>
            </div>
            <p style="margin:22px 0 0;color:#756b63;font-size:13px">This booking is also saved in the INHERE admin panel.</p>
          </div>
        </div>`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Booking email failed", response.status, error);
    return Response.json(
      { sent: false, error: "Email provider rejected the message." },
      { status: 502 },
    );
  }

  return Response.json({ sent: true });
}
