import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { ScreenRoute } from '../types';
import { SafeImage } from '../components/SafeImage';

interface AppointmentManagementScreenProps {
  onShowToast: (msg: string, icon?: string) => void;
  onNavigate: (route: ScreenRoute) => void;
}

const RESCHEDULE_DATES = [
  { tag: 'Mañana', label: 'Vie, 25 Oct', full: 'Viernes 25 Oct', slots: '2 horarios' },
  { tag: 'Recomendado', label: 'Lun, 28 Oct', full: 'Lunes 28 Oct', slots: '5 horarios' },
  { tag: 'Próxima sem.', label: 'Mar, 29 Oct', full: 'Martes 29 Oct', slots: '4 horarios' },
  { tag: 'Próxima sem.', label: 'Mié, 30 Oct', full: 'Miércoles 30 Oct', slots: '3 horarios' },
];

const RESCHEDULE_SLOTS = ['09:00 - 09:50', '11:00 - 11:50', '15:00 - 15:50', '17:30 - 18:20'];

const RATING_CAPTIONS: Record<number, string> = {
  1: '1 de 5 - Experiencia Deficiente',
  2: '2 de 5 - Experiencia Regular',
  3: '3 de 5 - Buena Sesión',
  4: '4 de 5 - Muy Satisfactoria',
  5: '5 de 5 - Experiencia Transformadora y Segura',
};

