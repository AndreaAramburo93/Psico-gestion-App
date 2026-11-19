import React, { useState } from 'react';
import { AppointmentEmailDraft, NotificationRule, ReminderLogItem } from '../types';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

interface RemindersNotificationsScreenProps {
  rules: NotificationRule[];
  logs: ReminderLogItem[];
  gmailConnected: boolean;
  connectedEmail: string | null;
  isSigningInGoogle: boolean;
  onGoogleSignIn: () => Promise<void>;
  onToggleRule: (id: string) => void;
  onAddLog: (item: ReminderLogItem) => void;
  onRequestEmailReminder: (draft: AppointmentEmailDraft) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const RemindersNotificationsScreen: React.FC<RemindersNotificationsScreenProps> = ({
  rules,
  logs,
  gmailConnected,
  connectedEmail,
  isSigningInGoogle,
  onGoogleSignIn,
  onToggleRule,
  onAddLog,
  onRequestEmailReminder,
  onShowToast,
}) => {
  const [channelFilter, setChannelFilter] = useState<'Todos' | 'WhatsApp' | 'Email' | 'SMS'>(
    'Todos'
  );
  const [testPatient, setTestPatient] = useState('Camila Morales Valencia');
  const [testEmail, setTestEmail] = useState('');
  const [testChannel, setTestChannel] = useState<'WhatsApp' | 'Email'>('Email');

  const filteredLogs = logs.filter(
    (item) => channelFilter === 'Todos' || item.channel === channelFilter
  );

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (testChannel === 'Email') {
      onRequestEmailReminder({
        patientName: testPatient,
        specialistName: 'Dra. Sofía Mendoza',
        dateLabel: 'Jueves 24 de Octubre, 2024',
        timeLabel: '16:00 - 16:50 hrs',
        modalityLabel: 'Teleconsulta Segura (Google Meet)',
        reason: 'Recordatorio Pre-Sesión Programada',
        defaultEmail: testEmail.trim() || connectedEmail || undefined,
      });
      return;
    }

    const newItem: ReminderLogItem = {
      id: `log-${Date.now()}`,
      patientName: testPatient,
      appointmentTime: 'Jue 24 Oct • 16:00 hrs',
      channel: 'WhatsApp',
      sentAt: 'Hace unos segundos',
      status: 'Entregado',
    };
    onAddLog(newItem);
    onShowToast(`Recordatorio de prueba registrado por WhatsApp para ${testPatient}.`, 'chat');
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto px-gutter py-space-lg space-y-space-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md bg-surface-container-low rounded-2xl p-space-lg">
        <div className="space-y-space-xs max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-caps uppercase">
            <span className="material-symbols-outlined text-[15px]">notifications_active</span>
            Automatización Clínica • CU-17
          </span>
          <h1 className="font-headline-lg text-on-surface tracking-tight">
            Recordatorios y Notificaciones Automatizadas
          </h1>
          <p className="text-body-base text-on-surface-variant">
            Envía recordaciones reales por <strong>Gmail</strong> cuando se agenda una cita y
            gestiona confirmaciones empáticas para reducir la tasa de inasistencia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          {gmailConnected ? (
            <div className="bg-[#E8F5E9] text-[#2E7D32] rounded-xl px-space-md py-3 flex items-center gap-2.5 shadow-sm">
              <span className="material-symbols-outlined text-title-lg">mark_email_read</span>
              <div className="text-left">
                <span className="text-label-caps block uppercase">Gmail Conectado</span>
                <span className="text-body-sm font-body-bold">{connectedEmail}</span>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col gap-1.5">
              <span className="text-label-sm text-on-surface-variant px-1">
                Conecta Gmail para envíos reales:
              </span>
              <GoogleSignInButton
                onClick={onGoogleSignIn}
                loading={isSigningInGoogle}
                label="Sign in with Google"
                compact
              />
            </div>
          )}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <span className="text-label-sm text-on-surface-variant block">Confirmación 48h</span>
            <span className="font-headline-md text-primary font-bold tabular-nums">94.8%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Rules List (7 cols) */}
        <section className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-title-lg text-on-surface">
                Reglas de Envío Automático Activas
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Activa o pausa flujos según la preferencia de tus pacientes.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-caps">
              {rules.filter((r) => r.enabled).length} / {rules.length} Activas
            </span>
          </div>

