import React, { useState } from 'react';
import { IMAGES, INITIAL_SPECIALISTS } from '../data/mockData';
import { AppointmentEmailDraft, ScreenRoute, Specialist } from '../types';
import { SafeImage } from '../components/SafeImage';

interface SpecialistProfileScreenProps {
  specialist: Specialist | null;
  onNavigate: (route: ScreenRoute) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onRequestEmailReminder: (draft: AppointmentEmailDraft) => void;
}

const TESTIMONIALS = [
  {
    id: 'rev-1',
    initials: 'SR',
    avatarBg: 'bg-primary-fixed text-primary',
    author: 'Sofía R.',
    subtitle: 'Paciente en Terapia Individual • 8 meses de proceso',
    timeAgo: 'Hace 2 semanas',
    quote:
      '"Andrés me ayudó a atravesar una de las crisis de pánico más complejas que he vivido. Su trato es profundamente compasivo pero sin perder la orientación pragmática; cada semana salía con ejercicios claros para identificar distorsiones cognitivas. Hoy puedo gestionar situaciones de estrés laboral sin desbordarme emocionalmente. Infinitamente agradecida."',
    tags: ['#ManejoDeAnsiedad', '#Empatía'],
    modality: 'Consulta Virtual Verificada',
    modalityIcon: 'check_circle',
    filterCategory: 'Manejo de Ansiedad',
  },
  {
    id: 'rev-2',
    initials: 'CM',
    avatarBg: 'bg-secondary-fixed text-secondary',
    author: 'Carlos M.',
    subtitle: 'Terapia de Pareja • 14 sesiones',
    timeAgo: 'Hace 1 mes',
    quote:
      '"Asistimos a terapia presencial en su consultorio en Bogotá con mi esposa. La neutralidad y agudeza analítica de Andrés evitaron que cayéramos en acusaciones estériles y nos guiaron hacia un diálogo reconstructivo y respetuoso. El espacio físico es sumamente acogedor y transmite muchísima paz."',
    tags: ['#TerapiaDePareja', '#Claridad'],
    modality: 'Presencial Bogotá',
    modalityIcon: 'apartment',
    filterCategory: 'Claridad en Herramientas',
  },
  {
    id: 'rev-3',
    initials: 'EV',
    avatarBg: 'bg-primary-fixed-dim text-primary',
    author: 'Elena V.',
    subtitle: 'Terapia Individual Online (desde Madrid)',
    timeAgo: 'Hace 2 meses',
    quote:
      '"Excelente profesional. Destaco especialmente su puntualidad irreprochable y el seguimiento que realiza entre sesiones. Me dio técnicas de respiración consciente que cambiaron radicalmente mi higiene de sueño y mi rumiación nocturna. 100% recomendado."',
    tags: ['#Puntualidad', '#Mindfulness'],
    modality: 'Consulta Virtual Verificada',
    modalityIcon: 'check_circle',
    filterCategory: 'Puntualidad Absoluta',
  },
];

