import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { PortalMode, ScreenRoute } from '../types';
import { SafeImage } from './SafeImage';
import { GoogleSignInButton } from './GoogleSignInButton';

interface LayoutHeaderProps {
  portalMode: PortalMode;
  activeRoute: ScreenRoute;
  onSelectPortal: (mode: PortalMode) => void;
  onNavigate: (route: ScreenRoute) => void;
  onShowToast: (msg: string, icon?: string) => void;
  unreadCount: number;
  onClearNotifications: () => void;
  gmailConnected: boolean;
  connectedEmail: string | null;
  isSigningInGoogle: boolean;
  onGoogleSignIn: () => Promise<void>;
  onGoogleLogout: () => Promise<void>;
}

const CLINICAL_NAV: { route: ScreenRoute; label: string }[] = [
  { route: 'directorio-de-psicologos', label: 'Directorio de Psicólogos' },
  { route: 'disponibilidad-y-cobros-terapeuta', label: 'Disponibilidad y Cobros' },
  { route: 'historia-clinica-y-evolucion', label: 'Historia Clínica y Evolución' },
  { route: 'gestion-y-reprogramacion-de-citas', label: 'Citas y Reseñas' },
  { route: 'agenda-y-calendario-terapeutico', label: 'Agenda y Calendario Terapéutico' },
  { route: 'recordatorios-y-notificaciones', label: 'Recordatorios y Notificaciones' },
];