          <div className="space-y-space-sm">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-space-md rounded-xl bg-surface-container-low/70 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-title-md text-on-surface">{rule.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-label-caps">
                      {rule.channel}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-label-sm">
                      {rule.timing}
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{rule.description}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={rule.enabled}
                  onClick={() => {
                    onToggleRule(rule.id);
                    onShowToast(
                      `${rule.title} ${!rule.enabled ? 'activado' : 'pausado'}.`,
                      'notifications'
                    );
                  }}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                    rule.enabled ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest transition-transform shadow-sm ${
                      rule.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Manual Trigger & Test Card (5 cols) */}
        <aside className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-title-lg">send</span>
            <h2 className="font-title-lg text-on-surface">Disparo Manual de Recordatorio</h2>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Envía un correo real de recordación a través de Gmail o registra un aviso de
            confirmación para citas próximas.
          </p>

          <form onSubmit={handleSendTest} className="space-y-space-md">
            <div>
              <label className="font-label-caps text-on-surface-variant block mb-1">
                Paciente Destinatario
              </label>
              <select
                value={testPatient}
                onChange={(e) => setTestPatient(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none"
              >
                <option value="Camila Morales Valencia">Camila Morales Valencia</option>
                <option value="Mateo Gómez">Mateo Gómez</option>
                <option value="Lucía Fernández">Lucía Fernández</option>
                <option value="Daniela Peña">Daniela Peña</option>
              </select>
            </div>

            <div>
              <label className="font-label-caps text-on-surface-variant block mb-1">
                Canal de Despacho
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTestChannel('Email')}
                  className={`py-2.5 rounded-xl text-body-sm font-body-bold flex items-center justify-center gap-1.5 ${
                    testChannel === 'Email'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span> Gmail Real
                </button>
                <button
                  type="button"
                  onClick={() => setTestChannel('WhatsApp')}
                  className={`py-2.5 rounded-xl text-body-sm font-body-bold flex items-center justify-center gap-1.5 ${
                    testChannel === 'WhatsApp'
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span> WhatsApp
                </button>
              </div>
            </div>

            {testChannel === 'Email' && (
              <div>
                <label className="font-label-caps text-on-surface-variant block mb-1">
                  Correo Destinatario (opcional)
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder={connectedEmail || 'tu-correo@gmail.com'}
                  className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            <div className="p-3 rounded-xl bg-surface-container-low text-body-sm text-on-surface-variant italic">
              &quot;Hola {testPatient.split(' ')[0]}, te recordamos tu sesión con Dra. Sofía
              Mendoza el Jueves 24 de Oct a las 16:00 hrs en Psico_Gestión.&quot;
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">outgoing_mail</span>
              {testChannel === 'Email'
                ? 'Revisar y Enviar por Gmail'
                : 'Enviar Recordatorio WhatsApp'}
            </button>
          </form>
        </aside>
      </div>

      {/* Delivery Log Table */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div>
            <h2 className="font-title-lg text-on-surface">Historial de Entregas y Respuestas</h2>
            <p className="text-body-sm text-on-surface-variant">
              Trazabilidad en tiempo real sin exponer contenido clínico sensible.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
            {(['Todos', 'WhatsApp', 'Email', 'SMS'] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setChannelFilter(ch)}
                className={`px-3 py-1 rounded-lg text-body-sm transition-colors ${
                  channelFilter === ch
                    ? 'bg-surface-container-lowest text-primary font-body-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant text-label-caps text-on-surface-variant uppercase">
                <th className="py-3 px-3">Paciente</th>
                <th className="py-3 px-3">Cita Programada</th>
                <th className="py-3 px-3">Canal</th>
                <th className="py-3 px-3">Despachado</th>
                <th className="py-3 px-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/60 text-body-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-body-bold text-on-surface">{log.patientName}</div>
                    {log.recipientEmail && (
                      <div className="text-label-sm text-on-surface-variant">
                        {log.recipientEmail}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">{log.appointmentTime}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-label-sm font-semibold">
                      {log.channel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">{log.sentAt}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-caps ${
                        log.status === 'Confirmado por paciente' ||
                        log.status === 'Enviado vía Gmail'
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : log.status === 'Entregado'
                          ? 'bg-primary-fixed text-primary'
                          : 'bg-secondary-fixed text-secondary'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