export const SpecialistProfileScreen: React.FC<SpecialistProfileScreenProps> = ({
  specialist,
  onNavigate,
  onShowToast,
  onRequestEmailReminder,
}) => {
  const activeSpecialist = specialist || INITIAL_SPECIALISTS[1];
  const heroAvatar =
    activeSpecialist.id === 'andres' ? IMAGES.andresHero : activeSpecialist.avatarUrl;
  const displayName =
    activeSpecialist.id === 'andres' ? 'Lic. Andrés Valencia Peña' : activeSpecialist.name;

  const [activeTab, setActiveTab] = useState<
    'sobre-mi' | 'testimonios' | 'especialidades' | 'tarifas'
  >('sobre-mi');
  const [reviewFilter, setReviewFilter] = useState<string>('Todas');

  // Booking Widget State
  const [modality, setModality] = useState<'online' | 'presencial'>('online');
  const [consultReason, setConsultReason] = useState('inicial');
  const [selectedDay, setSelectedDay] = useState(14);
  const [selectedSlot, setSelectedSlot] = useState('09:00 AM');
  const [monthLabel, setMonthLabel] = useState('Octubre 2024');

  const filteredReviews = TESTIMONIALS.filter(
    (rev) =>
      reviewFilter === 'Todas' ||
      rev.filterCategory === reviewFilter ||
      (reviewFilter === 'Empatía Terapéutica' && rev.tags.includes('#Empatía'))
  );

  const reasonLabels: Record<string, string> = {
    inicial: 'Consulta Inicial • Evaluación Diagnóstica',
    seguimiento: 'Sesión de Seguimiento Terapéutico',
    pareja: 'Consulta de Pareja / Familiar',
    orientacion: 'Sesión Breve de Orientación Emocional',
  };

  const handleConfirmBooking = () => {
    const modalityLabel =
      modality === 'online' ? 'Online (Sala Segura Meet E2E)' : 'Presencial (Consultorio Calle 93)';
    const dateLabel = `${selectedDay} de ${monthLabel}`;
    onShowToast(
      `Sesión ${modality === 'online' ? 'Online' : 'Presencial'} reservada con ${displayName} para el ${dateLabel} a las ${selectedSlot}.`,
      'event_available'
    );
    onRequestEmailReminder({
      patientName: 'Camila Morales Valencia',
      specialistName: displayName,
      dateLabel,
      timeLabel: selectedSlot,
      modalityLabel,
      reason: reasonLabels[consultReason] || 'Sesión Psicológica Individual',
    });
  };

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-gutter py-space-md">
      {/* Top Breadcrumb & Status Alert Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md text-body-sm text-on-surface-variant">
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={() => onNavigate('directorio-de-psicologos')}
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-title-md">arrow_back</span>
            <span>Directorio de Especialistas</span>
          </button>
          <span>/</span>
          <span className="text-on-surface font-body-bold">{displayName}</span>
        </div>
        <div className="inline-flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-label-caps text-primary tracking-wider uppercase">
            Agenda abierta esta semana • Próximo hueco: Hoy 3:00 PM
          </span>
        </div>
      </div>

      {/* Hero / Profile Identity Card */}
      <div className="relative w-full bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(36,83,71,0.06)] p-space-lg lg:p-space-xl overflow-hidden mb-space-lg">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
          {/* Left: Avatar + Vital Data */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg">
            <div className="relative flex-shrink-0">
              <SafeImage
                src={heroAvatar}
                alt={displayName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover shadow-md"
                fallbackText="AV"
              />
              <div
                className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-1.5 rounded-full shadow-md flex items-center justify-center"
                title="Terapeuta Certificado"
              >
                <span
                  className="material-symbols-outlined text-title-md"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-label-caps tracking-wider uppercase flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-label-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                  Profesional Verificado
                </span>
                <span className="bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full font-label-caps tracking-wider uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-label-sm">bolt</span> Atención
                  Inmediata
                </span>
                <span className="bg-surface-container-low text-on-surface-variant px-2.5 py-0.5 rounded-full text-label-sm">
                  {activeSpecialist.id === 'andres'
                    ? 'Colegiado Nº 14.892'
                    : activeSpecialist.license}
                </span>
              </div>

              <h1 className="font-headline-lg text-primary tracking-tight mt-1">{displayName}</h1>
              <p className="font-title-md text-secondary font-medium">
                {activeSpecialist.id === 'andres'
                  ? 'Psicólogo Clínico & Terapeuta Familiar, M.Sc.'
                  : activeSpecialist.title}
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-space-md mt-1 text-body-sm text-on-surface-variant">
                <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg">
                  <span
                    className="material-symbols-outlined text-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-body-bold text-on-surface text-body-base">
                    {activeSpecialist.rating.toFixed(2)}
                  </span>
                  <span className="text-on-surface-variant text-label-sm">/ 5.0</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('testimonios')}
                    className="text-primary underline ml-1 hover:text-primary-container font-body-bold"
                  >
                    ({activeSpecialist.reviewCount} reseñas verificadas)
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-title-md">
                    psychology
                  </span>
                  <span>{activeSpecialist.tags.join(' • ')}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-body-sm text-on-surface-variant mt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-title-md">
                    videocam
                  </span>
                  Consulta Online (Meet Seguro Encriptado)
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-title-md">
                    location_on
                  </span>
                  Presencial: Calle 93 #14-20, Bogotá / CDMX
                </span>
              </div>
            </div>
          </div>

          {/* Right: Primary CTA and Price Snapshot */}
          <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-space-sm bg-surface-container-low/60 p-space-md rounded-xl lg:min-w-[260px]">
            <div className="text-left lg:text-right">
              <span className="font-label-caps text-on-surface-variant uppercase tracking-wider block">
                Sesión Individual ({activeSpecialist.durationMin} min)
              </span>
              <div className="flex items-baseline gap-1 lg:justify-end">
                <span className="font-headline-md text-primary font-bold tabular-nums">
                  ${activeSpecialist.feeUsd} USD
                </span>
                <span className="text-on-surface-variant text-body-sm tabular-nums">
                  / ${activeSpecialist.feeCop.toLocaleString('es-CO')} COP
                </span>
              </div>
              <span className="text-primary text-label-sm flex items-center gap-0.5 lg:justify-end">
                <span className="material-symbols-outlined text-label-sm">verified</span> Reembolso
                con EPS/Seguros
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                document.getElementById('booking-card')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-12 px-space-lg bg-primary hover:bg-primary-container text-on-primary rounded-xl font-body-bold text-body-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-title-md">calendar_today</span>
              Reservar Cita Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Navigation Tabs */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-1.5 flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'sobre-mi' as const, label: 'Sobre Mí & Formación' },
              {
                id: 'testimonios' as const,
                label: `Reseñas & Testimonios (${activeSpecialist.reviewCount})`,
              },
              { id: 'especialidades' as const, label: 'Especialidades' },
              { id: 'tarifas' as const, label: 'Tarifas & Políticas' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-2.5 px-space-md rounded-lg text-body-sm transition-all text-center whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-primary-fixed text-on-primary-fixed font-body-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Sobre Mí & Formación */}
          {activeTab === 'sobre-mi' && (
            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full" />
                <h2 className="font-headline-md text-primary">Biografía Profesional</h2>
              </div>
              <p className="text-body-base text-on-surface leading-relaxed">
                Hola, soy {displayName.split(' ')[1] || displayName}. Mi propósito como terapeuta es
                ofrecerte un espacio de absoluta confidencialidad, calidez humana y rigor clínico
                donde podamos deconstruir juntos aquellas dinámicas, pensamientos automáticos y
                cargas emocionales que hoy limitan tu bienestar.
              </p>
              <p className="text-body-base text-on-surface-variant leading-relaxed">
                Cuento con más de 11 años de experiencia acompañando a adultos y parejas en el
                abordaje integral de crisis de ansiedad, desregulación del estado de ánimo, duelo
                migratorio y patrones de vinculación disfuncionales. Trabajo desde un marco
                integrador con base en la{' '}
                <strong>Terapia Cognitivo-Conductual de Tercera Generación (ACT y TCC)</strong>,
                sumando herramientas prácticas de autorregulación neuro-afectiva y Mindfulness
                clínico.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                <div className="relative rounded-xl overflow-hidden shadow-sm group">
                  <SafeImage
                    src={IMAGES.officePresencial}
                    alt="Consultorio Calle 93"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackIcon="apartment"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-on-surface/80 to-transparent p-space-sm text-on-primary">
                    <span className="font-label-caps uppercase tracking-wider block">
                      Espacio Presencial
                    </span>
                    <span className="text-body-sm">
                      Consultorio Calle 93 • Sala Privada Acústica
                    </span>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-sm group">
                  <SafeImage
                    src={IMAGES.officeTele}
                    alt="Sala de Tele-psicología"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackIcon="videocam"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-on-surface/80 to-transparent p-space-sm text-on-primary">
                    <span className="font-label-caps uppercase tracking-wider block">
                      Tele-psicología
                    </span>
                    <span className="text-body-sm">
                      Conexión Encriptada • Entorno Libre de Ruido
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-space-sm pt-space-sm">
                <h3 className="font-title-lg text-on-surface">Trayectoria y Acreditaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                  {[
                    {
                      icon: 'school',
                      title: 'Máster en Psicología Clínica',
                      inst: 'Universidad Complutense de Madrid (M.Sc. Cum Laude)',
                      year: '2014 - 2016',
                    },
                    {
                      icon: 'workspace_premium',
                      title: 'Certificación Internacional TCC',
                      inst: 'Beck Institute for Cognitive Behavior Therapy, PA',
                      year: '2018',
                    },
                    {
                      icon: 'diversity_3',
                      title: 'Especialista en Terapia Familiar',
                      inst: 'Instituto Sistémico de Relaciones Humanas',
                      year: '2019 - 2021',
                    },
                    {
                      icon: 'self_improvement',
                      title: 'Facilitador Mindfulness MBSR',
                      inst: 'Center for Mindfulness Medicine (San Diego)',
                      year: '2022',
                    },
                  ].map((cred) => (
                    <div
                      key={cred.title}
                      className="flex items-start gap-space-sm p-space-sm rounded-xl bg-surface-container-low"
                    >
                      <div className="p-2 rounded-lg bg-surface-container-lowest text-primary shadow-xs">
                        <span className="material-symbols-outlined text-title-md">{cred.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-body-bold text-body-base text-on-surface">
                          {cred.title}
                        </h4>
                        <p className="text-body-sm text-on-surface-variant">{cred.inst}</p>
                        <span className="text-label-sm text-primary font-medium">{cred.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: Reseñas & Testimonios */}
          {activeTab === 'testimonios' && (
            <section
              id="testimonios"
              className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg p-space-lg bg-surface-container-low rounded-xl">
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                  <span className="font-label-caps text-on-surface-variant uppercase tracking-wider">
                    Calificación Global
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-primary font-bold">
                      {activeSpecialist.rating.toFixed(2)}
                    </span>
                    <span className="font-title-lg text-on-surface-variant font-normal">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 text-tertiary-container my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-headline-md"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-body-sm text-on-surface-variant">
                    Basado en {activeSpecialist.reviewCount} consultas finalizadas con feedback
                    anónimo verificado
                  </span>
                </div>

                <div className="w-full md:w-64 flex flex-col gap-1.5">
                  {[
                    { label: '5 estrellas', pct: '92%', bar: 'bg-primary' },
                    { label: '4 estrellas', pct: '6%', bar: 'bg-primary/70' },
                    { label: '3 estrellas', pct: '2%', bar: 'bg-outline' },
                    { label: '2 estrellas', pct: '0%', bar: 'bg-outline-variant' },
                    { label: '1 estrella', pct: '0%', bar: 'bg-outline-variant' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2 text-label-sm">
                      <span className="w-16 text-on-surface-variant">{row.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.bar}`}
                          style={{ width: row.pct }}
                        />
                      </div>
                      <span className="w-8 font-body-bold text-on-surface text-right">
                        {row.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <span className="font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Filtrar testimonios por cualidad clínica:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: 'Todas', count: activeSpecialist.reviewCount },
                    { key: 'Empatía Terapéutica', count: 89 },
                    { key: 'Manejo de Ansiedad', count: 64 },
                    { key: 'Claridad en Herramientas', count: 51 },
                    { key: 'Puntualidad Absoluta', count: 42 },
                  ].map((tag) => (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={() => setReviewFilter(tag.key)}
                      className={`px-3 py-1.5 rounded-full text-body-sm transition-colors flex items-center gap-1 ${
                        reviewFilter === tag.key
                          ? 'font-body-bold bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span>{tag.key}</span>
                      <span
                        className={`text-label-sm font-bold ${
                          reviewFilter === tag.key ? 'text-primary-fixed' : 'text-primary'
                        }`}
                      >
                        ({tag.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-space-md">
                {filteredReviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="p-space-md rounded-xl bg-surface-container-low/70 flex flex-col gap-space-xs hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-title-md font-bold ${rev.avatarBg}`}
                        >
                          {rev.initials}
                        </div>
                        <div>
                          <h4 className="font-body-bold text-body-base text-on-surface">
                            {rev.author}
                          </h4>
                          <span className="text-label-sm text-on-surface-variant">
                            {rev.subtitle}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex text-tertiary-container">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className="material-symbols-outlined text-body-base"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-label-sm text-on-surface-variant">
                          {rev.timeAgo}
                        </span>
                      </div>
                    </div>
                    <p className="text-body-base text-on-surface mt-1 leading-relaxed">
                      {rev.quote}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {rev.tags.map((t) => (
                        <span
                          key={t}
                          className="bg-surface-container-lowest text-primary text-label-sm px-2.5 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                      <span className="bg-surface-container-lowest text-on-surface-variant text-label-sm px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-label-sm">
                          {rev.modalityIcon}
                        </span>
                        {rev.modality}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* TAB 3: Especialidades */}
          {activeTab === 'especialidades' && (
            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full" />
                <h2 className="font-headline-md text-primary">Áreas de Especialidad Clínica</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {[
                  {
                    icon: 'psychology_alt',
                    title: 'Trastornos de Ansiedad y Fobias',
                    desc: 'Tratamiento sistemático de ataques de pánico, agorafobia, ansiedad generalizada (TAG) e hipocondría mediante exposición graduada y reestructuración cognitiva.',
                  },
                  {
                    icon: 'favorite',
                    title: 'Vínculos de Pareja y Afectividad',
                    desc: 'Resolución de conflictos comunicacionales crónicos, redefinición de acuerdos, infidelidad y fortalecimiento del apego seguro mediante enfoque sistémico relacional.',
                  },
                  {
                    icon: 'mood_bad',
                    title: 'Depresión y Distimia',
                    desc: 'Activación conductual, resignificación de esquemas tempranos desadaptativos y reincorporación progresiva al ritmo vital y laboral cotidiano.',
                  },
                  {
                    icon: 'flight_takeoff',
                    title: 'Duelo Migratorio & Adaptación',
                    desc: 'Acompañamiento a hispanohablantes en el extranjero transitando choque cultural, soledad no deseada y reconfiguración del proyecto de vida.',
                  },
                ].map((area) => (
                  <div
                    key={area.title}
                    className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 text-primary font-title-md">
                      <span className="material-symbols-outlined">{area.icon}</span>
                      <h3>{area.title}</h3>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">{area.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 4: Tarifas & Políticas */}
          {activeTab === 'tarifas' && (
            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full" />
                <h2 className="font-headline-md text-primary">
                  Inversión y Términos Terapéuticos
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-primary uppercase">Modalidad Estándar</span>
                    <h3 className="font-title-lg text-on-surface font-semibold mt-1">
                      Psicoterapia Individual (50 min)
                    </h3>
                    <p className="text-body-sm text-on-surface-variant mt-2">
                      Atención online por videollamada HD o presencial en consultorio.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 flex items-baseline justify-between">
                    <span className="font-headline-md text-primary font-bold">
                      ${activeSpecialist.feeUsd} USD
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                      ${activeSpecialist.feeCop.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-secondary uppercase">
                      Modalidad Vincular
                    </span>
                    <h3 className="font-title-lg text-on-surface font-semibold mt-1">
                      Terapia de Pareja / Familiar (75 min)
                    </h3>
                    <p className="text-body-sm text-on-surface-variant mt-2">
                      Sesión extendida para dinámicas diádicas y mediación comunicacional.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 flex items-baseline justify-between">
                    <span className="font-headline-md text-primary font-bold">$85 USD</span>
                    <span className="text-body-sm text-on-surface-variant">$340.000 COP</span>
                  </div>
                </div>
              </div>
              <div className="p-space-md rounded-xl bg-surface-container-low/50 flex flex-col gap-2 mt-2">
                <h4 className="font-title-md text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary">event_repeat</span>
                  Política de Cancelación y Reagendamiento
                </h4>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Puedes reagendar o cancelar tu sesión sin costo alguno hasta con{' '}
                  <strong>24 horas de antelación</strong> directamente desde tu portal de paciente.
                  Las cancelaciones informadas con menos de 24 horas requerirán el abono del 50% de
                  los honorarios correspondientes al tiempo reservado en consultorio.
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Quick Booking Widget */}
        <div className="lg:col-span-4 w-full sticky top-24" id="booking-card">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgba(36,83,71,0.08)] p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs">
              <h3 className="font-title-lg text-primary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary">edit_calendar</span>
                Agendar Sesión
              </h3>
              <span className="font-label-caps bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">
                En Vivo
              </span>
            </div>

            {/* Modality Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">
                Tipo de Consulta:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setModality('online')}
                  className={`py-2 px-space-sm rounded-lg text-body-sm flex items-center justify-center gap-1 transition-all ${
                    modality === 'online'
                      ? 'font-body-bold bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-body-base">videocam</span> Online
                </button>
                <button
                  type="button"
                  onClick={() => setModality('presencial')}
                  className={`py-2 px-space-sm rounded-lg text-body-sm flex items-center justify-center gap-1 transition-all ${
                    modality === 'presencial'
                      ? 'font-body-bold bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-body-base">apartment</span>{' '}
                  Presencial
                </button>
              </div>
            </div>

            {/* Motivo */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">
                Motivo de Asistencia:
              </label>
              <select
                value={consultReason}
                onChange={(e) => setConsultReason(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest transition-all"
              >
                <option value="inicial">Consulta Inicial • Evaluación Diagnóstica</option>
                <option value="seguimiento">Sesión de Seguimiento Terapéutico</option>
                <option value="pareja">Consulta de Pareja / Familiar</option>
                <option value="orientacion">Sesión Breve de Orientación Emocional</option>
              </select>
            </div>

            {/* Mini Calendar */}
            <div className="flex flex-col gap-2 pt-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-body-bold text-body-base text-on-surface">{monthLabel}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMonthLabel('Septiembre 2024')}
                    className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-body-base">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthLabel('Noviembre 2024')}
                    className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-body-base">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-label-caps text-outline">
                <span>L</span>
                <span>M</span>
                <span>M</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
                <span>D</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-body-sm">
                <span className="py-1.5 text-outline-variant opacity-40">29</span>
                <span className="py-1.5 text-outline-variant opacity-40">30</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((day) => {
                  const disabled = [4, 5, 11, 12, 18, 19].includes(day);
                  if (disabled) {
                    return (
                      <span key={day} className="py-1.5 text-outline-variant opacity-40">
                        {day}
                      </span>
                    );
                  }
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`py-1.5 rounded-lg transition-colors ${
                        selectedDay === day
                          ? 'bg-primary text-on-primary font-body-bold shadow-xs'
                          : 'text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="flex flex-col gap-2 pt-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Horarios Libres • {selectedDay} Oct:
                </label>
                <span className="text-label-sm text-primary font-bold">Zona: GMT-5 (Bogotá)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['09:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 rounded-xl text-center text-body-sm transition-all flex items-center justify-center gap-1.5 ${
                      selectedSlot === slot
                        ? 'font-body-bold bg-primary-fixed text-on-primary-fixed shadow-xs'
                        : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-label-sm">schedule</span>{' '}
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Summary Badge */}
            <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-title-lg">lock</span>
                <div className="flex flex-col">
                  <span className="font-body-bold text-body-sm text-on-surface">
                    Reserva Inmediata
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    Cancelación gratis hasta 24h
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-title-md text-primary font-bold tabular-nums">
                  ${activeSpecialist.feeUsd} USD
                </span>
              </div>
            </div>

            {/* Primary Submit Action */}
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-bold text-body-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Confirmar y Pasar a Reserva</span>
              <span className="material-symbols-outlined text-title-md">arrow_forward</span>
            </button>

            <p className="text-label-sm text-center text-on-surface-variant">
              Al agendar, aceptas los términos del código de confidencialidad psicológica y el
              consentimiento informado de telemedicina.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
