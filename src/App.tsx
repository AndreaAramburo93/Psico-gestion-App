/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { LayoutHeader } from './components/LayoutHeader';
import { LayoutFooter } from './components/LayoutFooter';
import {
  INITIAL_BILLING_RECORDS,
  INITIAL_CALENDAR_APPOINTMENTS,
  INITIAL_NOTIFICATION_RULES,
  INITIAL_SOAP_NOTES,
  INITIAL_SPECIALISTS,
} from './data/mockData';
import {
  BillingRecord,
  CalendarAppointment,
  NotificationRule,
  PortalMode,
  ScreenRoute,
  SoapNote,
  Specialist,
} from './types';
import { AvailabilityBillingScreen } from './screens/AvailabilityBillingScreen';
import { DirectoryScreen } from './screens/DirectoryScreen';
import { ClinicalHistoryScreen } from './screens/ClinicalHistoryScreen';
import { AppointmentManagementScreen } from './screens/AppointmentManagementScreen';
import { TherapistCalendarScreen } from './screens/TherapistCalendarScreen';
import { PatientHomeScreen } from './screens/PatientHomeScreen';
import { UpcomingAppointmentsScreen } from './screens/UpcomingAppointmentsScreen';
import { PatientProfileScreen } from './screens/PatientProfileScreen';
import { SpecialistProfileScreen } from './screens/SpecialistProfileScreen';
import { AuthPortalScreen } from './screens/AuthPortalScreen';
import { RemindersNotificationsScreen } from './screens/RemindersNotificationsScreen';

interface ToastState {
  message: string;
  icon: string;
  visible: boolean;
}

