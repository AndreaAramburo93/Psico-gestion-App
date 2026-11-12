import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { BillingRecord, ScreenRoute } from '../types';
import { SafeImage } from '../components/SafeImage';

interface AvailabilityBillingScreenProps {
  billingRecords: BillingRecord[];
  onAddBillingRecord: (record: BillingRecord) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onNavigate: (route: ScreenRoute) => void;
}

interface DaySchedule {
  id: string;
  label: string;
  enabled: boolean;
  morning: string;
  afternoon: string;
  turns: number;
  note?: string;
  noteAccent?: boolean;
}

const INITIAL_DAYS: DaySchedule[] = [
  { id: 'lun', label: 'Lunes', enabled: true, morning: '08:00 - 13:00', afternoon: '14:30 - 18:30', turns: 8 },
  { id: 'mar', label: 'Martes', enabled: true, morning: '08:30 - 13:00', afternoon: '14:30 - 19:00', turns: 8 },
  { id: 'mie', label: 'Miércoles', enabled: true, morning: '09:00 - 13:30', afternoon: '15:00 - 18:00', turns: 7 },
  { id: 'jue', label: 'Jueves', enabled: true, morning: '08:00 - 13:00', afternoon: '14:30 - 18:30', turns: 8 },
  {
    id: 'vie',
    label: 'Viernes',
    enabled: true,
    morning: '08:30 - 14:00',
    afternoon: '',
    turns: 5,
    note: 'Tarde reservada para supervisión clínica',
  },
  {
    id: 'sab',
    label: 'Sábado',
    enabled: true,
    morning: '09:00 - 13:00',
    afternoon: '',
    turns: 4,
    note: 'Sobretasa fin de semana (+15%)',
    noteAccent: true,
  },
];

