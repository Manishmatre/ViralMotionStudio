import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp-relay.brevo.com";
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER || "8b2c1a002@smtp-brevo.com";
const smtpPass = process.env.SMTP_PASS || "bskQMNuHkbiUAcS";
const smtpFrom = process.env.SMTP_FROM || "ArionexTech Software <arionextech@gmail.com>";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`[Email Sent] MessageId: ${info.messageId} to ${options.to}`);
    return { success: true, messageId: info.messageId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[Email Delivery Skipped/Error] (${options.to}):`, msg);
    return { success: false, error: msg };
  }
}

export async function sendWelcomeEmail(to: string, userName: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; background: #090B18; color: #F8FAFC; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto;">
      <h1 style="color: #8247FF; margin-bottom: 8px;">Welcome to ViralMotionStudio</h1>
      <p style="color: #A1A8BC; font-size: 15px; line-height: 1.6;">
        Hi ${userName || "Creator"}, your AI video production and automated YouTube publishing studio is ready.
      </p>
      <div style="background: #12162B; border: 1px solid rgba(130,71,255,0.25); border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin-top: 0; color: #22D3EE;">Your Capabilities:</h3>
        <ul style="color: #E2E8F0; padding-left: 20px; line-height: 1.8;">
          <li>Automated 30 FPS Remotion Motion Graphics</li>
          <li>Neural Edge Voiceover & Word-by-Word Captions</li>
          <li>YouTube Data API v3 Direct Channel Publishing</li>
          <li>Dual Format Creation (9:16 Shorts & 16:9 Documentaries)</li>
        </ul>
      </div>
      <p style="color: #64748B; font-size: 12px;">Powered by ${smtpFrom}</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: "Welcome to ViralMotionStudio — Turn Ideas Into Cinematic Experiences",
    html,
  });
}

export async function sendPublishSuccessEmail(
  to: string,
  videoTitle: string,
  youtubeUrl: string,
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; background: #090B18; color: #F8FAFC; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto;">
      <h2 style="color: #10B981; margin-bottom: 8px;">Video Published to YouTube!</h2>
      <p style="color: #A1A8BC; font-size: 15px;">Your video <strong>"${videoTitle}"</strong> was successfully uploaded and published.</p>
      <a href="${youtubeUrl}" style="display: inline-block; background: #FF0033; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin: 16px 0;">View on YouTube</a>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Published: ${videoTitle}`,
    html,
  });
}

export async function getSmtpStatus(): Promise<{
  configured: boolean;
  host: string;
  from: string;
}> {
  return {
    configured: Boolean(smtpHost && smtpUser),
    host: smtpHost,
    from: smtpFrom,
  };
}