export default function App() {
  const [portalMode, setPortalMode] = useState<PortalMode>('clinical');
  const [activeRoute, setActiveRoute] = useState<ScreenRoute>('directorio-de-psicologos');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(
    INITIAL_SPECIALISTS[1]
  );

  // Shared domain states
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(INITIAL_BILLING_RECORDS);
  const [soapNotes, setSoapNotes] = useState<SoapNote[]>(INITIAL_SOAP_NOTES);
  const [calendarAppointments, setCalendarAppointments] = useState<CalendarAppointment[]>(
    INITIAL_CALENDAR_APPOINTMENTS
  );
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(
    INITIAL_NOTIFICATION_RULES
  );
  const [unreadCount, setUnreadCount] = useState<number>(2);

  // Toast feedback
  const [toast, setToast] = useState<ToastState>({
    message: '',
    icon: 'check_circle',
    visible: false,
  });

  const showToast = useCallback((message: string, icon = 'check_circle') => {
    setToast({ message, icon, visible: true });
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3600);
    return () => clearTimeout(timer);
  }, [toast.visible, toast.message]);

  const handleNavigate = useCallback((route: ScreenRoute) => {
    setActiveRoute(route);
    if (
      route === 'mis-citas-paciente' ||
      route === 'proximas-citas' ||
      route === 'mi-perfil-de-paciente' ||
      route === 'especialistas-y-perfil-profesional'
    ) {
      setPortalMode('patient');
    } else if (
      route === 'disponibilidad-y-cobros-terapeuta' ||
      route === 'historia-clinica-y-evolucion' ||
      route === 'agenda-y-calendario-terapeutico' ||
      route === 'recordatorios-y-notificaciones'
    ) {
      setPortalMode('clinical');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectPortal = useCallback((mode: PortalMode) => {
    setPortalMode(mode);
    setActiveRoute(
      mode === 'clinical' ? 'disponibilidad-y-cobros-terapeuta' : 'mis-citas-paciente'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectSpecialistProfile = useCallback((specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setPortalMode('patient');
    setActiveRoute('especialistas-y-perfil-profesional');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddBillingRecord = useCallback((record: BillingRecord) => {
    setBillingRecords((prev) => [record, ...prev]);
  }, []);

  const handleAddSoapNote = useCallback((note: SoapNote) => {
    setSoapNotes((prev) => [note, ...prev]);
  }, []);

  const handleAddCalendarAppointment = useCallback((appt: CalendarAppointment) => {
    setCalendarAppointments((prev) => [...prev, appt]);
  }, []);

  const handleToggleNotificationRule = useCallback((id: string) => {
    setNotificationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const handleAuthenticated = useCallback(
    (mode: PortalMode, destination: ScreenRoute, userName?: string) => {
      setPortalMode(mode);
      setActiveRoute(destination);
      showToast(
        userName
          ? `Bienvenido(a), ${userName}. Sesión cifrada iniciada.`
          : 'Acceso seguro concedido al entorno Psico_Gestión.',
        'verified_user'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [showToast]
  );

  const renderActiveScreen = () => {
    switch (activeRoute) {
      case 'disponibilidad-y-cobros-terapeuta':
        return (
          <AvailabilityBillingScreen
            billingRecords={billingRecords}
            onAddBillingRecord={handleAddBillingRecord}
            onShowToast={showToast}
            onNavigate={handleNavigate}
          />
        );
      case 'directorio-de-psicologos':
        return (
          <DirectoryScreen
            onSelectSpecialistProfile={handleSelectSpecialistProfile}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
      case 'historia-clinica-y-evolucion':
        return (
          <ClinicalHistoryScreen
            soapNotes={soapNotes}
            onAddSoapNote={handleAddSoapNote}
            onShowToast={showToast}
            onNavigate={handleNavigate}
          />
        );
      case 'gestion-y-reprogramacion-de-citas':
        return (
          <AppointmentManagementScreen
            onShowToast={showToast}
            onNavigate={handleNavigate}
          />
        );
      case 'agenda-y-calendario-terapeutico':
        return (
          <TherapistCalendarScreen
            appointments={calendarAppointments}
            onAddAppointment={handleAddCalendarAppointment}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
      case 'mis-citas-paciente':
        return <PatientHomeScreen onNavigate={handleNavigate} onShowToast={showToast} />;
      case 'proximas-citas':
        return (
          <UpcomingAppointmentsScreen onNavigate={handleNavigate} onShowToast={showToast} />
        );
      case 'mi-perfil-de-paciente':
        return (
          <PatientProfileScreen
            onNavigate={handleNavigate}
            onSelectSpecialistProfile={handleSelectSpecialistProfile}
            onShowToast={showToast}
          />
        );
      case 'especialistas-y-perfil-profesional':
        return (
          <SpecialistProfileScreen
            specialist={selectedSpecialist}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
      case 'recordatorios-y-notificaciones':
        return (
          <RemindersNotificationsScreen
            rules={notificationRules}
            onToggleRule={handleToggleNotificationRule}
            onShowToast={showToast}
          />
        );
      case 'portal-autenticacion':
        return (
          <AuthPortalScreen
            onAuthenticated={handleAuthenticated}
            onShowToast={showToast}
          />
        );
      default:
        return (
          <DirectoryScreen
            onSelectSpecialistProfile={handleSelectSpecialistProfile}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body-base">
      <LayoutHeader
        portalMode={portalMode}
        activeRoute={activeRoute}
        onSelectPortal={handleSelectPortal}
        onNavigate={handleNavigate}
        onShowToast={showToast}
        unreadCount={unreadCount}
        onClearNotifications={() => {
          setUnreadCount(0);
          showToast('Todas las notificaciones marcadas como leídas.', 'done_all');
        }}
      />

      <main
        className={`w-full flex-1 flex flex-col ${
          activeRoute === 'portal-autenticacion' ? 'pt-16' : 'pt-32'
        }`}
      >
        {renderActiveScreen()}
      </main>

      <LayoutFooter activeRoute={activeRoute} onShowToast={showToast} />

      {/* Floating Notification Toast */}
      {toast.visible && (
        <div
          id="notification-toast"
          className="fixed bottom-6 right-6 z-50 max-w-md bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 transition-all"
        >
          <span className="material-symbols-outlined text-primary-fixed text-title-lg shrink-0">
            {toast.icon}
          </span>
          <p className="text-body-sm font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
            className="text-inverse-on-surface/70 hover:text-inverse-on-surface ml-2"
            aria-label="Cerrar notificación"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
