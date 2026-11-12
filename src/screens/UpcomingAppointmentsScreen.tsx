import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { ScreenRoute } from '../types';
import { SafeImage } from '../components/SafeImage';

interface UpcomingAppointmentsScreenProps {
  onNavigate: (route: ScreenRoute) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

interface PatientAppointmentCard {
  id: string;
  month: string;
  day: string;
  weekday: string;
  type: 'virtual' | 'in-person';
  badgeType: string;
  paymentLabel: string;
  title: string;
  doctorTime: string;
  linkLabel: string;
  secondaryLabel: string;
  dayHighlightClass: string;
}

const APPOINTMENTS_LIST: PatientAppointmentCard[] = [
  {
    id: 'apt-1',
    month: 'OCT',
    day: '24',
    weekday: 'JUE',
    type: 'virtual',
    badgeType: 'Virtual Meet E2E',
    paymentLabel: 'Pagada',
    title: 'Sesión TCC: Manejo y Desactivación de Ansiedad',
    doctorTime: 'Con Dra. Marcela Restrepo • 16:00 - 16:50',
    linkLabel: 'Instrucciones de conexión',
    secondaryLabel: 'Mensaje previo al terapeuta',
    dayHighlightClass: 'bg-surface-container-low text-primary',
  },
  {
    id: 'apt-2',
    month: 'NOV',
    day: '08',
    weekday: 'VIE',
    type: 'in-person',
    badgeType: 'Presencial: Sede El Nogal',
    paymentLabel: 'Pagada',
    title: 'Evaluación Psiquiátrica y Seguimiento Farmacológico',
    doctorTime: 'Con Dr. Camilo Arboleda • 11:30 - 12:15',
    linkLabel: 'Consultorio 304 (Cómo llegar)',
    secondaryLabel: 'Llegar 10 min antes',
    dayHighlightClass: 'bg-secondary-container/50 text-secondary',
  },
  {
    id: 'apt-3',
    month: 'NOV',
    day: '21',
    weekday: 'JUE',
    type: 'virtual',
    badgeType: 'Virtual Meet E2E',
    paymentLabel: 'Plan Cubierto',
    title: 'TCC: Estrategias de Regulación Emocional y Balance',
    doctorTime: 'Con Dra. Marcela Restrepo • 16:00 - 16:50',
    linkLabel: 'Material y tareas previas',
    secondaryLabel: '',
    dayHighlightClass: 'bg-surface-container-low text-primary',
  },
];

export const UpcomingAppointmentsScreen: React.FC<UpcomingAppointmentsScreenProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'virtual' | 'in-person'>('all');
  const [prepNote, setPrepNote] = useState(
    'Revisar el registro de auto-observación de picos ansiosos durante la semana laboral...'
  );
  const [editingNote, setEditingNote] = useState(false);
  const [checklist, setChecklist] = useState({
    space: true,
    headphones: true,
    notebook: true,
  });

