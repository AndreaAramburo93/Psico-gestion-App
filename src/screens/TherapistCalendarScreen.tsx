import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { AppointmentEmailDraft, CalendarAppointment, ScreenRoute } from '../types';
import { SafeImage } from '../components/SafeImage';

interface TherapistCalendarScreenProps {
  appointments: CalendarAppointment[];
  onAddAppointment: (appt: CalendarAppointment) => void;
  onNavigate: (route: ScreenRoute) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onRequestEmailReminder: (draft: AppointmentEmailDraft) => void;
}

const DAYS = [
  { short: 'Lun', num: '21', isToday: false },
  { short: 'Mar', num: '22', isToday: true },
  { short: 'Mié', num: '23', isToday: false },
  { short: 'Jue', num: '24', isToday: false },
  { short: 'Vie', num: '25', isToday: false },
  { short: 'Sáb', num: '26', isToday: false },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const TherapistCalendarScreen: React.FC<TherapistCalendarScreenProps> = ({
  appointments,
  onAddAppointment,
  onNavigate,
  onShowToast,
  onRequestEmailReminder,
}) => {
  const [viewMode, setViewMode] = useState<'Semana' | 'Día' | 'Mes' | 'Lista de Pacientes'>('Semana');
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'confirmed' | 'pending' | 'virtual' | 'presencial'
  >('all');
  const [selectedMiniDay, setSelectedMiniDay] = useState(22);

  // Modal states for "+ Bloquear Horario" and "+ Nueva Cita Manual"
  const [modalMode, setModalMode] = useState<'none' | 'block' | 'new-appointment'>('none');
  const [formPatient, setFormPatient] = useState('');
  const [formPatientEmail, setFormPatientEmail] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('Sesión Individual TCC');
  const [formDayIndex, setFormDayIndex] = useState(2);
  const [formHour, setFormHour] = useState(11);
  const [formModality, setFormModality] = useState<'virtual' | 'presencial'>('virtual');

  const [selectedAppt, setSelectedAppt] = useState<CalendarAppointment | null>(null);
  const [showTemplatesDrawer, setShowTemplatesDrawer] = useState(false);

  const weekLabels = [
    'Semana del 14 al 20 de Octubre, 2024',
    'Semana del 21 al 27 de Octubre, 2024',
    'Semana del 28 de Oct al 3 de Nov, 2024',
  ];
  const currentWeekLabel =
    weekLabels[Math.max(0, Math.min(2, weekOffset + 1))] || weekLabels[1];

  const filteredAppointments = appointments.filter((appt) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'virtual') return appt.modality === 'virtual';
    if (activeFilter === 'presencial') return appt.modality === 'presencial';
    if (activeFilter === 'confirmed') return appt.statusLabel === 'Confirmada';
    if (activeFilter === 'pending') return appt.statusLabel === 'Recordatorio Enviado';
    return true;
  });

  const handleOpenSlotCreate = (dayIdx: number, hr: number) => {
    setFormDayIndex(dayIdx);
    setFormHour(hr);
    setFormPatient('');
    setFormSubtitle('Sesión Individual TCC');
    setModalMode('new-appointment');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hourStr = `${String(formHour).padStart(2, '0')}:00 - ${String(formHour + 1).padStart(2, '0')}:00`;
    if (modalMode === 'block') {
      const newBlock: CalendarAppointment = {
        id: `blk-${Date.now()}`,
        dayIndex: formDayIndex,
        hour: formHour,
        timeRange: hourStr,
        patientName: formPatient.trim() || 'Bloqueo Terapéutico',
        subtitle: 'Bloqueo Reservado',
        modality: 'bloqueo',
        locationOrPlatform: 'Sin agenda pública',
        statusLabel: 'Bloqueado',
        accent: 'neutral',
      };
      onAddAppointment(newBlock);
      onShowToast(`Horario bloqueado el ${DAYS[formDayIndex].short} ${DAYS[formDayIndex].num} (${hourStr}).`, 'lock_clock');
    } else {
      if (!formPatient.trim()) {
        onShowToast('Ingresa el nombre del paciente para agendar.', 'warning');
        return;
      }
      const newAppt: CalendarAppointment = {
        id: `cal-${Date.now()}`,
        dayIndex: formDayIndex,
        hour: formHour,
        timeRange: hourStr,
        patientName: formPatient.trim(),
        subtitle: formSubtitle,
        modality: formModality,
        locationOrPlatform: formModality === 'virtual' ? 'Google Meet' : 'Consultorio 302',
        statusLabel: 'Confirmada',
        accent: formModality === 'virtual' ? 'primary' : 'secondary',
      };
      onAddAppointment(newAppt);
      onShowToast(`Cita manual agendada con ${newAppt.patientName} (${hourStr}).`, 'event_available');
      onRequestEmailReminder({
        patientName: newAppt.patientName,
        specialistName: 'Dra. Sofía Mendoza',
        dateLabel: `${DAYS[formDayIndex].short} ${DAYS[formDayIndex].num} de Octubre, 2024`,
        timeLabel: hourStr,
        modalityLabel: formModality === 'virtual' ? 'Virtual (Google Meet)' : 'Presencial (Consultorio 302)',
        reason: formSubtitle,
        defaultEmail: formPatientEmail.trim() || undefined,
      });
      setFormPatientEmail('');
    }
    setModalMode('none');
  };

  const renderCardStyle = (appt: CalendarAppointment) => {
    if (appt.modality === 'bloqueo') {
      return 'bg-surface-container-highest/90 border-l-4 border-outline text-on-surface';
    }
    if (appt.accent === 'primary') {
      return 'bg-primary-fixed/40 hover:bg-primary-fixed/60 border-l-4 border-primary';
    }
    if (appt.accent === 'secondary') {
      return 'bg-secondary-fixed/50 hover:bg-secondary-fixed/80 border-l-4 border-secondary';
    }
    if (appt.accent === 'tertiary') {
      return 'bg-tertiary-fixed/40 hover:bg-tertiary-fixed/60 border-l-4 border-tertiary';
    }
    return 'bg-surface-container-high/70 hover:bg-surface-container-high border-l-4 border-outline';
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto px-gutter py-space-md">
      {/* Top Bar Control Clínico */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-md flex flex-col gap-space-md xl:gap-space-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          {/* View Selector & Date Range Navigator */}
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="inline-flex bg-surface-container-low p-1 rounded-xl flex-wrap">
              {(['Semana', 'Día', 'Mes', 'Lista de Pacientes'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setViewMode(tab)}
                  className={`px-space-md py-1.5 rounded-lg text-body-sm transition-all ${
                    viewMode === tab
                      ? 'font-body-bold bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Date jumper controls */}
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-xs py-1 rounded-xl">
              <button
                type="button"
                onClick={() => setWeekOffset((w) => Math.max(-1, w - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                title="Semana anterior"
              >
                <span className="material-symbols-outlined text-title-md">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setWeekOffset(0);
                  setSelectedMiniDay(22);
                  onShowToast('Centrado en el día actual: Mar 22 de Octubre.', 'today');
                }}
                className="px-space-sm py-1 rounded-lg text-body-sm font-body-bold bg-surface-container-lowest text-primary shadow-sm"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset((w) => Math.min(1, w + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                title="Semana siguiente"
              >
                <span className="material-symbols-outlined text-title-md">chevron_right</span>
              </button>
              <div className="flex items-center gap-space-xs pl-space-xs pr-space-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-title-md">
                  calendar_month
                </span>
                <span className="font-title-md text-title-md text-on-surface whitespace-nowrap">
                  {currentWeekLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              type="button"
              onClick={() => {
                setFormPatient('Supervisión Clínica / Descanso');
                setModalMode('block');
              }}
              className="inline-flex items-center gap-space-xs px-space-md h-12 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-dim transition-all text-body-sm font-body-bold"
            >
              <span className="material-symbols-outlined text-title-md text-tertiary">
                lock_clock
              </span>
              <span>+ Bloquear Horario</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormPatient('');
                setModalMode('new-appointment');
              }}
              className="inline-flex items-center gap-space-xs px-space-lg h-12 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-md transition-all text-body-sm font-body-bold"
            >
              <span className="material-symbols-outlined text-title-md">add_circle</span>
              <span>+ Nueva Cita Manual</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider mr-space-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-body-sm">filter_alt</span> Filtros:
          </span>
          <button
            type="button"
            onClick={() =>
              setActiveFilter(activeFilter === 'confirmed' ? 'all' : 'confirmed')
            }
            className={`inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full text-label-caps transition-all ${
              activeFilter === 'confirmed'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-primary hover:opacity-90'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'confirmed' ? 'bg-primary-fixed' : 'bg-primary'
              }`}
            />
            Confirmada (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')}
            className={`inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full text-label-caps transition-all ${
              activeFilter === 'pending'
                ? 'bg-tertiary text-on-tertiary shadow-sm'
                : 'bg-tertiary-fixed text-on-tertiary-fixed hover:opacity-90'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'pending' ? 'bg-tertiary-fixed' : 'bg-tertiary'
              }`}
            />
            Pendiente de Pago (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'virtual' ? 'all' : 'virtual')}
            className={`inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full text-label-caps transition-all ${
              activeFilter === 'virtual'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-secondary-container text-on-secondary-container hover:opacity-90'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">videocam</span>
            Virtual (14)
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveFilter(activeFilter === 'presencial' ? 'all' : 'presencial')
            }
            className={`inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full text-label-caps transition-all ${
              activeFilter === 'presencial'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">apartment</span>
            Presencial (10)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              setViewMode('Semana');
              onShowToast('Filtros restablecidos a vista semanal completa.', 'refresh');
            }}
            className="inline-flex items-center gap-1 text-label-sm font-label-sm text-outline hover:text-on-surface ml-auto transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span> Restablecer
          </button>
        </div>
      </div>

      {/* Main Layout: Grid Horaria (Left 8/9 cols) + Therapist Right Panel (Right 4/3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        <section className="lg:col-span-8 xl:col-span-9 bg-surface-container-lowest rounded-xl shadow-sm p-space-md overflow-hidden flex flex-col">
          {viewMode === 'Lista de Pacientes' ? (
            <div className="space-y-space-sm">
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
                <h3 className="font-title-lg text-on-surface">
                  Lista de Pacientes en Agenda ({filteredAppointments.length})
                </h3>
                <span className="text-label-sm text-on-surface-variant">
                  Orden cronológico de la semana
                </span>
              </div>
              {filteredAppointments.map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => setSelectedAppt(appt)}
                  className="p-space-md rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-primary">
                        {DAYS[appt.dayIndex]?.short} {DAYS[appt.dayIndex]?.num} • {appt.timeRange}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-container-lowest text-on-surface">
                        {appt.statusLabel}
                      </span>
                    </div>
                    <h4 className="font-title-md text-on-surface mt-1">{appt.patientName}</h4>
                    <p className="text-body-sm text-on-surface-variant">
                      {appt.subtitle} • {appt.locationOrPlatform}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('historia-clinica-y-evolucion');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary text-body-sm font-body-bold hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      Ver Expediente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'Día' ? (
            <div className="space-y-space-sm">
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
                <h3 className="font-title-lg text-on-surface">
                  Martes 22 de Octubre, 2024 • Vista Diaria Detallada
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-label-caps">
                  Hoy
                </span>
              </div>
              {HOURS.map((hr) => {
                const slotAppts = filteredAppointments.filter(
                  (a) => a.dayIndex === 1 && a.hour === hr
                );
                return (
                  <div
                    key={hr}
                    className="grid grid-cols-[70px_1fr] gap-space-sm items-stretch"
                  >
                    <div className="text-right pr-2 pt-2 text-label-sm text-outline tabular-nums">
                      {String(hr).padStart(2, '0')}:00
                    </div>
                    {hr === 13 ? (
                      <div className="rounded-xl bg-surface-container-highest/80 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-tertiary font-body-bold text-body-sm">
                          <span className="material-symbols-outlined text-[18px]">
                            self_improvement
                          </span>
                          <span>Almuerzo / Espacio Terapéutico (13:00 - 14:00)</span>
                        </div>
                        <span className="text-label-sm text-on-surface-variant">
                          Bloqueo Reservado
                        </span>
                      </div>
                    ) : slotAppts.length > 0 ? (
                      <div className="space-y-2">
                        {slotAppts.map((appt) => (
                          <div
                            key={appt.id}
                            onClick={() => setSelectedAppt(appt)}
                            className={`rounded-xl p-3 cursor-pointer transition-all ${renderCardStyle(
                              appt
                            )}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-body-bold text-on-surface">
                                {appt.patientName} — {appt.subtitle}
                              </span>
                              <span className="text-label-caps text-primary">{appt.timeRange}</span>
                            </div>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">
                              {appt.locationOrPlatform} • {appt.statusLabel}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenSlotCreate(1, hr)}
                        className="h-14 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-low text-left px-3 text-label-sm text-outline hover:text-primary transition-colors flex items-center justify-between"
                      >
                        <span>Espacio libre disponible</span>
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : viewMode === 'Mes' ? (
            <div className="space-y-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-on-surface">Octubre 2024 • Ocupación Mensual</h3>
                <span className="text-body-sm text-on-surface-variant">
                  34 sesiones completadas • 96% asistencia
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center font-label-caps text-outline">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isToday = day === 22;
                  const count = day % 7 === 0 ? 0 : (day % 4) + 1;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedMiniDay(day);
                        setViewMode('Semana');
                        onShowToast(`Viendo agenda del ${day} de Octubre.`, 'calendar_today');
                      }}
                      className={`p-2.5 rounded-xl text-left transition-all min-h-[76px] flex flex-col justify-between ${
                        isToday
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'bg-surface-container-low/60 hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span className="font-body-bold text-body-sm">{day}</span>
                      {count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold w-fit ${
                            isToday
                              ? 'bg-on-primary text-primary'
                              : 'bg-primary-fixed text-primary'
                          }`}
                        >
                          {count} citas
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Default Week Matrix */
            <>
              <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-space-xs mb-space-xs pb-space-sm bg-surface-container-lowest">
                <div className="text-right pr-space-xs font-label-sm text-label-sm text-outline flex items-end justify-end pb-1">
                  GMT-5
                </div>
                {DAYS.map((d) => (
                  <div
                    key={d.num}
                    className={`rounded-xl p-space-xs text-center ${
                      d.isToday ? 'bg-primary-fixed shadow-xs' : 'bg-surface-container-low'
                    }`}
                  >
                    <span
                      className={`block font-label-caps uppercase ${
                        d.isToday ? 'text-on-primary-fixed-variant' : 'text-on-surface-variant'
                      }`}
                    >
                      {d.short}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-body-bold ${
                        d.isToday
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface'
                      }`}
                    >
                      {d.num}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="relative grid grid-cols-[60px_repeat(6,1fr)] gap-x-space-xs divide-y divide-surface-variant">
                    {HOURS.map((hr) => (
                      <React.Fragment key={hr}>
                        <div
                          className={`h-20 text-right pr-space-xs font-label-sm pt-1 tabular-nums ${
                            hr === 13 ? 'text-tertiary font-semibold' : 'text-outline'
                          }`}
                        >
                          {String(hr).padStart(2, '0')}:00
                        </div>

                        {DAYS.map((d, dayIdx) => {
                          if (hr === 13) {
                            return dayIdx === 1 ? (
                              <div key={`${hr}-${dayIdx}`} className="h-20 p-1">
                                <div className="h-full bg-surface-container-highest/90 rounded-lg p-2 flex flex-col justify-center items-center text-center shadow-xs relative overflow-hidden">
                                  <div className="flex items-center gap-1 text-tertiary font-body-bold text-[11px] leading-tight">
                                    <span className="material-symbols-outlined text-[15px]">
                                      self_improvement
                                    </span>
                                    <span>Almuerzo / Espacio Terapéutico</span>
                                  </div>
                                  <span className="text-[10px] text-on-surface-variant mt-0.5">
                                    13:00 - 14:00 (Bloqueo)
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={`${hr}-${dayIdx}`}
                                className="h-20 bg-surface-dim/40 rounded-lg p-1"
                              >
                                <div className="h-full bg-surface-container-highest/60 rounded-lg flex items-center justify-center text-center p-1">
                                  <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">
                                      restaurant
                                    </span>
                                    Pausa
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          const cellAppts = filteredAppointments.filter(
                            (a) => a.dayIndex === dayIdx && a.hour === hr
                          );

                          if (cellAppts.length === 0) {
                            return (
                              <button
                                key={`${hr}-${dayIdx}`}
                                type="button"
                                onClick={() => handleOpenSlotCreate(dayIdx, hr)}
                                title={`Agendar en ${d.short} ${d.num} a las ${String(hr).padStart(2, '0')}:00`}
                                className="h-20 bg-surface-container-low/40 rounded-lg hover:bg-surface-container-low transition-colors relative cursor-pointer group"
                              >
                                <span className="material-symbols-outlined text-[16px] text-primary opacity-0 group-hover:opacity-100 absolute top-2 right-2 transition-opacity">
                                  add
                                </span>
                              </button>
                            );
                          }

                          const appt = cellAppts[0];
                          return (
                            <div
                              key={`${hr}-${dayIdx}`}
                              className={`h-20 p-1 ${
                                appt.halfOffset ? 'flex flex-col justify-end' : ''
                              }`}
                            >
                              <div
                                onClick={() => setSelectedAppt(appt)}
                                className={`${
                                  appt.halfOffset ? 'h-[82%]' : 'h-full'
                                } rounded-lg p-2 flex flex-col justify-between shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 overflow-hidden ${renderCardStyle(
                                  appt
                                )}`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] font-bold text-primary tracking-tight truncate">
                                      {appt.timeRange}
                                    </span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface truncate">
                                      {appt.statusLabel}
                                    </span>
                                  </div>
                                  <h4 className="text-[12px] leading-tight text-on-surface font-semibold truncate mt-0.5">
                                    {appt.patientName}
                                  </h4>
                                  <p className="text-[10px] text-on-surface-variant truncate">
                                    {appt.subtitle}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between gap-1 text-[10px] text-secondary truncate">
                                  <span className="inline-flex items-center gap-0.5 truncate">
                                    <span className="material-symbols-outlined text-[12px]">
                                      {appt.modality === 'presencial'
                                        ? 'apartment'
                                        : appt.modality === 'bloqueo'
                                        ? 'lock'
                                        : 'videocam'}
                                    </span>
                                    {appt.locationOrPlatform}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Matrix bottom legend */}
          <div className="mt-space-md pt-space-sm border-t border-surface-variant flex flex-wrap items-center justify-between gap-space-sm text-label-sm text-on-surface-variant">
            <div className="flex flex-wrap items-center gap-space-md">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-primary" /> Cita Virtual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-secondary" /> Presencial (Sede Centro)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-surface-dim" /> Bloqueo Terapéutico /
                Almuerzo
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onShowToast('Sincronización bidireccional con Google Calendar & iCal al día.', 'sync')
              }
              className="flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
              <span>Sincronizado con Google Calendar &amp; iCal</span>
            </button>
          </div>
        </section>

        {/* Panel Lateral Derecho del Psicólogo */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-md">
          {/* Next Patient Alert Card (Countdown in 15 mins) */}
          <div className="bg-primary text-on-primary rounded-xl p-space-md shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-primary-container rounded-full opacity-40 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-space-xs">
              <div className="inline-flex items-center gap-1.5 bg-primary-container px-2 py-0.5 rounded-full text-label-caps text-on-primary-container">
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                En 15 minutos
              </div>
              <span className="text-label-sm text-on-primary/80">09:00 AM</span>
            </div>

            <div className="flex items-center gap-space-sm mt-space-sm">
              <SafeImage
                src={IMAGES.camilaCalendar}
                alt="Camila Morales"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-fixed shadow-sm shrink-0"
                fallbackText="CM"
              />
              <div className="min-w-0">
                <h3 className="font-title-md text-title-md text-on-primary font-semibold leading-tight truncate">
                  Camila Morales
                </h3>
                <p className="text-body-sm text-on-primary-container">
                  Sesión 4 • TCC Ansiedad
                </p>
              </div>
            </div>

            <div className="mt-space-md flex flex-col gap-space-xs">
              <button
                type="button"
                onClick={() => onNavigate('historia-clinica-y-evolucion')}
                className="w-full h-10 rounded-xl bg-on-primary text-primary font-body-bold text-body-sm flex items-center justify-center gap-space-xs hover:bg-surface-container transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-title-md">clinical_notes</span>
                <span>Ficha Clínica / Anamnesis</span>
              </button>
              <div className="grid grid-cols-2 gap-space-xs">
                <button
                  type="button"
                  onClick={() =>
                    onShowToast('Sala segura Meet #CM-04 iniciada con cifrado E2E.', 'videocam')
                  }
                  className="h-9 rounded-lg bg-primary-container/70 hover:bg-primary-container text-on-primary text-label-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">videocam</span> Unirse a
                  Meet
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('historia-clinica-y-evolucion')}
                  className="h-9 rounded-lg bg-primary-container/70 hover:bg-primary-container text-on-primary text-label-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">history_edu</span>{' '}
                  Últimas Notas
                </button>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm border-t border-primary-container/80 text-[12px] text-on-primary/90">
              <div className="flex items-center justify-between text-on-primary-container text-[11px] mb-1">
                <span className="font-semibold uppercase tracking-wider">
                  Nota Sesión 3 (15 Oct):
                </span>
                <span>Revisada</span>
              </div>
              <p className="text-body-sm text-on-primary/80 line-clamp-2 leading-relaxed">
                &quot;Trabajo de reestructuración cognitiva ante pensamientos catastrofistas en el
                entorno laboral. Tarea: autorregistro de emociones...&quot;
              </p>
            </div>
          </div>

          {/* Mini Calendario Mensual */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                Octubre 2024
              </h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setWeekOffset((w) => Math.max(-1, w - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors"
                  title="Mes anterior"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeekOffset((w) => Math.min(1, w + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors"
                  title="Mes siguiente"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-label-caps text-outline mb-1">
              <span>D</span>
              <span>L</span>
              <span>M</span>
              <span>M</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-body-sm text-on-surface">
              <span className="py-1 text-outline/50">29</span>
              <span className="py-1 text-outline/50">30</span>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedMiniDay(day)}
                  className={`py-1 rounded-lg transition-colors ${
                    selectedMiniDay === day
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : day === 23
                      ? 'bg-primary-fixed text-primary font-semibold'
                      : 'hover:bg-surface-container-low'
                  }`}
                >
                  {day}
                </button>
              ))}
              <span className="py-1 text-outline/50">1</span>
              <span className="py-1 text-outline/50">2</span>
            </div>
          </div>

          {/* Métricas Clave del Mes */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                Métricas del Mes
              </h3>
              <span className="font-label-caps text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                Octubre
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="bg-surface-container-low p-space-sm rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                    <span className="material-symbols-outlined text-title-lg">check_circle</span>
                  </div>
                  <div>
                    <span className="block font-headline-md text-headline-md leading-none text-on-surface font-bold tabular-nums">
                      {30 + appointments.length}
                    </span>
                    <span className="text-label-sm text-on-surface-variant">Citas Realizadas</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center text-[12px] font-semibold text-primary">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
                  </span>
                  <span className="block text-[10px] text-outline">vs. Sept</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-variant"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-primary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="96, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <span className="absolute text-[9px] font-bold text-primary">96%</span>
                  </div>
                  <div>
                    <span className="block font-headline-md text-headline-md leading-none text-on-surface font-bold tabular-nums">
                      96%
                    </span>
                    <span className="text-label-sm text-on-surface-variant">
                      Tasa de Asistencia
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-body-bold rounded-full bg-primary-fixed text-on-primary-fixed">
                  Óptimo
                </span>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-xs">
                    <span className="material-symbols-outlined text-title-lg">payments</span>
                  </div>
                  <div>
                    <span className="block font-headline-md text-headline-md leading-none text-on-surface font-bold tabular-nums">
                      $2,040
                    </span>
                    <span className="text-label-sm text-on-surface-variant">USD Generados</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-body-bold text-tertiary">3 pendientes</span>
                  <span className="block text-[10px] text-outline">$180 por cobrar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plantillas Clínicas */}
          <div className="bg-surface-container-low/70 rounded-xl p-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-title-lg">
                auto_stories
              </span>
              <div>
                <h4 className="font-body-bold text-body-sm text-on-surface">Plantillas Clínicas</h4>
                <p className="text-label-sm text-on-surface-variant">Formato CIE-11 &amp; DSM-5</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTemplatesDrawer(true)}
              className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all shadow-xs"
              title="Abrir plantillas"
            >
              <span className="material-symbols-outlined text-body-base">chevron_right</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Modal: Nueva Cita Manual o Bloqueo */}
      {modalMode !== 'none' && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl space-y-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-on-surface">
                {modalMode === 'block' ? 'Bloquear Franja Horaria' : 'Nueva Cita Manual'}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode('none')}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-space-md">
              <div>
                <label className="text-label-caps text-on-surface-variant block mb-1">
                  {modalMode === 'block' ? 'Motivo del Bloqueo' : 'Nombre del Paciente'}
                </label>
                <input
                  value={formPatient}
                  onChange={(e) => setFormPatient(e.target.value)}
                  placeholder={
                    modalMode === 'block'
                      ? 'Ej. Supervisión de Casos / Almuerzo'
                      : 'Ej. Valentina Rivas'
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {modalMode === 'new-appointment' && (
                <>
                  <div>
                    <label className="text-label-caps text-on-surface-variant block mb-1">
                      Correo del Paciente (para recordatorio Gmail)
                    </label>
                    <input
                      type="email"
                      value={formPatientEmail}
                      onChange={(e) => setFormPatientEmail(e.target.value)}
                      placeholder="paciente@ejemplo.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-label-caps text-on-surface-variant block mb-1">
                      Enfoque / Motivo de Sesión
                    </label>
                    <input
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-1">Día</label>
                  <select
                    value={formDayIndex}
                    onChange={(e) => setFormDayIndex(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none"
                  >
                    {DAYS.map((d, idx) => (
                      <option key={d.num} value={idx}>
                        {d.short} {d.num} Oct
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-1">Hora</label>
                  <select
                    value={formHour}
                    onChange={(e) => setFormHour(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none"
                  >
                    {HOURS.filter((h) => h !== 13).map((hr) => (
                      <option key={hr} value={hr}>
                        {String(hr).padStart(2, '0')}:00 - {String(hr + 1).padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {modalMode === 'new-appointment' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormModality('virtual')}
                    className={`py-2.5 rounded-xl text-body-sm font-body-bold flex items-center justify-center gap-1.5 ${
                      formModality === 'virtual'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">videocam</span> Virtual
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormModality('presencial')}
                    className={`py-2.5 rounded-xl text-body-sm font-body-bold flex items-center justify-center gap-1.5 ${
                      formModality === 'presencial'
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">apartment</span>{' '}
                    Presencial
                  </button>
                </div>
              )}

              <div className="flex items-center justify-end gap-space-sm pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode('none')}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-body-sm font-body-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-body-sm font-body-bold hover:bg-primary-container"
                >
                  {modalMode === 'block' ? 'Confirmar Bloqueo' : 'Agendar Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detalle de Cita Seleccionada */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl space-y-space-md">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-label-caps">
                {selectedAppt.statusLabel}
              </span>
              <button
                type="button"
                onClick={() => setSelectedAppt(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div>
              <h3 className="font-headline-md text-on-surface">{selectedAppt.patientName}</h3>
              <p className="text-body-sm text-on-surface-variant mt-1">{selectedAppt.subtitle}</p>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-xl space-y-1 text-body-sm">
              <p>
                <strong>Horario:</strong> {DAYS[selectedAppt.dayIndex]?.short}{' '}
                {DAYS[selectedAppt.dayIndex]?.num} Oct • {selectedAppt.timeRange}
              </p>
              <p>
                <strong>Ubicación:</strong> {selectedAppt.locationOrPlatform}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAppt(null);
                  onNavigate('historia-clinica-y-evolucion');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-body-sm font-body-bold"
              >
                Abrir Historia Clínica
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAppt(null);
                  onNavigate('gestion-y-reprogramacion-de-citas');
                }}
                className="py-2.5 px-4 rounded-xl bg-surface-container text-on-surface text-body-sm font-body-bold"
              >
                Gestionar Turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Plantillas Clínicas CIE-11 / DSM-5 */}
      {showTemplatesDrawer && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl space-y-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-on-surface">
                Plantillas Clínicas (CIE-11 &amp; DSM-5)
              </h3>
              <button
                type="button"
                onClick={() => setShowTemplatesDrawer(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-2">
              {[
                {
                  title: 'Nota de Evolución SOAP (TCC)',
                  desc: 'Estructura Subjetivo / Objetivo / Análisis / Plan con firma SHA-256.',
                },
                {
                  title: 'Tamizaje Ansiedad GAD-7 & PHQ-9',
                  desc: 'Escalas psicométricas estandarizadas con cálculo automático de severidad.',
                },
                {
                  title: 'Consentimiento Informado Telepsicología',
                  desc: 'Documento normativo Ley 1090 para sesiones encriptadas.',
                },
              ].map((tpl) => (
                <div
                  key={tpl.title}
                  className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-body-bold text-body-sm text-on-surface">{tpl.title}</p>
                    <p className="text-label-sm text-on-surface-variant">{tpl.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplatesDrawer(false);
                      onNavigate('historia-clinica-y-evolucion');
                      onShowToast(`Plantilla "${tpl.title}" cargada en el expediente.`, 'auto_stories');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-label-sm font-bold shrink-0"
                  >
                    Usar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
