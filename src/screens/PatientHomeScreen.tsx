import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { ScreenRoute } from '../types';
import { SafeImage } from '../components/SafeImage';

interface PatientHomeScreenProps {
  onNavigate: (route: ScreenRoute) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

const MOOD_OPTIONS = [
  { key: 'alta', emoji: '😰', label: 'Alta', title: 'Con mucha ansiedad' },
  { key: 'baja', emoji: '😔', label: 'Baja', title: 'Abrumada' },
  { key: 'neutro', emoji: '😐', label: 'Neutro', title: 'Neutral / Estable' },
  { key: 'calma', emoji: '🌱', label: 'Calma', title: 'Tranquila' },
  { key: 'optima', emoji: '✨', label: 'Óptima', title: 'Muy Enérgica y Positiva' },
];

export const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'notes' | 'docs'>('upcoming');
  const [selectedMood, setSelectedMood] = useState('calma');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('Ansiedad y Estrés');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'Dra. Marcela Restrepo',
      text: '“Hola Camila, recuerda revisar el registro de activación somática antes de nuestra sesión del jueves.”',
      time: 'Ayer 18:24',
      fromMe: false,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'Tú',
        text: chatInput.trim(),
        time: 'Ahora',
        fromMe: true,
      },
    ]);
    setChatInput('');
    onShowToast('Mensaje cifrado enviado a Dra. Marcela Restrepo.', 'lock');
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto px-gutter py-space-lg flex flex-col gap-space-xl">
      {/* Header de bienvenida y estatus empático */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-lg lg:p-space-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-56 h-56 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps tracking-wider uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              Espacio Seguro Personal
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Hola, Camila Morales 👋
            </h1>
            <p className="font-body-base text-body-base text-on-surface-variant">
              Plan de Acompañamiento Activo:{' '}
              <strong className="text-on-surface font-body-bold">
                Manejo de Ansiedad y Regulación Emocional
              </strong>
              . Tienes una sesión programada en 2 días. Respira, estás dedicando tiempo a ti misma.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-title-md">psychology</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">
                  Progreso Global
                </span>
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  12 Sesiones
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-title-md">sentiment_calm</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">
                  Estado Actual
                </span>
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  Fase de Integración
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjeta Hero: Próxima Sesión */}
      <section className="relative bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="relative lg:col-span-4 min-h-[220px] lg:min-h-full">
            <SafeImage
              src={IMAGES.marcelaHero}
              alt="Dra. Marcela Restrepo"
              className="w-full h-full object-cover"
              fallbackText="MR"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-3 lg:hidden text-on-primary">
              <p className="font-title-md text-title-md font-bold">Dra. Marcela Restrepo</p>
              <p className="font-label-sm text-label-sm opacity-90">
                Psicoterapia Cognitivo-Conductual
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 p-space-lg lg:p-space-xl flex flex-col justify-between gap-space-lg">
            <div className="flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-caps text-label-caps bg-primary text-on-primary">
                  <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
                  PRÓXIMO ENCUENTRO DESTACADO
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('recordatorios-y-notificaciones')}
                  className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm bg-surface-container px-space-sm py-1 rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-body-sm text-primary">
                    verified
                  </span>
                  <span>Recordatorio activo: WhatsApp &amp; Correo</span>
                </button>
              </div>

              <div className="hidden lg:block">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Dra. Marcela Restrepo
                </h2>
                <p className="font-body-base text-body-base text-on-surface-variant">
                  Especialista en Psicoterapia Cognitivo-Conductual • Reg. Sanitario N° 84920-CL
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm bg-surface-container-low p-space-md rounded-xl">
                <div className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-title-lg mt-0.5">
                    event
                  </span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">
                      Fecha
                    </span>
                    <span className="font-body-bold text-body-base text-on-surface">
                      Jueves, 24 Octubre
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold block">
                      En 2 días
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-title-lg mt-0.5">
                    schedule
                  </span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">
                      Horario
                    </span>
                    <span className="font-body-bold text-body-base text-on-surface">
                      16:00 - 17:00 hrs
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">
                      Zona Horaria (GMT-5)
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-title-lg mt-0.5">
                    videocam
                  </span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">
                      Modalidad
                    </span>
                    <span className="font-body-bold text-body-base text-on-surface">En Línea</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">
                      Sala Segura Encriptada
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() =>
                  onShowToast(
                    'Sala de Teleconsulta encriptada verificada. Enlace habilitado 10 min antes.',
                    'video_camera_front'
                  )
                }
                className="inline-flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-body-bold text-body-base h-12 px-space-lg rounded-xl shadow-sm transition-all duration-200"
              >
                <span className="material-symbols-outlined text-title-md">video_camera_front</span>
                Ingresar a Sala Virtual
              </button>
              <button
                type="button"
                onClick={() => onNavigate('gestion-y-reprogramacion-de-citas')}
                className="inline-flex items-center justify-center gap-space-xs bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-body-bold text-body-sm h-12 px-space-md rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-body-base">event_repeat</span>
                Reprogramar
              </button>
              <button
                type="button"
                onClick={() =>
                  onShowToast('Evento agregado a tu Google Calendar personal.', 'calendar_add_on')
                }
                className="inline-flex items-center justify-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-body-base text-body-sm h-12 px-space-md rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-body-base">calendar_add_on</span>
                Google Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Layout Dividido: Contenido Principal + Columna Lateral Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Pestañas Interactivas */}
          <div className="bg-surface-container-lowest p-space-xs rounded-xl shadow-sm flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`px-space-md py-space-sm rounded-lg text-body-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'upcoming'
                  ? 'font-body-bold bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Próximas Citas
              <span
                className={`px-1.5 py-0.5 rounded-full text-label-sm ${
                  activeTab === 'upcoming'
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                3
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-space-md py-space-sm rounded-lg text-body-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'history'
                  ? 'font-body-bold bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Historial de Sesiones
              <span
                className={`px-1.5 py-0.5 rounded-full text-label-sm ${
                  activeTab === 'history'
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                12
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`px-space-md py-space-sm rounded-lg text-body-sm transition-all ${
                activeTab === 'notes'
                  ? 'font-body-bold bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Notas y Tareas Terapéuticas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`px-space-md py-space-sm rounded-lg text-body-sm transition-all ${
                activeTab === 'docs'
                  ? 'font-body-bold bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Documentos &amp; Facturación
            </button>
          </div>

          {activeTab === 'upcoming' && (
            <section className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-title-lg text-on-surface">
                  Próximos Encuentros Reservados
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Sincronizado con huso horario de Bogotá (COT)
                </span>
              </div>

              {/* Tarjeta Cita 1 */}
              <article className="bg-surface-container-lowest p-space-md lg:p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="flex flex-col items-center justify-center bg-surface-container text-primary font-body-bold w-16 h-16 rounded-xl flex-shrink-0">
                    <span className="font-label-sm uppercase tracking-wider">NOV</span>
                    <span className="font-headline-md leading-none">02</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-title-md text-on-surface font-semibold">
                        Dra. Marcela Restrepo
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm bg-[#E8F5E9] text-[#2E7D32]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mr-1" />
                        Confirmada
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      Enfoque: Técnicas de Reestructuración Cognitiva y Desescalada
                    </p>
                    <div className="flex flex-wrap items-center gap-space-md text-label-sm text-on-surface-variant mt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-body-sm">schedule</span>
                        16:00 - 17:00 hrs
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-body-sm">videocam</span>
                        Google Meet
                      </span>
                      <span className="font-body-bold text-on-surface">$55 USD • Pagado</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs md:self-center">
                  <button
                    type="button"
                    onClick={() => onNavigate('proximas-citas')}
                    className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-bold text-body-sm transition-colors"
                  >
                    Detalles
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('gestion-y-reprogramacion-de-citas')}
                    className="w-10 h-10 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
                    title="Reprogramar o gestionar"
                  >
                    <span className="material-symbols-outlined text-title-md">more_vert</span>
                  </button>
                </div>
              </article>

              {/* Tarjeta Cita 2 */}
              <article className="bg-surface-container-lowest p-space-md lg:p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="flex flex-col items-center justify-center bg-surface-container text-primary font-body-bold w-16 h-16 rounded-xl flex-shrink-0">
                    <span className="font-label-sm uppercase tracking-wider">NOV</span>
                    <span className="font-headline-md leading-none">16</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-title-md text-on-surface font-semibold">
                        Dra. Marcela Restrepo
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm bg-[#E8F5E9] text-[#2E7D32]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mr-1" />
                        Confirmada
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      Enfoque: Evaluación de Bitácora Semanal y Autocuidado
                    </p>
                    <div className="flex flex-wrap items-center gap-space-md text-label-sm text-on-surface-variant mt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-body-sm">schedule</span>
                        16:00 - 17:00 hrs
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-body-sm">apartment</span>
                        Consultorio 302 (Presencial)
                      </span>
                      <span className="font-body-bold text-on-surface">$55 USD • Pagado</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs md:self-center">
                  <button
                    type="button"
                    onClick={() => onNavigate('proximas-citas')}
                    className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-bold text-body-sm transition-colors"
                  >
                    Detalles
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('gestion-y-reprogramacion-de-citas')}
                    className="w-10 h-10 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
                    title="Reprogramar o gestionar"
                  >
                    <span className="material-symbols-outlined text-title-md">more_vert</span>
                  </button>
                </div>
              </article>
            </section>
          )}

          {activeTab === 'history' && (
            <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-on-surface">Historial de 12 Sesiones</h3>
                <button
                  type="button"
                  onClick={() => onNavigate('mi-perfil-de-paciente')}
                  className="text-body-sm font-body-bold text-primary hover:underline"
                >
                  Ver expediente completo →
                </button>
              </div>
              {[
                { date: '10 Oct 2024', title: 'Sesión #12 • Desensibilización Sistemática', doc: 'Dra. Marcela Restrepo' },
                { date: '26 Sep 2024', title: 'Sesión #11 • Patrones de Rumiación Somática', doc: 'Dra. Marcela Restrepo' },
                { date: '12 Sep 2024', title: 'Interconsulta • Control Farmacológico', doc: 'Dr. Camilo Arboleda' },
              ].map((s) => (
                <div
                  key={s.title}
                  className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-label-sm text-primary font-semibold">{s.date}</span>
                    <p className="font-title-md text-on-surface">{s.title}</p>
                    <span className="text-body-sm text-on-surface-variant">{s.doc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onShowToast(`Resumen clínico de "${s.title}" abierto.`, 'clinical_notes')}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary text-body-sm font-body-bold"
                  >
                    Ver Resumen
                  </button>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'notes' && (
            <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md">
              <h3 className="font-title-lg text-on-surface">
                Notas y Tareas Terapéuticas Asignadas
              </h3>
              <div className="p-space-md rounded-xl bg-surface-container-low space-y-2">
                <span className="text-label-caps text-primary uppercase">
                  Tarea Activa • Semana del 21 Oct
                </span>
                <p className="font-body-bold text-on-surface">
                  Registro de Pensamientos Automáticos y Pausa de Respiración 4-7-8
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Anota 1 evento estresante diario, emoción percibida (0-10) y evidencia alternativa.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'docs' && (
            <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-sm">
              <h3 className="font-title-lg text-on-surface">Documentos &amp; Recibos de Pago</h3>
              <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-body-bold text-on-surface">Recibo #4092 • Sesión 10 Oct</p>
                  <p className="text-label-sm text-on-surface-variant">
                    $55.00 USD • Stripe Visa •••• 4120
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onShowToast('Descargando comprobante PDF #4092...', 'download')}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-body-sm font-body-bold"
                >
                  Descargar PDF
                </button>
              </div>
            </section>
          )}

          {/* Historial Reciente con Descarga de Resumen Clínico */}
          <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface">
                  Última Sesión Concluida
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  10 de Octubre, 2024 • Sesión individual #12
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm bg-[#ECEFF1] text-[#455A64]">
                Completada
              </span>
            </div>
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
              <span className="font-label-caps text-primary uppercase">
                Evolución Clínica • Resumen Paciente
              </span>
              <p className="font-body-base text-body-base text-on-surface">
                “Camila presentó significativos avances en la identificación temprana de
                somatizaciones por sobrecarga laboral. Se establecieron micro-pausas y técnica de
                anclaje de 5 sentidos.”
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() =>
                  onShowToast(
                    'Resumen Clínico & Tareas Sesión #12 descargado en PDF cifrado.',
                    'download_for_offline'
                  )
                }
                className="inline-flex items-center gap-space-xs text-primary hover:text-primary-container font-body-bold text-body-sm transition-colors"
              >
                <span className="material-symbols-outlined text-title-md">
                  download_for_offline
                </span>
                Descargar Resumen Clínico &amp; Tareas (PDF Seguro)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('especialistas-y-perfil-profesional')}
                className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-body-bold text-body-sm transition-colors"
              >
                <span className="material-symbols-outlined text-body-base">replay</span>
                Volver a agendar con Dra. Marcela
              </button>
            </div>
          </section>
        </div>

        {/* Columna Lateral Derecha (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Agendar Nueva Consulta con Filtro */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-on-surface font-semibold">
                ¿Necesitas una nueva sesión?
              </span>
              <span className="material-symbols-outlined text-primary text-title-lg">
                add_circle
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('directorio-de-psicologos')}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-bold text-body-base flex items-center justify-center gap-space-xs shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-title-md">calendar_today</span>
              Agendar Nueva Consulta (+)
            </button>
            <div>
              <span className="text-label-sm text-on-surface-variant block mb-2">
                Filtro rápido por especialidad requerida:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Ansiedad y Estrés',
                  'Duelo',
                  'Terapia de Pareja',
                  'Autoestima',
                  'Burnout',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedSpecialtyFilter(tag);
                      onNavigate('directorio-de-psicologos');
                      onShowToast(`Filtrando especialistas en ${tag}.`, 'filter_list');
                    }}
                    className={`px-2.5 py-1 rounded-full text-label-sm transition-colors ${
                      selectedSpecialtyFilter === tag
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'bg-surface-container text-on-surface-variant hover:bg-primary hover:text-on-primary'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Diario Emocional Semanal */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-on-surface font-semibold">
                Registro Emocional Semanal
              </h3>
              <span className="material-symbols-outlined text-tertiary-container text-title-md">
                favorite
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              ¿Cómo te has sentido hoy? Tu terapeuta puede consultar esta evolución antes de tu
              sesión.
            </p>

            <div className="grid grid-cols-5 gap-1.5 py-1">
              {MOOD_OPTIONS.map((m) => {
                const isSelected = selectedMood === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    title={m.title}
                    onClick={() => {
                      setSelectedMood(m.key);
                      onShowToast(
                        `Estado emocional "${m.title}" registrado en tu bitácora.`,
                        'sentiment_satisfied'
                      );
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors group ${
                      isSelected
                        ? 'bg-primary-fixed text-primary ring-2 ring-primary/30'
                        : 'bg-surface-container-low hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {m.emoji}
                    </span>
                    <span
                      className={`text-[10px] mt-1 ${
                        isSelected ? 'font-bold text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
              <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
                <span>Tendencia últimos 7 días</span>
                <span className="text-primary font-body-bold">Estabilidad +14%</span>
              </div>
              <svg
                className="w-full h-12 text-primary"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 200 48"
              >
                <path
                  d="M 0,38 C 30,35 45,42 70,26 C 95,10 120,30 145,18 C 170,6 185,14 200,12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <circle className="fill-primary" cx="200" cy="12" r="3.5" />
              </svg>
              <div className="flex justify-between text-[10px] text-outline">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Hoy</span>
              </div>
            </div>
          </div>

          {/* Contacto Directo por Chat Seguro con el Terapeuta */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="relative">
                  <SafeImage
                    src={IMAGES.marcelaChat}
                    alt="Dra. Marcela Restrepo"
                    className="w-10 h-10 rounded-full object-cover"
                    fallbackText="MR"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2E7D32] ring-2 ring-surface-container-lowest" />
                </div>
                <div>
                  <h4 className="font-body-bold text-body-sm text-on-surface">
                    Dra. Marcela Restrepo
                  </h4>
                  <span className="text-label-sm text-[#2E7D32]">En línea • Asignada</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-title-md">lock</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-space-sm rounded-xl text-body-sm ${
                    msg.fromMe
                      ? 'bg-primary text-on-primary ml-6'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[10px] block text-right mt-1 ${
                      msg.fromMe ? 'text-primary-fixed' : 'text-outline'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-xl"
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="bg-transparent text-body-sm text-on-surface placeholder:text-outline focus:outline-none w-full"
                placeholder="Escribir mensaje confidencial..."
                type="text"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center flex-shrink-0 hover:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined text-body-base">send</span>
              </button>
            </form>
          </div>

          {/* Banner de Soporte / Asistencia de Crisis Rápida */}
          <div className="bg-tertiary-fixed p-space-md rounded-xl flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-tertiary text-headline-md flex-shrink-0">
              sos
            </span>
            <div className="flex flex-col">
              <span className="font-body-bold text-body-sm text-on-tertiary-fixed">
                ¿Estás en un momento de crisis?
              </span>
              <span className="text-body-sm text-on-tertiary-fixed-variant">
                Línea gratuita de contención 24/7 disponible
              </span>
              <button
                type="button"
                onClick={() =>
                  onShowToast(
                    'Conectando con Línea de Contención 24/7 (Marcación 106). Respira profundo.',
                    'sos'
                  )
                }
                className="text-left text-label-sm text-tertiary font-bold underline mt-0.5"
              >
                Acceder a Asistencia Inmediata
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