export const AvailabilityBillingScreen: React.FC<AvailabilityBillingScreenProps> = ({
  billingRecords,
  onAddBillingRecord,
  onShowToast,
}) => {
  const [intakeActive, setIntakeActive] = useState(true);
  const [sessionDuration, setSessionDuration] = useState('50');
  const [bufferTime, setBufferTime] = useState('10');
  const [days, setDays] = useState<DaySchedule[]>(INITIAL_DAYS);
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [blockedPeriods, setBlockedPeriods] = useState<string[]>(['Jul 12-16']);

  // Billing form state
  const [patientOption, setPatientOption] = useState('Camila Morales — Historia #CM-2024');
  const [concept, setConcept] = useState('Sesión TCC Individual (50 min)');
  const [sessionDate, setSessionDate] = useState('2024-10-24');
  const [amount, setAmount] = useState('55.00');
  const [paymentChannel, setPaymentChannel] = useState('Tarjeta Crédito (Stripe Auto)');
  const [sendPdf, setSendPdf] = useState(true);
  const [withholding, setWithholding] = useState(false);
  const [showCobroFeedback, setShowCobroFeedback] = useState(false);

  // Table filter
  const [statusFilter, setStatusFilter] = useState<string>('Todos los estados');
  const [highlightForm, setHighlightForm] = useState(false);

  const totalCollected = billingRecords
    .filter((r) => r.status === 'Cobrado con éxito')
    .reduce((acc, r) => acc + r.amountUsd, 2655); // baseline monthly + live records

  const pendingAmount = billingRecords
    .filter((r) => r.status !== 'Cobrado con éxito')
    .reduce((acc, r) => acc + r.amountUsd, 165);

  const filteredRecords = billingRecords.filter((r) => {
    if (statusFilter === 'Todos los estados') return true;
    if (statusFilter === 'Cobrado con éxito') return r.status === 'Cobrado con éxito';
    if (statusFilter === 'Pendiente') return r.status === 'Pendiente' || r.status === 'En Liquidación';
    if (statusFilter === 'Aseguradora') return r.paymentMethod.toLowerCase().includes('seguros');
    return true;
  });

  const handleToggleDay = (id: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const handleUpdateDayBlocks = (id: string, morning: string, afternoon: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, morning, afternoon } : d))
    );
    setEditingDayId(null);
    onShowToast('Bloques horarios actualizados correctamente.', 'schedule');
  };

  const handleSubmitCobro = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedName = patientOption.split(' — ')[0] || 'Camila Morales';
    const historyPart = patientOption.split(' — ')[1] || 'HC #CM-2024';
    const initials = parsedName
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
    const numericAmount = parseFloat(amount) || 55;
    const finalAmount = withholding ? +(numericAmount * 0.89).toFixed(2) : numericAmount;
    const nextReceiptNum = 4093 + billingRecords.length - 4;

    const newRecord: BillingRecord = {
      id: `bill-${Date.now()}`,
      patientName: parsedName,
      initials,
      initialsBg: 'bg-primary-fixed',
      initialsText: 'text-primary',
      historyCode: `${historyPart} • ${concept.split(' ')[0]}`,
      concept,
      dateTime: `${sessionDate} • Hoy`,
      sessionLabel: concept,
      paymentMethod: paymentChannel,
      paymentIcon: paymentChannel.includes('Tarjeta')
        ? 'credit_card'
        : paymentChannel.includes('Transferencia')
        ? 'account_balance'
        : paymentChannel.includes('Póliza')
        ? 'health_and_safety'
        : 'payments',
      amountUsd: finalAmount,
      status: paymentChannel.includes('Póliza') ? 'En Liquidación' : 'Cobrado con éxito',
      receiptNumber: `Recibo #${nextReceiptNum}`,
    };

    onAddBillingRecord(newRecord);
    setShowCobroFeedback(true);
    onShowToast(`Comprobante ${newRecord.receiptNumber} emitido con éxito.`, 'receipt_long');
    setTimeout(() => setShowCobroFeedback(false), 4000);
  };

  const scrollToForm = () => {
    const el = document.getElementById('cobro-form-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 1800);
    }
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto px-gutter py-space-lg flex flex-col gap-space-xl">
      {/* Hero / Status Banner & Profile Context */}
      <div className="relative w-full rounded-2xl bg-surface-container-low shadow-sm p-space-lg overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-space-lg">
            <div className="relative shrink-0">
              <SafeImage
                src={IMAGES.sofiaHero}
                alt="Dra. Sofía Mendoza en su consultorio clínico"
                className="w-20 h-20 rounded-2xl object-cover shadow-md"
                fallbackText="SM"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
                  Práctica Activa
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    verified
                  </span>{' '}
                  Habilitación Sanitaria N° CO-88421
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                Disponibilidad &amp; Gestión de Cobros
              </h1>
              <p className="font-body-base text-body-base text-on-surface-variant max-w-xl">
                Configura tu ritmo asistencial, amortigua el desgaste terapéutico con pausas conscientes y fiscaliza tus ingresos en tiempo real.
              </p>
            </div>
          </div>

          {/* Quick Operational KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm w-full xl:w-auto">
            {/* Toggle Intake */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between min-w-[200px]">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Admisión Activa
                </span>
                <span className="material-symbols-outlined text-primary text-[20px]">
                  how_to_reg
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`font-body-bold text-body-bold ${
                    intakeActive ? 'text-on-surface' : 'text-on-surface-variant'
                  }`}
                >
                  {intakeActive ? 'Nuevos Pacientes' : 'Agenda Cerrada'}
                </span>
                <button
                  type="button"
                  aria-label="Alternar admisión de nuevos pacientes"
                  onClick={() => {
                    setIntakeActive((v) => !v);
                    onShowToast(
                      !intakeActive
                        ? 'Admisión de nuevos pacientes activada.'
                        : 'Agenda cerrada temporalmente para nuevos ingresos.',
                      'how_to_reg'
                    );
                  }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    intakeActive ? 'bg-primary' : 'bg-surface-dim'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 ease-in-out mt-0.5 ${
                      intakeActive ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Base Honorarium */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between min-w-[190px]">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Tarifa Estándar
                </span>
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  payments
                </span>
              </div>
              <div className="mt-2">
                <div className="font-title-lg text-title-lg text-on-surface font-semibold tabular-nums">
                  $55 USD{' '}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    / {sessionDuration}m
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  220.000 COP aprox.
                </span>
              </div>
            </div>

            {/* Weekly Occupancy */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between min-w-[190px]">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Ocupación Semanal
                </span>
                <span className="material-symbols-outlined text-primary text-[20px]">
                  donut_large
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="font-title-lg text-title-lg text-primary font-bold tabular-nums">
                    82%
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">
                    33/40 bloques
                  </span>
                </div>
                <svg className="w-9 h-9 -rotate-90 text-primary" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary transition-all duration-1000 ease-out"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="82, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT: Disponibilidad Horaria (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <h2 className="font-title-lg text-title-lg text-on-surface">
                    Matriz Semanal de Atención
                  </h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Establece tus turnos matutinos y vespertinos con espaciado de respiro mental.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Zona horaria:
                </span>
                <span className="font-label-caps text-label-caps bg-surface-container px-2 py-1 rounded-md text-on-surface">
                  Bogotá (GMT-5)
                </span>
              </div>
            </div>

            {/* Global Settings Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-xl">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
                <div className="flex-1">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Duración por Sesión
                  </label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => {
                      setSessionDuration(e.target.value);
                      onShowToast(`Duración estándar ajustada a ${e.target.value} minutos.`, 'timer');
                    }}
                    className="mt-0.5 bg-transparent font-body-bold text-body-sm text-on-surface focus:outline-none cursor-pointer w-full"
                  >
                    <option value="50">50 min (Psicoterapia Estándar)</option>
                    <option value="60">60 min (Evaluación Integral)</option>
                    <option value="45">45 min (Intervención Focal)</option>
                    <option value="90">90 min (Terapia de Pareja / Familia)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary text-[20px] shadow-xs">
                  <span className="material-symbols-outlined">self_improvement</span>
                </div>
                <div className="flex-1">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Respiro Terapéutico (Buffer)
                  </label>
                  <select
                    value={bufferTime}
                    onChange={(e) => {
                      setBufferTime(e.target.value);
                      onShowToast(`Respiro terapéutico ajustado a ${e.target.value} min.`, 'self_improvement');
                    }}
                    className="mt-0.5 bg-transparent font-body-bold text-body-sm text-on-surface focus:outline-none cursor-pointer w-full"
                  >
                    <option value="10">10 min (Notas clínicas &amp; pausa)</option>
                    <option value="15">15 min (Recomendado burnout-free)</option>
                    <option value="20">20 min (Transición suave)</option>
                    <option value="0">0 min (Sesiones continuas)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule Days List */}
            <div className="flex flex-col gap-space-xs mt-2">
              {days.map((day) => (
                <div
                  key={day.id}
                  className={`p-space-sm rounded-xl flex flex-col gap-space-sm transition-all ${
                    day.id === 'sab'
                      ? 'bg-surface-container/60 hover:bg-surface-container-high/60'
                      : 'bg-surface-container hover:bg-surface-container-high/60'
                  } ${!day.enabled ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm min-w-[130px]">
                      <input
                        checked={day.enabled}
                        onChange={() => handleToggleDay(day.id)}
                        className="w-5 h-5 rounded-md accent-primary cursor-pointer"
                        id={`check-${day.id}`}
                        type="checkbox"
                      />
                      <label
                        className="font-body-bold text-body-base text-on-surface cursor-pointer"
                        htmlFor={`check-${day.id}`}
                      >
                        {day.label}
                      </label>
                    </div>

                    <div className="flex items-center flex-wrap gap-space-xs text-on-surface font-body-sm">
                      {day.enabled ? (
                        <>
                          <span className="bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 font-body-bold text-primary tabular-nums">
                            <span className="material-symbols-outlined text-[16px]">wb_sunny</span>{' '}
                            {day.morning}
                          </span>
                          {day.afternoon && (
                            <>
                              <span className="text-outline text-body-sm px-1">+</span>
                              <span className="bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 font-body-bold text-primary tabular-nums">
                                <span className="material-symbols-outlined text-[16px]">bedtime</span>{' '}
                                {day.afternoon}
                              </span>
                            </>
                          )}
                          {day.note && (
                            <span
                              className={`font-label-sm text-label-sm pl-2 ${
                                day.noteAccent
                                  ? 'text-tertiary font-semibold'
                                  : 'text-on-surface-variant italic'
                              }`}
                            >
                              {day.note}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-on-surface-variant italic">Día no laborable</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <span className="font-label-sm text-label-sm text-on-surface-variant tabular-nums">
                        {day.enabled ? `${day.turns} turnos` : '0 turnos'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingDayId(editingDayId === day.id ? null : day.id)}
                        className="p-1 text-on-surface-variant hover:text-primary rounded-lg transition-colors"
                        title="Editar bloques"
                      >
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                      </button>
                    </div>
                  </div>

                  {editingDayId === day.id && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/40">
                      <input
                        type="text"
                        defaultValue={day.morning}
                        id={`morning-${day.id}`}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-body-sm font-body-bold text-on-surface w-36 focus:outline-none"
                        placeholder="Ej. 08:00 - 13:00"
                      />
                      <input
                        type="text"
                        defaultValue={day.afternoon}
                        id={`afternoon-${day.id}`}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-body-sm font-body-bold text-on-surface w-36 focus:outline-none"
                        placeholder="Ej. 14:30 - 18:30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const m = (document.getElementById(`morning-${day.id}`) as HTMLInputElement)?.value || day.morning;
                          const a = (document.getElementById(`afternoon-${day.id}`) as HTMLInputElement)?.value || '';
                          handleUpdateDayBlocks(day.id, m, a);
                        }}
                        className="px-3 py-1 rounded-lg bg-primary text-on-primary text-body-sm font-body-bold hover:bg-primary-container"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Date Overrides & Calendar Sync */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-sm mt-2">
              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">event_busy</span>
                  </div>
                  <div>
                    <h3 className="font-body-bold text-body-sm text-on-surface">
                      Bloqueo de Fechas &amp; Vacaciones
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Suspende citas temporalmente sin alterar tu esquema habitual.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 gap-2">
                  <span className="font-label-sm text-label-sm text-primary font-medium">
                    {blockedPeriods.length} periodo{blockedPeriods.length > 1 ? 's' : ''} ({blockedPeriods[blockedPeriods.length - 1]})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextPeriod = `Dic ${20 + blockedPeriods.length}-${23 + blockedPeriods.length}`;
                      setBlockedPeriods((p) => [...p, nextPeriod]);
                      onShowToast(`Periodo ${nextPeriod} bloqueado en tu agenda.`, 'event_busy');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors font-body-bold text-body-sm shadow-xs flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>{' '}
                    Bloquear
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">sync</span>
                  </div>
                  <div>
                    <h3 className="font-body-bold text-body-sm text-on-surface">
                      Calendarios Bidireccionales
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Prevén solapamientos con citas personales o congresos.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs pt-1">
                  <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded-md text-[12px] font-label-sm text-primary shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Google Cal
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded-md text-[12px] font-label-sm text-secondary shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-secondary" /> Outlook 365
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onShowToast('Sincronización activa con Google Cal y Outlook 365.', 'sync')
                    }
                    className="ml-auto text-primary font-body-bold text-body-sm hover:underline text-[12px]"
                  >
                    Gestionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Aranceles y Modalidades Clínicas */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <h2 className="font-title-lg text-title-lg text-on-surface">
                  Aranceles y Modalidades Clínicas
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onShowToast('Perfil de honorarios actualizado.', 'edit_note')}
                className="text-primary font-body-bold text-body-sm hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span> Actualizar
                Perfil
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Individual TCC
                </span>
                <span className="font-title-lg text-title-lg text-on-surface font-bold tabular-nums">
                  $55 <span className="text-body-sm font-normal text-on-surface-variant">USD</span>
                </span>
                <span className="font-label-sm text-label-sm text-primary font-medium">
                  Virtual • Google Meet
                </span>
              </div>
              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Presencial Sede Norte
                </span>
                <span className="font-title-lg text-title-lg text-on-surface font-bold tabular-nums">
                  $65 <span className="text-body-sm font-normal text-on-surface-variant">USD</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Consultorio 402
                </span>
              </div>
              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Pareja / Familiar
                </span>
                <span className="font-title-lg text-title-lg text-on-surface font-bold tabular-nums">
                  $85 <span className="text-body-sm font-normal text-on-surface-variant">USD</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  80 minutos de sesión
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Registro de Cobro Manual & Métricas (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Action Trigger Card for Billing */}
          <div className="bg-primary text-on-primary rounded-2xl p-space-lg shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-primary-fixed/20 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps uppercase bg-primary-container text-on-primary-container px-2.5 py-1 rounded-full">
                  Gestión Financiera
                </span>
                <span className="material-symbols-outlined text-[24px] text-on-primary-container">
                  receipt_long
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-primary">
                Módulo de Cobros Clínicos
              </h2>
              <p className="font-body-sm text-body-sm text-on-primary/80 mt-1">
                Emite comprobantes médicos deducibles, registra honorarios recibidos por transferencia o seguro y timbra facturación electrónica.
              </p>
            </div>
            <div className="mt-space-lg pt-space-sm flex flex-col sm:flex-row gap-space-sm relative z-10">
              <button
                type="button"
                onClick={scrollToForm}
                className="w-full py-3 px-4 rounded-xl bg-surface-container-lowest text-primary font-body-bold text-body-base hover:bg-surface-bright transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span> Registrar
                Cobro Manual
              </button>
              <button
                type="button"
                onClick={() =>
                  onShowToast('Reporte tributario DIAN / SAT generado en formato PDF.', 'file_download')
                }
                className="py-3 px-4 rounded-xl bg-primary-container text-on-primary hover:bg-primary-container/80 transition-colors font-body-bold text-body-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span> Reporte
                DIAN / SAT
              </button>
            </div>
          </div>

          {/* Monthly Financial Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-caps text-label-caps uppercase">
                  Recaudado este Mes
                </span>
                <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">
                    account_balance_wallet
                  </span>
                </span>
              </div>
              <div className="mt-2 font-headline-md text-headline-md text-on-surface font-bold tabular-nums">
                ${totalCollected.toLocaleString('en-US')}{' '}
                <span className="font-body-sm text-body-sm text-on-surface-variant">USD</span>
              </div>
              <div className="mt-1 flex items-center gap-1 font-label-sm text-label-sm text-primary">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +14% vs.
                mes anterior ({48 + billingRecords.length} citas)
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-caps text-label-caps uppercase">
                  Pendiente de Cobro
                </span>
                <span className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                </span>
              </div>
              <div className="mt-2 font-headline-md text-headline-md text-tertiary font-bold tabular-nums">
                ${pendingAmount.toLocaleString('en-US')}{' '}
                <span className="font-body-sm text-body-sm text-on-surface-variant">USD</span>
              </div>
              <div className="mt-1 flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                <span className="font-body-bold text-on-surface">
                  {3 + billingRecords.filter((r) => r.status !== 'Cobrado con éxito').length} sesiones
                </span>{' '}
                sin liquidar
              </div>
            </div>
          </div>

          {/* Interactive Form Card */}
          <div
            id="cobro-form-card"
            className={`bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md transition-all ${
              highlightForm ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  credit_score
                </span>
                <h3 className="font-title-lg text-title-lg text-on-surface">
                  Nuevo Comprobante de Cobro
                </h3>
              </div>
              <span className="font-label-sm text-label-sm bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-bold">
                Autofactura
              </span>
            </div>

            <form className="flex flex-col gap-space-sm" onSubmit={handleSubmitCobro}>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                  Paciente
                </label>
                <div className="relative">
                  <select
                    value={patientOption}
                    onChange={(e) => setPatientOption(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface rounded-xl px-3 py-2.5 font-body-base text-body-sm focus:outline-none focus:bg-surface-container transition-colors appearance-none"
                    required
                  >
                    <option value="Camila Morales — Historia #CM-2024">
                      Camila Morales — Historia #CM-2024
                    </option>
                    <option value="Mateo Gómez — Historia #MG-1049">
                      Mateo Gómez — Historia #MG-1049
                    </option>
                    <option value="Valentina Rivas — Historia #VR-0982">
                      Valentina Rivas — Historia #VR-0982
                    </option>
                    <option value="Daniela Peña — Historia #DP-4412">
                      Daniela Peña — Historia #DP-4412
                    </option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                    Concepto
                  </label>
                  <select
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface rounded-xl px-3 py-2.5 font-body-base text-body-sm focus:outline-none focus:bg-surface-container transition-colors"
                  >
                    <option>Sesión TCC Individual (50 min)</option>
                    <option>Evaluación Psicodiagnóstica</option>
                    <option>Terapia de Pareja</option>
                    <option>Informe Clínico Pericial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                    Fecha Sesión
                  </label>
                  <input
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface rounded-xl px-3 py-2.5 font-body-base text-body-sm focus:outline-none focus:bg-surface-container transition-colors"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                    Monto ($ USD)
                  </label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface rounded-xl px-3 py-2.5 font-body-bold text-body-base focus:outline-none focus:bg-surface-container transition-colors tabular-nums"
                    step="0.5"
                    type="number"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                    Canal de Pago
                  </label>
                  <select
                    value={paymentChannel}
                    onChange={(e) => setPaymentChannel(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface rounded-xl px-3 py-2.5 font-body-base text-body-sm focus:outline-none focus:bg-surface-container transition-colors"
                  >
                    <option>Tarjeta Crédito (Stripe Auto)</option>
                    <option>Transferencia Bancolombia / PSE</option>
                    <option>Efectivo en Consultorio</option>
                    <option>Póliza Sanitas / Sura Reembolso</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1 bg-surface-container-low/50 p-space-sm rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer font-body-sm text-body-sm text-on-surface">
                  <input
                    checked={sendPdf}
                    onChange={(e) => setSendPdf(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                    type="checkbox"
                  />
                  <span>Enviar recibo fiscal PDF al correo del paciente con firma digital</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-body-sm text-body-sm text-on-surface">
                  <input
                    checked={withholding}
                    onChange={(e) => setWithholding(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                    type="checkbox"
                  />
                  <span>Aplicar retención en la fuente profesional (11%)</span>
                </label>
              </div>

              <button
                className="mt-2 w-full py-3 rounded-xl bg-primary text-on-primary font-body-bold text-body-base shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                type="submit"
              >
                <span className="material-symbols-outlined text-[20px]">save_as</span> Registrar y
                Timbrar Recibo
              </button>

              {showCobroFeedback && (
                <div className="p-3 bg-surface-container-high text-primary rounded-xl text-center font-body-bold text-body-sm">
                  Comprobante expedido con éxito. Copia remitida al paciente.
                </div>
              )}
            </form>
          </div>
        </section>
      </div>

      {/* FULL-WIDTH SECTION: Tabla de Cobros Recientes */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h2 className="font-title-lg text-title-lg text-on-surface">
                Historial de Cobros &amp; Comprobantes Emitidos
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Consulta el estado de cada honorario percibido, desglose tributario y descarga facturas con firma colegiada.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-xl gap-2">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                filter_list
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer"
              >
                <option>Todos los estados</option>
                <option>Cobrado con éxito</option>
                <option>Pendiente</option>
                <option>Aseguradora</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Exportando historial financiero en CSV / Excel...', 'download')}
              className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors font-body-sm text-body-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">download</span> Exportar Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-base text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase">
                <th className="py-3 px-4 rounded-l-xl">Paciente / ID</th>
                <th className="py-3 px-4">Fecha &amp; Sesión</th>
                <th className="py-3 px-4">Método de Pago</th>
                <th className="py-3 px-4">Monto</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Comprobante</th>
              </tr>
            </thead>
            <tbody className="text-on-surface">
              {filteredRecords.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-4 font-body-bold">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${row.initialsBg} ${row.initialsText} flex items-center justify-center font-title-md font-bold text-[14px]`}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <span className="font-body-bold text-on-surface block">
                          {row.patientName}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {row.historyCode}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-body-sm text-on-surface block">{row.dateTime}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {row.sessionLabel}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {row.paymentIcon}
                      </span>
                      <span>{row.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-body-bold text-primary tabular-nums">
                    ${row.amountUsd.toFixed(2)} USD
                  </td>
                  <td className="py-4 px-4">
                    {row.status === 'Cobrado con éxito' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-caps font-bold bg-[#E8F5E9] text-[#2E7D32]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> Cobrado con éxito
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-caps font-bold bg-[#FFF8E1] text-[#B26A00]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B26A00]" /> {row.status}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {row.receiptNumber ? (
                      <button
                        type="button"
                        onClick={() =>
                          onShowToast(`Descargando ${row.receiptNumber} en PDF firmado...`, 'picture_as_pdf')
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-primary hover:bg-surface-container-high transition-colors font-body-bold text-body-sm shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          picture_as_pdf
                        </span>{' '}
                        {row.receiptNumber}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onShowToast('Pre-factura generada para trámite con aseguradora.', 'visibility')
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors font-body-bold text-body-sm shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>{' '}
                        Pre-Factura
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs text-on-surface-variant font-body-sm">
          <span className="font-label-sm text-label-sm">
            Mostrando {filteredRecords.length} de {52 + billingRecords.length} transacciones del
            periodo fiscal actual
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded-lg bg-surface-container-low opacity-50 cursor-not-allowed font-body-sm text-body-sm"
              disabled
              type="button"
            >
              Anterior
            </button>
            <button
              className="px-3 py-1 rounded-lg bg-primary text-on-primary font-body-bold text-body-sm"
              type="button"
            >
              1
            </button>
            <button
              onClick={() => onShowToast('Página 2 cargada.', 'chevron_right')}
              className="px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-body-sm text-body-sm"
              type="button"
            >
              2
            </button>
            <button
              onClick={() => onShowToast('Página 3 cargada.', 'chevron_right')}
              className="px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-body-sm text-body-sm"
              type="button"
            >
              3
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
