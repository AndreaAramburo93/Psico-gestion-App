import React, { useState } from 'react';
import { INITIAL_SPECIALISTS } from '../data/mockData';
import { AppointmentEmailDraft, ScreenRoute, Specialist } from '../types';
import { SafeImage } from '../components/SafeImage';

interface DirectoryScreenProps {
  onSelectSpecialistProfile: (specialist: Specialist) => void;
  onNavigate: (route: ScreenRoute) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onRequestEmailReminder: (draft: AppointmentEmailDraft) => void;
}

const QUICK_DAYS = [
  { key: '24', label: 'HOY', dayNum: '24', weekday: 'Jue' },
  { key: '25', label: 'MAÑ', dayNum: '25', weekday: 'Vie' },
  { key: '26', label: 'SÁB', dayNum: '26', weekday: 'Sáb' },
  { key: '28', label: 'LUN', dayNum: '28', weekday: 'Lun' },
  { key: '29', label: 'MAR', dayNum: '29', weekday: 'Mar' },
];

const QUICK_SLOTS = [
  { time: '11:00 AM', disabled: false },
  { time: '04:00 PM', disabled: false },
  { time: '05:30 PM', disabled: false },
  { time: '07:00 PM', disabled: false },
  { time: '08:00 PM', disabled: false },
  { time: 'Ocupado', disabled: true },
];

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({
  onSelectSpecialistProfile,
  onShowToast,
  onRequestEmailReminder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'online' | 'presencial' | 'hibrido'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('this-week');
  const [sortBy, setSortBy] = useState('Recomendación Clínica');
  const [activePills, setActivePills] = useState<string[]>([
    'Motivo: Ansiedad',
    'Técnica: TCC (Cognitivo-Conductual)',
    'Cupo: Esta Semana',
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState<Specialist>(INITIAL_SPECIALISTS[0]);
  const [selectedDay, setSelectedDay] = useState('24');
  const [selectedSlot, setSelectedSlot] = useState('04:00 PM');
  const [consultReason, setConsultReason] = useState('Manejo de Ansiedad y Estrés Agudo');
  const [showTestModal, setShowTestModal] = useState(false);

  const filteredSpecialists = INITIAL_SPECIALISTS.filter((doc) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q));
    const matchesModality =
      modalityFilter === 'all' ||
      doc.modalityType === modalityFilter ||
      doc.modalityType === 'hibrido';
    return matchesSearch && matchesModality;
  }).sort((a, b) => {
    if (sortBy === 'Mayor Calificación (4.9+)') return b.rating - a.rating;
    if (sortBy === 'Tarifa: Menor a Mayor') return a.feeUsd - b.feeUsd;
    return 0;
  });

  const handleBookQuickSlot = () => {
    const dayObj = QUICK_DAYS.find((d) => d.key === selectedDay);
    const dateLabel = dayObj ? `${dayObj.weekday} ${dayObj.dayNum} de Octubre, 2024` : `${selectedDay} Oct, 2024`;
    onShowToast(
      `¡Cita agendada con ${selectedDoctor.name} el ${dateLabel} a las ${selectedSlot}!`,
      'task_alt'
    );
    onRequestEmailReminder({
      patientName: 'Camila Morales Valencia',
      specialistName: selectedDoctor.name,
      dateLabel,
      timeLabel: selectedSlot,
      modalityLabel: selectedDoctor.modalityLabel,
      reason: consultReason,
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Hero & Specialized Query Header */}
      <section className="relative w-full bg-surface-container-low px-gutter py-space-xl overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-lg relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="space-y-space-xs max-w-2xl">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps tracking-wide">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                RED CLÍNICA VERIFICADA • TELE-PSICOLOGÍA SEGURA
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
                Directorio Clínico y Asignación Terapéutica
              </h1>
              <p className="font-body-base text-body-base text-on-surface-variant">
                Encuentra acompañamiento psicológico basado en evidencia. Filtra por motivos de consulta, escuelas teóricas, disponibilidad inmediata y modalidad.
              </p>
            </div>

            {/* Quick Matching Assistant Banner Callout */}
            <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-md max-w-md">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-headline-md">psychology_alt</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface leading-tight">
                  ¿Inseguro de qué enfoque necesitas?
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Cuestionario clínico de 2 min para asignación sugerida.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTestModal(true)}
                className="ml-auto px-space-sm py-2 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all font-body-bold text-body-sm shrink-0 whitespace-nowrap"
              >
                Iniciar Test
              </button>
            </div>
          </div>

          {/* Advanced Multivariable Search & Filter Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-md">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm">
              <div className="md:col-span-5 relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-primary text-title-lg">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-lg font-body-base text-body-base text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Buscar por especialista, motivo (ansiedad, duelo...) o enfoque (TCC, ACT...)"
                  type="text"
                />
              </div>

              <div className="md:col-span-3 relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant">
                  video_camera_front
                </span>
                <select
                  value={modalityFilter}
                  onChange={(e) =>
                    setModalityFilter(e.target.value as 'all' | 'online' | 'presencial' | 'hibrido')
                  }
                  className="w-full pl-11 pr-8 py-3 bg-surface-container-low rounded-lg font-body-base text-body-base text-on-surface appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="all">Todas las Modalidades</option>
                  <option value="online">Teleconsulta (Online HD)</option>
                  <option value="presencial">Presencial (Consultorio)</option>
                  <option value="hibrido">Modalidad Híbrida</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-sm text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="md:col-span-2 relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant">
                  calendar_clock
                </span>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full pl-11 pr-8 py-3 bg-surface-container-low rounded-lg font-body-base text-body-base text-on-surface appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="any">Cualquier día</option>
                  <option value="today">Hoy Disponible</option>
                  <option value="this-week">Esta semana</option>
                  <option value="weekend">Fines de semana</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-sm text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="md:col-span-2 flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    onShowToast(
                      `Mostrando ${filteredSpecialists.length} especialistas verificados.`,
                      'tune'
                    )
                  }
                  className="w-full h-full py-3 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-bold text-body-base flex items-center justify-center gap-space-xs transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined">tune</span>
                  <span>Filtrar</span>
                </button>
              </div>
            </div>

            {/* Active Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant mr-1">
                  Filtros Activos:
                </span>
                {activePills.map((pill, idx) => (
                  <span
                    key={pill}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-caps text-label-caps ${
                      idx === 2
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-primary-fixed text-on-primary-fixed'
                    }`}
                  >
                    <span>{pill}</span>
                    <button
                      type="button"
                      onClick={() => setActivePills((p) => p.filter((x) => x !== pill))}
                      className="hover:opacity-75 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}
                {activePills.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePills([]);
                      setSearchQuery('');
                      setModalityFilter('all');
                    }}
                    className="font-body-sm text-body-sm text-primary underline hover:text-on-surface ml-2 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm">
                <div className="flex items-center gap-2">
                  <span>Rango tarifa:</span>
                  <span className="font-body-bold text-on-surface tabular-nums">$30 - $80 USD</span>
                </div>
                <div className="w-px h-4 bg-outline-variant" />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Colegiatura Verificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory Catalog & Side Quick-Booking Engine Container */}
      <div className="max-w-[1440px] mx-auto px-gutter py-space-xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Catalog Left Column */}
          <section className="lg:col-span-8 flex flex-col gap-space-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-md text-headline-md text-on-surface">
                  Especialistas Disponibles
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-caps text-label-caps text-primary">
                  {filteredSpecialists.length} Encontrados
                </span>
              </div>
              <div className="flex items-center gap-space-sm font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-lowest px-3 py-1.5 rounded-lg text-on-surface font-body-bold focus:outline-none shadow-sm cursor-pointer"
                >
                  <option>Recomendación Clínica</option>
                  <option>Mayor Calificación (4.9+)</option>
                  <option>Disponibilidad Próxima</option>
                  <option>Tarifa: Menor a Mayor</option>
                </select>
              </div>
            </div>

            {filteredSpecialists.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center shadow-sm flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-primary">search_off</span>
                <p className="font-title-md text-on-surface">
                  No encontramos especialistas con esos criterios
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setModalityFilter('all');
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-body-bold text-body-sm"
                >
                  Restablecer búsqueda
                </button>
              </div>
            ) : (
              filteredSpecialists.map((doc) => (
                <article
                  key={doc.id}
                  className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-md transition-all hover:shadow-xl group"
                >
                  {doc.featured && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-on-primary font-label-caps text-label-caps px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      <span>CLÍNICA DESTACADA</span>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-space-lg">
                    <div className="flex flex-col items-center text-center md:text-left md:items-start shrink-0">
                      <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-sm">
                        <SafeImage
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                          fallbackText={doc.name.slice(0, 2)}
                        />
                        {doc.featured && (
                          <span
                            className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-primary ring-2 ring-surface-container-lowest"
                            title="En línea para consultas"
                          />
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-primary">
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-body-bold text-body-base tabular-nums">
                          {doc.rating.toFixed(2)}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          ({doc.reviewCount} reseñas)
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                        {doc.license}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-space-sm">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-space-xs">
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectSpecialistProfile(doc)}
                              className="font-title-lg text-title-lg text-on-surface hover:text-primary transition-colors text-left"
                            >
                              {doc.name}
                            </button>
                            <p
                              className={`font-body-sm text-body-sm font-body-bold ${
                                doc.accentColor === 'secondary'
                                  ? 'text-secondary'
                                  : doc.accentColor === 'tertiary'
                                  ? 'text-tertiary-container'
                                  : 'text-primary'
                              }`}
                            >
                              {doc.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-label-caps text-label-caps text-on-surface-variant block">
                              Por sesión ({doc.durationMin} min)
                            </span>
                            <span className="font-headline-md text-headline-md text-primary font-bold tabular-nums">
                              ${doc.feeUsd}{' '}
                              <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">
                                USD
                              </span>
                            </span>
                          </div>
                        </div>

                        <p className="font-body-base text-body-base text-on-surface-variant mt-space-xs line-clamp-2">
                          {doc.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-space-sm">
                          {doc.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-label-caps text-label-caps"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-primary font-label-caps text-label-caps flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">videocam</span>{' '}
                            {doc.modalityLabel}
                          </span>
                        </div>
                      </div>

                      <div className="pt-space-sm mt-space-xs flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-low/60 p-space-sm rounded-lg">
                        <div className="flex items-center gap-2 text-on-surface">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-base">alarm_on</span>
                          </div>
                          <div>
                            <span className="font-label-caps text-label-caps text-primary block">
                              {doc.featured ? 'PRÓXIMO TURNO INMEDIATO' : 'DISPONIBILIDAD'}
                            </span>
                            <span className="font-body-bold text-body-sm">{doc.nextSlot}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-xs w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => onSelectSpecialistProfile(doc)}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-body-bold text-body-sm"
                          >
                            Ver Perfil Completo
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDoctor(doc);
                              onShowToast(
                                `${doc.name} seleccionada en el panel de reserva.`,
                                'event_available'
                              );
                            }}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-body-bold text-body-sm shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <span>Agendar Cita</span>
                            <span className="material-symbols-outlined text-base">
                              arrow_forward
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>

          {/* Right Column: Interactive Quick-Booking Panel */}
          <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-full bg-primary animate-ping" />
                  <span className="font-label-caps text-label-caps text-primary">
                    RESERVA INMEDIATA EN 3 PASOS
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline">lock</span>
              </div>

              <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                Agendar Teleconsulta
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Espacio confidencial encriptado de extremo a extremo.
              </p>

              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between mb-space-md">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">
                    Profesional Seleccionado:
                  </span>
                  <span className="font-body-bold text-body-base text-primary">
                    {selectedDoctor.name}
                  </span>
                </div>
                <span className="font-title-md text-title-md font-bold text-on-surface tabular-nums">
                  ${selectedDoctor.feeUsd} USD
                </span>
              </div>

              {/* Step 1: Mini Calendar Picker */}
              <div className="space-y-space-xs mb-space-md">
                <div className="flex items-center justify-between">
                  <label className="font-title-md text-body-bold text-on-surface flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    Selecciona Fecha
                  </label>
                  <span className="font-body-sm text-body-sm text-primary font-bold">
                    Octubre 2024
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center pt-1">
                  {QUICK_DAYS.map((d) => {
                    const active = selectedDay === d.key;
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setSelectedDay(d.key)}
                        className={`flex flex-col items-center py-2 px-1 rounded-lg font-label-caps text-label-caps transition-colors ${
                          active
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="opacity-80">{d.label}</span>
                        <span className="font-headline-md text-title-lg">{d.dayNum}</span>
                        <span className="text-[10px]">{d.weekday}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Time Slot Picker */}
              <div className="space-y-space-xs mb-space-md">
                <label className="font-title-md text-body-bold text-on-surface flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Horarios Disponibles (Zona Local)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={slot.disabled}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-2 px-1 rounded-lg text-center font-body-sm text-body-sm font-body-bold transition-colors ${
                          slot.disabled
                            ? 'opacity-40 cursor-not-allowed bg-surface-container-high'
                            : isSelected
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-low hover:bg-surface-container-high'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Consultation Reason */}
              <div className="space-y-space-xs mb-space-md">
                <label className="font-title-md text-body-bold text-on-surface flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  Motivo Primario de Consulta
                </label>
                <select
                  value={consultReason}
                  onChange={(e) => setConsultReason(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Manejo de Ansiedad y Estrés Agudo</option>
                  <option>Duelo o Pérdida Significativa</option>
                  <option>Dificultades en Vínculos / Pareja</option>
                  <option>Evaluación Neurocognitiva / TDAH</option>
                  <option>Autoestima y Crecimiento Personal</option>
                </select>
              </div>

              {/* Automated Notifications Notice */}
              <div className="bg-surface-container-high/40 p-space-sm rounded-lg space-y-1.5 mb-space-md">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-base">
                    notifications_active
                  </span>
                  <span className="font-body-bold text-body-sm">Confirmación y Recordatorios</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm pl-6">
                  <span className="material-symbols-outlined text-sm text-primary">
                    check_circle
                  </span>
                  <span>Notificación inmediata a WhatsApp</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm pl-6">
                  <span className="material-symbols-outlined text-sm text-primary">
                    check_circle
                  </span>
                  <span>Enlace cifrado y sala Google Meet por Email</span>
                </div>
              </div>

              <div className="space-y-space-sm">
                <button
                  type="button"
                  onClick={handleBookQuickSlot}
                  className="w-full py-3.5 px-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-bold text-title-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Confirmar y Reservar Cita</span>
                  <span className="material-symbols-outlined text-title-lg">calendar_month</span>
                </button>
                <p className="text-center font-label-sm text-label-sm text-outline">
                  Cancelación o reprogramación gratuita hasta 6h antes.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs">
              <div className="flex items-center gap-2 text-primary font-body-bold text-body-sm">
                <span className="material-symbols-outlined text-base">health_and_safety</span>
                <span>Garantía de Ejercicio Ético</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Todos los terapeutas en Psico_Gestión cuentan con cédula profesional validada ante tribunales deontológicos y firman acuerdos de estricta confidencialidad médica conforme a la Ley de Salud Mental.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Interactive Guidance & Clinical Test Section */}
      <section className="w-full bg-surface-container-lowest py-space-xl px-gutter my-space-lg">
        <div className="max-w-[1440px] mx-auto rounded-xl bg-surface-container p-space-lg md:p-space-xl shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center relative z-10">
            <div className="md:col-span-8 space-y-space-xs">
              <span className="font-label-caps text-label-caps text-primary tracking-wider">
                ORIENTACIÓN PERSONALIZADA
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                ¿Primera vez en terapia y no sabes por dónde comenzar?
              </h2>
              <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
                Responde 5 breves preguntas anónimas sobre cómo te has sentido en las últimas semanas. Nuestro algoritmo clínico asignará 3 perfiles terapéuticos compatibles con tu ritmo y motivo específico.
              </p>
              <div className="pt-space-sm flex flex-wrap items-center gap-space-md">
                <button
                  type="button"
                  onClick={() => setShowTestModal(true)}
                  className="px-space-lg py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-bold text-body-base transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">assignment</span>
                  <span>Comenzar Test Clínico (Gratis)</span>
                </button>
                <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">timer</span>{' '}
                  Duración estimada: 2 minutos
                </span>
              </div>
            </div>
            <div className="md:col-span-4 flex justify-center">
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-md text-center w-full max-w-xs space-y-space-xs">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-headline-lg">verified_user</span>
                </div>
                <div className="font-headline-md text-headline-md text-primary font-bold tabular-nums">
                  96.4%
                </div>
                <div className="font-body-bold text-body-sm text-on-surface">
                  Tasa de Adherencia Terapéutica
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Los pacientes conectados mediante el test continúan su proceso luego de la sesión inicial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Orientation Quick Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-on-surface">
                Test Rápido de Asignación Clínica
              </h3>
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body-sm text-on-surface-variant">
              Selecciona tu prioridad terapéutica principal para recomendarte al especialista ideal:
            </p>
            <div className="space-y-2">
              {INITIAL_SPECIALISTS.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setShowTestModal(false);
                    onShowToast(
                      `Recomendación clínica aplicada: ${doc.name}.`,
                      'psychology'
                    );
                  }}
                  className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-body-bold text-on-surface">{doc.tags[0]}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      Sugerido: {doc.name} ({doc.modalityLabel})
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
