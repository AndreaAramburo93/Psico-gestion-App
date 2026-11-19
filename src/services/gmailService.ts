import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppointmentEmailDraft } from '../types';

export const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({ prompt: 'select_account' });

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the OAuth access token strictly in memory (never localStorage/sessionStorage).
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el permiso de envío de Gmail.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async (): Promise<void> => {
  await auth.signOut();
  cachedAccessToken = null;
};

function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function toBase64UrlUtf8(str: string): string {
  return toBase64Utf8(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeMimeHeader(value: string): string {
  return `=?UTF-8?B?${toBase64Utf8(value)}?=`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildAppointmentEmailHtml(draft: AppointmentEmailDraft): string {
  const safePatient = escapeHtml(draft.patientName);
  const safeSpecialist = escapeHtml(draft.specialistName);
  const safeDate = escapeHtml(draft.dateLabel);
  const safeTime = escapeHtml(draft.timeLabel);
  const safeModality = escapeHtml(draft.modalityLabel);
  const safeReason = escapeHtml(draft.reason);
  const safeNotes = draft.extraNotes ? escapeHtml(draft.extraNotes) : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Recordatorio de Cita — Psico_Gestión</title>
</head>
<body style="margin:0;padding:0;background-color:#ecfdf8;font-family:Inter,Arial,sans-serif;color:#0f1e1c;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#ecfdf8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d5e6e1;">
          <tr>
            <td style="background-color:#245347;padding:24px 28px;color:#ffffff;">
              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#bbeddc;font-weight:700;">
                Psico_Gestión • Confirmación y Recordatorio
              </p>
              <h1 style="margin:8px 0 0 0;font-size:22px;line-height:30px;font-weight:700;color:#ffffff;">
                Tu cita psicológica ha sido agendada
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px 0;font-size:15px;line-height:24px;color:#0f1e1c;">
                Hola <strong>${safePatient}</strong>,
              </p>
              <p style="margin:0 0 20px 0;font-size:15px;line-height:24px;color:#404945;">
                Te compartimos el recordatorio oficial de tu próximo encuentro terapéutico en <strong>Psico_Gestión</strong>. Hemos reservado este espacio confidencial exclusivamente para ti:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e6f7f2;border-radius:12px;padding:18px 20px;margin-bottom:20px;">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#404945;width:140px;">Especialista:</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#0f1e1c;">${safeSpecialist}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#404945;">Fecha:</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#245347;">${safeDate}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#404945;">Horario:</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#0f1e1c;">${safeTime} (GMT-5)</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#404945;">Modalidad:</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#0f1e1c;">${safeModality}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#404945;">Motivo / Enfoque:</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#0f1e1c;">${safeReason}</td>
                </tr>
              </table>

              ${
                safeNotes
                  ? `<p style="margin:0 0 20px 0;font-size:14px;line-height:22px;color:#404945;background:#f8fbfa;padding:12px 16px;border-left:3px solid #245347;border-radius:6px;"><strong>Nota adicional:</strong> ${safeNotes}</p>`
                  : ''
              }

              <p style="margin:0 0 12px 0;font-size:13px;line-height:20px;color:#404945;">
                <strong>Recomendaciones previas:</strong> Busca un espacio tranquilo y privado, verifica tus audífonos y conéctate 5 minutos antes si tu sesión es virtual. Puedes reprogramar sin costo hasta 24 horas antes.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#e6f7f2;padding:16px 28px;font-size:12px;color:#404945;text-align:center;">
              Psico_Gestión • Plataforma de Salud Mental y Tele-psicología • Confidencialidad protegida
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendAppointmentReminderEmail(
  recipientEmail: string,
  subject: string,
  draft: AppointmentEmailDraft
): Promise<{ id: string; threadId?: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('NEEDS_AUTH');
  }

  const htmlBody = buildAppointmentEmailHtml(draft);
  const mimeMessage = [
    `To: ${recipientEmail}`,
    `Subject: ${encodeMimeHeader(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    toBase64Utf8(htmlBody),
  ].join('\r\n');

  const raw = toBase64UrlUtf8(mimeMessage);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (response.status === 401 || response.status === 403) {
    cachedAccessToken = null;
    throw new Error('AUTH_EXPIRED');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`No se pudo enviar el correo (${response.status}): ${errorText}`);
  }

  return response.json();
}
