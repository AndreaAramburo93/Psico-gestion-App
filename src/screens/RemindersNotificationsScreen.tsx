import React, { useState } from 'react';
import { INITIAL_REMINDER_LOGS } from '../data/mockData';
import { NotificationRule, ReminderLogItem } from '../types';

interface RemindersNotificationsScreenProps {
  rules: NotificationRule[];
  onToggleRule: (id: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const RemindersNotificationsScreen: React.FC<RemindersNotificationsScreenProps> = ({
  rules,
  onToggleRule,
  onShowToast,
}) => {
  const [logs, setLogs] = useState<ReminderLogItem[]>(INITIAL_REMINDER_LOGS);
  const [channelFilter, setChannelFilter] = useState<'Todos' | 'WhatsApp' | 'Email' | 'SMS'>(
    'Todos'
  );
  const [testPatient, setTestPatient] = useState('Camila Morales Valencia');
  const [testChannel, setTestChannel] = useState<'WhatsApp' | 'Email'>('WhatsApp');

  const filteredLogs = logs.filter(
    (item) => channelFilter === 'Todos' || item.channel === channelFilter
  );

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ReminderLogItem = {
      id: `log-${Date.now()}`,
      patientName: testPatient,
      appointmentTime: 'Jue 24 Oct • 16:00 hrs',
      channel: testChannel,
      sentAt: 'Hace unos segundos',
      status: 'Entregado',
    };
    setLogs((prev) => [newItem, ...prev]);
    onShowToast(
      `Recordatorio de prueba enviado por ${testChannel} a ${testPatient}.`,
      testChannel === 'WhatsApp' ? 'chat' : 'mail'
    );
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
            Reduce la tasa de inasistencia mediante confirmaciones empáticas por WhatsApp Business,
            correo electrónico cifrado y avisos SMS de respaldo.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-space-sm shrink-0">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <span className="text-label-sm text-on-surface-variant block">Confirmación 48h</span>
            <span className="font-headline-md text-primary font-bold tabular-nums">94.8%</span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <span className="text-label-sm text-on-surface-variant block">Ausentismo Oct</span>
            <span className="font-headline-md text-secondary font-bold tabular-nums">3.1%</span>
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
            Envía un aviso inmediato de confirmación o enlace de teleconsulta para pacientes con
            citas próximas.
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
                  onClick={() => setTestChannel('WhatsApp')}
                  className={`py-2.5 rounded-xl text-body-sm font-body-bold flex items-center justify-center gap-1.5 ${
                    testChannel === 'WhatsApp'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setTestChannel('Email')}
                  className={`py-2.5 rounded-xl text-body-sm font-body-bold flex items-center justify-center gap-1.5 ${
                    testChannel === 'Email'
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span> Email Cifrado
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-body-sm text-on-surface-variant italic">
              &quot;Hola {testPatient.split(' ')[0]}, te recordamos tu sesión con Dra. Sofía
              Mendoza el Jueves 24 de Oct a las 16:00 hrs. Responde SÍ para confirmar tu
              asistencia.&quot;
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">outgoing_mail</span>
              Enviar Recordatorio Ahora
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
                  <td className="py-3 px-3 font-body-bold text-on-surface">{log.patientName}</td>
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
                        log.status === 'Confirmado por paciente'
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
