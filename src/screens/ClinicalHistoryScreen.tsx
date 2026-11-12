import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { ScreenRoute, SoapNote } from '../types';
import { SafeImage } from '../components/SafeImage';

interface ClinicalHistoryScreenProps {
  soapNotes: SoapNote[];
  onAddSoapNote: (note: SoapNote) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onNavigate: (route: ScreenRoute) => void;
}

export const ClinicalHistoryScreen: React.FC<ClinicalHistoryScreenProps> = ({
  soapNotes,
  onAddSoapNote,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'notas' | 'anamnesis' | 'tests' | 'plan' | 'consent'>('notas');
  const [consultDate, setConsultDate] = useState('2024-11-20');
  const [timeSlot, setTimeSlot] = useState('16:00 - 16:50 (50 min)');
  const [modality, setModality] = useState('Videoconsulta Encriptada');
  const [subjective, setSubjective] = useState(
    'Refiere disminución apreciable de episodios de angustia paroxística en horario laboral. Manifiesta haber aplicado la técnica de pausa cognitiva al detectar ideas intrusivas sobre errores en el proyecto arquitectónico. Señala mejor descanso nocturno (promedio 6.5 horas continuas sin despertares en sobresalto).'
  );
  const [objective, setObjective] = useState(
    'Paciente lúcida, orientada en las tres esferas. Presentación personal prolija. Mantiene contacto visual espontáneo. Tono de voz pausado. Ausencia de temblor distal visible en manos durante el diálogo.'
  );
  const [analysis, setAnalysis] = useState(
    'Consolidación positiva de la reestructuración cognitiva para distorsiones de catastrofización. Se observa mayor tolerancia a la incertidumbre laboral. La respuesta de escape fisiológico ha cedido ante la práctica de respiración diafragmática 4-7-8.'
  );
  const [showSaveToast, setShowSaveToast] = useState(false);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNumber = (soapNotes[0]?.id || 12) + 1;
    const newNote: SoapNote = {
      id: nextNumber,
      title: `Sesión ${nextNumber}: Evolución Terapéutica (${modality.split(' ')[0]})`,
      dateTime: `${consultDate} • ${timeSlot.split(' ')[0]} hs`,
      subjective,
      objective,
      analysis,
      plan: 'Continuar autoregistro ABC y ventana de preocupación delimitada (15 min diarios).',
      signedBy: 'Dra. Sofía Mendoza • MP 4182',
      hash: `${Math.random().toString(16).slice(2, 7)}...${Math.random().toString(16).slice(2, 5)}`,
      isDefaultOpen: true,
    };
    onAddSoapNote(newNote);
    setShowSaveToast(true);
    onShowToast(`Nota clínica #${nextNumber} firmada y sellada en historial.`, 'verified');
  };

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-gutter py-space-lg">
      <div className="absolute top-12 right-20 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-80 left-10 w-72 h-72 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Cabecera del Expediente Clínico */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg md:p-space-xl mb-space-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md mb-space-md bg-surface-container-low/60 -mx-space-lg -mt-space-lg md:-mx-space-xl md:-mt-space-xl px-space-lg md:px-space-xl py-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              EXPEDIENTE CIFRADO AES-256 • ACCESO CLÍNICO RESTRINGIDO
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm hidden sm:inline">
              HCD: PG-84920-VAL
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary font-body-sm text-body-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-body-bold text-on-surface">Consentimiento CU-06:</span>
            <span className="text-on-surface-variant">
              Firmado digitalmente • Válido Ley 1090 de 2006
            </span>
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex items-start md:items-center gap-space-md">
            <div className="relative shrink-0">
              <SafeImage
                src={IMAGES.camilaHistory}
                alt="Camila Morales Valencia"
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-sm ring-4 ring-surface-container"
                fallbackText="CM"
              />
              <span className="absolute -bottom-1 -right-1 bg-surface-container-lowest p-1 rounded-full shadow-sm text-primary">
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-space-xs mb-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase">
                  HISTORIAL CLÍNICO INDIVIDUAL
                </span>
                <span className="text-outline text-label-sm">•</span>
                <span className="font-label-sm text-label-sm text-primary font-semibold">
                  ID #PG-84920
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-1">
                Camila Morales Valencia
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex flex-wrap items-center gap-x-space-md gap-y-1">
                <span>
                  <strong className="font-body-bold text-on-surface">Edad:</strong> 29 años (14/08/1995)
                </span>
                <span>
                  <strong className="font-body-bold text-on-surface">Ocupación:</strong> Arquitecta de Software
                </span>
                <span>
                  <strong className="font-body-bold text-on-surface">Sesiones acumuladas:</strong>{' '}
                  {soapNotes.length + 9} sesiones
                </span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-caps text-label-caps font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  CIE-11: 6B00 / DSM-5: F41.1
                </span>
                <span className="font-body-sm text-body-sm text-primary font-semibold bg-primary-fixed/40 px-3 py-1 rounded-lg">
                  Trastorno de Ansiedad Generalizada con predominio de rumiación cognitiva
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm shrink-0 self-end lg:self-center">
            <button
              type="button"
              onClick={() => onShowToast('Exportando Historia Clínica Digital (PDF cifrado)...', 'print')}
              className="flex items-center gap-2 px-space-md py-3 rounded-xl bg-surface-container-low text-on-surface font-body-bold text-body-sm hover:bg-surface-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
              <span>Exportar HCD</span>
            </button>
            <button
              type="button"
              onClick={() => onShowToast('Solicitud de interconsulta enviada a Dr. Camilo Arboleda.', 'swap_horiz')}
              className="flex items-center gap-2 px-space-md py-3 rounded-xl bg-secondary-container/40 text-on-secondary-container font-body-bold text-body-sm hover:bg-secondary-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              <span>Interconsulta</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('notas');
                document.getElementById('soap-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-space-lg py-3 rounded-xl bg-primary text-on-primary font-body-bold text-body-sm shadow-md hover:bg-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">rate_review</span>
              <span>+ Nueva Nota Evolución</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Pestañas de Navegación del Expediente Clínico */}
      <div className="w-full mb-space-lg">
        <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-xl overflow-x-auto shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('notas')}
            className={`flex items-center gap-2 px-space-md py-2.5 rounded-lg text-body-sm whitespace-nowrap transition-colors ${
              activeTab === 'notas'
                ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history_edu</span>
            <span>Notas de Evolución (Activa)</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps">
              {soapNotes.length + 9}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('anamnesis')}
            className={`flex items-center gap-2 px-space-md py-2.5 rounded-lg text-body-sm whitespace-nowrap transition-colors ${
              activeTab === 'anamnesis'
                ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
            <span>Anamnesis e Ingreso</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-space-md py-2.5 rounded-lg text-body-sm whitespace-nowrap transition-colors ${
              activeTab === 'tests'
                ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Tests y Psicométricos</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
              GAD-7 / BDI
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 px-space-md py-2.5 rounded-lg text-body-sm whitespace-nowrap transition-colors ${
              activeTab === 'plan'
                ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">flag</span>
            <span>Plan de Tratamiento y Objetivos</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('consent')}
            className={`flex items-center gap-2 px-space-md py-2.5 rounded-lg text-body-sm whitespace-nowrap transition-colors ${
              activeTab === 'consent'
                ? 'bg-surface-container-lowest text-primary font-body-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Consentimientos (CU-06)</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Structure */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left Column */}
        {activeTab === 'notas' ? (
          <section
            id="soap-section"
            className="xl:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg md:p-space-xl flex flex-col gap-space-lg"
          >
            <div className="flex items-center justify-between pb-space-sm bg-surface-container-low/40 -mx-space-lg -mt-space-lg md:-mx-space-xl md:-mt-space-xl px-space-lg md:px-space-xl py-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="p-2 rounded-xl bg-primary text-on-primary shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">edit_note</span>
                </span>
                <div>
                  <span className="font-label-caps text-label-caps text-primary tracking-wide">
                    CU-14 REGISTRO CLÍNICO
                  </span>
                  <h2 className="font-title-lg text-title-lg text-on-surface">
                    Nueva Nota de Evolución Terapéutica
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Sesión #{(soapNotes[0]?.id || 12) + 1} • Sesión en curso
                </span>
                <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-caps text-label-caps">
                  Teleconsulta
                </span>
              </div>
            </div>

            <form className="flex flex-col gap-space-md" onSubmit={handleSaveNote}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm p-space-sm bg-surface-container-low rounded-xl">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Fecha de la Consulta
                  </label>
                  <input
                    value={consultDate}
                    onChange={(e) => setConsultDate(e.target.value)}
                    className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none shadow-sm"
                    type="date"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Hora Inicio / Fin
                  </label>
                  <input
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none shadow-sm"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Modalidad
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none shadow-sm"
                  >
                    <option>Videoconsulta Encriptada</option>
                    <option>Presencial - Consultorio 302</option>
                  </select>
                </div>
              </div>

              {/* S - Subjetivo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-title-md text-title-md text-on-surface">
                    <span className="w-6 h-6 rounded-md bg-primary-fixed text-primary font-label-caps text-label-caps flex items-center justify-center">
                      S
                    </span>
                    <span>Subjetivo (Relato de la Paciente)</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Motivo de consulta y auto-reporte
                  </span>
                </div>
                <textarea
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  className="w-full bg-surface-container-low/60 rounded-xl p-3 font-body-base text-body-base text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-sm leading-relaxed"
                  rows={3}
                />
              </div>

              {/* O - Objetivo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-title-md text-title-md text-on-surface">
                    <span className="w-6 h-6 rounded-md bg-secondary-fixed text-secondary font-label-caps text-label-caps flex items-center justify-center">
                      O
                    </span>
                    <span>Objetivo (Examen Mental &amp; Observación Clínica)</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Signos observables y comportamiento
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {[
                    'Afecto modulado',
                    'Discurso coherente',
                    'Introspección ++',
                    'Sin agitación motora',
                  ].map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        check_circle
                      </span>
                      {item}
                    </span>
                  ))}
                </div>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-surface-container-low/60 rounded-xl p-3 font-body-base text-body-base text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-sm leading-relaxed"
                  rows={2}
                />
              </div>

              {/* A - Análisis */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-title-md text-title-md text-on-surface">
                    <span className="w-6 h-6 rounded-md bg-tertiary-fixed text-tertiary font-label-caps text-label-caps flex items-center justify-center">
                      A
                    </span>
                    <span>Análisis (Evaluación Terapéutica y Dinámica)</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Hipótesis y asimilación técnica
                  </span>
                </div>
                <textarea
                  value={analysis}
                  onChange={(e) => setAnalysis(e.target.value)}
                  className="w-full bg-surface-container-low/60 rounded-xl p-3 font-body-base text-body-base text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-sm leading-relaxed"
                  rows={3}
                />
              </div>

              {/* P - Plan */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-title-md text-title-md text-on-surface">
                    <span className="w-6 h-6 rounded-md bg-surface-container-highest text-on-surface-variant font-label-caps text-label-caps flex items-center justify-center">
                      P
                    </span>
                    <span>Plan Terapéutico y Tareas Inter-sesión</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Intervenciones para la semana
                  </span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-xl space-y-2">
                  {[
                    '1. Continuar autoregistro ABC de pensamientos automáticos en la app móvil.',
                    '2. Técnica de Anclaje de 5 Sentidos (Grounding) ante taquicardia situacional.',
                    '3. Programar ventana de preocupación delimitada (15 min diarios máximo).',
                  ].map((task) => (
                    <div key={task} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        task_alt
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-space-sm bg-surface-container-low/40 p-space-md rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    event_repeat
                  </span>
                  <div>
                    <span className="block font-label-caps text-label-caps text-on-surface-variant">
                      PRÓXIMA SESIÓN PROGRAMADA
                    </span>
                    <span className="font-body-bold text-body-sm text-on-surface">
                      Miércoles 27 de Noviembre, 16:00 hs
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => onShowToast('Borrador clínico guardado localmente.', 'save')}
                    className="px-space-md py-2.5 rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-high transition-colors"
                  >
                    Borrador
                  </button>
                  <button
                    className="flex items-center gap-2 px-space-lg py-3 rounded-xl bg-primary text-on-primary font-body-bold text-body-sm shadow-md hover:bg-primary-container transition-all"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[18px]">draw</span>
                    <span>Guardar y Firmar Nota (Inmutable)</span>
                  </button>
                </div>
              </div>

              {showSaveToast && (
                <div className="p-3 rounded-lg bg-surface-container text-primary font-body-sm text-body-sm flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">verified</span>
                    <span>
                      Nota clínica #{soapNotes[0]?.id} registrada con éxito. Sello de tiempo criptográfico inmutable generado según normativa de historia clínica.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSaveToast(false)}
                    className="text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}
            </form>
          </section>
        ) : (
          <section className="xl:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg md:p-space-xl flex flex-col gap-space-md">
            <h2 className="font-headline-md text-on-surface">
              {activeTab === 'anamnesis' && 'Anamnesis e Historia de Ingreso'}
              {activeTab === 'tests' && 'Batería Psicométrica (GAD-7 & BDI-II)'}
              {activeTab === 'plan' && 'Plan Terapéutico y Objetivos Clínicos'}
              {activeTab === 'consent' && 'Consentimientos Informados Firmados (CU-06)'}
            </h2>
            <div className="p-space-md rounded-xl bg-surface-container-low space-y-2">
              <p className="font-body-base text-on-surface">
                {activeTab === 'anamnesis' &&
                  'Motivo de consulta inicial (Mayo 2024): Episodios de ansiedad anticipatoria asociados a entregas de proyectos críticos y dificultad para conciliar el sueño.'}
                {activeTab === 'tests' &&
                  'GAD-7 inicial: 18/21 (Ansiedad Severa) → Actual (Semana 12): 6/21 (Ansiedad Leve). BDI-II: 9/63 (Mínimo).'}
                {activeTab === 'plan' &&
                  'Objetivo 1: Identificar y reestructurar pensamientos catastróficos (Logrado 85%). Objetivo 2: Establecer higiene del sueño de 7 horas continuas (En progreso).'}
                {activeTab === 'consent' &&
                  'Documento firmado digitalmente el 14/05/2024 con verificación biométrica y respaldo bajo Ley 1090 de 2006 y estándares HIPAA.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('notas')}
              className="self-start px-4 py-2 rounded-xl bg-primary text-on-primary font-body-bold text-body-sm"
            >
              Volver a Notas SOAP
            </button>
          </section>
        )}

        {/* Right Column: Evolución Visual & Historial de Notas Previas */}
        <section className="xl:col-span-5 flex flex-col gap-space-lg">
          {/* GAD-7 Curve Chart */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-label-caps text-label-caps text-primary tracking-wide">
                  MONITOREO DE ANSIEDAD
                </span>
                <h3 className="font-title-lg text-title-lg text-on-surface">
                  Curva Evolutiva GAD-7
                </h3>
              </div>
              <div className="text-right">
                <span className="font-label-caps text-label-caps text-on-surface-variant block">
                  ÚLTIMO PUNTAJE
                </span>
                <span className="font-headline-md text-headline-md text-primary font-bold tabular-nums">
                  6{' '}
                  <span className="text-label-sm font-normal text-on-surface-variant">
                    / 21 (Leve)
                  </span>
                </span>
              </div>
            </div>

            <div className="relative w-full h-44 bg-surface-container-low rounded-xl p-3 flex flex-col justify-between">
              <div className="flex justify-between text-label-sm text-on-surface-variant">
                <span>Nivel Severo (15-21)</span>
                <span>Semana 1 → Semana 12</span>
              </div>
              <svg className="w-full h-24 overflow-visible" fill="none" viewBox="0 0 360 80">
                <line
                  className="text-surface-container-highest"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  x1="0"
                  x2="360"
                  y1="15"
                  y2="15"
                />
                <line
                  className="text-surface-container-highest"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  x1="0"
                  x2="360"
                  y1="45"
                  y2="45"
                />
                <line
                  className="text-surface-container-highest"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  x1="0"
                  x2="360"
                  y1="70"
                  y2="70"
                />
                <defs>
                  <linearGradient id="curveGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#245347" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#245347" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 12 Q 70 20, 130 35 T 250 55 T 350 68 L 350 80 L 10 80 Z"
                  fill="url(#curveGradient)"
                />
                <path
                  d="M 10 12 Q 70 20, 130 35 T 250 55 T 350 68"
                  fill="none"
                  stroke="#245347"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
                <circle className="fill-error" cx="10" cy="12" r="4.5" />
                <text className="text-[10px] fill-on-surface-variant font-medium" textAnchor="middle" x="10" y="8">
                  18
                </text>
                <circle className="fill-tertiary" cx="130" cy="35" r="4" />
                <text className="text-[10px] fill-on-surface-variant font-medium" textAnchor="middle" x="130" y="30">
                  13
                </text>
                <circle className="fill-primary" cx="250" cy="55" r="4" />
                <text className="text-[10px] fill-on-surface-variant font-medium" textAnchor="middle" x="250" y="50">
                  9
                </text>
                <circle className="fill-primary" cx="350" cy="68" r="5" />
                <text className="text-[10px] fill-primary font-bold" textAnchor="middle" x="350" y="63">
                  6
                </text>
              </svg>
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                <span>S1 (Ingreso: 18)</span>
                <span>S4 (13)</span>
                <span>S8 (9)</span>
                <span className="font-body-bold text-primary">S12 (Actual: 6 - Ansiedad Leve)</span>
              </div>
            </div>

            <div className="mt-space-sm p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between text-body-sm">
              <span className="text-on-surface-variant">Reducción sintomática acumulada:</span>
              <span className="font-body-bold text-primary flex items-center gap-1 tabular-nums">
                <span className="material-symbols-outlined text-[16px]">trending_down</span>
                -66.6% en 12 semanas
              </span>
            </div>
          </div>

          {/* Historial de Evolución (CU-15) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                <h3 className="font-title-lg text-title-lg text-on-surface">
                  Historial de Evolución (CU-15)
                </h3>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-md">
                {soapNotes.length + 9} Notas Firmadas
              </span>
            </div>

            <div className="space-y-space-sm">
              {soapNotes.map((note) => (
                <details
                  key={note.id}
                  open={note.isDefaultOpen}
                  className="group bg-surface-container-low/60 hover:bg-surface-container-low rounded-xl overflow-hidden transition-all"
                >
                  <summary className="list-none p-space-md cursor-pointer flex items-center justify-between select-none">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-body-bold text-body-sm tabular-nums">
                        #{note.id}
                      </div>
                      <div>
                        <h4 className="font-title-md text-title-md text-on-surface leading-tight">
                          {note.title}
                        </h4>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {note.dateTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps hidden sm:inline">
                        Firmado Digital
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                        expand_more
                      </span>
                    </div>
                  </summary>
                  <div className="p-space-md pt-0 text-body-sm text-on-surface-variant space-y-2">
                    <p>
                      <strong className="font-body-bold text-on-surface">S:</strong> {note.subjective}
                    </p>
                    {note.objective && (
                      <p>
                        <strong className="font-body-bold text-on-surface">O:</strong>{' '}
                        {note.objective}
                      </p>
                    )}
                    {note.analysis && (
                      <p>
                        <strong className="font-body-bold text-on-surface">A:</strong>{' '}
                        {note.analysis}
                      </p>
                    )}
                    {note.plan && (
                      <p>
                        <strong className="font-body-bold text-on-surface">P:</strong> {note.plan}
                      </p>
                    )}
                    <div className="pt-2 flex items-center justify-between font-label-sm text-label-sm text-outline">
                      <span>Firma: {note.signedBy}</span>
                      <span className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-[14px]">lock</span> Hash:{' '}
                        {note.hash}
                      </span>
                    </div>
                  </div>
                </details>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                onShowToast('Mostrando las 12 notas clínicas archivadas en expediente.', 'folder_open')
              }
              className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-body-bold text-body-sm transition-colors text-center flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              <span>Ver las {soapNotes.length + 9} notas clínicas anteriores archivadas</span>
            </button>
          </div>

          {/* Conformidad Legal */}
          <div className="bg-surface-container-low/50 rounded-xl p-space-md flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">
              policy
            </span>
            <div className="min-w-0">
              <h4 className="font-body-bold text-body-sm text-on-surface">
                Conformidad Legal y Ética (Ley 1090)
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Toda evolución registrada en este expediente constituye documento privado sujeto a reserva legal. Los accesos quedan auditados en la bitácora de seguridad bajo la firma digital del profesional tratante.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
