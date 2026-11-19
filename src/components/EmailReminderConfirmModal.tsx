import React, { useState, useEffect } from 'react';
import { AppointmentEmailDraft } from '../types';
import { GoogleSignInButton } from './GoogleSignInButton';

interface EmailReminderConfirmModalProps {
  draft: AppointmentEmailDraft | null;
  gmailConnected: boolean;
  connectedEmail: string | null;
  isSigningIn: boolean;
  isSending: boolean;
  onGoogleSignIn: () => Promise<void>;
  onConfirmSend: (recipientEmail: string, subject: string, extraNotes: string) => Promise<void>;
  onCancel: () => void;
}

export const EmailReminderConfirmModal: React.FC<EmailReminderConfirmModalProps> = ({
  draft,
  gmailConnected,
  connectedEmail,
  isSigningIn,
  isSending,
  onGoogleSignIn,
  onConfirmSend,
  onCancel,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!draft) return;
    setRecipientEmail(draft.defaultEmail || connectedEmail || '');
    setSubject(
      `Recordatorio de Cita — Psico_Gestión: ${draft.specialistName} (${draft.dateLabel}, ${draft.timeLabel})`
    );
    setExtraNotes(draft.extraNotes || '');
    setValidationError('');
  }, [draft, connectedEmail]);

  if (!draft) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = recipientEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setValidationError('Ingresa una dirección de correo electrónico válida para el destinatario.');
      return;
    }
    setValidationError('');
    await onConfirmSend(trimmed, subject.trim() || 'Recordatorio de Cita — Psico_Gestión', extraNotes.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-confirm-title"
    >
      <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-space-lg shadow-2xl space-y-space-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex items-start gap-space-sm">
            <div className="w-11 h-11 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-title-lg">mark_email_read</span>
            </div>
            <div>
              <span className="text-label-caps text-primary uppercase tracking-wider">
                Confirmación de Envío por Gmail
              </span>
              <h3 id="email-confirm-title" className="font-headline-md text-on-surface leading-tight">
                ¿Enviar correo de recordación de cita?
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSending}
            aria-label="Cerrar diálogo"
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Appointment Summary Preview */}
        <div className="bg-surface-container-low rounded-xl p-space-md space-y-2 text-body-sm">
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-surface-variant">
            <span className="font-label-caps text-primary uppercase">Resumen de la Cita Agendada</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-label-sm font-bold">
              {draft.modalityLabel}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            <p className="text-on-surface-variant">
              Paciente: <strong className="text-on-surface">{draft.patientName}</strong>
            </p>
            <p className="text-on-surface-variant">
              Especialista: <strong className="text-on-surface">{draft.specialistName}</strong>
            </p>
            <p className="text-on-surface-variant">
              Fecha: <strong className="text-primary">{draft.dateLabel}</strong>
            </p>
            <p className="text-on-surface-variant">
              Horario: <strong className="text-on-surface">{draft.timeLabel}</strong>
            </p>
          </div>
          <p className="text-on-surface-variant pt-0.5">
            Motivo / Enfoque: <strong className="text-on-surface">{draft.reason}</strong>
          </p>
        </div>

        {/* Gmail Auth Status Banner */}
        {!gmailConnected ? (
          <div className="rounded-xl bg-secondary-fixed/50 p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div className="space-y-0.5">
              <p className="font-body-bold text-body-sm text-on-secondary-fixed flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                Conecta tu cuenta de Google para enviar este correo
              </p>
              <p className="text-label-sm text-on-secondary-fixed-variant">
                El correo de recordación se enviará desde tu cuenta de Gmail únicamente cuando confirmes abajo.
              </p>
            </div>
            <div className="shrink-0">
              <GoogleSignInButton
                onClick={onGoogleSignIn}
                loading={isSigningIn}
                label="Sign in with Google"
                compact
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[#E8F5E9] px-space-md py-2.5 flex items-center justify-between gap-2 text-body-sm">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>
                Remitente conectado: <strong>{connectedEmail}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Editable Email Fields */}
        <form onSubmit={handleSubmit} className="space-y-space-sm">
          <div>
            <label
              htmlFor="reminder-recipient-email"
              className="font-label-caps text-on-surface-variant block mb-1"
            >
              Correo del destinatario (Para)
            </label>
            <input
              id="reminder-recipient-email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="paciente@ejemplo.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label
              htmlFor="reminder-subject"
              className="font-label-caps text-on-surface-variant block mb-1"
            >
              Asunto del correo
            </label>
            <input
              id="reminder-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label
              htmlFor="reminder-notes"
              className="font-label-caps text-on-surface-variant block mb-1"
            >
              Nota opcional para el paciente
            </label>
            <textarea
              id="reminder-notes"
              rows={2}
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              placeholder="Ej. Recuerda tener a mano tu bitácora de la semana y conectarte 5 min antes."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {validationError && (
            <p className="text-body-sm text-error font-medium">{validationError}</p>
          )}

          {/* Explicit Confirmation Disclaimer */}
          <div className="p-3 rounded-xl bg-surface-container-low/60 flex items-start gap-2 text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">info</span>
            <span>
              Al hacer clic en <strong>Confirmar y Enviar Correo</strong>, se enviará un mensaje real desde tu Gmail al destinatario indicado arriba con el resumen de esta cita.
            </span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-space-sm pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSending}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-sm font-body-bold hover:bg-surface-container-high transition-colors"
            >
              Cancelar (solo agendar)
            </button>
            <button
              type="submit"
              disabled={!gmailConnected || isSending}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-body-sm font-body-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSending ? 'hourglass_top' : 'send'}
              </span>
              <span>{isSending ? 'Enviando por Gmail...' : 'Confirmar y Enviar Correo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
