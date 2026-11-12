import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { PortalMode, ScreenRoute } from '../types';
import { SafeImage } from '../components/SafeImage';

interface AuthPortalScreenProps {
  onAuthenticated: (mode: PortalMode, destination: ScreenRoute, userName?: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const AuthPortalScreen: React.FC<AuthPortalScreenProps> = ({
  onAuthenticated,
  onShowToast,
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<'patient' | 'therapist'>('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedConsent, setAcceptedConsent] = useState(true);

  const getStrength = () => {
    if (!password) return { level: 0, label: 'Ingresa contraseña', color: 'text-on-surface-variant' };
    if (password.length < 6) return { level: 1, label: 'Débil', color: 'text-tertiary' };
    if (password.length < 10) return { level: 2, label: 'Moderada', color: 'text-primary' };
    return { level: 3, label: 'Óptima para historia médica', color: 'text-primary font-bold' };
  };

  const strength = getStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register' && !acceptedConsent) {
      onShowToast('Debes aceptar el Consentimiento Informado Clínico para continuar.', 'warning');
      return;
    }
    const targetMode: PortalMode = role === 'patient' ? 'patient' : 'clinical';
    const targetRoute: ScreenRoute =
      role === 'patient' ? 'mis-citas-paciente' : 'agenda-y-calendario-terapeutico';
    onAuthenticated(targetMode, targetRoute, fullName.trim() || undefined);
  };

  const handleSocialAuth = (provider: string) => {
    const targetMode: PortalMode = role === 'patient' ? 'patient' : 'clinical';
    const targetRoute: ScreenRoute =
      role === 'patient' ? 'mis-citas-paciente' : 'agenda-y-calendario-terapeutico';
    onShowToast(`Autenticado vía ${provider} con cifrado de grado clínico.`, 'verified_user');
    onAuthenticated(targetMode, targetRoute);
  };

  return (
    <div className="relative w-full overflow-hidden py-space-lg md:py-space-xl flex-1 flex items-center">
      <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-gutter w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-stretch">
          {/* COLUMNA IZQUIERDA */}
          <section className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-sm p-space-lg md:p-space-xl relative overflow-hidden">
            <div className="space-y-space-lg relative z-10">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>ESPACIO CLÍNICO CERTIFICADO • ACCESO CONFIDENCIAL</span>
              </div>

              <div className="space-y-space-sm">
                <h1 className="font-headline-lg text-primary tracking-tight">
                  Tu bienestar emocional en un entorno seguro y confidencial.
                </h1>
                <p className="font-body-base text-on-surface-variant max-w-xl">
                  Acompañamiento psicológico humano, riguroso y adaptado a tu ritmo. Comienza hoy
                  mismo sin barreras y encuentra la serenidad que mereces.
                </p>
              </div>

              <div className="rounded-xl bg-surface-container-low p-space-md shadow-sm space-y-space-md">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[22px]">spa</span>
                    <span className="font-title-md text-primary font-semibold">
                      Ventajas del Acceso Inicia Gratis
                    </span>
                  </div>
                  <span className="font-label-caps px-2 py-0.5 rounded-full bg-primary text-on-primary">
                    100% LIBRE DE COSTE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                      check_circle
                    </span>
                    <span className="text-body-sm text-on-surface">
                      Sin suscripción inicial ni tarjeta de crédito solicitada.
                    </span>
                  </div>
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                      auto_stories
                    </span>
                    <span className="text-body-sm text-on-surface">
                      1ª consulta de valoración y bitácora clínica de autocuidado.
                    </span>
                  </div>
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                      lock
                    </span>
                    <span className="text-body-sm text-on-surface">
                      Cifrado de grado médico AES-256 (Normas HIPAA / Salud Mental).
                    </span>
                  </div>
                  <div className="flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                      psychology
                    </span>
                    <span className="text-body-sm text-on-surface">
                      Red de 350+ terapeutas y psiquiatras colegiados.
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Testimonio */}
              <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col sm:flex-row items-center gap-space-md">
                <SafeImage
                  src={IMAGES.helenaAuth}
                  alt="Dra. Helena Navarro"
                  className="w-16 h-16 rounded-full object-cover shadow-sm flex-shrink-0"
                  fallbackText="HN"
                />
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <p className="text-body-sm text-on-surface italic">
                    &quot;El paso más transformador no es tener todas las respuestas, sino brindarse
                    a uno mismo el espacio digno para comenzar a sanar.&quot;
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
                    <span className="font-body-bold text-primary">Dra. Helena Navarro</span>
                    <span className="text-label-sm text-on-surface-variant">
                      • Especialista en Terapia Cognitiva (Col. M-34981)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-space-sm pt-space-xs">
                <div className="p-3 rounded bg-surface-container text-center">
                  <div className="font-title-lg text-primary font-bold tabular-nums">98.4%</div>
                  <div className="text-label-sm text-on-surface-variant">
                    Confidencialidad Auditada
                  </div>
                </div>
                <div className="p-3 rounded bg-surface-container text-center">
                  <div className="font-title-lg text-primary font-bold tabular-nums">350+</div>
                  <div className="text-label-sm text-on-surface-variant">Especialistas Activos</div>
                </div>
                <div className="p-3 rounded bg-surface-container text-center">
                  <div className="font-title-lg text-primary font-bold">&lt; 2 min</div>
                  <div className="text-label-sm text-on-surface-variant">Activación Inmediata</div>
                </div>
              </div>
            </div>

            <div className="pt-space-lg mt-space-md flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant">
              <div className="flex items-center gap-space-xs text-label-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">encrypted</span>
                <span>Encriptación Grado Clínico</span>
              </div>
              <div className="flex items-center gap-space-xs text-label-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">security</span>
                <span>Protocolo HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-space-xs text-label-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  clinical_notes
                </span>
                <span>Colegios Oficiales Registrados</span>
              </div>
            </div>
          </section>

          {/* COLUMNA DERECHA: Formulario Dinámico */}
          <section className="lg:col-span-6 flex flex-col justify-center rounded-xl bg-surface-container-lowest shadow-md p-space-lg md:p-space-xl">
            <div className="p-1 rounded-xl bg-surface-container flex items-center mb-space-md">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-center font-title-md transition-all ${
                  authMode === 'login'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-center font-title-md transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'register'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>Crear Cuenta</span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-secondary-container text-on-secondary-fixed rounded-full">
                  Gratis
                </span>
              </button>
            </div>

            <div className="mb-space-md">
              <p className="font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
                Tipo de Perfil
              </p>
              <div className="grid grid-cols-2 gap-space-xs">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                    role === 'patient'
                      ? 'bg-surface-container-low text-primary shadow-sm ring-1 ring-primary/20'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">person_heart</span>
                  <span className="font-body-bold text-sm">Soy Paciente</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('therapist')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                    role === 'therapist'
                      ? 'bg-surface-container-low text-primary shadow-sm ring-1 ring-primary/20'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">stethoscope</span>
                  <span className="font-body-bold text-sm">Soy Terapeuta</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-sm mb-space-md">
              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-body-bold text-on-surface text-sm shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialAuth('Apple')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-body-bold text-on-surface text-sm shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.86.96-2.94-1 .04-2.13.67-2.8 1.45-.58.67-1.1 1.76-.96 2.81 1.11.09 2.18-.57 2.8-1.32z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-space-md">
              <div className="w-full h-px bg-surface-container-high" />
              <span className="absolute px-3 bg-surface-container-lowest text-label-sm text-on-surface-variant">
                o con tu correo electrónico
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label
                    className="font-label-caps text-on-surface-variant"
                    htmlFor="user-name"
                  >
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <input
                      id="user-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Lucía Martínez"
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-md transition-all pl-11"
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-outline">
                      badge
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-label-caps text-on-surface-variant" htmlFor="user-email">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    id="user-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@ejemplo.com"
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-md transition-all pl-11"
                  />
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-outline">
                    mail
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    className="font-label-caps text-on-surface-variant"
                    htmlFor="user-password"
                  >
                    Contraseña
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() =>
                        onShowToast(
                          'Se ha enviado un enlace de recuperación segura a tu correo.',
                          'mail'
                        )
                      }
                      className="text-body-sm text-primary hover:underline font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="user-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-md transition-all pl-11 pr-11"
                  />
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-[20px] text-outline">
                    lock_open
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-3 text-outline hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {authMode === 'register' && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
                      <span>Seguridad:</span>
                      <span className={`font-medium ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full w-1/3 rounded-full transition-all ${
                          strength.level === 1
                            ? 'bg-tertiary-container'
                            : strength.level === 2
                            ? 'bg-primary-fixed-dim'
                            : strength.level === 3
                            ? 'bg-primary'
                            : 'bg-outline-variant'
                        }`}
                      />
                      <div
                        className={`h-full w-1/3 rounded-full transition-all ${
                          strength.level === 2
                            ? 'bg-primary-fixed-dim'
                            : strength.level === 3
                            ? 'bg-primary'
                            : 'bg-outline-variant'
                        }`}
                      />
                      <div
                        className={`h-full w-1/3 rounded-full transition-all ${
                          strength.level === 3 ? 'bg-primary' : 'bg-outline-variant'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {authMode === 'register' && (
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      checked={acceptedConsent}
                      onChange={(e) => setAcceptedConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-primary cursor-pointer"
                      type="checkbox"
                    />
                    <span className="text-body-sm text-on-surface-variant leading-tight">
                      Acepto el{' '}
                      <span className="text-primary underline font-medium">
                        Consentimiento Informado Clínico
                      </span>{' '}
                      y los términos de confidencialidad médica conforme a la Ley de Salud Mental y
                      HIPAA.
                    </span>
                  </label>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>
                    {authMode === 'login'
                      ? role === 'patient'
                        ? 'Acceder a mi Portal de Salud'
                        : 'Acceder al Panel Clínico'
                      : 'Inicia Gratis - Crear Cuenta'}
                  </span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </form>

            <div className="mt-space-md p-3 rounded-lg bg-surface-container-low/60 flex items-start gap-2.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                verified
              </span>
              <p className="text-body-sm">
                Tus datos de salud, notas de sesión y consultas están protegidos mediante cifrado
                punto a punto. Jamás serán vendidos ni transferidos a terceros.
              </p>
            </div>

            <div className="mt-space-md text-center text-body-sm text-on-surface-variant">
              <span>
                {authMode === 'login'
                  ? '¿Primera vez en Psico_Gestión?'
                  : '¿Ya posees un expediente o cuenta?'}
              </span>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                className="font-body-bold text-primary hover:underline ml-1"
              >
                {authMode === 'login' ? 'Inicia gratis aquí' : 'Inicia sesión aquí'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