const PATIENT_NAV: { route: ScreenRoute; label: string }[] = [
  { route: 'mis-citas-paciente', label: 'Mis Citas (Paciente)' },
  { route: 'proximas-citas', label: 'Próximas Citas' },
  { route: 'mi-perfil-de-paciente', label: 'Mi Perfil de Paciente' },
  { route: 'especialistas-y-perfil-profesional', label: 'Especialistas y Perfil Profesional' },
  { route: 'directorio-de-psicologos', label: 'Directorio de Especialistas' },
  { route: 'gestion-y-reprogramacion-de-citas', label: 'Reprogramar / Reseñas' },
];

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  portalMode,
  activeRoute,
  onSelectPortal,
  onNavigate,
  onShowToast,
  unreadCount,
  onClearNotifications,
  gmailConnected,
  connectedEmail,
  isSigningInGoogle,
  onGoogleSignIn,
  onGoogleLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (activeRoute === 'portal-autenticacion') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-gutter flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('directorio-de-psicologos')}
            className="flex items-center gap-space-md cursor-pointer"
          >
            <SafeImage
              src={IMAGES.logoAuth}
              alt="Psico_Gestión Logo"
              className="h-8 w-auto object-contain rounded-md"
              fallbackIcon="spa"
            />
            <span className="font-title-lg text-title-lg text-primary tracking-tight whitespace-nowrap">
              Psico_Gestión
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-space-lg">
            <button
              type="button"
              onClick={() => onNavigate('portal-autenticacion')}
              className="transition-colors text-primary font-bold text-body-sm whitespace-nowrap"
            >
              Acceso Profesional
            </button>
            <button
              type="button"
              onClick={() => {
                onShowToast('Línea de soporte clínico disponible 24/7 en ayuda@psicogestion.com', 'support_agent');
              }}
              className="text-on-surface-variant hover:text-on-surface transition-colors text-body-sm whitespace-nowrap"
            >
              Soporte y Ayuda
            </button>
            <button
              type="button"
              onClick={() => onNavigate(portalMode === 'clinical' ? 'disponibilidad-y-cobros-terapeuta' : 'mis-citas-paciente')}
              className="text-on-surface-variant hover:text-on-surface transition-colors text-body-sm whitespace-nowrap"
            >
              Volver al Inicio
            </button>
          </nav>

          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm px-space-sm py-1 rounded bg-surface-container">
              <span className="text-on-surface-variant font-medium">ES</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(portalMode === 'clinical' ? 'disponibilidad-y-cobros-terapeuta' : 'mis-citas-paciente')}
              title="Volver al portal"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  const navItems = portalMode === 'clinical' ? CLINICAL_NAV : PATIENT_NAV;

  const quickSearchTargets: { keywords: string[]; label: string; route: ScreenRoute }[] = [
    { keywords: ['marcela', 'andres', 'valentina', 'camilo', 'directorio', 'psicologo'], label: 'Directorio de Psicólogos', route: 'directorio-de-psicologos' },
    { keywords: ['cobro', 'disponibilidad', 'factura', 'tarifa', 'pago'], label: 'Disponibilidad y Cobros', route: 'disponibilidad-y-cobros-terapeuta' },
    { keywords: ['historia', 'camila', 'soap', 'gad', 'expediente', 'nota'], label: 'Historia Clínica y Evolución', route: 'historia-clinica-y-evolucion' },
    { keywords: ['agenda', 'calendario', 'turno', 'mateo', 'lucia'], label: 'Agenda y Calendario Terapéutico', route: 'agenda-y-calendario-terapeutico' },
    { keywords: ['reprogramar', 'cancelar', 'reseña', 'sesion 14'], label: 'Gestión de Citas y Reseñas', route: 'gestion-y-reprogramacion-de-citas' },
    { keywords: ['perfil', 'paciente', 'certificado'], label: 'Mi Perfil de Paciente', route: 'mi-perfil-de-paciente' },
    { keywords: ['recordatorio', 'whatsapp', 'notificacion'], label: 'Recordatorios y Notificaciones', route: 'recordatorios-y-notificaciones' },
  ];

  const matchingTargets = searchTerm.trim().length > 1
    ? quickSearchTargets.filter(
        (t) =>
          t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.keywords.some((k) => k.includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1440px] mx-auto px-gutter flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-lg">
          <button
            type="button"
            onClick={() =>
              onNavigate(
                portalMode === 'clinical'
                  ? 'disponibilidad-y-cobros-terapeuta'
                  : 'mis-citas-paciente'
              )
            }
            className="flex items-center gap-space-sm shrink-0"
          >
            <SafeImage
              src={IMAGES.logoMain}
              alt="Psico_Gestión Logo"
              className="h-8 w-auto object-contain rounded-md"
              fallbackIcon="spa"
            />
            <span className="font-title-lg text-title-lg text-primary tracking-tight whitespace-nowrap">
              Psico_Gestión
            </span>
          </button>

          <div className="hidden xl:flex relative items-center bg-surface-container-low px-space-sm py-space-xs rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant text-body-base mr-space-xs">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && matchingTargets.length > 0) {
                  onNavigate(matchingTargets[0].route);
                  setSearchTerm('');
                }
              }}
              className="bg-transparent text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none w-52 2xl:w-64"
              placeholder={
                portalMode === 'clinical'
                  ? 'Buscar terapeutas, citas, expedientes...'
                  : 'Buscar terapeutas, citas, notas clínicas...'
              }
              type="text"
            />
            {matchingTargets.length > 0 && (
              <div className="absolute top-11 left-0 w-72 bg-surface-container-lowest rounded-xl shadow-xl p-1.5 z-50 border border-outline-variant/40">
                {matchingTargets.map((item) => (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => {
                      onNavigate(item.route);
                      setSearchTerm('');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-body-sm text-on-surface hover:bg-surface-container-low flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-space-md">
          {/* Portal Switcher */}
          <div className="hidden md:flex items-center bg-surface-container-low p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectPortal('clinical')}
              className={`px-space-sm py-1 rounded-lg text-body-sm transition-all whitespace-nowrap ${
                portalMode === 'clinical'
                  ? 'font-body-bold bg-surface-container-lowest text-primary shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Portal Clínico
            </button>
            <button
              type="button"
              onClick={() => onSelectPortal('patient')}
              className={`px-space-sm py-1 rounded-lg text-body-sm transition-all whitespace-nowrap ${
                portalMode === 'patient'
                  ? 'font-body-bold bg-surface-container-lowest text-primary shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Vista Paciente
            </button>
          </div>

          {/* Gmail Google Auth Button / Status */}
          <div className="hidden lg:flex items-center">
            {gmailConnected ? (
              <button
                type="button"
                onClick={() => onNavigate('recordatorios-y-notificaciones')}
                title={`Gmail conectado: ${connectedEmail || ''}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-label-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
                <span>Gmail activo</span>
              </button>
            ) : (
              <GoogleSignInButton
                onClick={onGoogleSignIn}
                loading={isSigningInGoogle}
                label="Sign in with Google"
                compact
              />
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifMenu((v) => !v);
                setShowProfileMenu(false);
              }}
              aria-label="Notificaciones clínicas"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-title-lg">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl p-space-md z-50 border border-outline-variant/30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-variant">
                  <span className="font-title-md text-on-surface">Alertas Recientes</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearNotifications();
                      setShowNotifMenu(false);
                    }}
                    className="text-label-sm text-primary font-semibold hover:underline"
                  >
                    Marcar leídas
                  </button>
                </div>
                <div className="space-y-2 text-body-sm">
                  <div className="p-2 rounded-lg bg-surface-container-low">
                    <p className="font-body-bold text-on-surface">Confirmación WhatsApp recibida</p>
                    <p className="text-on-surface-variant text-label-sm">
                      Camila Morales confirmó asistencia para Jue 24 Oct • 16:00 hrs.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low">
                    <p className="font-body-bold text-on-surface">Cobro #4092 acreditado</p>
                    <p className="text-on-surface-variant text-label-sm">
                      $55.00 USD liquidados vía Stripe sin incidencias.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigate('recordatorios-y-notificaciones');
                  }}
                  className="mt-3 w-full py-2 rounded-lg bg-primary text-on-primary text-body-sm font-body-bold hover:bg-primary-container transition-colors"
                >
                  Ir a Recordatorios y Notificaciones
                </button>
              </div>
            )}
          </div>

          {/* Profile Avatar & Quick Auth Portal Access */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu((v) => !v);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-space-sm pl-space-xs text-left hover:opacity-90 transition-opacity"
            >
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-body-bold text-body-sm text-on-surface leading-tight">
                  {portalMode === 'clinical' ? 'Dra. Sofía Mendoza' : 'Camila Morales'}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {portalMode === 'clinical'
                    ? 'Psicóloga Clínica • MP 4182'
                    : 'Paciente Activa • ID #PG-84920'}
                </span>
              </div>
              <SafeImage
                src={portalMode === 'clinical' ? IMAGES.sofiaAvatar : IMAGES.camilaProfile}
                alt={portalMode === 'clinical' ? 'Perfil Dra. Sofía Mendoza' : 'Perfil Camila Morales'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                fallbackText={portalMode === 'clinical' ? 'SM' : 'CM'}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-surface-container-lowest rounded-xl shadow-xl p-2 z-50 border border-outline-variant/30 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSelectPortal(portalMode === 'clinical' ? 'patient' : 'clinical');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    swap_horiz
                  </span>
                  <span>
                    Cambiar a {portalMode === 'clinical' ? 'Vista Paciente' : 'Portal Clínico'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('mi-perfil-de-paciente');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    badge
                  </span>
                  <span>Mi Perfil de Paciente</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('portal-autenticacion');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-body-sm text-primary font-body-bold hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Portal de Acceso / Registro</span>
                </button>
                <div className="border-t border-surface-variant my-1" />
                {gmailConnected ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      void onGoogleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-body-sm text-error hover:bg-error-container/40 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span className="truncate">Desconectar Gmail</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      void onGoogleSignIn();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-body-sm text-primary hover:bg-surface-container-low flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    <span>Conectar Gmail (Google)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-navigation bar */}
      <div className="bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-gutter flex items-center justify-between gap-4">
          <nav className="flex items-center gap-space-lg overflow-x-auto py-0">
            {navItems.map((item) => {
              const isActive = activeRoute === item.route;
              return (
                <button
                  key={item.route}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onNavigate(item.route)}
                  className={`py-space-sm transition-colors whitespace-nowrap shrink-0 text-body-sm ${
                    isActive
                      ? 'text-primary font-body-bold border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile quick portal switch */}
          <div className="flex md:hidden items-center gap-1 shrink-0 py-1">
            <button
              type="button"
              onClick={() =>
                onSelectPortal(portalMode === 'clinical' ? 'patient' : 'clinical')
              }
              className="px-2.5 py-1 rounded-lg bg-surface-container-low text-primary text-label-sm font-bold whitespace-nowrap"
            >
              {portalMode === 'clinical' ? 'Ir a Paciente' : 'Ir a Clínico'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
