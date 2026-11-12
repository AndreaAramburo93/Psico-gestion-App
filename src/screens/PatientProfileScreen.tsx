import React, { useState } from 'react';
import { IMAGES, INITIAL_SPECIALISTS } from '../data/mockData';
import { ScreenRoute, Specialist } from '../types';
import { SafeImage } from '../components/SafeImage';

interface PatientProfileScreenProps {
  onNavigate: (route: ScreenRoute) => void;
  onSelectSpecialistProfile: (specialist: Specialist) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

const APPOINTMENTS_HISTORY = [
  {
    id: 'h-1',
    category: 'Futuras' as const,
    month: 'OCT',
    day: '24',
    status: 'Confirmada',
    modality: 'En Línea / Meet',
    timeOrDuration: '10:00 AM - 10:50 AM',
    title: 'Sesión #13: Revisión de Estrategias Cognitivas en Ambientes de Presión',
    doctor: 'Dra. Marcela Restrepo',
    role: 'Psicoterapeuta Principal',
    avatar: IMAGES.marcelaDir,
    actionLabel: 'Ingresar a Sala',
    isFuture: true,
  },
  {
    id: 'h-2',
    category: 'Asistidas' as const,
    month: 'OCT',
    day: '10',
    status: 'Completada / Asistida',
    modality: 'En Línea',
    timeOrDuration: 'Duración: 52 min',
    title: 'Desensibilización Sistemática y Límites Interpersonales',
    doctor: 'Dra. Marcela Restrepo',
    role: 'Psicoterapeuta Principal',
    avatar: IMAGES.marcelaChat,
    actionLabel: 'Ver Resumen Clínico & Tareas',
    isFuture: false,
  },
  {
    id: 'h-3',
    category: 'Asistidas' as const,
    month: 'SEP',
    day: '26',
    status: 'Completada / Asistida',
    modality: 'Presencial · Consultorio 408',
    timeOrDuration: 'Duración: 55 min',
    title: 'Evaluación de Patrones de Rumiación y Autoobservación Somática',
    doctor: 'Dra. Marcela Restrepo',
    role: 'Psicoterapeuta Principal',
    avatar: IMAGES.marcelaSession14,
    actionLabel: 'Ver Resumen',
    isFuture: false,
  },
  {
    id: 'h-4',
    category: 'Asistidas' as const,
    month: 'SEP',
    day: '12',
    status: 'Completada / Asistida',
    modality: 'En Línea',
    timeOrDuration: 'Seguimiento Farmacológico',
    title: 'Control de Titulación Farmacológica & Higiene del Sueño',
    doctor: 'Dr. Camilo Arboleda',
    role: 'Médico Psiquiatra',
    avatar: IMAGES.camiloProfileCard,
    actionLabel: 'Ver Receta / Pauta',
    isFuture: false,
  },
  {
    id: 'h-5',
    category: 'Canceladas' as const,
    month: 'AGO',
    day: '28',
    status: 'Reprogramada sin costo',
    modality: 'En Línea',
    timeOrDuration: 'Movida a 29 Ago',
    title: 'Reestructuración de Creencias de Autoexigencia Laboral',
    doctor: 'Dra. Marcela Restrepo',
    role: 'Psicoterapeuta Principal',
    avatar: IMAGES.marcelaDir,
    actionLabel: 'Ver Historial',
    isFuture: false,
  },
];

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  onNavigate,
  onSelectSpecialistProfile,
  onShowToast,
}) => {
  const [innerTab, setInnerTab] = useState<'history' | 'therapists' | 'docs' | 'settings'>(
    'history'
  );
  const [historyFilter, setHistoryFilter] = useState<
    'Todas' | 'Asistidas' | 'Futuras' | 'Canceladas'
  >('Todas');
  const [emergencyContact, setEmergencyContact] = useState(
    'Lucía Valencia (Madre) · +57 314 829 4011'
  );
  const [patientEmail, setPatientEmail] = useState('camila.morales@ejemplo.com');

  const filteredHistory = APPOINTMENTS_HISTORY.filter(
    (item) => historyFilter === 'Todas' || item.category === historyFilter
  );

  return (
    <div className="max-w-[1440px] w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl flex flex-col gap-space-xl">
      {/* Top Notification / Status Banner */}
      <div className="w-full bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm shadow-sm">
        <div className="flex items-center gap-space-sm">
          <span
            className="material-symbols-outlined text-primary text-headline-md shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shield_with_heart
          </span>
          <div>
            <p className="font-title-md text-on-surface">
              Expediente Clínico &amp; Confidencialidad Activa
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Protección conforme a la Ley de Salud Mental y Telemedicina. Acceso restringido y
              cifrado biométrico.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs shrink-0 self-end sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-label-caps shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            EXPEDIENTE SINCRONIZADO
          </span>
        </div>
      </div>

      {/* 1. Cabecera de Perfil de Paciente */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col lg:flex-row gap-space-xl justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg w-full lg:w-auto">
          <div className="relative shrink-0">
            <SafeImage
              src={IMAGES.camilaProfile}
              alt="Camila Morales Valencia"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md"
              fallbackText="CM"
            />
            <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-lg p-1 shadow-sm flex items-center justify-center">
              <span
                className="material-symbols-outlined text-title-md"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-space-xs">
              <h1 className="font-headline-lg text-on-surface tracking-tight">
                Camila Morales Valencia
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps">
                Paciente Regular
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant flex flex-wrap items-center gap-x-space-md gap-y-1 mt-0.5">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-label-caps text-outline">badge</span>
                ID: #PG-84920
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-label-caps text-outline">cake</span>
                29 años
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-label-caps text-outline">
                  location_on
                </span>
                Bogotá / Híbrida
              </span>
            </p>
            <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-primary-container max-w-fit">
              <span className="material-symbols-outlined text-title-md text-tertiary">
                emergency
              </span>
              <p className="text-body-sm">
                Contacto de Emergencia:{' '}
                <strong className="font-body-bold text-on-surface">{emergencyContact}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Resumen Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-sm w-full lg:w-auto shrink-0 bg-surface-container-low p-space-md rounded-xl">
          {[
            { icon: 'event_available', val: '14', label: 'Asistidas con Éxito', color: 'text-primary' },
            { icon: 'schedule', val: '3', label: 'Agendadas Activas', color: 'text-primary-container' },
            { icon: 'event_repeat', val: '1', label: 'Reprogramada', color: 'text-tertiary' },
            { icon: 'groups', val: '2', label: 'Especialistas', color: 'text-secondary' },
            { icon: 'timelapse', val: '12.5', label: 'Horas Terapéuticas', color: 'text-primary' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className={`${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              } flex flex-col items-center justify-center text-center p-2 rounded-lg bg-surface-container-lowest shadow-sm`}
            >
              <div className={`flex items-center gap-1 ${stat.color}`}>
                <span className="material-symbols-outlined text-title-md">{stat.icon}</span>
                <span className="font-headline-md font-bold tabular-nums">{stat.val}</span>
              </div>
              <span className="text-label-sm text-on-surface-variant mt-0.5 leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Pestañas de Navegación Interna */}
      <div className="w-full flex items-center justify-start gap-space-xs overflow-x-auto bg-surface-container-high p-1.5 rounded-xl shadow-inner">
        <button
          type="button"
          onClick={() => setInnerTab('history')}
          className={`px-space-md py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
            innerTab === 'history'
              ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-title-md">history_edu</span>
          Historial de Citas Asistidas &amp; Agendadas
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-caps">
            18
          </span>
        </button>
        <button
          type="button"
          onClick={() => setInnerTab('therapists')}
          className={`px-space-md py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
            innerTab === 'therapists'
              ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-title-md">psychology</span>
          Mis Profesionales y Terapeutas Consultados
        </button>
        <button
          type="button"
          onClick={() => setInnerTab('docs')}
          className={`px-space-md py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
            innerTab === 'docs'
              ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-title-md">folder_shared</span>
          Documentos Clínicos &amp; Facturas
        </button>
        <button
          type="button"
          onClick={() => setInnerTab('settings')}
          className={`px-space-md py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
            innerTab === 'settings'
              ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-title-md">settings</span>
          Datos Personales y Ajustes
        </button>
      </div>

      {/* Layout Grid: Bloque Principal (8 Cols) + Panel Lateral (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {(innerTab === 'history' || innerTab === 'docs') && (
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-space-md">
                <div>
                  <h2 className="font-headline-md text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    {innerTab === 'docs'
                      ? 'Comprobantes y Resúmenes de Sesiones'
                      : 'Historial de Citas y Sesiones'}
                  </h2>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    Control cronológico detallado de interconsultas, psicoterapia y citas futuras
                    programadas.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl shrink-0 overflow-x-auto max-w-full">
                  {(['Todas', 'Asistidas', 'Futuras', 'Canceladas'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setHistoryFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                        historyFilter === tab
                          ? 'bg-primary text-on-primary font-body-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-space-md">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`${
                      item.isFuture
                        ? 'bg-surface-container-low/70 hover:bg-surface-container-low'
                        : 'bg-surface-container-lowest hover:bg-surface-container/30'
                    } rounded-xl p-space-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-sm`}
                  >
                    <div className="flex items-start gap-space-md min-w-0">
                      <div
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 ${
                          item.isFuture
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="font-label-caps uppercase tracking-wider">
                          {item.month}
                        </span>
                        <span className="font-headline-md font-bold leading-none">{item.day}</span>
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-label-caps flex items-center gap-1 ${
                              item.isFuture
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-label-caps">
                              {item.isFuture ? 'event_available' : 'check_circle'}
                            </span>
                            {item.status}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps flex items-center gap-1">
                            {item.modality}
                          </span>
                          <span className="text-body-sm text-outline">{item.timeOrDuration}</span>
                        </div>
                        <h3 className="font-title-md text-on-surface font-semibold truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
                          <SafeImage
                            src={item.avatar}
                            alt={item.doctor}
                            className="w-6 h-6 rounded-full object-cover"
                            fallbackText="DR"
                          />
                          <span>{item.doctor}</span>
                          <span>·</span>
                          <span className="text-primary font-body-bold">{item.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() =>
                          item.isFuture
                            ? onShowToast('Abriendo sala segura Meet de tu sesión #13.', 'video_call')
                            : onShowToast(`Abriendo "${item.actionLabel}" para ${item.title}.`, 'assignment')
                        }
                        className={`px-4 py-2 rounded-xl text-body-sm font-body-bold transition-colors shadow-sm flex items-center gap-1.5 ${
                          item.isFuture
                            ? 'bg-primary text-on-primary hover:bg-primary-container'
                            : 'bg-surface-container-low hover:bg-surface-container-high text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-title-md">
                          {item.isFuture ? 'video_call' : 'assignment'}
                        </span>
                        {item.actionLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          item.isFuture
                            ? onNavigate('gestion-y-reprogramacion-de-citas')
                            : onShowToast('Descargando comprobante fiscal PDF...', 'receipt_long')
                        }
                        className="p-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors"
                        title={item.isFuture ? 'Reprogramar cita' : 'Descargar comprobante'}
                      >
                        <span className="material-symbols-outlined text-title-md">
                          {item.isFuture ? 'edit_calendar' : 'receipt_long'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-space-sm flex items-center justify-between">
                <span className="text-body-sm text-on-surface-variant">
                  Mostrando {filteredHistory.length} de 18 registros clínicos
                </span>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('Todas')}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-body-bold text-body-sm transition-colors flex items-center gap-1"
                >
                  Ver Historial Completo
                  <span className="material-symbols-outlined text-body-base">expand_more</span>
                </button>
              </div>
            </div>
          )}

          {innerTab === 'settings' && (
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
              <h2 className="font-headline-md text-on-surface">
                Datos Personales y Contacto de Emergencia
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-1">
                    Contacto de Emergencia
                  </label>
                  <input
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-body-sm text-on-surface"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onShowToast('Preferencias y contacto de emergencia actualizados.', 'verified')
                }
                className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary text-body-sm font-body-bold"
              >
                Guardar Cambios
              </button>
            </div>
          )}

          {/* 4. Sección Destacada: Terapeutas y Profesionales Consultados */}
          {(innerTab === 'history' || innerTab === 'therapists') && (
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-space-sm">
                <div>
                  <h2 className="font-headline-md text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">medical_services</span>
                    Terapeutas y Profesionales Consultados
                  </h2>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    Especialistas acreditados vinculados a tu expediente clínico individual.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps self-start sm:self-auto">
                  2 Especialistas Vinculados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Profesional 1: Dra. Marcela Restrepo */}
                <div className="bg-surface-container-low/50 hover:bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md shadow-sm transition-all">
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <SafeImage
                          src={IMAGES.marcelaProfileCard}
                          alt="Dra. Marcela Restrepo"
                          className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0"
                          fallbackText="MR"
                        />
                        <div>
                          <h3 className="font-title-lg text-on-surface font-semibold leading-tight">
                            Dra. Marcela Restrepo
                          </h3>
                          <p className="text-body-sm text-primary font-body-bold">
                            Psicoterapeuta Principal
                          </p>
                          <p className="text-label-sm text-on-surface-variant">
                            Enfoque Cognitivo-Conductual (TCC)
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps shrink-0">
                        En Tratamiento Activo
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-lowest rounded-lg flex items-center justify-between text-on-surface-variant text-body-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-title-md text-primary">
                          history
                        </span>
                        12 sesiones realizadas
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-title-md text-primary">
                          event
                        </span>
                        Frecuencia quincenal
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      Registro profesional MinSalud: #102934-COL. Especialista en regulación del
                      estrés, rumiación mental y perfeccionismo.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
                    <button
                      type="button"
                      onClick={() => onNavigate('mis-citas-paciente')}
                      className="w-full py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-primary font-body-bold text-body-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-title-md">chat</span>
                      Enviar Mensaje
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSpecialistProfile(INITIAL_SPECIALISTS[0]);
                        onNavigate('especialistas-y-perfil-profesional');
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-bold text-body-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-title-md">add_circle</span>
                      Agendar Nueva
                    </button>
                  </div>
                </div>

                {/* Profesional 2: Dr. Camilo Arboleda */}
                <div className="bg-surface-container-low/50 hover:bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md shadow-sm transition-all">
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <SafeImage
                          src={IMAGES.camiloProfileCard}
                          alt="Dr. Camilo Arboleda"
                          className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0"
                          fallbackText="CA"
                        />
                        <div>
                          <h3 className="font-title-lg text-on-surface font-semibold leading-tight">
                            Dr. Camilo Arboleda
                          </h3>
                          <p className="text-body-sm text-secondary font-body-bold">
                            Médico Psiquiatra
                          </p>
                          <p className="text-label-sm text-on-surface-variant">
                            Especialista en Trastornos del Ánimo
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps shrink-0">
                        Seguimiento Periódico
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-lowest rounded-lg flex items-center justify-between text-on-surface-variant text-body-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-title-md text-secondary">
                          repeat
                        </span>
                        2 interconsultas
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-title-md text-secondary">
                          update
                        </span>
                        Próx. control: Nov 2024
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      Registro Médico: #49281-RM. Interconsulta para evaluación biológica de
                      somatización y modulación farmacológica de soporte.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
                    <button
                      type="button"
                      onClick={() =>
                        onShowToast(
                          'Mostrando pauta farmacológica y resumen de interconsultas psiquiátricas.',
                          'quick_reference'
                        )
                      }
                      className="w-full py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-secondary font-body-bold text-body-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-title-md">
                        quick_reference
                      </span>
                      Ver Historial Médico
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSpecialistProfile(INITIAL_SPECIALISTS[3]);
                        onNavigate('especialistas-y-perfil-profesional');
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-secondary hover:bg-on-secondary-container text-on-secondary font-body-bold text-body-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-title-md">schedule_send</span>
                      Solicitar Revisión
                    </button>
                  </div>
                </div>
              </div>

              {/* Banner para agregar nuevo especialista */}
              <div className="p-space-md rounded-xl bg-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-headline-md">person_search</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-on-surface font-semibold">
                      ¿Necesitas una nueva especialidad o interconsulta?
                    </h4>
                    <p className="text-body-sm text-on-surface-variant">
                      Explora neuropsicólogos, terapeutas familiares o especialistas en mindfulness
                      evaluados por la red Psico_Gestión.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('directorio-de-psicologos')}
                  className="px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-bold text-body-sm transition-colors shrink-0 shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-title-md">travel_explore</span>
                  Explorar Directorio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Panel Lateral Clínico (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Proceso Terapéutico */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-title-lg text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology_alt</span>
                Proceso Terapéutico
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-caps">
                Fase 2 de 3
              </span>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
              <span className="font-label-caps text-primary uppercase">
                Objetivo Terapéutico Principal
              </span>
              <p className="font-title-md text-on-surface font-semibold leading-snug">
                Gestión de Ansiedad y Reducción de la Autoexigencia Laboral
              </p>
              <p className="text-body-sm text-on-surface-variant">
                Protocolo TCC enfocado en reestructuración de esquemas desadaptativos de
                sobre-responsabilidad y fortalecimiento del descanso efectivo.
              </p>
            </div>

            <div className="flex flex-col gap-space-xs text-body-sm">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Inicio del Proceso:</span>
                <span className="font-body-bold text-on-surface">15 de Mayo, 2024 (5 meses)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Adherencia Terapéutica:</span>
                <span className="font-body-bold text-primary">94% (Excelente)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Plan de Seguimiento:</span>
                <span className="font-body-bold text-on-surface">Sesiones Quincenales</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low/40 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-on-surface-variant uppercase">
                  Evolución de Bienestar Subjetivo
                </span>
                <span className="font-body-bold text-body-sm text-primary">+38% vs. Inicio</span>
              </div>
              <svg
                className="w-full h-12 text-primary"
                fill="none"
                viewBox="0 0 200 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 40 Q 30 36 60 32 T 120 20 T 160 14 T 200 8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
                <circle cx="200" cy="8" fill="currentColor" r="4" />
              </svg>
              <div className="flex justify-between text-label-sm text-outline">
                <span>Mayo 2024</span>
                <span>Julio</span>
                <span>Octubre 2024</span>
              </div>
            </div>
          </div>

          {/* Certificado Oficial de Asistencia */}
          <div className="bg-primary text-on-primary rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-on-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-title-lg">verified_user</span>
              </div>
              <div>
                <h3 className="font-title-md font-bold text-on-primary">
                  Certificado Oficial de Asistencia
                </h3>
                <p className="text-body-sm text-primary-fixed mt-0.5">
                  Válido para pólizas de salud prepagada, seguros médicos y reembolsos laborales.
                </p>
              </div>
            </div>

            <div className="bg-on-primary/10 rounded-lg p-3 text-body-sm flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-primary-fixed">Periodo emitido:</span>
                <span className="font-bold">Mayo - Octubre 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-fixed">Total sesiones certificadas:</span>
                <span className="font-bold">14 Sesiones</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onShowToast(
                  'Certificado oficial PDF firmado digitalmente descargado (#PG-84920).',
                  'download'
                )
              }
              className="w-full py-3 px-space-md rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-low font-body-bold text-body-base transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-title-md">download</span>
              Descargar Reporte PDF Firmado
            </button>
          </div>

          {/* Consentimientos Informados */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <h3 className="font-title-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">policy</span>
              Consentimientos y Confidencialidad
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Documentos legales y autorizaciones vigentes asociadas a este expediente:
            </p>
            <div className="flex flex-col gap-space-xs">
              {[
                {
                  icon: 'draw',
                  color: 'text-primary',
                  title: 'Consentimiento Telepsicología',
                  sub: 'Firmado digitalmente el 14/05/2024',
                },
                {
                  icon: 'lock_person',
                  color: 'text-secondary',
                  title: 'Acuerdo de Secreto Profesional',
                  sub: 'Ley 1090 de 2006 (Código Deontológico)',
                },
                {
                  icon: 'medication',
                  color: 'text-tertiary',
                  title: 'Consentimiento Interconsulta Psiquiatría',
                  sub: 'Firmado digitalmente el 10/09/2024',
                },
              ].map((doc) => (
                <button
                  key={doc.title}
                  type="button"
                  onClick={() => onShowToast(`Visualizando documento firmado: ${doc.title}`, 'policy')}
                  className="p-3 rounded-lg bg-surface-container-low/60 hover:bg-surface-container-low transition-colors flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-title-md ${doc.color}`}>
                      {doc.icon}
                    </span>
                    <div>
                      <p className="font-body-bold text-body-sm text-on-surface group-hover:text-primary transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-label-sm text-outline">{doc.sub}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-body-base">
                    open_in_new
                  </span>
                </button>
              ))}
            </div>
            <div className="pt-2 text-center">
              <span className="text-label-sm text-outline flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-label-sm text-primary">lock</span>
                Cifrado AES-256 en reposo y en tránsito
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