export const AppointmentManagementScreen: React.FC<AppointmentManagementScreenProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const [workflowTab, setWorkflowTab] = useState<'schedule' | 'feedback'>('schedule');
  const [status, setStatus] = useState('confirmada');
  const [selectedDay, setSelectedDay] = useState('Lunes 28 Oct');
  const [selectedSlot, setSelectedSlot] = useState('15:00 - 15:50');
  const [reason, setReason] = useState('laboral');
  const [showCancelDrawer, setShowCancelDrawer] = useState(false);
  const [cancelNotes, setCancelNotes] = useState('');

  // Review state
  const [stars, setStars] = useState(5);
  const [dimEmpathy, setDimEmpathy] = useState(5);
  const [dimClarity, setDimClarity] = useState(5);
  const [dimPunctuality, setDimPunctuality] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const [dynamicLog, setDynamicLog] = useState({
    title: 'Estado: Confirmada',
    time: 'Hoy • Hace 2 horas',
    desc: 'Verificación de disponibilidad de sala virtual completada.',
  });

  const statusLabels: Record<string, string> = {
    confirmada: 'Confirmada (Programada)',
    asistida: 'Completada / Asistida',
    en_curso: 'En Curso',
    ausente: 'No asistió (Ausencia)',
    cancelada: 'Cancelada por el Paciente',
    reprogramada: 'Reprogramada',
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === 'asistida') {
      setWorkflowTab('feedback');
      onShowToast(
        'Sesión marcada como asistida. Puedes registrar la valoración terapéutica.',
        'rate_review'
      );
    } else {
      onShowToast(`Estado actualizado: ${statusLabels[newStatus]}`, 'sync');
    }
    setDynamicLog({
      title: `Estado: ${statusLabels[newStatus]}`,
      time: 'Ahora mismo',
      desc: 'Modificado manualmente desde el gestor de cita.',
    });
  };

  const handleConfirmReschedule = () => {
    setStatus('reprogramada');
    setDynamicLog({
      title: 'Estado: Reprogramada',
      time: 'Ahora mismo',
      desc: `Reasignada para ${selectedDay} a las ${selectedSlot} (${reason}).`,
    });
    onShowToast('Sesión reprogramada con éxito. Mensaje enviado a la terapeuta.', 'event_available');
  };

  const handleConfirmCancel = () => {
    setShowCancelDrawer(false);
    setStatus('cancelada');
    setDynamicLog({
      title: 'Estado: Cancelada por el Paciente',
      time: 'Ahora mismo',
      desc: cancelNotes ? `Motivo: ${cancelNotes}` : 'Cupo liberado en agenda comunitaria.',
    });
    onShowToast('La cita ha sido cancelada y el cupo liberado.', 'cancel');
  };

  const handleSubmitReview = () => {
    const authorNotice = isAnonymous
      ? 'como testimonio anónimo (iniciales)'
      : 'con tu nombre clínico verificado';
    onShowToast(
      `Reseña enviada con éxito (${authorNotice}). ¡Gracias por tus aportes!`,
      'sentiment_very_satisfied'
    );
    setReviewText('');
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto px-gutter py-space-lg flex flex-col gap-space-xl">
      {/* Contextual Breadcrumb & Live Notice */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
          <button
            type="button"
            onClick={() => onNavigate('agenda-y-calendario-terapeutico')}
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-body-sm">arrow_back</span> Agenda Clínica
          </button>
          <span>/</span>
          <span className="text-on-surface font-body-bold">
            Sesión #14: Dra. Marcela Restrepo
          </span>
          <span className="bg-surface-container-high px-space-xs py-0.5 rounded-full text-primary font-label-caps">
            ID-7829-MR
          </span>
        </div>
        <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full text-primary">
          <span className="material-symbols-outlined text-body-base animate-pulse">spa</span>
          <span className="font-label-caps text-label-caps tracking-wider uppercase">
            Espacio Seguro &amp; Confidencial
          </span>
        </div>
      </div>

      {/* Active Session Hero Banner */}
      <div className="relative bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary-fixed/20 to-transparent pointer-events-none blur-3xl" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md z-10">
          <div className="relative shrink-0">
            <SafeImage
              src={IMAGES.marcelaSession14}
              alt="Dra. Marcela Restrepo"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm"
              fallbackText="MR"
            />
            <span className="absolute -bottom-1 -right-1 bg-surface-container-lowest p-1 rounded-full shadow-sm flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary text-body-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap mb-1">
              <span className="bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps px-space-xs py-0.5 rounded-md">
                Psicoterapia Cognitivo-Conductual
              </span>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps px-space-xs py-0.5 rounded-md">
                Modalidad Virtual Encriptada
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Sesión Terapéutica #14
            </h1>
            <div className="flex items-center gap-space-md text-on-surface-variant font-body-base text-body-base mt-1 flex-wrap">
              <span className="flex items-center gap-1 font-body-bold text-on-surface">
                <span className="material-symbols-outlined text-primary text-title-lg">
                  calendar_today
                </span>{' '}
                Jueves, 24 de Octubre
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-outline text-title-lg">
                  schedule
                </span>{' '}
                16:00 - 16:50 (50 min)
              </span>
              <span className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-title-lg">videocam</span> Sala de
                Teleconsulta 03
              </span>
            </div>
          </div>
        </div>

        {/* Live Status Switcher (CU-13) */}
        <div className="w-full lg:w-auto flex flex-col gap-space-xs z-10 bg-surface-container-low p-space-md rounded-xl">
          <div className="flex items-center justify-between gap-space-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Estado Operativo (CU-13)
            </span>
            <span className="text-label-sm font-label-sm text-outline">Actualizable</span>
          </div>
          <div className="relative inline-block w-full">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none w-full bg-surface-container-lowest text-on-surface font-body-bold text-body-base py-space-sm pl-space-md pr-10 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="confirmada">● Confirmada (Programada)</option>
              <option value="asistida">✓ Completada / Asistida</option>
              <option value="en_curso">▶ En Curso (En sesión)</option>
              <option value="ausente">✕ No asistió (Ausencia)</option>
              <option value="cancelada">⊘ Cancelada por el Paciente</option>
              <option value="reprogramada">↺ Reprogramada a nueva fecha</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-title-lg">
              expand_more
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-label-sm font-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-body-sm">shield</span>
            Sincronizado con expediente y recordatorio WhatsApp
          </div>
        </div>
      </div>

      {/* Main Dynamic Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-space-sm p-1 bg-surface-container-low rounded-xl">
            <button
              type="button"
              onClick={() => setWorkflowTab('schedule')}
              className={`flex-1 py-space-sm px-space-md rounded-lg font-title-md text-title-md flex items-center justify-center gap-space-xs transition-all ${
                workflowTab === 'schedule'
                  ? 'text-primary bg-surface-container-lowest shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-title-lg">edit_calendar</span>
              Reprogramar o Cancelar (CU-04 / CU-05)
            </button>
            <button
              type="button"
              onClick={() => setWorkflowTab('feedback')}
              className={`flex-1 py-space-sm px-space-md rounded-lg font-title-md text-title-md flex items-center justify-center gap-space-xs transition-all ${
                workflowTab === 'feedback'
                  ? 'text-primary bg-surface-container-lowest shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-title-lg">rate_review</span>
              Evaluación Terapéutica (CU-09)
            </button>
          </div>

          {workflowTab === 'schedule' ? (
            <div className="flex flex-col gap-space-xl">
              {/* Reprogramar Cita Card (CU-05) */}
              <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-xl shadow-md flex flex-col gap-space-lg relative overflow-hidden">
                <div className="flex items-start justify-between gap-space-md">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary tracking-wider uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-body-base">update</span> CU-05
                      • Flexibilidad Consciente
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
                      Reprogramar Nueva Fecha de Sesión
                    </h2>
                    <p className="font-body-base text-body-base text-on-surface-variant mt-1">
                      Tienes disponible la reprogramación sin recargo ni penalización gracias a que restan{' '}
                      <strong className="text-primary font-body-bold">48 horas</strong> para tu sesión.
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end bg-surface-container-low px-space-md py-space-xs rounded-xl">
                    <span className="text-label-sm font-label-sm text-outline">Política de Aviso</span>
                    <span className="font-body-bold text-body-sm text-primary">
                      Mayor a 24 horas
                    </span>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="flex flex-col gap-space-md">
                  <label className="font-title-md text-title-md text-on-surface">
                    1. Selecciona un nuevo día disponible
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                    {RESCHEDULE_DATES.map((d) => {
                      const active = selectedDay === d.full;
                      return (
                        <button
                          key={d.full}
                          type="button"
                          onClick={() => setSelectedDay(d.full)}
                          className={`p-space-sm rounded-xl text-left transition-all flex flex-col ${
                            active
                              ? 'bg-primary-container text-on-primary shadow-sm'
                              : 'bg-surface-container-low hover:bg-surface-container'
                          }`}
                        >
                          <span
                            className={`font-label-sm text-label-sm ${
                              active ? 'text-on-primary-container' : 'text-on-surface-variant'
                            }`}
                          >
                            {d.tag}
                          </span>
                          <span
                            className={`font-title-md text-title-md ${
                              active ? 'text-white' : 'text-on-surface'
                            }`}
                          >
                            {d.label}
                          </span>
                          <span
                            className={`text-label-sm mt-1 ${
                              active ? 'text-on-primary-container' : 'text-outline'
                            }`}
                          >
                            {d.slots}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hour Selector */}
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="font-title-md text-title-md text-on-surface">
                      2. Horarios disponibles para{' '}
                      <span className="text-primary font-body-bold">{selectedDay}</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary" /> Zona horaria: Bogotá /
                      Lima (-05:00)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                    {RESCHEDULE_SLOTS.map((slot) => {
                      const active = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-space-sm px-space-md rounded-xl font-body-bold text-body-sm transition-colors text-center tabular-nums ${
                            active
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reason Selector */}
                <div className="flex flex-col gap-space-xs">
                  <label
                    className="font-title-md text-title-md text-on-surface"
                    htmlFor="reschedule-reason"
                  >
                    3. Motivo del cambio de horario
                  </label>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Permite a tu terapeuta contextualizar la continuidad de tu proceso.
                  </p>
                  <div className="relative mt-1">
                    <select
                      id="reschedule-reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="appearance-none w-full bg-surface-container-low text-on-surface font-body-base text-body-base p-space-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="laboral">Compromiso laboral o académico imprevisto</option>
                      <option value="medico">Causa de salud o consulta médica</option>
                      <option value="fuerza_mayor">Situación personal o de fuerza mayor</option>
                      <option value="otro">Otro motivo (especificado al terapeuta)</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                      unfold_more
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm">
                  <div className="flex items-center gap-space-xs text-on-surface-variant text-label-sm font-label-sm">
                    <span className="material-symbols-outlined text-primary text-body-base">
                      send_and_archive
                    </span>
                    Se enviará confirmación automática vía WhatsApp y Correo
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmReschedule}
                    className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md px-space-xl py-space-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-space-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-title-lg">
                      event_available
                    </span>
                    Confirmar Nuevo Horario
                  </button>
                </div>
              </div>

              {/* Cancellation Module (CU-04) */}
              <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-xl shadow-sm flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-title-lg">event_busy</span>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps text-error tracking-wider uppercase">
                        CU-04 • Cancelación Consciente
                      </span>
                      <h3 className="font-title-lg text-title-lg text-on-surface">
                        Cancelar esta Consulta
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCancelDrawer((v) => !v)}
                    className="text-error font-body-bold text-body-sm hover:underline flex items-center gap-1"
                  >
                    <span>{showCancelDrawer ? 'Ocultar opciones' : 'Ver opciones de baja'}</span>
                    <span className="material-symbols-outlined text-body-base">
                      {showCancelDrawer ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>
                <p className="font-body-base text-body-base text-on-surface-variant">
                  Comprendemos que a veces surgen circunstancias imprevistas. Si decides cancelar, el espacio será liberado de inmediato en la agenda comunitaria para pacientes en lista de espera prioritaria.
                </p>

                {showCancelDrawer && (
                  <div className="flex flex-col gap-space-md pt-space-sm">
                    <div className="bg-error-container/40 p-space-md rounded-xl text-on-surface flex flex-col gap-space-xs">
                      <div className="flex items-center gap-space-xs font-body-bold text-body-sm text-error">
                        <span className="material-symbols-outlined text-title-lg">info</span>
                        Política de reembolso y saldo a favor
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Al cancelar con más de 24 horas de antelación, el 100% del valor de la sesión ($140.000 COP) se acreditará en tu monedero de paciente o regresará al método de pago original en 3 a 5 días hábiles.
                      </p>
                    </div>
                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-title-md text-title-md text-on-surface"
                        htmlFor="cancel-feedback-text"
                      >
                        Mensaje para la Dra. Marcela (Opcional):
                      </label>
                      <textarea
                        id="cancel-feedback-text"
                        value={cancelNotes}
                        onChange={(e) => setCancelNotes(e.target.value)}
                        className="w-full bg-surface-container-low p-space-sm rounded-xl font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-error transition-all"
                        placeholder="Si deseas compartir la razón, esto ayuda a brindar contención terapéutica..."
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-space-md">
                      <button
                        type="button"
                        onClick={() => setShowCancelDrawer(false)}
                        className="px-space-md py-space-sm rounded-xl font-body-bold text-body-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                      >
                        Mantener Cita
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmCancel}
                        className="bg-error hover:bg-error/90 text-on-error px-space-lg py-space-sm rounded-xl font-body-bold text-body-sm shadow-sm transition-all flex items-center gap-space-xs"
                      >
                        <span className="material-symbols-outlined text-body-base">cancel</span>
                        Confirmar Cancelación Definitiva
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* SECTION 2: Evaluation & Therapeutic Review Flow (CU-09) */
            <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-xl shadow-md flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-primary tracking-wider uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-body-base">favorite</span> CU-09
                    • Evaluación Terapéutica
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
                    Valoración de tu Consulta
                  </h2>
                  <p className="font-body-base text-body-base text-on-surface-variant mt-1">
                    Tu retroalimentación fortalece el vínculo terapéutico y orienta a otros pacientes en su camino hacia el bienestar mental.
                  </p>
                </div>
                <div className="bg-surface-container-low px-space-md py-space-sm rounded-2xl flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md text-primary font-semibold tabular-nums">
                    {stars.toFixed(1)}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface uppercase">
                      Puntaje Global
                    </span>
                    <span className="text-label-sm font-label-sm text-outline">
                      Excelente sesión
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-space-lg bg-surface-container-low rounded-2xl gap-space-xs text-center">
                <span className="font-title-md text-title-md text-on-surface">
                  ¿Cómo calificarías tu experiencia general en esta sesión?
                </span>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStars(num)}
                      className={`hover:scale-125 transition-transform ${
                        num <= stars ? 'text-tertiary-container' : 'text-surface-variant'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-headline-lg"
                        style={{
                          fontVariationSettings: num <= stars ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
                <span className="font-label-sm text-label-sm text-primary font-body-bold mt-1">
                  {RATING_CAPTIONS[stars]}
                </span>
              </div>

              {/* Dimensions */}
              <div className="flex flex-col gap-space-md">
                <span className="font-title-md text-title-md text-on-surface">
                  Dimensiones Clínicas de Acompañamiento
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {[
                    { label: 'Empatía y Calidez Humana', icon: 'favorite', value: dimEmpathy, setter: setDimEmpathy },
                    { label: 'Claridad en Herramientas', icon: 'psychology', value: dimClarity, setter: setDimClarity },
                    { label: 'Puntualidad y Entorno Seguro', icon: 'lock', value: dimPunctuality, setter: setDimPunctuality },
                  ].map((dim) => (
                    <div
                      key={dim.label}
                      className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm"
                    >
                      <div className="flex items-center gap-space-xs text-primary">
                        <span className="material-symbols-outlined text-title-lg">{dim.icon}</span>
                        <span className="font-body-bold text-body-sm text-on-surface">
                          {dim.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 pt-2">
                        {[3, 4, 5].map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => dim.setter(score)}
                            className={`w-8 h-8 rounded-lg font-body-bold text-body-sm transition-colors ${
                              dim.value === score
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-surface-container-lowest hover:bg-primary hover:text-white'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-title-md text-title-md text-on-surface" htmlFor="review-content">
                  Testimonio o comentario de la sesión
                </label>
                <textarea
                  id="review-content"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-surface-container-low p-space-md rounded-xl font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Comparte cómo te ayudó esta sesión en tu bienestar emocional..."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between p-space-md bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-title-lg">
                    visibility_off
                  </span>
                  <div className="flex flex-col">
                    <span className="font-body-bold text-body-sm text-on-surface">
                      Publicar como Anónimo
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Solo se mostrarán tus iniciales (ej. C. M.) para preservar tu privacidad clínica integral.
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-end gap-space-md pt-space-xs">
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md px-space-xl py-space-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-space-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-title-lg">send</span>
                  Publicar Reseña y Enviar Agradecimiento
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Audit Log & Teleconsult Launch */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Conexión Segura
              </span>
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" /> Sala Lista
              </span>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-primary text-headline-md">
                video_camera_front
              </span>
              <div className="flex flex-col">
                <span className="font-body-bold text-body-sm text-on-surface">
                  Google Meet Clínico Encriptado
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  meet.psicogestion.com/sesion-14
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onShowToast('Conectando a sala encriptada Google Meet Clínico...', 'video_camera_front')
              }
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md py-space-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-title-lg">meeting_room</span> Entrar a
              la Sesión
            </button>
            <div className="flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant pt-space-xs">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-body-sm">timer</span> Recordatorio a
                15 min
              </span>
              <button
                type="button"
                onClick={() =>
                  onShowToast('Micrófono y cámara verificados con éxito.', 'mic')
                }
                className="text-primary hover:underline"
              >
                Comprobar Audio/Cámara
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-title-lg">
                  history_edu
                </span>
                Historial y Auditoría
              </h3>
              <span className="font-label-sm text-label-sm bg-surface-container px-space-xs py-0.5 rounded text-primary">
                4 eventos
              </span>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Trazabilidad oficial de modificaciones de la cita médica.
            </p>

            <div className="relative flex flex-col gap-space-md pl-space-md before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-variant">
              <div className="relative flex flex-col gap-0.5">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-surface-container-lowest" />
                <span className="font-label-caps text-label-caps text-on-surface">
                  Agendamiento Inicial
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  12 Oct 2024 • 10:14 AM
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Agendada por paciente desde Directorio Especializado.
                </span>
              </div>

              <div className="relative flex flex-col gap-0.5">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest" />
                <div className="flex items-center gap-1">
                  <span className="font-label-caps text-label-caps text-on-surface">
                    Recordatorio WhatsApp (CU-17)
                  </span>
                  <span className="material-symbols-outlined text-body-sm text-primary">
                    check_circle
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  22 Oct 2024 • 09:00 AM
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Enviado exitosamente al +57 310 ****892. Paciente confirmó lectura.
                </span>
              </div>

              <div className="relative flex flex-col gap-0.5">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-surface-tint ring-4 ring-surface-container-lowest" />
                <span className="font-label-caps text-label-caps text-on-surface">
                  Cobro Verificado
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  22 Oct 2024 • 09:02 AM
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Transacción aprobada vía Pasarela Segura ($140.000 COP).
                </span>
              </div>

              <div className="relative flex flex-col gap-0.5">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary-fixed-dim ring-4 ring-surface-container-lowest" />
                <span className="font-label-caps text-label-caps text-primary">
                  {dynamicLog.title}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {dynamicLog.time}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {dynamicLog.desc}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Evolución del Proceso
              </span>
              <span className="font-body-bold text-body-sm text-primary tabular-nums">
                14 de 16 sesiones
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: '87.5%' }}
              />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Fase actual: Consolidación de herramientas conductuales y prevención de recaídas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
