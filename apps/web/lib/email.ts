/**
 * Email Service for FITCLASS
 * handles transactional emails using Postmark or Resend API.
 */

const PRODUCT_NAME = "FITCLASS";
const SUPPORT_EMAIL = "soporte@fitclass.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface SendInvitationParams {
  to: string;
  name: string;
  gymName: string;
  tempPassword?: string;
  senderName: string;
}

/**
 * Envia el correo de invitación usando la API de Postmark (vía fetch)
 */
export async function sendInvitationEmail({
  to,
  name,
  gymName,
  tempPassword,
  senderName,
}: SendInvitationParams) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

  if (!postmarkToken || postmarkToken.includes("REEMPLAZAR")) {
    console.warn("[EmailService] No hay token de Postmark configurado. Saltando envío.");
    return { success: false, error: "Missing API Token" };
  }

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title></title>
  <style type="text/css" rel="stylesheet" media="all">
    /* Base Styles */
    body { width: 100% !important; height: 100%; margin: 0; line-height: 1.4; background-color: #F2F4F6; color: #51545E; -webkit-text-size-adjust: none; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    a { color: #5e5ce6; }
    .email-wrapper { width: 100%; margin: 0; padding: 0; background-color: #0a0a0c; }
    .email-content { width: 100%; max-width: 600px; margin: 0 auto; padding: 0; }
    .email-body { width: 100%; margin: 0; padding: 32px; background-color: #131315; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }
    h1 { margin-top: 0; color: #ffffff; font-size: 24px; font-weight: 800; text-align: left; letter-spacing: -0.02em; }
    p { margin-top: 0; color: #a1a1aa; font-size: 16px; line-height: 1.6; }
    .button { background-color: #5e5ce6; border-radius: 12px; color: #FFF; display: inline-block; font-size: 14px; font-weight: 800; line-height: 45px; text-align: center; text-decoration: none; width: 200px; -webkit-text-size-adjust: none; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(94, 92, 230, 0.2); }
    .credentials-box { background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin: 24px 0; }
    .credentials-label { color: #71717a; font-size: 11px; font-weight: 800; text-transform: uppercase; tracking: 0.1em; margin-bottom: 4px; }
    .credentials-value { color: #ffffff; font-size: 15px; font-weight: 600; margin-bottom: 12px; }
    .footer { text-align: center; padding: 32px; color: #52525b; font-size: 12px; }
  </style>
</head>
<body>
  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="email-body">
              <h1>¡Hola, ${name}!</h1>
              <p>${senderName} de <strong>${gymName}</strong> te ha invitado a unirte como Coach en nuestra plataforma de alto rendimiento.</p>
              
              <div class="credentials-box">
                <div class="credentials-label">Usuario / Email</div>
                <div class="credentials-value">${to}</div>
                ${tempPassword ? `
                <div class="credentials-label">Contraseña Temporal</div>
                <div class="credentials-value" style="color: #c2c1ff; font-family: monospace; font-size: 18px;">${tempPassword}</div>
                <p style="font-size: 12px; margin-top: 8px;">Recomendamos cambiar tu contraseña en tu primer acceso.</p>
                ` : ''}
              </div>

              <table border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${APP_URL}/login" class="button" target="_blank">Entrar al Sistema</a>
                  </td>
                </tr>
              </table>

              <p>Si tienes alguna pregunta, puedes responder directamente a este correo. ¡Bienvenido al equipo!</p>
              <p>Atentamente,<br/>El Equipo de ${PRODUCT_NAME}</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>&copy; 2024 ${PRODUCT_NAME} Tecnologia de Alto Rendimiento. <br/>
              Si tienes problemas con el botón, copia y envía este enlace: ${APP_URL}/login</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: "mmaldas1@espe.edu.ec", // Tu correo verificado en Postmark
        To: to,
        Subject: `¡Bienvenido a ${gymName}! 🚀`,
        HtmlBody: html,
        MessageStream: "outbound",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || "Error sending email");
    }

    return { success: true };
  } catch (err: any) {
    console.error("[EmailService] Error:", err.message);
    return { success: false, error: err.message };
  }
}