  const visibleCards = APPOINTMENTS_LIST.filter(
    (card) => filter === 'all' || card.type === filter
  );
  const readyCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="max-w-[1440px] w-full mx-auto px-margin-mobile sm:px-margin-tablet lg:px-margin py-space-lg space-y-space-xl">
      {/* Warm Page Sub-Header & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="space-y-space-xs max-w-2xl">
          <div className="inline-flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full text-primary font-label-caps tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Plan Bienestar Continuo • 3 Sesiones Activas
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Tus Próximos Encuentros Terapéuticos
          </h1>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Un espacio seguro y confidencial reservado para tu evolución personal. Revisa tus
            detalles de conexión y prepara tu entorno con serenidad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm self-start md:self-auto">
          <button
            type="button"
            onClick={() =>
              onShowToast(
                'Calendario sincronizado con Google Calendar e iCal (3 sesiones exportadas).',
                'sync'
              )
            }
            className="inline-flex items-center gap-space-xs px-space-md py-3 rounded-xl bg-surface-container-low text-primary font-body-bold text-body-sm hover:bg-surface-container transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-title-md">sync</span>
            Sincronizar Calendario
          </button>
          <button
            type="button"
            onClick={() => onNavigate('directorio-de-psicologos')}
            className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-primary text-on-primary font-body-bold text-body-sm hover:bg-primary-container transition-all shadow-md group"
          >
            <span className="material-symbols-outlined text-title-md group-hover:rotate-90 transition-transform duration-300">
              add
            </span>
            Agendar Nueva Consulta
          </button>
        </div>
      </div>

      {/* Hero Showcase: Next Immediate Appointment (In 48h) */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-xl p-space-md md:p-space-xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-fixed/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          {/* Therapist Profile */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left gap-space-md">
            <div className="relative">
              <SafeImage
                src={IMAGES.marcelaUpcoming}
                alt="Dra. Marcela Restrepo"
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-md"
                fallbackText="MR"
              />
              <span
                className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-1.5 rounded-xl shadow"
                title="Sesión Segura Encriptada"
              >
                <span className="material-symbols-outlined text-body-base leading-none">lock</span>
              </span>
            </div>
            <div className="space-y-1">
              <span className="inline-block font-label-caps uppercase tracking-wider text-primary bg-surface-container-low px-space-xs py-0.5 rounded-md">
                Terapeuta Principal
              </span>
              <h2 className="font-headline-md text-on-surface">Dra. Marcela Restrepo</h2>
              <p className="text-body-sm text-on-surface-variant">
                Psicóloga Clínica • Enfoque Cognitivo-Conductual (TCC)
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-space-xs text-primary pt-1">
                <span
                  className="material-symbols-outlined text-body-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="text-label-sm">Colegiatura Sanitaria Certificada #COL-48291</span>
              </div>
            </div>
          </div>

          {/* Appointment Metadata & Countdown */}
          <div className="lg:col-span-5 bg-surface-container-low/70 rounded-xl p-space-md md:p-space-lg flex flex-col justify-between gap-space-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-space-xs bg-surface-container-lowest text-primary px-space-sm py-1 rounded-full shadow-sm font-label-caps">
                <span className="material-symbols-outlined text-body-sm text-primary">
                  schedule
                </span>
                Encuentro más próximo en 48 horas
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant text-label-sm">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                WhatsApp Activo
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-sm py-space-xs">
              <div>
                <span className="font-label-caps text-on-surface-variant uppercase">
                  Fecha Programada
                </span>
                <p className="font-headline-lg text-on-surface">Jueves, 24 Oct</p>
                <span className="text-body-sm text-on-surface-variant">
                  16:00 - 16:50 (50 min)
                </span>
              </div>
              <div>
                <span className="font-label-caps text-on-surface-variant uppercase">Modalidad</span>
                <p className="font-headline-lg text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-title-md">videocam</span>
                  Teleconsulta
                </p>
                <span className="text-body-sm text-on-surface-variant">Sala HD Encriptada E2E</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest/90 rounded-lg p-space-sm flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-primary text-body-base mt-0.5">
                edit_note
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-label-sm text-on-surface font-body-bold block">
                  Tu nota preparatoria:
                </span>
                {editingNote ? (
                  <div className="mt-1 space-y-1.5">
                    <textarea
                      value={prepNote}
                      onChange={(e) => setPrepNote(e.target.value)}
                      rows={2}
                      className="w-full p-2 rounded-lg bg-surface-container-low text-body-sm text-on-surface focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNote(false);
                        onShowToast('Nota preparatoria guardada para Dra. Marcela.', 'check');
                      }}
                      className="px-3 py-1 rounded-lg bg-primary text-on-primary text-label-sm font-bold"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <p className="text-body-sm text-on-surface-variant line-clamp-2 italic">
                    &quot;{prepNote}&quot;
                  </p>
                )}
              </div>
              {!editingNote && (
                <button
                  type="button"
                  onClick={() => setEditingNote(true)}
                  className="text-primary hover:text-primary-container text-label-sm font-body-bold whitespace-nowrap"
                >
                  Editar
                </button>
              )}
            </div>
          </div>

