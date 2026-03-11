import nodemailer from "nodemailer";

interface ContactEmailData {
  name: string;
  email: string;
  plan?: string;
  message?: string;
}

const ADMIN_EMAIL = "vladko13111999@gmail.com";

function getTransporter() {
  // Use SMTP credentials from environment variables if available
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Gmail with app password
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  return null;
}

export async function sendContactNotification(data: ContactEmailData): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("[Email] No email transporter configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS or GMAIL_USER/GMAIL_APP_PASSWORD env vars.");
    return false;
  }

  const planLabels: Record<string, string> = {
    unknown: "Zatiaľ neviem",
    free: "Free - Zadarmo",
    basic: "Basic - 9€/mesiac",
    premium: "Premium - 15€/mesiac",
  };

  const planLabel = data.plan ? (planLabels[data.plan] || data.plan) : "Nezvolený";

  const htmlContent = `
<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .field value { display: block; font-size: 16px; color: #111827; font-weight: 500; }
    .message-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-top: 6px; }
    .message-box p { margin: 0; color: #374151; font-size: 15px; line-height: 1.6; }
    .footer { background: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
    .badge { display: inline-block; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 20px; padding: 4px 12px; font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 Nová registrácia na Tvojton.online</h1>
      <p>Niekto sa zaregistroval na čakaciu listinu</p>
    </div>
    <div class="body">
      <div class="field">
        <label>Meno a priezvisko</label>
        <value>${data.name}</value>
      </div>
      <div class="field">
        <label>Email</label>
        <value><a href="mailto:${data.email}" style="color:#3b82f6;">${data.email}</a></value>
      </div>
      <div class="field">
        <label>Záujem o plán</label>
        <value><span class="badge">${planLabel}</span></value>
      </div>
      ${data.message ? `
      <div class="field">
        <label>Správa / Čo by mal agent vedieť</label>
        <div class="message-box"><p>${data.message.replace(/\n/g, '<br>')}</p></div>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>Táto správa bola odoslaná automaticky z Tvojton.online</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER || process.env.GMAIL_USER || "noreply@tvojton.online",
      to: ADMIN_EMAIL,
      subject: `🤖 Nová registrácia: ${data.name} (${planLabel})`,
      html: htmlContent,
      text: `Nová registrácia na Tvojton.online\n\nMeno: ${data.name}\nEmail: ${data.email}\nPlán: ${planLabel}\nSpráva: ${data.message || "—"}`,
    });
    console.log(`[Email] Notification sent to ${ADMIN_EMAIL} for ${data.email}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send notification:", error);
    return false;
  }
}