          {/* CTA Module */}
          <div className="lg:col-span-3 flex flex-col gap-space-sm justify-center">
            <button
              type="button"
              onClick={() =>
                onShowToast(
                  'Ingresando a sala de espera encriptada. Prueba de audio/video lista.',
                  'video_call'
                )
              }
              className="w-full inline-flex items-center justify-center gap-space-xs py-3.5 px-space-md rounded-xl bg-primary text-on-primary font-body-bold text-body-base shadow-lg hover:bg-primary-container transition-all text-center"
            >
              <span className="material-symbols-outlined text-title-lg">video_call</span>
              Ingresar a Sala Virtual
            </button>
            <button
              type="button"
              onClick={() => onNavigate('gestion-y-reprogramacion-de-citas')}
              className="w-full inline-flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-xl bg-surface-container text-on-surface font-body-bold text-body-sm hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-body-base">event_repeat</span>
              Reprogramar / Cancelar
            </button>
            <div className="flex items-center justify-center gap-1.5 text-center text-on-surface-variant text-label-sm pt-1">
              <span className="material-symbols-outlined text-body-base text-primary">
                verified_user
              </span>
              <span>Link activo 10 min antes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Split 8 cols List + 4 cols Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <section className="lg:col-span-8 space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
            <div>
              <h3 className="font-title-lg text-on-surface">Cronología de Consultas</h3>
              <p className="text-body-sm text-on-surface-variant">
                Gestión transparente de tus sesiones planificadas
              </p>
            </div>
            <div className="inline-flex bg-surface-container-low p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-space-sm py-1 rounded-lg text-body-sm transition-all ${
                  filter === 'all'
                    ? 'font-body-bold bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Todas (3)
              </button>
              <button
                type="button"
                onClick={() => setFilter('virtual')}
                className={`px-space-sm py-1 rounded-lg text-body-sm transition-all ${
                  filter === 'virtual'
                    ? 'font-body-bold bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Virtuales
              </button>
              <button
                type="button"
                onClick={() => setFilter('in-person')}
                className={`px-space-sm py-1 rounded-lg text-body-sm transition-all ${
                  filter === 'in-person'
                    ? 'font-body-bold bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Presenciales
              </button>
            </div>
          </div>

          <div className="space-y-space-sm">
            {visibleCards.map((card) => (
              <article
                key={card.id}
                className="group relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-space-md"
              >
                <div className="flex items-start gap-space-md min-w-0">
                  <div
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl text-center px-2 ${card.dayHighlightClass}`}
                  >
                    <span className="font-label-caps uppercase tracking-wider">{card.month}</span>
                    <span className="font-headline-lg text-on-surface leading-none py-0.5">
                      {card.day}
                    </span>
                    <span className="text-label-sm text-on-surface-variant">{card.weekday}</span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-caps text-[#2E7D32] bg-[#E8F5E9]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                        Confirmada
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-caps ${
                          card.paymentLabel === 'Pagada'
                            ? 'text-secondary bg-secondary-fixed'
                            : 'text-on-surface-variant bg-surface-container-high'
                        }`}
                      >
                        {card.paymentLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant">
                        <span
                          className={`material-symbols-outlined text-body-sm ${
                            card.type === 'virtual' ? 'text-primary' : 'text-tertiary'
                          }`}
                        >
                          {card.type === 'virtual' ? 'videocam' : 'apartment'}
                        </span>
                        {card.badgeType}
                      </span>
                    </div>
                    <h4 className="font-title-md text-on-surface font-body-bold">{card.title}</h4>
                    <p className="text-body-sm text-on-surface-variant">{card.doctorTime}</p>
                    <div className="pt-1 flex flex-wrap items-center gap-space-sm text-primary">
                      <button
                        type="button"
                        onClick={() =>
                          onShowToast(`Abriendo "${card.linkLabel}"...`, 'info')
                        }
                        className="inline-flex items-center gap-1 text-label-sm font-body-bold hover:underline"
                      >
                        <span className="material-symbols-outlined text-body-base">
                          {card.type === 'virtual' ? 'laptop_mac' : 'location_on'}
                        </span>
                        {card.linkLabel}
                      </button>
                      {card.secondaryLabel && (
                        <>
                          <span className="text-outline-variant">•</span>
                          <span className="text-label-sm text-on-surface-variant">
                            {card.secondaryLabel}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center md:flex-col justify-end gap-space-xs flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('gestion-y-reprogramacion-de-citas')}
                    className="px-space-md py-2 rounded-lg bg-surface-container-low text-primary font-body-bold text-body-sm hover:bg-surface-container transition-colors w-full text-center"
                  >
                    Ver Ficha
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('gestion-y-reprogramacion-de-citas')}
                    className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    title="Opciones de cita"
                  >
                    <span className="material-symbols-outlined text-title-md">more_horiz</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* In-Person Consultation Map Visual Snippet */}
          <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm space-y-space-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">map</span>
                <span className="font-title-md text-on-surface">
                  Ubicación de tu Cita Presencial (8 Nov)
                </span>
              </div>
              <span className="text-label-sm text-on-surface-variant">
                Cra 11 # 85-32, Consultorio 304
              </span>
            </div>
            <div className="w-full h-44 rounded-lg overflow-hidden shadow-inner relative flex items-end p-space-sm">
              <SafeImage
                src={IMAGES.mapBogota}
                alt="Mapa Centro Médico El Nogal Bogotá"
                className="absolute inset-0 w-full h-full object-cover"
                fallbackIcon="map"
              />
              <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-on-surface text-body-sm flex items-center gap-2 shadow">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                Psico_Gestión Centro Médico El Nogal
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Preparation, FAQ & Emergency */}
        <aside className="lg:col-span-4 space-y-space-md">
          {/* Session Preparation Checklist */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-title-lg">spa</span>
                <h3 className="font-title-md text-on-surface">Preparación de Sesión</h3>
              </div>
              <span className="font-label-caps text-primary bg-surface-container-low px-2 py-0.5 rounded-full">
                {readyCount}/3 Listos
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              Pequeños pasos para cultivar un entorno seguro y maximizar tu bienestar durante la
              consulta:
            </p>
            <div className="space-y-space-xs pt-1">
              <label className="flex items-start gap-space-sm p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  checked={checklist.space}
                  onChange={() => setChecklist((c) => ({ ...c, space: !c.space }))}
                  className="mt-1 w-4 h-4 rounded accent-primary"
                  type="checkbox"
                />
                <div className="text-body-sm">
                  <span className="font-body-bold text-on-surface block">
                    Espacio en calma y privacidad
                  </span>
                  <span className="text-on-surface-variant">
                    Cierra la puerta y silencia notificaciones externas.
                  </span>
                </div>
              </label>
              <label className="flex items-start gap-space-sm p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  checked={checklist.headphones}
                  onChange={() => setChecklist((c) => ({ ...c, headphones: !c.headphones }))}
                  className="mt-1 w-4 h-4 rounded accent-primary"
                  type="checkbox"
                />
                <div className="text-body-sm">
                  <span className="font-body-bold text-on-surface block">
                    Audífonos con micrófono
                  </span>
                  <span className="text-on-surface-variant">
                    Garantizan audio nítido y total confidencialidad.
                  </span>
                </div>
              </label>
              <label className="flex items-start gap-space-sm p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                <input
                  checked={checklist.notebook}
                  onChange={() => setChecklist((c) => ({ ...c, notebook: !c.notebook }))}
                  className="mt-1 w-4 h-4 rounded accent-primary"
                  type="checkbox"
                />
                <div className="text-body-sm">
                  <span className="font-body-bold text-on-surface block">
                    Cuaderno de reflexiones o bitácora
                  </span>
                  <span className="text-on-surface-variant">
                    Ten a mano tus sensaciones clave de la semana.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-title-lg">
                help_outline
              </span>
              <h3 className="font-title-md text-on-surface">Agendamiento y Cancelaciones</h3>
            </div>
            <div className="space-y-space-xs text-body-sm text-on-surface-variant">
              <details className="group p-2 rounded-lg bg-surface-container-low/60 cursor-pointer">
                <summary className="font-body-bold text-on-surface flex justify-between items-center list-none">
                  <span>¿Cómo reprogramar una cita?</span>
                  <span className="material-symbols-outlined text-body-base group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="pt-2 text-on-surface-variant leading-relaxed">
                  Puedes reprogramar con hasta <strong>24 horas de antelación</strong> sin ningún
                  cargo ni penalidad desde el botón de opciones en tu ficha.
                </p>
              </details>
              <details className="group p-2 rounded-lg bg-surface-container-low/60 cursor-pointer">
                <summary className="font-body-bold text-on-surface flex justify-between items-center list-none">
                  <span>Política de cancelación tardía</span>
                  <span className="material-symbols-outlined text-body-base group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="pt-2 text-on-surface-variant leading-relaxed">
                  Las cancelaciones con menos de 24 horas retienen la reserva del terapeuta para
                  garantizar la sostenibilidad de la agenda clínica.
                </p>
              </details>
              <details className="group p-2 rounded-lg bg-surface-container-low/60 cursor-pointer">
                <summary className="font-body-bold text-on-surface flex justify-between items-center list-none">
                  <span>¿Qué ocurre si tengo un fallo técnico?</span>
                  <span className="material-symbols-outlined text-body-base group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="pt-2 text-on-surface-variant leading-relaxed">
                  Tu terapeuta intentará comunicarse por WhatsApp o llamada de respaldo en los
                  primeros 10 minutos para asistirte.
                </p>
              </details>
            </div>
          </div>

          {/* 24/7 Emotional Support */}
          <div className="relative overflow-hidden rounded-xl bg-tertiary text-on-tertiary p-space-md shadow-md space-y-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-title-lg text-tertiary-fixed">
                crisis_alert
              </span>
              <h3 className="font-headline-md">Línea de Apoyo Emocional 24/7</h3>
            </div>
            <p className="text-body-sm text-inverse-on-surface/90">
              Si experimentas una situación de crisis inmediata o desborde emocional que no puede
              esperar a tu próxima sesión, contáctanos gratis:
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-space-xs">
              <button
                type="button"
                onClick={() =>
                  onShowToast('Marcación gratuita de atención en crisis: Línea 106 activa.', 'phone_in_talk')
                }
                className="inline-flex items-center justify-center gap-1 bg-surface-container-lowest text-tertiary px-space-md py-2.5 rounded-lg font-body-bold text-body-sm shadow hover:bg-surface-container-low transition-colors text-center"
              >
                <span className="material-symbols-outlined text-body-base">phone_in_talk</span>
                Llamar Línea 106
              </button>
              <button
                type="button"
                onClick={() =>
                  onShowToast('Protocolo de contención emocional inmediata desplegado.', 'crisis_alert')
                }
                className="inline-flex items-center justify-center gap-1 bg-tertiary-container text-on-tertiary px-space-md py-2.5 rounded-lg font-body-bold text-body-sm hover:opacity-90 transition-opacity text-center"
              >
                Protocolo de Crisis
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
